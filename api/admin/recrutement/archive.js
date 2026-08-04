/**
 * Retrait réversible d’une candidature.
 *
 * Rien n’est effacé physiquement : un drapeau est posé, et la candidature
 * disparaît des listes, des statistiques et des exports. Une manipulation
 * malheureuse reste donc rattrapable — sur un dossier qui porte une pièce
 * d’identité et un diplôme, c’est le minimum.
 *
 * La purge définitive n’est volontairement pas exposée : elle se fait depuis
 * Back4App, en connaissance de cause.
 */

import {
  serverEnvironment,
  missingEnvironmentNames,
  findObjects,
  updateObject,
  parseDate,
} from '../../_lib/parse-server.js';
import { authorizeAdmin } from '../../_lib/admin-auth.js';
import { readJsonBody, sendError } from '../../_lib/http.js';
import { RECRUITMENT_CLASS } from '../../_lib/recruitment.js';

const isValidObjectId = (value) =>
  typeof value === 'string' && /^[A-Za-z0-9]{6,20}$/.test(value);

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
    console.error('[recruitment-archive] missing_configuration', { missing });
    sendError(
      response,
      503,
      `Configuration du serveur manquante : ${missing.join(', ')}.`,
      'missing_configuration',
    );
    return;
  }

  const payload = await readJsonBody(request);
  if (!payload || typeof payload !== 'object') {
    sendError(response, 400, 'Requête illisible.', 'unreadable_body');
    return;
  }

  const authorization = await authorizeAdmin(environment, payload.actorId);
  if (authorization.error) {
    sendError(response, authorization.status, authorization.error, authorization.code);
    return;
  }

  const { objectId } = payload;
  const action = payload.action === 'restore' ? 'restore' : 'archive';
  if (!isValidObjectId(objectId)) {
    sendError(response, 400, 'Dossier invalide.', 'invalid_selection');
    return;
  }

  let application;
  try {
    const found = await findObjects(environment, RECRUITMENT_CLASS, {
      where: { objectId },
      limit: 1,
      keys: 'objectId,reference,fullName,history,archived',
    });
    application = found.results?.[0];
  } catch (error) {
    console.error('[recruitment-archive] lookup_failed', {
      reason: error?.message ?? 'unknown',
    });
    sendError(response, 502, 'Le dossier n’a pas pu être relu.', 'lookup_failed');
    return;
  }

  if (!application) {
    sendError(response, 404, 'Candidature introuvable.', 'unknown_application');
    return;
  }

  const actorName = authorization.actor.name ?? 'Administrateur';
  const now = new Date();
  const previous = Array.isArray(application.history) ? application.history : [];

  const fields = {
    archived: action === 'archive',
    archivedAt: action === 'archive' ? parseDate(now) : null,
    archivedBy: action === 'archive' ? actorName : '',
    history: [
      ...previous,
      { at: now.toISOString(), by: actorName, type: action },
    ].slice(-50),
  };

  try {
    await updateObject(environment, RECRUITMENT_CLASS, objectId, fields);
  } catch (error) {
    console.error('[recruitment-archive] write_failed', {
      reason: error?.message ?? 'unknown',
    });
    sendError(
      response,
      502,
      action === 'archive'
        ? 'La candidature n’a pas pu être supprimée.'
        : 'La candidature n’a pas pu être restaurée.',
      'write_failed',
    );
    return;
  }

  console.info('[recruitment-archive] done', { action, actorId: payload.actorId });

  response.status(200).json({
    success: true,
    objectId,
    action,
    message:
      action === 'archive'
        ? `Candidature ${application.reference ?? ''} supprimée.`.replace('  ', ' ')
        : `Candidature ${application.reference ?? ''} restaurée.`.replace('  ', ' '),
  });
}
