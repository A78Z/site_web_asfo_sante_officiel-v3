/**
 * Modèles de messages enregistrés par l’administration.
 *
 * Aucun modèle n’est imposé : les trois modèles de départ sont *proposés* à la
 * première ouverture, à valider et modifier avant d’être enregistrés. Cette
 * route ne fait que conserver ce que l’administrateur a choisi d’écrire.
 */

import {
  serverEnvironment,
  missingEnvironmentNames,
  createObject,
  findObjects,
  updateObject,
} from '../../_lib/parse-server.js';
import { authorizeAdmin } from '../../_lib/admin-auth.js';
import { readJsonBody, sendError } from '../../_lib/http.js';

const TEMPLATE_CLASS = 'ModeleMessage';

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  const environment = serverEnvironment();
  const missing = missingEnvironmentNames(environment);
  if (missing.length > 0) {
    console.error('[reminder-templates] missing_configuration', { missing });
    sendError(
      response,
      503,
      `Configuration du serveur manquante : ${missing.join(', ')}.`,
      'missing_configuration',
    );
    return;
  }

  const payload = await readJsonBody(request);
  const actorId = payload?.actorId ?? request.headers['x-actor-id'];
  const authorization = await authorizeAdmin(environment, actorId);
  if (authorization.error) {
    sendError(response, authorization.status, authorization.error, authorization.code);
    return;
  }

  if (request.method === 'POST' && payload?.action === 'list') {
    const { results } = await findObjects(environment, TEMPLATE_CLASS, {
      where: { archived: { $ne: true } },
      order: '-updatedAt',
      limit: 50,
    });
    response.status(200).json({ success: true, templates: results ?? [] });
    return;
  }

  if (request.method === 'POST' && payload?.action === 'save') {
    const name = String(payload.name ?? '').trim().slice(0, 60);
    const body = String(payload.body ?? '').trim();
    if (name.length < 3) {
      sendError(response, 400, 'Donnez un nom au modèle.', 'invalid_name');
      return;
    }
    if (body.length < 10) {
      sendError(response, 400, 'Le message est trop court.', 'invalid_body');
      return;
    }

    const saved = payload.objectId
      ? await updateObject(environment, TEMPLATE_CLASS, payload.objectId, { name, body })
      : await createObject(environment, TEMPLATE_CLASS, {
          name,
          body,
          archived: false,
          createdByName: authorization.actor.name ?? '',
        });
    response.status(200).json({ success: true, objectId: payload.objectId ?? saved.objectId });
    return;
  }

  if (request.method === 'POST' && payload?.action === 'archive') {
    if (!payload.objectId) {
      sendError(response, 400, 'Modèle introuvable.', 'missing_object_id');
      return;
    }
    // Archivage plutôt que suppression : un modèle retiré reste récupérable.
    await updateObject(environment, TEMPLATE_CLASS, payload.objectId, { archived: true });
    response.status(200).json({ success: true });
    return;
  }

  response.setHeader('Allow', 'POST');
  sendError(response, 405, 'Action non reconnue.', 'unknown_action');
}
