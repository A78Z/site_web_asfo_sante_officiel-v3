/**
 * Notification « votre carte de membre est disponible ».
 *
 * Route délibérément étroite : un seul dossier à la fois, un message imposé,
 * et trois verrous avant l’envoi — carte réellement disponible, numéro
 * sénégalais valide, notification pas déjà partie. Le renvoi existe, mais il
 * doit être demandé explicitement (`force`) par un administrateur.
 *
 * L’envoi ne modifie jamais l’état de la carte : notifier n’est pas remettre.
 */

import {
  serverEnvironment,
  missingEnvironmentNames,
  createObject,
  findObjects,
  updateObject,
  parseDate,
} from '../../_lib/parse-server.js';
import { authorizeAdmin } from '../../_lib/admin-auth.js';
import { sendSms } from '../../_lib/sms-sender.js';
import { normalizeSenegalPhone } from '../../_lib/senegal-phone.js';
import { memberCardAvailableSms, smsSegmentCount } from '../../_lib/sms-templates.js';
import { CARD_STATES } from '../../_lib/card-lifecycle.js';
import { readJsonBody, sendError } from '../../_lib/http.js';

const MEMBER_REQUEST_CLASS = 'MemberRequests';
const REMINDER_LOG_CLASS = 'RappelEnvoye';

const isValidObjectId = (value) =>
  typeof value === 'string' && /^[A-Za-z0-9]{6,20}$/.test(value);

const REQUEST_KEYS = [
  'objectId',
  'firstName',
  'lastName',
  'phone',
  'phoneNormalized',
  'cardState',
  'cardReadySmsStatus',
  'cardReadySmsSentAt',
  'cardReadySmsProviderId',
  'cardReadySmsCount',
].join(',');

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
    console.error('[card-notify] missing_configuration', { missing });
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

  const objectId = payload.objectId;
  const force = payload.force === true;
  if (!isValidObjectId(objectId)) {
    sendError(response, 400, 'Dossier invalide.', 'invalid_selection');
    return;
  }

  // L’état est relu en base, jamais pris depuis le client : une page restée
  // ouverte peut afficher une carte « disponible » qui ne l’est plus.
  let member;
  try {
    const found = await findObjects(environment, MEMBER_REQUEST_CLASS, {
      where: { objectId },
      limit: 1,
      keys: REQUEST_KEYS,
    });
    member = found.results?.[0];
  } catch (error) {
    console.error('[card-notify] lookup_failed', { reason: error?.message ?? 'unknown' });
    sendError(response, 502, 'Le dossier n’a pas pu être relu.', 'lookup_failed');
    return;
  }

  if (!member) {
    sendError(response, 404, 'Dossier introuvable.', 'unknown_request');
    return;
  }

  // Verrou 1 : la carte doit être physiquement disponible. Prévenir un membre
  // trop tôt le ferait se déplacer pour rien.
  if (member.cardState !== CARD_STATES.AVAILABLE) {
    sendError(
      response,
      409,
      'La carte n’est pas au statut « Disponible ». Marquez-la disponible avant de notifier le membre.',
      'card_not_available',
    );
    return;
  }

  // Verrou 2 : un membre déjà prévenu ne l’est pas deux fois par mégarde.
  const alreadyNotified = member.cardReadySmsStatus === 'sent';
  if (alreadyNotified && !force) {
    sendError(
      response,
      409,
      'Ce membre a déjà été notifié. Utilisez « Renvoyer le SMS » pour l’avertir une nouvelle fois.',
      'already_notified',
    );
    return;
  }

  // Verrou 3 : numéro exploitable, au format E.164 sénégalais.
  const destination = normalizeSenegalPhone(member.phoneNormalized || member.phone);
  if (!destination) {
    const invalidFields = {
      cardReadySmsStatus: 'failed',
      cardReadySmsError: 'Numéro de téléphone invalide.',
      cardReadySmsAttemptedAt: parseDate(new Date()),
    };
    await updateObject(environment, MEMBER_REQUEST_CLASS, objectId, invalidFields).catch(
      (error) =>
        console.error('[card-notify] status_write_failed', {
          reason: error?.message ?? 'unknown',
        }),
    );
    sendError(
      response,
      400,
      'Le numéro de téléphone de ce membre est invalide : le SMS ne peut pas être envoyé.',
      'invalid_phone',
    );
    return;
  }

  // Le gabarit refuse un prénom ou un nom vide : plus de « Bonjour , ».
  let message;
  try {
    message = memberCardAvailableSms(member.firstName, member.lastName);
  } catch {
    sendError(
      response,
      422,
      'Le prénom ou le nom du membre est manquant : complétez le dossier avant de notifier.',
      'incomplete_member',
    );
    return;
  }

  const outcome = await sendSms(destination, message);
  const now = new Date();
  const sent = outcome.status === 'sent';

  const fields = sent
    ? {
        cardReadySmsStatus: 'sent',
        cardReadySmsSentAt: parseDate(now),
        cardReadySmsProviderId: outcome.providerId ?? '',
        cardReadySmsError: '',
        // Compteur d’envois : distingue une notification d’un renvoi.
        cardReadySmsCount: Number(member.cardReadySmsCount ?? 0) + 1,
        cardReadySmsSentBy: authorization.actor.name ?? '',
        lastReminderAt: parseDate(now),
        lastReminderChannel: 'sms',
      }
    : {
        // Le dossier reste en « SMS non envoyé » : l’administrateur voit
        // l’échec et peut relancer plus tard.
        cardReadySmsStatus: 'failed',
        cardReadySmsError: String(outcome.error ?? 'Envoi refusé.').slice(0, 180),
        cardReadySmsAttemptedAt: parseDate(now),
      };

  let statusPersisted = true;
  try {
    await updateObject(environment, MEMBER_REQUEST_CLASS, objectId, fields);
  } catch (error) {
    statusPersisted = false;
    console.error('[card-notify] status_write_failed', {
      reason: error?.message ?? 'unknown',
    });
  }

  // Journal d’envoi, partagé avec les rappels : texte exact, accusé, émetteur.
  try {
    await createObject(environment, REMINDER_LOG_CLASS, {
      memberRequestId: objectId,
      memberName: `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim(),
      phone: destination,
      channel: 'sms',
      kind: 'carte_disponible',
      resend: alreadyNotified,
      message,
      segments: smsSegmentCount(message),
      providerStatus: outcome.status,
      providerId: outcome.providerId ?? '',
      providerError: outcome.error ?? '',
      sentByName: authorization.actor.name ?? '',
      sentById: payload.actorId,
      sentAt: parseDate(now),
    });
  } catch (error) {
    console.error('[card-notify] log_failed', { reason: error?.message ?? 'unknown' });
  }

  console.info('[card-notify] done', {
    actorId: payload.actorId,
    status: outcome.status,
    resend: alreadyNotified,
  });

  response.status(200).json({
    success: true,
    objectId,
    status: sent ? 'sent' : 'failed',
    resend: alreadyNotified,
    sentAt: sent ? now.toISOString() : null,
    providerId: sent ? outcome.providerId ?? '' : '',
    segments: smsSegmentCount(message),
    statusPersisted,
    message: sent
      ? 'Le membre a été notifié par SMS.'
      : `Le SMS n’a pas pu être envoyé : ${outcome.error ?? 'erreur inconnue'}. Le dossier reste en « SMS non envoyé ».`,
  });
}
