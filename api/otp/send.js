/**
 * Envoi d’un code de vérification vers un mobile sénégalais.
 *
 * C’est le verrou principal contre les faux numéros : sans code reçu, aucune
 * demande de carte membre ne peut être enregistrée.
 */

import { normalizeSenegalPhone } from '../_lib/senegal-phone.js';
import { verificationCodeSms } from '../_lib/sms-templates.js';
import { sendSms } from '../_lib/sms-sender.js';
import { serverEnvironment, missingEnvironmentNames } from '../_lib/parse-server.js';
import {
  CODE_TTL_MS,
  MAX_SENDS_PER_IP,
  MAX_SENDS_PER_WINDOW,
  RESEND_DELAY_MS,
  clientIp,
  countRecentSends,
  countRecentSendsByIp,
  findLatestVerification,
  hashIp,
  issueCode,
} from '../_lib/otp.js';
import { readJsonBody, sendError } from '../_lib/http.js';

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
    console.error('[otp-send] missing_configuration', { missing });
    sendError(
      response,
      503,
      `Configuration du serveur manquante : ${missing.join(', ')}.`,
      'missing_configuration',
    );
    return;
  }

  const payload = await readJsonBody(request);
  const phone = normalizeSenegalPhone(payload?.phone);
  if (!phone) {
    sendError(
      response,
      400,
      'Entrez un numéro de mobile sénégalais valide : +221 suivi de 9 chiffres.',
      'invalid_phone',
    );
    return;
  }

  const ipHash = hashIp(clientIp(request));

  try {
    // Anti-renvoi : un code par minute au plus vers un même numéro.
    const latest = await findLatestVerification(environment, phone);
    if (latest?.sentAt?.iso) {
      const elapsed = Date.now() - new Date(latest.sentAt.iso).getTime();
      if (elapsed < RESEND_DELAY_MS) {
        response.setHeader(
          'Retry-After',
          String(Math.ceil((RESEND_DELAY_MS - elapsed) / 1000)),
        );
        sendError(
          response,
          429,
          `Patientez ${Math.ceil((RESEND_DELAY_MS - elapsed) / 1000)} secondes avant de demander un nouveau code.`,
          'resend_too_soon',
        );
        return;
      }
    }

    const [sendsForPhone, sendsForIp] = await Promise.all([
      countRecentSends(environment, phone),
      countRecentSendsByIp(environment, ipHash),
    ]);
    if (sendsForPhone >= MAX_SENDS_PER_WINDOW || sendsForIp >= MAX_SENDS_PER_IP) {
      sendError(
        response,
        429,
        'Trop de demandes de code. Réessayez dans une heure.',
        'rate_limited',
      );
      return;
    }

    const minutes = Math.round(CODE_TTL_MS / 60000);
    const { code } = await issueCode(environment, phone, ipHash);

    // Le code n’est ni journalisé ni renvoyé au client : il ne transite que
    // par le SMS, ce qui est précisément ce qui prouve la possession du numéro.
    const result = await sendSms(phone, verificationCodeSms(code, String(minutes)));
    if (result.status !== 'sent') {
      console.error('[otp-send] sms_failed', { reason: result.error });
      sendError(
        response,
        502,
        'Le code n’a pas pu être envoyé. Vérifiez le numéro puis réessayez.',
        'sms_failed',
      );
      return;
    }

    response.status(200).json({
      success: true,
      expiresInSeconds: Math.round(CODE_TTL_MS / 1000),
      resendInSeconds: Math.round(RESEND_DELAY_MS / 1000),
    });
  } catch (error) {
    console.error('[otp-send] failed', { reason: error?.message ?? 'unknown' });
    sendError(
      response,
      502,
      'Le service de vérification est momentanément indisponible.',
      'otp_unavailable',
    );
  }
}
