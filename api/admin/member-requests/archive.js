/**
 * Archivage réversible d’une demande de carte membre.
 *
 * Cette route ne supprime jamais physiquement : elle bascule un statut et pose
 * un horodatage, de sorte qu’une erreur de manipulation reste rattrapable. Elle
 * s’exécute avec la clé master, côté serveur, pour que l’opération ne dépende
 * pas de la clé REST publique embarquée dans le bundle du navigateur.
 *
 * La purge définitive n’est volontairement pas exposée ici.
 */

const MEMBER_REQUEST_CLASS = 'MemberRequests';
const ADMIN_USER_CLASS = 'AdminUsers';
const REQUEST_TIMEOUT_MS = 15_000;

/** Seuls ces rôles peuvent archiver ou restaurer une demande. */
const ALLOWED_ROLES = new Set(['Super Admin', 'Admin']);

/** Statut appliqué à une demande archivée. */
const ARCHIVED_STATUS = 'Supprimé';

const serverEnvironment = () => ({
  appId:
    process.env.BACK4APP_APP_ID ||
    process.env.PARSE_APP_ID ||
    process.env.VITE_PARSE_APP_ID,
  // Jamais préfixée VITE_ : une telle variable serait embarquée dans le bundle.
  masterKey: process.env.BACK4APP_MASTER_KEY || process.env.PARSE_MASTER_KEY,
  serverUrl:
    process.env.BACK4APP_SERVER_URL ||
    process.env.PARSE_SERVER_URL ||
    process.env.VITE_PARSE_SERVER_URL,
});

const ENVIRONMENT_VARIABLE_NAMES = {
  appId: 'PARSE_APP_ID',
  masterKey: 'PARSE_MASTER_KEY',
  serverUrl: 'PARSE_SERVER_URL',
};

const baseUrl = (environment) => environment.serverUrl.replace(/\/+$/, '');

const masterHeaders = (environment) => ({
  'X-Parse-Application-Id': environment.appId,
  'X-Parse-Master-Key': environment.masterKey,
  'Content-Type': 'application/json',
});

const fetchWithTimeout = async (url, options) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

/** Les objectId Parse sont alphanumériques et courts. */
const isValidObjectId = (value) =>
  typeof value === 'string' && /^[A-Za-z0-9]{6,20}$/.test(value);

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
  return null;
};

const sendError = (response, status, message, code) => {
  response.status(status).json({ success: false, error: message, code });
};

/** Charge l’acteur et vérifie qu’il a le droit d’archiver. */
const authorizeActor = async (environment, actorId) => {
  const response = await fetchWithTimeout(
    `${baseUrl(environment)}/classes/${ADMIN_USER_CLASS}/${actorId}?keys=name,role,status`,
    { headers: masterHeaders(environment) },
  );
  if (response.status === 404) return { error: 'unknown_actor' };
  if (!response.ok) return { error: 'actor_lookup_failed' };

  const actor = await response.json();
  if (actor.status !== 'Actif') return { error: 'inactive_actor' };
  if (!ALLOWED_ROLES.has(actor.role)) return { error: 'forbidden_role' };
  return { actor };
};

const loadRequest = async (environment, objectId) => {
  const response = await fetchWithTimeout(
    `${baseUrl(environment)}/classes/${MEMBER_REQUEST_CLASS}/${objectId}?keys=status,statusBeforeDelete`,
    { headers: masterHeaders(environment) },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('request_lookup_failed');
  return response.json();
};

const applyUpdate = async (environment, objectId, fields) => {
  const response = await fetchWithTimeout(
    `${baseUrl(environment)}/classes/${MEMBER_REQUEST_CLASS}/${objectId}`,
    {
      method: 'PUT',
      headers: masterHeaders(environment),
      body: JSON.stringify(fields),
    },
  );
  if (!response.ok) throw new Error('update_failed');
  return response.json();
};

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendError(response, 405, 'Méthode non autorisée.', 'method_not_allowed');
    return;
  }

  const environment = serverEnvironment();
  const missing = Object.keys(ENVIRONMENT_VARIABLE_NAMES)
    .filter((key) => !environment[key])
    .map((key) => ENVIRONMENT_VARIABLE_NAMES[key]);
  if (missing.length > 0) {
    console.error('[member-request-archive] missing_configuration', { missing });
    sendError(
      response,
      503,
      `Configuration du serveur manquante : ${missing.join(', ')}.`,
      'missing_configuration',
    );
    return;
  }

  const payload = await parseBody(request);
  if (!payload || typeof payload !== 'object') {
    sendError(response, 400, 'Requête illisible.', 'unreadable_body');
    return;
  }

  const { objectId, actorId } = payload;
  const action = payload.action === 'restore' ? 'restore' : 'archive';

  if (!isValidObjectId(objectId)) {
    sendError(response, 400, 'Identifiant de demande invalide.', 'invalid_object_id');
    return;
  }
  if (!isValidObjectId(actorId)) {
    sendError(
      response,
      401,
      'Session administrateur invalide. Reconnectez-vous.',
      'invalid_actor',
    );
    return;
  }

  let authorization;
  try {
    authorization = await authorizeActor(environment, actorId);
  } catch {
    sendError(response, 502, 'Vérification des droits impossible.', 'actor_lookup_failed');
    return;
  }
  if (authorization.error) {
    const forbidden =
      authorization.error === 'forbidden_role' || authorization.error === 'inactive_actor';
    sendError(
      response,
      forbidden ? 403 : 401,
      forbidden
        ? 'Votre rôle ne permet pas de supprimer une demande.'
        : 'Session administrateur invalide. Reconnectez-vous.',
      authorization.error,
    );
    return;
  }

  try {
    const existing = await loadRequest(environment, objectId);
    if (!existing) {
      sendError(response, 404, 'Cette demande n’existe plus.', 'not_found');
      return;
    }

    const fields =
      action === 'archive'
        ? {
            status: ARCHIVED_STATUS,
            // Mémorisé pour que la restauration rende son statut d’origine.
            statusBeforeDelete: existing.status ?? 'En attente',
            deletedAt: { __type: 'Date', iso: new Date().toISOString() },
            deletedBy: authorization.actor.name ?? '',
            deletedById: actorId,
          }
        : {
            status: existing.statusBeforeDelete || 'En attente',
            statusBeforeDelete: { __op: 'Delete' },
            deletedAt: { __op: 'Delete' },
            deletedBy: { __op: 'Delete' },
            deletedById: { __op: 'Delete' },
          };

    await applyUpdate(environment, objectId, fields);

    // Journal d’audit : identifiants techniques uniquement, aucune donnée
    // personnelle du demandeur ni de l’administrateur.
    console.info('[member-request-archive] ok', {
      action,
      objectId,
      actorId,
      at: new Date().toISOString(),
    });

    response.status(200).json({
      success: true,
      action,
      status: fields.status,
      previousStatus: action === 'archive' ? existing.status ?? null : null,
    });
  } catch (error) {
    console.error('[member-request-archive] failed', {
      action,
      objectId,
      reason: error?.message ?? 'unknown',
    });
    sendError(
      response,
      502,
      action === 'archive'
        ? 'La demande n’a pas pu être supprimée. Veuillez réessayer.'
        : 'La demande n’a pas pu être restaurée. Veuillez réessayer.',
      'operation_failed',
    );
  }
}
