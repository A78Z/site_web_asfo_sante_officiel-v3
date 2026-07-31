import type { ParseFile } from './parse';

export type SmsConfirmationStatus =
  | 'pending'
  | 'sent'
  | 'failed'
  | 'non_envoye_numero_invalide';

interface MemberCardSubmissionPayload {
  submissionId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  professionAutre?: string;
  village: string;
  photo: ParseFile;
  consentAccepted: true;
  /** Champ piège anti-robot : toujours vide chez un humain. */
  website?: string;
  /** Durée de remplissage en millisecondes, indice anti-automate. */
  filledInMs?: number;
}

interface MemberCardSubmissionResponse {
  success?: boolean;
  request?: {
    objectId: string;
    createdAt: string;
    smsConfirmationStatus: SmsConfirmationStatus;
    smsConfirmationSentAt?: string;
  };
  message?: string;
  error?: string;
  code?: string;
}

/** Erreur de soumission portant le code serveur, pour une reprise ciblée. */
export class MemberCardSubmissionError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'MemberCardSubmissionError';
    this.code = code;
  }
}

export async function submitMemberCardRequest(
  payload: MemberCardSubmissionPayload,
): Promise<Required<Pick<MemberCardSubmissionResponse, 'request' | 'message'>>> {
  let response: Response;
  try {
    response = await fetch('/api/cartes-membres/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': payload.submissionId,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new MemberCardSubmissionError(
      'La connexion avec le serveur a été interrompue. Vérifiez votre réseau puis réessayez.',
      'network_error',
    );
  }

  const result = (await response.json().catch(() => ({}))) as MemberCardSubmissionResponse;
  if (!response.ok || !result.request || !result.message) {
    throw new MemberCardSubmissionError(
      result.error || 'La demande n’a pas pu être enregistrée. Veuillez réessayer.',
      result.code || `http_${response.status}`,
    );
  }

  return {
    request: result.request,
    message: result.message,
  };
}
