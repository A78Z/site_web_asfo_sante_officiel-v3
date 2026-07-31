import { memberCardReceivedSms } from '../_lib/sms-templates.js';
import { normalizeSenegalPhone, senegalPhoneIssue } from '../_lib/senegal-phone.js';
import {
  validateBirthDate,
  validateEmail,
  validateFieldDistinctness,
  validatePersonName,
  validateProfessionAutre,
  validateVillage,
} from '../_lib/member-request-validation.js';
import { consumeVerification, isPhoneVerified } from '../_lib/otp.js';

const MEMBER_REQUEST_CLASS = 'MemberRequests';

/** Refus métier : porte un code exploitable par l’interface. */
class SubmissionRejection extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'SubmissionRejection';
    this.code = code;
  }
}

/** Durée minimale de remplissage plausible pour un humain. */
const MIN_FILL_DURATION_MS = 3000;
const AXIOMTEXT_ENDPOINT = 'https://api.axiomtext.com/api/sms/message';
const REQUEST_TIMEOUT_MS = 30_000;
const IDEMPOTENCY_CACHE_MS = 10 * 60 * 1000;

const ALLOWED_PROFESSIONS = new Set([
  'medecin',
  'medecin-specialiste',
  'infirmier',
  'sage-femme',
  'pharmacien',
  'dentiste',
  'kinesitherapeute',
  'laborantin',
  'technicien-laboratoire',
  'biologiste',
  'radiologue',
  'technicien-imagerie-medicale',
  'ophtalmologue',
  'gynecologue-obstetricien',
  'pediatre',
  'cardiologue',
  'dermatologue',
  'oto-rhino-laryngologiste',
  'neurologue',
  'psychiatre',
  'psychologue',
  'nutritionniste',
  'dieteticien',
  'assistant-social',
  'agent-sante-communautaire',
  'matrone',
  'aide-soignant',
  'ambulancier',
  'secretaire-medical',
  'administrateur-sante',
  'etudiant-medecine',
  'etudiant-pharmacie',
  'etudiant-sante',
  'interne-medecine',
  'benevole',
  'Autre',
]);

const submissionCache =
  globalThis.__asfoMemberSubmissionCache ||
  (globalThis.__asfoMemberSubmissionCache = new Map());

const serverEnvironment = () => ({
  appId:
    process.env.BACK4APP_APP_ID ||
    process.env.PARSE_APP_ID ||
    process.env.VITE_PARSE_APP_ID,
  masterKey:
    process.env.BACK4APP_MASTER_KEY ||
    process.env.PARSE_MASTER_KEY ||
    process.env.VITE_PARSE_MASTER_KEY,
  serverUrl:
    process.env.BACK4APP_SERVER_URL ||
    process.env.PARSE_SERVER_URL ||
    process.env.VITE_PARSE_SERVER_URL,
  smsApiKey: process.env.SMS_API_KEY,
  smsSenderId: process.env.SMS_SENDER_ID || 'SERVICE SMS',
});

const compactWhitespace = (value) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';

const MAX_BODY_SIZE = 256 * 1024;

/** Lit le corps encore en flux quand le runtime ne l’a pas bufferisé. */
const readRawBody = (request) =>
  new Promise((resolve) => {
    if (request.readableEnded || request.destroyed) {
      resolve(null);
      return;
    }
    const chunks = [];
    let size = 0;
    let settled = false;
    const settle = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        request.destroy();
        settle(null);
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => settle(Buffer.concat(chunks).toString('utf8')));
    request.on('error', () => settle(null));
    request.on('aborted', () => settle(null));
  });

/**
 * Récupère le payload JSON quel que soit le runtime : `request.body` déjà
 * analysé (objet), bufferisé (Buffer/chaîne), ou flux encore ouvert. Sans ce
 * dernier cas, un runtime qui ne pré-analyse pas le corps produisait un payload
 * nul, signalé à tort comme un identifiant de demande invalide.
 */
const parseBody = async (request) => {
  const { body } = request;
  if (Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString('utf8'));
    } catch {
      return null;
    }
  }
  if (body && typeof body === 'object') return body;
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }

  const raw = await readRawBody(request);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const isValidSubmissionId = (value) =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

// Le corps illisible et l’identifiant invalide sont contrôlés en amont dans le
// handler : ils ont chacun leur message et leur code, pour ne plus être
// confondus (un corps vide était signalé comme « identifiant invalide »).
const validatePayload = (payload) => {
  // Nom et prénom : lettres uniquement, et refus des saisies manifestement
  // fantaisistes (« ZZTest », « Preprod »…) via le module partagé.
  const firstNameError = validatePersonName(payload.firstName, 'Le prénom');
  if (firstNameError) return firstNameError;
  const lastNameError = validatePersonName(payload.lastName, 'Le nom');
  if (lastNameError) return lastNameError;

  // L’e-mail est facultatif : le SMS est le canal de suivi principal. Fourni,
  // il est validé strictement (format, TLD non délivrables, jetables).
  const emailError = validateEmail(payload.email);
  if (emailError) return emailError;

  // Le téléphone est revalidé ici avec la même fonction que le formulaire : le
  // SMS de confirmation est la seule voie de suivi, un numéro injoignable ne
  // doit pas franchir cette étape même si le client a été contourné.
  const phoneIssue = senegalPhoneIssue(payload.phone);
  if (phoneIssue === 'landline') {
    return 'Les numéros fixes ne reçoivent pas de SMS. Indiquez un mobile sénégalais (70, 75, 76, 77 ou 78).';
  }
  if (phoneIssue) {
    return 'Entrez un numéro de mobile sénégalais valide : +221 suivi de 9 chiffres (ex. 77 123 45 67).';
  }

  if (!ALLOWED_PROFESSIONS.has(payload.profession)) {
    return 'La profession sélectionnée est invalide.';
  }
  if (payload.profession === 'Autre') {
    const professionError = validateProfessionAutre(payload.professionAutre);
    if (professionError) return professionError;
  }

  const birthPlaceError = validateVillage(payload.lieuNaissance, 'Le lieu de naissance');
  if (birthPlaceError) return birthPlaceError;
  const birthDateError = validateBirthDate(payload.dateNaissance);
  if (birthDateError) return birthDateError;

  const distinctnessError = validateFieldDistinctness({
    firstName: payload.firstName,
    lastName: payload.lastName,
    village: payload.lieuNaissance,
    professionAutre: payload.professionAutre,
  });
  if (distinctnessError) return distinctnessError;

  if (
    payload.photo?.__type !== 'File' ||
    typeof payload.photo?.name !== 'string' ||
    typeof payload.photo?.url !== 'string' ||
    !payload.photo.url.startsWith('https://')
  ) {
    return 'La référence de la photo est invalide.';
  }
  if (payload.consentAccepted !== true) {
    return 'Vous devez accepter les critères d’adhésion.';
  }
  return null;
};

const parseHeaders = (environment, contentType = 'application/json') => ({
  'X-Parse-Application-Id': environment.appId,
  'X-Parse-Master-Key': environment.masterKey,
  'Content-Type': contentType,
});

const parseUrl = (environment, path) =>
  `${environment.serverUrl.replace(/\/+$/, '')}${path}`;

const fetchWithTimeout = async (url, options) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

const findExistingRequest = async (environment, submissionId) => {
  const query = new URLSearchParams({
    where: JSON.stringify({ submissionId }),
    limit: '1',
    keys:
      'objectId,createdAt,photo,smsConfirmationStatus,smsConfirmationSentAt,smsConfirmationProviderId',
  });
  const response = await fetchWithTimeout(
    parseUrl(environment, `/classes/${MEMBER_REQUEST_CLASS}?${query.toString()}`),
    { headers: parseHeaders(environment) },
  );
  if (!response.ok) throw new Error('La vérification de la demande a échoué.');
  const payload = await response.json();
  return payload.results?.[0] ?? null;
};

const createMemberRequest = async (environment, payload, normalizedPhone) => {
  const smsStatus = normalizedPhone ? 'pending' : 'non_envoye_numero_invalide';
  const body = {
    firstName: compactWhitespace(payload.firstName),
    lastName: compactWhitespace(payload.lastName),
    email: compactWhitespace(payload.email).toLocaleLowerCase('fr'),
    // Toujours stocké au format E.164 sans espace, prêt pour l’envoi SMS.
    phone: normalizedPhone ?? compactWhitespace(payload.phone),
    ...(normalizedPhone ? { phoneNormalized: normalizedPhone } : {}),
    profession: payload.profession === 'Autre' ? 'Autre' : payload.profession,
    ...(payload.profession === 'Autre'
      ? { professionAutre: compactWhitespace(payload.professionAutre) }
      : {}),
    // Nouveaux champs d’état civil. `village` n’est plus alimenté : il
    // portait une adresse de résidence, de sens différent, et les
    // enregistrements existants le conservent tel quel.
    lieuNaissance: compactWhitespace(payload.lieuNaissance),
    dateNaissance: compactWhitespace(payload.dateNaissance),
    photo: payload.photo,
    status: 'En attente',
    submissionId: payload.submissionId,
    smsConfirmationStatus: smsStatus,
    consentAccepted: true,
    consentAcceptedAt: {
      __type: 'Date',
      iso: new Date().toISOString(),
    },
  };
  const response = await fetchWithTimeout(
    parseUrl(environment, `/classes/${MEMBER_REQUEST_CLASS}`),
    {
      method: 'POST',
      headers: parseHeaders(environment),
      body: JSON.stringify(body),
    },
  );
  if (!response.ok) {
    throw new Error('La demande n’a pas pu être enregistrée dans Back4App.');
  }
  return response.json();
};

const updateSmsStatus = async (environment, objectId, fields) => {
  const response = await fetchWithTimeout(
    parseUrl(environment, `/classes/${MEMBER_REQUEST_CLASS}/${objectId}`),
    {
      method: 'PUT',
      headers: parseHeaders(environment),
      body: JSON.stringify(fields),
    },
  );
  if (!response.ok) throw new Error('Le statut SMS n’a pas pu être enregistré.');
};

const sendAxiomTextSms = async (environment, to, reference) => {
  if (!environment.smsApiKey) {
    return {
      status: 'failed',
      error: 'Configuration SMS indisponible.',
    };
  }

  // Gabarit centralisé : texte GSM-7, montant inclus, un seul segment facturé.
  const message = memberCardReceivedSms(reference);

  try {
    const response = await fetchWithTimeout(AXIOMTEXT_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${environment.smsApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        message,
        signature: environment.smsSenderId,
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.success !== true) {
      return {
        status: 'failed',
        error: `AxiomText a refusé l’envoi (HTTP ${response.status}).`,
      };
    }
    return {
      status: 'sent',
      providerId:
        typeof payload.data?.messageId === 'string'
          ? payload.data.messageId
          : String(payload.data?.messageId ?? ''),
    };
  } catch (error) {
    return {
      status: 'failed',
      error:
        error?.name === 'AbortError'
          ? 'Le délai d’envoi AxiomText a expiré.'
          : 'AxiomText est temporairement injoignable.',
    };
  }
};

const publicSuccessMessage = (smsStatus) => {
  const base =
    'Votre demande de carte membre a bien été enregistrée. Notre équipe procédera à sa vérification. Aucun paiement ne doit être effectué avant validation.';
  if (smsStatus === 'sent') return `${base} Un SMS de confirmation vous a été envoyé.`;
  if (smsStatus === 'failed' || smsStatus === 'non_envoye_numero_invalide') {
    return `${base} Votre demande est bien enregistrée. La notification SMS n’a pas pu être envoyée, mais cela n’affecte pas le traitement de votre dossier.`;
  }
  return base;
};

const formatSuccessResponse = (request, idempotent = false) => ({
  success: true,
  idempotent,
  request: {
    objectId: request.objectId,
    createdAt: request.createdAt,
    smsConfirmationStatus: request.smsConfirmationStatus ?? 'pending',
    smsConfirmationSentAt: request.smsConfirmationSentAt?.iso,
  },
  message: publicSuccessMessage(request.smsConfirmationStatus),
});

/**
 * Refuse une seconde demande en attente pour le même numéro ou le même e-mail.
 * Les dossiers déjà traités (validés, refusés, archivés) n’entrent pas en jeu.
 */
const findPendingDuplicate = async (environment, normalizedPhone, email) => {
  const clauses = [{ phoneNormalized: normalizedPhone }];
  if (email) clauses.push({ email });

  const query = new URLSearchParams({
    where: JSON.stringify({ status: 'En attente', $or: clauses }),
    limit: '1',
    keys: 'status',
  });
  const response = await fetchWithTimeout(
    parseUrl(environment, `/classes/${MEMBER_REQUEST_CLASS}?${query.toString()}`),
    { headers: parseHeaders(environment) },
  );
  if (!response.ok) return null;
  const payload = await response.json();
  return payload.results?.[0] ?? null;
};

const processSubmission = async (environment, payload) => {
  const existingRequest = await findExistingRequest(environment, payload.submissionId);
  if (existingRequest) return formatSuccessResponse(existingRequest, true);

  const normalizedPhone = normalizeSenegalPhone(payload.phone);

  // Verrou principal : la demande n'est créée que si le numéro porte une
  // vérification OTP réussie, récente et non déjà utilisée. Ce contrôle relit
  // l'état en base — un client falsifié ne peut pas se déclarer vérifié.
  const verification = await isPhoneVerified(environment, normalizedPhone);
  if (!verification) {
    throw new SubmissionRejection(
      'Vérifiez votre numéro avec le code reçu par SMS avant d’envoyer la demande.',
      'phone_not_verified',
    );
  }

  const duplicate = await findPendingDuplicate(
    environment,
    normalizedPhone,
    compactWhitespace(payload.email).toLocaleLowerCase('fr'),
  );
  if (duplicate) {
    throw new SubmissionRejection(
      'Une demande est déjà en cours pour ce numéro ou cette adresse e-mail.',
      'duplicate_request',
    );
  }

  const created = await createMemberRequest(environment, payload, normalizedPhone);
  // Un code vérifié ne vaut qu'une demande.
  await consumeVerification(environment, verification.objectId).catch(() => {});
  const request = {
    ...created,
    smsConfirmationStatus: normalizedPhone
      ? 'pending'
      : 'non_envoye_numero_invalide',
  };

  if (!normalizedPhone) return formatSuccessResponse(request);

  const smsResult = await sendAxiomTextSms(environment, normalizedPhone, created.objectId);
  const smsFields =
    smsResult.status === 'sent'
      ? {
          smsConfirmationStatus: 'sent',
          smsConfirmationSentAt: {
            __type: 'Date',
            iso: new Date().toISOString(),
          },
          ...(smsResult.providerId
            ? { smsConfirmationProviderId: smsResult.providerId }
            : {}),
        }
      : {
          smsConfirmationStatus: 'failed',
          smsConfirmationError: smsResult.error.slice(0, 180),
        };

  try {
    await updateSmsStatus(environment, created.objectId, smsFields);
  } catch {
    return formatSuccessResponse({
      ...request,
      smsConfirmationStatus: 'pending',
    });
  }

  return formatSuccessResponse({
    ...request,
    ...smsFields,
  });
};

const sendError = (response, status, message, code = 'submission_failed') => {
  response.status(status).json({ success: false, error: message, code });
};

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendError(response, 405, 'Méthode non autorisée.');
    return;
  }

  const environment = serverEnvironment();
  if (!environment.appId || !environment.masterKey || !environment.serverUrl) {
    sendError(
      response,
      503,
      'Le service d’enregistrement est temporairement indisponible.',
    );
    return;
  }

  const payload = await parseBody(request);
  if (!payload || typeof payload !== 'object') {
    sendError(
      response,
      400,
      'La demande n’a pas pu être lue par le serveur. Veuillez réessayer.',
      'unreadable_body',
    );
    return;
  }
  if (!isValidSubmissionId(payload.submissionId)) {
    sendError(
      response,
      400,
      'L’identifiant de la demande est invalide. Rechargez le formulaire puis réessayez.',
      'invalid_submission_id',
    );
    return;
  }

  // Anti-bot 1 : champ piège, invisible pour un humain. Rempli => robot.
  // Le rejet est silencieux (200) pour ne rien apprendre à l’automate.
  if (compactWhitespace(payload.website).length > 0) {
    console.warn('[member-request] honeypot_triggered');
    response.status(200).json({
      success: true,
      request: { objectId: '', createdAt: new Date().toISOString(), smsConfirmationStatus: 'pending' },
      message: 'Votre demande a bien été enregistrée.',
    });
    return;
  }

  // Anti-bot 2 : un formulaire rempli en moins de trois secondes n’est pas
  // rempli à la main. Indicatif seulement — la valeur vient du client.
  const filledIn = Number(payload.filledInMs);
  if (Number.isFinite(filledIn) && filledIn >= 0 && filledIn < MIN_FILL_DURATION_MS) {
    sendError(
      response,
      400,
      'Votre demande a été envoyée trop rapidement. Vérifiez vos informations puis réessayez.',
      'filled_too_fast',
    );
    return;
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    sendError(response, 400, validationError, 'invalid_payload');
    return;
  }
  if (request.headers['x-idempotency-key'] !== payload.submissionId) {
    sendError(
      response,
      400,
      'La clé d’idempotence de la demande est invalide.',
      'idempotency_mismatch',
    );
    return;
  }

  const now = Date.now();
  for (const [key, entry] of submissionCache) {
    if (entry.expiresAt <= now) submissionCache.delete(key);
  }

  const cached = submissionCache.get(payload.submissionId);
  if (cached) {
    try {
      response.status(200).json(await cached.promise);
    } catch (error) {
      // Même traitement que hors cache : un refus métier garde son code.
      submissionCache.delete(payload.submissionId);
      if (error instanceof SubmissionRejection) {
        sendError(
          response,
          error.code === 'duplicate_request' ? 409 : 403,
          error.message,
          error.code,
        );
        return;
      }
      sendError(
        response,
        502,
        error instanceof Error
          ? error.message
          : 'La demande n’a pas pu être enregistrée.',
      );
    }
    return;
  }

  const promise = processSubmission(environment, payload);
  submissionCache.set(payload.submissionId, {
    promise,
    expiresAt: now + IDEMPOTENCY_CACHE_MS,
  });

  try {
    const result = await promise;
    response.status(result.idempotent ? 200 : 201).json(result);
  } catch (error) {
    submissionCache.delete(payload.submissionId);
    // Un refus métier (numéro non vérifié, doublon) est une erreur de requête,
    // pas une panne : il doit remonter avec son code et un statut 4xx.
    if (error instanceof SubmissionRejection) {
      sendError(
        response,
        error.code === 'duplicate_request' ? 409 : 403,
        error.message,
        error.code,
      );
      return;
    }
    sendError(
      response,
      502,
      error instanceof Error ? error.message : 'La demande n’a pas pu être enregistrée.',
    );
  }
}
