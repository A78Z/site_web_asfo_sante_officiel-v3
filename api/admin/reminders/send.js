/**
 * Envoi d’un lot de rappels et journalisation.
 *
 * Le client découpe la sélection et appelle cette route lot par lot : c’est ce
 * qui rend possible la barre de progression et l’interruption sans perdre ce
 * qui est déjà parti. Un échec sur un destinataire n’arrête pas les autres.
 *
 * Le canal SMS réutilise l’intégration existante (AxiomText) — aucun second
 * système d’envoi n’est introduit.
 */

import {
  serverEnvironment,
  missingEnvironmentNames,
  createObject,
  updateObject,
  parseDate,
} from '../../_lib/parse-server.js';
import { authorizeAdmin } from '../../_lib/admin-auth.js';
import { sendSms } from '../../_lib/sms-sender.js';
import { normalizeSenegalPhone } from '../../_lib/senegal-phone.js';
import {
  DEFAULT_SEGMENT_CAP,
  messageMetrics,
  renderReminder,
} from '../../_lib/reminder-message.js';
import { readJsonBody, sendError } from '../../_lib/http.js';

const MEMBER_REQUEST_CLASS = 'MemberRequests';
const REMINDER_LOG_CLASS = 'RappelEnvoye';
const MAX_BATCH = 25;

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
    console.error('[reminder-send] missing_configuration', { missing });
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

  const template = String(payload.template ?? '');
  const recipients = Array.isArray(payload.recipients) ? payload.recipients : [];
  const segmentCap = Number.isFinite(payload.segmentCap)
    ? Math.max(1, Math.floor(payload.segmentCap))
    : DEFAULT_SEGMENT_CAP;
  const isTest = payload.mode === 'test';
  const campaignId = String(payload.campaignId ?? '').slice(0, 64);

  if (template.trim().length < 10) {
    sendError(response, 400, 'Le message est trop court.', 'template_too_short');
    return;
  }
  if (recipients.length === 0) {
    sendError(response, 400, 'Aucun destinataire dans ce lot.', 'empty_batch');
    return;
  }
  if (recipients.length > MAX_BATCH) {
    sendError(
      response,
      400,
      `Un lot ne peut dépasser ${MAX_BATCH} destinataires.`,
      'batch_too_large',
    );
    return;
  }

  const results = [];

  for (const recipient of recipients) {
    const name = `${recipient.firstName ?? ''} ${recipient.lastName ?? ''}`.trim();
    // En mode test, le message est composé avec un destinataire réel mais
    // expédié au numéro de l’administrateur.
    const destination = normalizeSenegalPhone(
      isTest ? payload.testPhone : recipient.phoneNormalized || recipient.phone,
    );

    if (!destination) {
      results.push({
        objectId: recipient.objectId,
        name,
        status: 'skipped',
        detail: 'Numéro invalide au moment de l’envoi.',
      });
      continue;
    }

    const message = renderReminder(template, recipient);
    const metrics = messageMetrics(message);

    // Plafond de segments : blocage explicite, jamais de troncature silencieuse.
    if (metrics.segments > segmentCap) {
      results.push({
        objectId: recipient.objectId,
        name,
        status: 'skipped',
        segments: metrics.segments,
        detail: `Message de ${metrics.segments} segments, au-delà du plafond de ${segmentCap}.`,
      });
      continue;
    }

    const outcome = await sendSms(destination, message);

    results.push({
      objectId: recipient.objectId,
      name,
      // `providerStatus` est l’accusé de l’API, restitué tel quel : il atteste
      // d’une remise à l’opérateur, jamais d’une réception ni d’une lecture.
      status: outcome.status === 'sent' ? 'accepted_by_provider' : 'failed',
      providerStatus: outcome.status,
      providerId: outcome.providerId ?? null,
      detail: outcome.error ?? null,
      segments: metrics.segments,
    });

    if (isTest) continue;

    // Journal : texte final, canal, horodatage, accusé, segments, émetteur.
    try {
      await createObject(environment, REMINDER_LOG_CLASS, {
        memberRequestId: recipient.objectId,
        memberName: name,
        phone: destination,
        channel: 'sms',
        message,
        segments: metrics.segments,
        providerStatus: outcome.status,
        providerId: outcome.providerId ?? '',
        providerError: outcome.error ?? '',
        campaignId,
        sentByName: authorization.actor.name ?? '',
        sentById: payload.actorId,
        sentAt: parseDate(new Date()),
      });
    } catch (error) {
      console.error('[reminder-send] log_failed', { reason: error?.message ?? 'unknown' });
    }

    if (outcome.status === 'sent') {
      try {
        await updateObject(environment, MEMBER_REQUEST_CLASS, recipient.objectId, {
          lastReminderAt: parseDate(new Date()),
          lastReminderChannel: 'sms',
        });
      } catch (error) {
        console.error('[reminder-send] stamp_failed', {
          reason: error?.message ?? 'unknown',
        });
      }
    }
  }

  const accepted = results.filter((r) => r.status === 'accepted_by_provider').length;
  console.info('[reminder-send] batch', {
    mode: isTest ? 'test' : 'live',
    actorId: payload.actorId,
    size: recipients.length,
    accepted,
  });

  response.status(200).json({
    success: true,
    mode: isTest ? 'test' : 'live',
    accepted,
    failed: results.length - accepted,
    results,
  });
}
