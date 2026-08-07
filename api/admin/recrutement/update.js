/**
 * Instruction d’une candidature : décision, commentaire, notifications.
 *
 * Trois actions distinctes plutôt qu’une route fourre-tout :
 *   - `decision` : change le statut et trace qui l’a fait, et quand ;
 *   - `comment`  : ajoute une note interne, jamais envoyée au candidat ;
 *   - `notify`   : prévient le candidat par SMS et/ou e-mail.
 *
 * Une décision ne notifie pas automatiquement : la commission doit pouvoir
 * arrêter un choix, le relire, puis décider quand et comment l’annoncer.
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
import { normalizeSenegalPhone } from '../../_lib/senegal-phone.js';
import { sendSms } from '../../_lib/sms-sender.js';
import { recruitmentDecisionSms } from '../../_lib/sms-templates.js';
import { sendEmail } from '../../_lib/email-sender.js';
import { recruitmentDecisionEmail } from '../../_lib/email-templates.js';
import {
  EMAIL_NOTIFICATIONS_ENABLED,
  RECRUITMENT_CLASS,
  isRecruitmentStatus,
  specialtyBySlug,
} from '../../_lib/recruitment.js';

const isValidObjectId = (value) =>
  typeof value === 'string' && /^[A-Za-z0-9]{6,20}$/.test(value);

const loadApplication = async (environment, objectId) => {
  const found = await findObjects(environment, RECRUITMENT_CLASS, {
    where: { objectId },
    limit: 1,
    keys:
      'objectId,reference,firstName,lastName,email,phone,phoneNormalized,specialty,speciality,profession,status,comments,history,decisionSmsStatus,decisionEmailStatus',
  });
  return found.results?.[0] ?? null;
};

/** Historique borné : les 50 derniers événements suffisent à l’instruction. */
const appendHistory = (application, entry) => {
  const previous = Array.isArray(application.history) ? application.history : [];
  return [...previous, entry].slice(-50);
};

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
    console.error('[recruitment-update] missing_configuration', { missing });
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

  const { objectId, action } = payload;
  if (!isValidObjectId(objectId)) {
    sendError(response, 400, 'Dossier invalide.', 'invalid_selection');
    return;
  }

  let application;
  try {
    application = await loadApplication(environment, objectId);
  } catch (error) {
    console.error('[recruitment-update] lookup_failed', { reason: error?.message ?? 'unknown' });
    sendError(response, 502, 'Le dossier n’a pas pu être relu.', 'lookup_failed');
    return;
  }
  if (!application) {
    sendError(response, 404, 'Candidature introuvable.', 'unknown_application');
    return;
  }

  const actorName = authorization.actor.name ?? 'Administrateur';
  const now = new Date();

  /* ─── Décision ─── */
  if (action === 'decision') {
    const status = payload.status;
    if (!isRecruitmentStatus(status)) {
      sendError(response, 400, 'Statut inconnu.', 'invalid_status');
      return;
    }

    const fields = {
      status,
      reviewedBy: actorName,
      reviewDate: parseDate(now),
      history: appendHistory(application, {
        at: now.toISOString(),
        by: actorName,
        type: 'decision',
        from: application.status ?? '',
        to: status,
      }),
    };

    try {
      await updateObject(environment, RECRUITMENT_CLASS, objectId, fields);
    } catch (error) {
      console.error('[recruitment-update] decision_failed', {
        reason: error?.message ?? 'unknown',
      });
      sendError(response, 502, 'La décision n’a pas pu être enregistrée.', 'write_failed');
      return;
    }

    response.status(200).json({
      success: true,
      objectId,
      status,
      message: `Statut mis à jour : ${status}. Le candidat n’a pas encore été prévenu.`,
    });
    return;
  }

  /* ─── Commentaire interne ─── */
  if (action === 'comment') {
    const comment = String(payload.comment ?? '').trim().slice(0, 1000);
    if (comment.length < 2) {
      sendError(response, 400, 'Le commentaire est vide.', 'empty_comment');
      return;
    }

    const fields = {
      comments: comment,
      history: appendHistory(application, {
        at: now.toISOString(),
        by: actorName,
        type: 'comment',
        text: comment.slice(0, 300),
      }),
    };

    try {
      await updateObject(environment, RECRUITMENT_CLASS, objectId, fields);
    } catch (error) {
      console.error('[recruitment-update] comment_failed', {
        reason: error?.message ?? 'unknown',
      });
      sendError(response, 502, 'Le commentaire n’a pas pu être enregistré.', 'write_failed');
      return;
    }

    response.status(200).json({ success: true, objectId, message: 'Commentaire enregistré.' });
    return;
  }

  /* ─── Notification du candidat ─── */
  if (action === 'notify') {
    const channel = payload.channel === 'email' ? 'email' : 'sms';

    // Le bouton est désactivé dans le back-office, mais la route reste
    // atteignable : le refus est posé ici aussi.
    if (channel === 'email' && !EMAIL_NOTIFICATIONS_ENABLED) {
      sendError(
        response,
        409,
        'La notification par e-mail n’est pas encore activée. Utilisez le SMS.',
        'email_disabled',
      );
      return;
    }

    const status = application.status ?? '';
    if (!isRecruitmentStatus(status)) {
      sendError(
        response,
        409,
        'Arrêtez d’abord une décision avant de notifier le candidat.',
        'no_decision',
      );
      return;
    }

    const specialtyLabel =
      application.speciality ?? specialtyBySlug(application.specialty)?.label ?? application.profession ?? '';
    const comment = String(payload.comment ?? '').trim().slice(0, 600);
    const fields = {};
    let outcome;

    if (channel === 'sms') {
      const destination = normalizeSenegalPhone(
        application.phoneNormalized || application.phone,
      );
      if (!destination) {
        sendError(
          response,
          400,
          'Le numéro de ce candidat est invalide : le SMS ne peut pas être envoyé.',
          'invalid_phone',
        );
        return;
      }
      try {
        outcome = await sendSms(
          destination,
          recruitmentDecisionSms(
            application.firstName,
            specialtyLabel,
            application.reference,
            status,
          ),
        );
      } catch (error) {
        outcome = { status: 'failed', error: error?.message ?? 'Composition impossible.' };
      }
      fields.decisionSmsStatus = outcome.status === 'sent' ? 'sent' : 'failed';
      fields.decisionSmsError = outcome.error ? String(outcome.error).slice(0, 180) : '';
      if (outcome.status === 'sent') {
        fields.decisionSmsSentAt = parseDate(now);
        fields.decisionSmsProviderId = outcome.providerId ?? '';
      }
    } else {
      if (!application.email) {
        sendError(
          response,
          400,
          'Ce candidat n’a pas d’adresse e-mail enregistrée.',
          'no_email',
        );
        return;
      }
      outcome = await sendEmail({
        to: application.email,
        ...recruitmentDecisionEmail({
          firstName: application.firstName,
          lastName: application.lastName,
          specialty: specialtyLabel,
          reference: application.reference,
          status,
          comment,
        }),
      });
      fields.decisionEmailStatus = outcome.status;
      fields.decisionEmailError = outcome.error ? String(outcome.error).slice(0, 180) : '';
      if (outcome.status === 'sent') {
        fields.decisionEmailSentAt = parseDate(now);
        fields.decisionEmailProviderId = outcome.providerId ?? '';
      }
    }

    fields.history = appendHistory(application, {
      at: now.toISOString(),
      by: actorName,
      type: `notify_${channel}`,
      result: outcome.status,
    });

    try {
      await updateObject(environment, RECRUITMENT_CLASS, objectId, fields);
    } catch (error) {
      console.error('[recruitment-update] notify_status_failed', {
        reason: error?.message ?? 'unknown',
      });
    }

    const sent = outcome.status === 'sent';
    response.status(200).json({
      success: true,
      objectId,
      channel,
      status: outcome.status,
      message: sent
        ? `Le candidat a été notifié par ${channel === 'sms' ? 'SMS' : 'e-mail'}.`
        : outcome.status === 'not_configured'
          ? 'L’envoi d’e-mails n’est pas configuré sur ce serveur (RESEND_API_KEY manquante).'
          : `La notification n’a pas pu être envoyée : ${outcome.error ?? 'erreur inconnue'}.`,
    });
    return;
  }

  sendError(response, 400, 'Action inconnue.', 'unknown_action');
}
