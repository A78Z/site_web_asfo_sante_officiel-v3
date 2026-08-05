/**
 * Dépôt d’une candidature au recrutement médical.
 *
 * Ordre imposé : on valide, on vérifie que la spécialité est réellement
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
  RECRUITMENT_CLASS,
  SPECIALTY_CLASS,
  buildRecruitmentReference,
  mergeSpecialtyStates,
  specialtyBySlug,
  validateRecruitmentApplication,
  validateRecruitmentFiles,
} from '../_lib/recruitment.js';

/** Durée minimale de remplissage plausible pour un dossier aussi long. */
const MIN_FILL_DURATION_MS = 5_000;

const isValidSubmissionId = (value) =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

/** Une spécialité fermée ne peut pas recevoir de candidature, même forcée. */
const isSpecialtyOpen = async (environment, slug) => {
  let rows = [];
  try {
    const found = await findObjects(environment, SPECIALTY_CLASS, {
      where: { slug },
      limit: 1,
      keys: 'slug,open',
    });
    rows = found.results ?? [];
  } catch {
    // Lecture impossible : on retombe sur la valeur par défaut du catalogue.
    rows = [];
  }
  return mergeSpecialtyStates(rows).find((item) => item.slug === slug)?.open === true;
};

/** Refuse un second dossier en cours pour le même numéro ou le même e-mail. */
const findPendingDuplicate = async (environment, phone, email, specialty) => {
  try {
    const found = await findObjects(environment, RECRUITMENT_CLASS, {
      where: {
        specialty,
        status: { $nin: ['Refusé'] },
        $or: [{ phoneNormalized: phone }, { email }],
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

  const specialty = specialtyBySlug(payload.specialty);
  if (!specialty) {
    sendError(response, 400, 'Spécialité inconnue.', 'unknown_specialty');
    return;
  }

  // Verrou serveur : l’état affiché au navigateur ne fait pas foi.
  if (!(await isSpecialtyOpen(environment, specialty.slug))) {
    sendError(
      response,
      409,
      `Les inscriptions pour la spécialité « ${specialty.label} » ne sont pas ouvertes.`,
      'specialty_closed',
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

  const fileError = validateRecruitmentFiles(payload);
  if (fileError) {
    response
      .status(400)
      .json({ success: false, error: fileError.message, code: 'invalid_file', field: fileError.field });
    return;
  }

  const phoneNormalized = normalizeSenegalPhone(payload.phone);
  const email = compactWhitespace(payload.email).toLocaleLowerCase('fr');
  const firstName = compactWhitespace(payload.firstName);
  const lastName = compactWhitespace(payload.lastName);

  const duplicate = await findPendingDuplicate(
    environment,
    phoneNormalized,
    email,
    specialty.slug,
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

  const record = {
    reference,
    submissionId: payload.submissionId,
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
    region: compactWhitespace(payload.region),
    department: compactWhitespace(payload.department),
    // Profil professionnel
    specialty: specialty.slug,
    profession: specialty.label,
    orderNumber: compactWhitespace(payload.orderNumber),
    university: compactWhitespace(payload.university),
    experience: Number(payload.experience),
    employer: compactWhitespace(payload.employer),
    availability: compactWhitespace(payload.availability),
    motivation: compactWhitespace(payload.motivation),
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
    // Pièces jointes, toutes facultatives : un champ absent n’est pas écrit,
    // plutôt que stocké à `null`, pour rester lisible dans Back4App.
    ...(payload.cvFile ? { cvFile: payload.cvFile } : {}),
    ...(payload.diplomaFile ? { diplomaFile: payload.diplomaFile } : {}),
    ...(payload.photoFile ? { photoFile: payload.photoFile } : {}),
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
        recruitmentReceivedSms(firstName, specialty.label, reference),
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
          specialty: specialty.label,
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
    specialty: specialty.slug,
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
