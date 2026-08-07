/**
 * Dépôt d’une candidature au recrutement médical.
 *
 * Ordre imposé : on valide, on vérifie que la catégorie est réellement
 * ouverte, on enregistre — et seulement ensuite on notifie. Aucun SMS ni
 * e-mail ne part si le dossier n’est pas en base, et l’échec d’une
 * notification n’annule jamais une candidature enregistrée.
 *
 * Le module n’écrit que dans `MedicalRecruitments` : aucune classe existante
 * n’est lue ni modifiée.
 */

import crypto from 'node:crypto';
import {
  serverEnvironment,
  missingEnvironmentNames,
  createObject,
  findObjects,
  updateObject,
  parseDate,
} from '../_lib/parse-server.js';
import { readJsonBody, sendError } from '../_lib/http.js';
import { compactWhitespace } from '../_lib/member-request-validation.js';
import { normalizeSenegalPhone } from '../_lib/senegal-phone.js';
import { sendSms } from '../_lib/sms-sender.js';
import { recruitmentReceivedSms } from '../_lib/sms-templates.js';
import { sendEmail } from '../_lib/email-sender.js';
import { recruitmentReceivedEmail } from '../_lib/email-templates.js';
import {
  DEFAULT_RECRUITMENT_STATUS,
  EMAIL_NOTIFICATIONS_ENABLED,
  OTHER_EDUCATION_LEVEL,
  RECRUITMENT_CLASS,
  SPECIALTY_CLASS,
  buildRecruitmentReference,
  categoryByKey,
  mergeSpecialtyStates,
  professionForCategory,
  resolvedSpeciality,
  specialtyBySlug,
  validateRecruitmentApplication,
  validateRecruitmentFiles,
} from '../_lib/recruitment.js';

/** Durée minimale de remplissage plausible, y compris pour le parcours court. */
const MIN_FILL_DURATION_MS = 5_000;

const isValidSubmissionId = (value) =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

/** Une catégorie fermée ne peut pas recevoir de candidature, même forcée. */
const isCategoryOpen = async (environment, slug) => {
  try {
    const found = await findObjects(environment, SPECIALTY_CLASS, {
      where: { slug },
      limit: 1,
      keys: 'slug,open',
    });
    return mergeSpecialtyStates(found.results ?? []).find((item) => item.slug === slug)?.open === true;
  } catch {
    // Échec de lecture : sécurité prioritaire, la route reste fermée.
    return false;
  }
};

/** Refuse un second dossier en cours pour le même numéro ou le même e-mail. */
const findPendingDuplicate = async (environment, phone, email, category, legacySpecialties = []) => {
  const categoryMatch = legacySpecialties.length > 0
    ? {
        $or: [
          { recruitmentCategory: category },
          ...legacySpecialties.map((specialty) => ({ specialty })),
        ],
      }
    : { recruitmentCategory: category };
  try {
    const found = await findObjects(environment, RECRUITMENT_CLASS, {
      where: {
        status: { $nin: ['Refusé'] },
        $and: [
          categoryMatch,
          { $or: [{ phoneNormalized: phone }, { email }] },
        ],
      },
      limit: 1,
      keys: 'reference,status',
    });
    return found.results?.[0] ?? null;
  } catch {
    return null;
  }
};

const findBySubmissionId = async (environment, submissionId) => {
  try {
    const found = await findObjects(environment, RECRUITMENT_CLASS, {
      where: { submissionId },
      limit: 1,
      keys: 'reference,createdAt,smsStatus,emailStatus',
    });
    return found.results?.[0] ?? null;
  } catch {
    return null;
  }
};

const successPayload = (record, extra = {}) => ({
  success: true,
  application: {
    objectId: record.objectId,
    reference: record.reference,
    createdAt: record.createdAt,
    smsStatus: record.smsStatus ?? 'pending',
    emailStatus: record.emailStatus ?? 'pending',
  },
  message:
    'Votre candidature a bien été enregistrée. Notre commission examinera votre dossier et vous serez informé(e) de la suite par SMS ou WhatsApp.',
  ...extra,
});

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendError(response, 405, 'Méthode non autorisée.', 'method_not_allowed');
    return;
  }

  const environment = serverEnvironment();
  const missing = missingEnvironmentNames(environment);
  if (missing.length > 0) {
    console.error('[recruitment-apply] missing_configuration', { missing });
    sendError(
      response,
      503,
      'Le service de candidature est temporairement indisponible.',
      'missing_configuration',
    );
    return;
  }

  const payload = await readJsonBody(request);
  if (!payload || typeof payload !== 'object') {
    sendError(response, 400, 'La candidature n’a pas pu être lue.', 'unreadable_body');
    return;
  }

  if (!isValidSubmissionId(payload.submissionId)) {
    sendError(
      response,
      400,
      'L’identifiant du dossier est invalide. Rechargez le formulaire puis réessayez.',
      'invalid_submission_id',
    );
    return;
  }

  // Anti-robot : champ piège invisible pour un humain. Rejet silencieux.
  if (compactWhitespace(payload.website).length > 0) {
    console.warn('[recruitment-apply] honeypot_triggered');
    response.status(200).json({
      success: true,
      application: { objectId: '', reference: '', createdAt: new Date().toISOString() },
      message: 'Votre candidature a bien été enregistrée.',
    });
    return;
  }

  const filledIn = Number(payload.filledInMs);
  if (Number.isFinite(filledIn) && filledIn >= 0 && filledIn < MIN_FILL_DURATION_MS) {
    sendError(
      response,
      400,
      'Votre candidature a été envoyée trop rapidement. Vérifiez vos informations puis réessayez.',
      'filled_too_fast',
    );
    return;
  }

  // Rejeu d’un même envoi : on renvoie le dossier déjà créé, sans doublon ni
  // second SMS.
  const existing = await findBySubmissionId(environment, payload.submissionId);
  if (existing) {
    response.status(200).json(successPayload(existing, { idempotent: true }));
    return;
  }

  const category = categoryByKey(payload.recruitmentCategory);
  if (!category) {
    sendError(response, 400, 'Catégorie de recrutement inconnue.', 'unknown_category');
    return;
  }

  const specialty = category.formKind === 'complete'
    ? specialtyBySlug(category.legacySpecialtySlug)
    : null;

  // Verrou serveur : l’état affiché au navigateur ne fait pas foi.
  if (!(await isCategoryOpen(environment, category.slug))) {
    sendError(
      response,
      409,
      `Les inscriptions pour la catégorie « ${category.label} » sont fermées.`,
      'category_closed',
    );
    return;
  }

  const fieldError = validateRecruitmentApplication(payload);
  if (fieldError) {
    response
      .status(400)
      .json({ success: false, error: fieldError.message, code: 'invalid_field', field: fieldError.field });
    return;
  }

  // Les trois nouveaux formulaires courts ne demandent et n’acceptent aucune
  // pièce. Les contrôles historiques restent en place pour dentistes/pharmaciens.
  if (category.formKind === 'complete') {
    const fileError = validateRecruitmentFiles(payload);
    if (fileError) {
      response
        .status(400)
        .json({ success: false, error: fileError.message, code: 'invalid_file', field: fileError.field });
      return;
    }
  }

  const phoneNormalized = normalizeSenegalPhone(payload.phone);
  const email = compactWhitespace(payload.email).toLocaleLowerCase('fr');
  const firstName = compactWhitespace(payload.firstName);
  const lastName = compactWhitespace(payload.lastName);

  const duplicate = await findPendingDuplicate(
    environment,
    phoneNormalized,
    email,
    category.key,
    category.legacySpecialtySlugs,
  );
  if (duplicate) {
    sendError(
      response,
      409,
      `Une candidature est déjà en cours pour ce numéro ou cette adresse e-mail (référence ${duplicate.reference ?? 'inconnue'}).`,
      'duplicate_application',
    );
    return;
  }

  const reference = buildRecruitmentReference(crypto.randomBytes(6));
  const speciality = resolvedSpeciality(category, payload);
  const profession = professionForCategory(category, payload);
  const isCompleteForm = category.formKind === 'complete';

  const record = {
    reference,
    submissionId: payload.submissionId,
    recruitmentCategory: category.key,
    // Identité
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    gender: compactWhitespace(payload.gender),
    birthDate: compactWhitespace(payload.birthDate),
    phone: phoneNormalized,
    phoneNormalized,
    email,
    address: compactWhitespace(payload.address),
    // Profil professionnel
    specialty: specialty?.slug ?? category.key,
    profession,
    ...(speciality ? { speciality } : {}),
    ...(category.formKind === 'simplified'
      ? {
          educationLevel: compactWhitespace(payload.educationLevel),
          // Précision libre : écrite seulement quand le niveau « Autre » est
          // retenu, pour ne pas ajouter un champ vide aux autres dossiers.
          ...(compactWhitespace(payload.educationLevel) === OTHER_EDUCATION_LEVEL &&
          compactWhitespace(payload.educationLevelOther)
            ? { educationLevelOther: compactWhitespace(payload.educationLevelOther) }
            : {}),
        }
      : {}),
    ...(isCompleteForm
      ? {
          region: compactWhitespace(payload.region),
          department: compactWhitespace(payload.department),
          orderNumber: compactWhitespace(payload.orderNumber),
          university: compactWhitespace(payload.university),
          ...(compactWhitespace(payload.diplomaTitle)
            ? { diplomaTitle: compactWhitespace(payload.diplomaTitle) }
            : {}),
          ...(compactWhitespace(payload.graduationYear)
            ? { graduationYear: Number(compactWhitespace(payload.graduationYear)) }
            : {}),
          ...(compactWhitespace(payload.stockExperience)
            ? { stockExperience: compactWhitespace(payload.stockExperience) }
            : {}),
          experience: Number(payload.experience),
          employer: compactWhitespace(payload.employer),
          availability: compactWhitespace(payload.availability),
          motivation: compactWhitespace(payload.motivation),
        }
      : {}),
    // Appartenance à l’ASFO. Les précisions ne sont écrites que si la personne
    // se déclare membre : répondre « non » ne doit pas laisser de numéro de
    // carte résiduel dans le dossier.
    isMember: payload.isMember === true,
    ...(payload.isMember === true && compactWhitespace(payload.memberCardNumber)
      ? { memberCardNumber: compactWhitespace(payload.memberCardNumber) }
      : {}),
    ...(payload.isMember === true && compactWhitespace(payload.memberSince)
      ? { memberSince: Number(compactWhitespace(payload.memberSince)) }
      : {}),
    // Les pièces ne sont reprises que pour les deux formulaires historiques.
    ...(isCompleteForm && payload.cvFile ? { cvFile: payload.cvFile } : {}),
    ...(isCompleteForm && payload.diplomaFile ? { diplomaFile: payload.diplomaFile } : {}),
    ...(isCompleteForm && payload.photoFile ? { photoFile: payload.photoFile } : {}),
    // Instruction
    status: DEFAULT_RECRUITMENT_STATUS,
    comments: '',
    reviewedBy: '',
    consentAccepted: true,
    consentAcceptedAt: parseDate(new Date()),
    smsStatus: 'pending',
    emailStatus: 'pending',
  };

  let created;
  try {
    created = await createObject(environment, RECRUITMENT_CLASS, record);
  } catch (error) {
    console.error('[recruitment-apply] create_failed', {
      reason: error?.message ?? 'unknown',
    });
    sendError(
      response,
      502,
      'La candidature n’a pas pu être enregistrée. Veuillez réessayer.',
      'create_failed',
    );
    return;
  }

  // À partir d’ici le dossier existe : plus aucune erreur de notification ne
  // doit faire échouer la réponse.
  const notifications = {};

  if (phoneNormalized) {
    let smsOutcome = { status: 'failed', error: 'Message non composé.' };
    try {
      smsOutcome = await sendSms(
        phoneNormalized,
        recruitmentReceivedSms(firstName, speciality || profession || category.label, reference),
      );
    } catch (error) {
      smsOutcome = { status: 'failed', error: error?.message ?? 'Composition impossible.' };
    }
    notifications.smsStatus = smsOutcome.status === 'sent' ? 'sent' : 'failed';
    notifications.smsProviderId = smsOutcome.providerId ?? '';
    notifications.smsError = smsOutcome.error ? String(smsOutcome.error).slice(0, 180) : '';
    if (smsOutcome.status === 'sent') notifications.smsSentAt = parseDate(new Date());
  } else {
    notifications.smsStatus = 'non_envoye_numero_invalide';
  }

  // Canal e-mail désactivé : on ne tente rien, et le dossier le dit clairement
  // plutôt que de porter un échec qui n’en est pas un.
  const emailOutcome = EMAIL_NOTIFICATIONS_ENABLED
    ? await sendEmail({
        to: email,
        ...recruitmentReceivedEmail({
          firstName,
          lastName,
          specialty: speciality || profession || category.label,
          reference,
          region: record.region,
          availability: record.availability,
        }),
      })
    : { status: 'disabled' };
  notifications.emailStatus = emailOutcome.status;
  notifications.emailProviderId = emailOutcome.providerId ?? '';
  notifications.emailError = emailOutcome.error ? String(emailOutcome.error).slice(0, 180) : '';
  if (emailOutcome.status === 'sent') notifications.emailSentAt = parseDate(new Date());

  try {
    await updateObject(environment, RECRUITMENT_CLASS, created.objectId, notifications);
  } catch (error) {
    console.error('[recruitment-apply] notification_status_failed', {
      reason: error?.message ?? 'unknown',
    });
  }

  console.info('[recruitment-apply] created', {
    category: category.key,
    sms: notifications.smsStatus,
    email: notifications.emailStatus,
  });

  response.status(201).json(
    successPayload({
      objectId: created.objectId,
      reference,
      createdAt: created.createdAt,
      smsStatus: notifications.smsStatus,
      emailStatus: notifications.emailStatus,
    }),
  );
}
