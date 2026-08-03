/**
 * Envoi d’e-mails transactionnels, sans dépendance ajoutée.
 *
 * Le transport est l’API HTTP de Resend, appelée en `fetch` : aucun paquet npm
 * n’entre dans le projet, et la clé reste côté serveur. Le service se
 * configure par deux variables d’environnement :
 *   - `RESEND_API_KEY` : clé d’API (obligatoire pour envoyer) ;
 *   - `EMAIL_FROM`     : expéditeur vérifié, ex. « ASFO <contact@asfo.sn> ».
 *
 * Règle de conception : un e-mail n’est jamais bloquant. Si la configuration
 * manque ou si le fournisseur refuse, la fonction renvoie un statut — elle ne
 * lève pas. Une candidature enregistrée ne doit pas échouer parce qu’un e-mail
 * de confirmation n’a pas pu partir.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const SEND_TIMEOUT_MS = 15_000;

export const emailEnvironment = () => ({
  apiKey: process.env.RESEND_API_KEY,
  from: process.env.EMAIL_FROM || 'ASFO <onboarding@resend.dev>',
  replyTo: process.env.EMAIL_REPLY_TO || '',
});

/** `true` si l’envoi d’e-mails est réellement configuré sur cet environnement. */
export const isEmailConfigured = () => Boolean(emailEnvironment().apiKey);

/**
 * Envoie un e-mail.
 * Renvoie `{ status: 'sent' | 'failed' | 'not_configured', providerId?, error? }`.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const { apiKey, from, replyTo } = emailEnvironment();
  if (!apiKey) {
    return { status: 'not_configured', error: 'RESEND_API_KEY absente.' };
  }
  if (!to || !subject) {
    return { status: 'failed', error: 'Destinataire ou objet manquant.' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      // Seul le statut HTTP est journalisé : ni la clé, ni le destinataire.
      console.error('[email] provider_rejected', { status: response.status });
      return {
        status: 'failed',
        error: `Le service d’e-mail a refusé l’envoi (HTTP ${response.status}).`,
      };
    }
    return { status: 'sent', providerId: String(payload?.id ?? '') };
  } catch (error) {
    return {
      status: 'failed',
      error:
        error?.name === 'AbortError'
          ? 'Le délai d’envoi de l’e-mail a expiré.'
          : 'Le service d’e-mail est temporairement injoignable.',
    };
  } finally {
    clearTimeout(timer);
  }
};
