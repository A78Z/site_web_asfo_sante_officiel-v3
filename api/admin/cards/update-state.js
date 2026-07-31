/**
 * Mise à jour de l’état de carte, à l’unité ou en lot.
 *
 * Le passage à `Disponible` exige lieu, date et horaires de retrait : ce sont
 * précisément les informations que le SMS de rappel doit porter, et un rappel
 * sans lieu ferait déplacer les membres à l’aveugle.
 */

import { serverEnvironment, missingEnvironmentNames, updateObject } from '../../_lib/parse-server.js';
import { authorizeAdmin } from '../../_lib/admin-auth.js';
import {
  CARD_STATES,
  cardStateFields,
  isCardState,
  validatePickupDetails,
} from '../../_lib/card-lifecycle.js';
import { readJsonBody, sendError } from '../../_lib/http.js';

const MEMBER_REQUEST_CLASS = 'MemberRequests';
const MAX_BATCH = 300;

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
    console.error('[card-state] missing_configuration', { missing });
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

  const { state, pickup = {} } = payload;
  const objectIds = Array.isArray(payload.objectIds) ? payload.objectIds : [];

  if (!isCardState(state)) {
    sendError(response, 400, 'État de carte inconnu.', 'invalid_state');
    return;
  }
  if (objectIds.length === 0 || !objectIds.every(isValidObjectId)) {
    sendError(response, 400, 'Sélection de demandes invalide.', 'invalid_selection');
    return;
  }
  if (objectIds.length > MAX_BATCH) {
    sendError(
      response,
      400,
      `Le lot est limité à ${MAX_BATCH} demandes à la fois.`,
      'batch_too_large',
    );
    return;
  }
  if (state === CARD_STATES.AVAILABLE) {
    const pickupError = validatePickupDetails(pickup);
    if (pickupError) {
      sendError(response, 400, pickupError, 'invalid_pickup');
      return;
    }
  }

  const fields = cardStateFields(state, pickup, authorization.actor);
  const updated = [];
  const failed = [];

  // Un échec sur une demande n’interrompt pas les autres.
  for (const objectId of objectIds) {
    try {
      await updateObject(environment, MEMBER_REQUEST_CLASS, objectId, fields);
      updated.push(objectId);
    } catch (error) {
      failed.push({ objectId, reason: error?.message ?? 'unknown' });
    }
  }

  console.info('[card-state] applied', {
    state,
    actorId: payload.actorId,
    updated: updated.length,
    failed: failed.length,
  });

  response.status(200).json({
    success: true,
    state,
    fields: {
      pickupLocation: fields.pickupLocation ?? null,
      pickupDate: fields.pickupDate ?? null,
      pickupHours: fields.pickupHours ?? null,
    },
    updated,
    failed,
  });
}
