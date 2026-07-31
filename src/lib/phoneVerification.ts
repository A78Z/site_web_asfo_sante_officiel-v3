/** Client des routes de vérification du numéro par code SMS. */

interface OtpResponse {
  success?: boolean;
  verified?: boolean;
  expiresInSeconds?: number;
  resendInSeconds?: number;
  error?: string;
  code?: string;
}

export class PhoneVerificationError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'PhoneVerificationError';
    this.code = code;
  }
}

const post = async (path: string, body: unknown): Promise<OtpResponse> => {
  let response: Response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new PhoneVerificationError(
      'Connexion impossible. Vérifiez votre réseau puis réessayez.',
      'network_error',
    );
  }

  const payload = (await response.json().catch(() => ({}))) as OtpResponse;
  if (!response.ok || !payload.success) {
    throw new PhoneVerificationError(
      payload.error || 'La vérification a échoué. Veuillez réessayer.',
      payload.code || `http_${response.status}`,
    );
  }
  return payload;
};

/** Demande l’envoi d’un code au numéro indiqué. */
export const sendVerificationCode = (phone: string) =>
  post('/api/otp/send', { phone });

/** Confronte le code saisi au code envoyé. */
export const verifyPhoneCode = (phone: string, code: string) =>
  post('/api/otp/verify', { phone, code });
