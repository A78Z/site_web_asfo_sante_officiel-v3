const MEMBER_REQUEST_CLASS = 'MemberRequests';
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

const normalizeSenegalPhone = (rawPhone) => {
  const compact = compactWhitespace(rawPhone).replace(/[\s().-]/g, '');
  let digits = compact.replace(/^\+/, '').replace(/\D/g, '');

  if (digits.startsWith('00221')) digits = digits.slice(5);
  else if (digits.startsWith('221')) digits = digits.slice(3);
  else if (digits.length === 10 && digits.startsWith('0')) digits = digits.slice(1);

  if (!/^7[05678]\d{7}$/.test(digits)) return null;
  return `+221${digits}`;
};

const parseBody = (request) => {
  if (request.body && typeof request.body === 'object') return request.body;
  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body);
    } catch {
      return null;
    }
  }
  return null;
};

const isValidSubmissionId = (value) =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

const validatePayload = (payload) => {
  if (!payload || !isValidSubmissionId(payload.submissionId)) {
    return 'L’identifiant de la demande est invalide. Rechargez le formulaire puis réessayez.';
  }

  const requiredTextFields = [
    ['firstName', 'Le prénom est requis.'],
    ['lastName', 'Le nom est requis.'],
    ['email', 'L’adresse e-mail est requise.'],
    ['phone', 'Le téléphone est requis.'],
    ['village', 'L’adresse ou la ville est requise.'],
  ];
  for (const [field, message] of requiredTextFields) {
    if (compactWhitespace(payload[field]).length < 2) return message;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(compactWhitespace(payload.email))) {
    return 'L’adresse e-mail est invalide.';
  }
  if (!ALLOWED_PROFESSIONS.has(payload.profession)) {
    return 'La profession sélectionnée est invalide.';
  }
  if (
    payload.profession === 'Autre' &&
    compactWhitespace(payload.professionAutre).length < 3
  ) {
    return 'Précisez votre profession.';
  }
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
    phone: compactWhitespace(payload.phone),
    ...(normalizedPhone ? { phoneNormalized: normalizedPhone } : {}),
    profession: payload.profession === 'Autre' ? 'Autre' : payload.profession,
    ...(payload.profession === 'Autre'
      ? { professionAutre: compactWhitespace(payload.professionAutre) }
      : {}),
    village: compactWhitespace(payload.village),
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

  const message = `ASFO : votre demande de carte membre a bien été reçue. Référence : ${reference}. Aucun paiement avant validation. Vous serez informé(e) de la suite. Merci.`;

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

const processSubmission = async (environment, payload) => {
  const existingRequest = await findExistingRequest(environment, payload.submissionId);
  if (existingRequest) return formatSuccessResponse(existingRequest, true);

  const normalizedPhone = normalizeSenegalPhone(payload.phone);
  const created = await createMemberRequest(environment, payload, normalizedPhone);
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

const sendError = (response, status, message) => {
  response.status(status).json({ success: false, error: message });
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

  const payload = parseBody(request);
  const validationError = validatePayload(payload);
  if (validationError) {
    sendError(response, 400, validationError);
    return;
  }
  if (request.headers['x-idempotency-key'] !== payload.submissionId) {
    sendError(response, 400, 'La clé d’idempotence de la demande est invalide.');
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
    sendError(
      response,
      502,
      error instanceof Error ? error.message : 'La demande n’a pas pu être enregistrée.',
    );
  }
}
