/**
 * Envoi de SMS via AxiomText. La clé d’API est lue uniquement depuis
 * l’environnement serveur et n’apparaît ni dans les réponses ni dans les logs.
 */

const AXIOMTEXT_ENDPOINT = 'https://api.axiomtext.com/api/sms/message';
const SEND_TIMEOUT_MS = 20_000;

export const smsEnvironment = () => ({
  apiKey: process.env.SMS_API_KEY,
  senderId: process.env.SMS_SENDER_ID || 'ASFO SANTE',
});

/**
 * Envoie un message déjà rendu et normalisé en GSM-7.
 * Renvoie `{ status: 'sent', providerId }` ou `{ status: 'failed', error }` :
 * l’appelant décide de la suite, aucune exception n’est levée.
 */
export const sendSms = async (to, message) => {
  const { apiKey, senderId } = smsEnvironment();
  if (!apiKey) {
    return { status: 'failed', error: 'Configuration SMS indisponible.' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);

  try {
    const response = await fetch(AXIOMTEXT_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, message, signature: senderId }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.success !== true) {
      // Seul le statut HTTP est journalisé : jamais la clé ni le destinataire.
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
  } finally {
    clearTimeout(timer);
  }
};
