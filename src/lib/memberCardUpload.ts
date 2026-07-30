import type { ParseFile } from './parse';

interface MemberPhotoUploadResponse {
  success?: boolean;
  photo?: ParseFile;
  error?: string;
  code?: string;
}

/** Erreur d’upload enrichie : permet à l’UI de proposer un réessai pertinent. */
export class MemberPhotoUploadError extends Error {
  readonly code: string;
  /** true quand un simple réessai a une chance d’aboutir. */
  readonly retryable: boolean;

  constructor(message: string, code: string, retryable: boolean) {
    super(message);
    this.name = 'MemberPhotoUploadError';
    this.code = code;
    this.retryable = retryable;
  }
}

const RETRY_DELAY_MS = 1200;
const wait = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

/** Statuts pour lesquels un second essai automatique est justifié. */
const isRetryableStatus = (status: number) =>
  status === 408 || status === 425 || status === 429 || (status >= 500 && status !== 501);

const messageForStatus = (status: number): string => {
  if (status === 401 || status === 403) {
    return 'Le service de photos a refusé l’accès. L’équipe ASFO a été alertée, réessayez plus tard.';
  }
  if (status === 404) {
    return 'Le service de téléversement est introuvable. L’équipe ASFO a été alertée.';
  }
  if (status === 405) {
    // Cas typique d’une fonction serveur absente du déploiement : la requête
    // retombe sur le fichier statique du site, qui refuse la méthode POST.
    return 'Le service de téléversement n’est pas disponible sur ce site. L’équipe ASFO a été alertée.';
  }
  if (status === 413) return 'La photo ne doit pas dépasser 2 Mo.';
  if (status === 429) {
    return 'Trop de tentatives en peu de temps. Patientez quelques instants puis réessayez.';
  }
  if (status === 503) {
    return 'Le service de photos est momentanément indisponible. Réessayez dans quelques minutes.';
  }
  if (status === 504) {
    return 'Le téléversement a expiré. Vérifiez votre connexion puis réessayez.';
  }
  if (status >= 500) {
    return 'Le service de photos a rencontré une erreur. Veuillez réessayer.';
  }
  return 'La photo n’a pas pu être téléversée. Veuillez réessayer.';
};

async function attemptUpload(file: File, submissionId: string): Promise<ParseFile> {
  const formData = new FormData();
  formData.append('photo', file);

  let response: Response;
  try {
    response = await fetch('/api/cartes-membres/upload', {
      method: 'POST',
      headers: {
        'X-Idempotency-Key': submissionId,
      },
      body: formData,
    });
  } catch {
    throw new MemberPhotoUploadError(
      'Le téléversement a été interrompu. Vérifiez votre connexion puis réessayez.',
      'network_error',
      true,
    );
  }

  // Une réponse non-JSON signale que la requête n’a pas atteint la fonction
  // serveur (page HTML de repli, page d’erreur d’un proxy, etc.).
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.toLowerCase().includes('application/json');

  if (!isJson) {
    throw new MemberPhotoUploadError(
      response.ok
        ? 'Réponse inattendue du service de photos. L’équipe ASFO a été alertée.'
        : messageForStatus(response.status),
      'unexpected_response',
      isRetryableStatus(response.status),
    );
  }

  const payload = (await response
    .json()
    .catch(() => ({}))) as MemberPhotoUploadResponse;

  if (!response.ok) {
    throw new MemberPhotoUploadError(
      payload.error || messageForStatus(response.status),
      payload.code || `http_${response.status}`,
      isRetryableStatus(response.status),
    );
  }

  if (!payload.photo?.name || !payload.photo?.url) {
    throw new MemberPhotoUploadError(
      'La confirmation du téléversement est incomplète. Veuillez réessayer.',
      'incomplete_response',
      true,
    );
  }

  return payload.photo;
}

/**
 * Téléverse la photo d’identité et renvoie la référence de fichier Parse.
 * Un second essai automatique est effectué pour les échecs transitoires
 * (réseau coupé, service momentanément indisponible).
 */
export async function uploadMemberCardPhoto(
  file: File,
  submissionId: string,
): Promise<ParseFile> {
  try {
    return await attemptUpload(file, submissionId);
  } catch (error) {
    if (error instanceof MemberPhotoUploadError && error.retryable) {
      await wait(RETRY_DELAY_MS);
      return attemptUpload(file, submissionId);
    }
    throw error;
  }
}
