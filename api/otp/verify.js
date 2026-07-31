/**
 * Vérification du code reçu par SMS.
 *
 * Le succès n’émet aucun jeton exploitable par le client : c’est
 * l’enregistrement de la demande qui relira l’état vérifié directement en base.
 * Un client falsifié ne peut donc pas se déclarer vérifié.
 */

import { normalizeSenegalPhone } from '../_lib/senegal-phone.js';
import { serverEnvironment, missingEnvironmentNames } from '../_lib/parse-server.js';
import { MAX_ATTEMPTS, verifyCode } from '../_lib/otp.js';
import { readJsonBody, sendError } from '../_lib/http.js';

const FAILURE_MESSAGES = {
  no_code: 'Aucun code n’a été envoyé à ce numéro. Demandez un code.',
  expired: 'Ce code a expiré. Demandez un nouveau code.',
  too_many_attempts: `Trop d’essais (${MAX_ATTEMPTS}). Demandez un nouveau code.`,
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
    console.error('[otp-verify] missing_configuration', { missing });
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
  const code = String(payload?.code ?? '').replace(/\D/g, '');

  if (!phone) {
    sendError(response, 400, 'Numéro de téléphone invalide.', 'invalid_phone');
    return;
  }
  if (code.length !== 6) {
    sendError(response, 400, 'Le code doit comporter 6 chiffres.', 'invalid_code_format');
    return;
  }

  try {
    const result = await verifyCode(environment, phone, code);
    if (result.ok) {
      response.status(200).json({ success: true, verified: true });
      return;
    }

    if (result.reason === 'mismatch') {
      sendError(
        response,
        400,
        result.remaining > 0
          ? `Code incorrect. Il vous reste ${result.remaining} essai${result.remaining > 1 ? 's' : ''}.`
          : 'Code incorrect. Demandez un nouveau code.',
        'code_mismatch',
      );
      return;
    }

    sendError(
      response,
      result.reason === 'too_many_attempts' ? 429 : 400,
      FAILURE_MESSAGES[result.reason] ?? 'La vérification a échoué.',
      result.reason,
    );
  } catch (error) {
    console.error('[otp-verify] failed', { reason: error?.message ?? 'unknown' });
    sendError(
      response,
      502,
      'Le service de vérification est momentanément indisponible.',
      'otp_unavailable',
    );
  }
}
