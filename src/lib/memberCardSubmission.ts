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
    throw new Error(
      'La connexion avec le serveur a été interrompue. Vérifiez votre réseau puis réessayez.',
    );
  }

  const result = (await response.json().catch(() => ({}))) as MemberCardSubmissionResponse;
  if (!response.ok || !result.request || !result.message) {
    throw new Error(
      result.error || 'La demande n’a pas pu être enregistrée. Veuillez réessayer.',
    );
  }

  return {
    request: result.request,
    message: result.message,
  };
}
