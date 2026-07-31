/** Client de la route d’archivage réversible des demandes de carte membre. */

interface ArchiveResponse {
  success?: boolean;
  status?: string;
  error?: string;
  code?: string;
}

export class MemberRequestArchiveError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'MemberRequestArchiveError';
    this.code = code;
  }
}

/** Identité de l’administrateur connecté, telle que posée à la connexion. */
const currentActorId = (): string | null => {
  try {
    const stored = window.localStorage.getItem('asfo_admin');
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { objectId?: string };
    return parsed.objectId ?? null;
  } catch {
    return null;
  }
};

const callArchiveRoute = async (objectId: string, action: 'archive' | 'restore') => {
  const actorId = currentActorId();
  if (!actorId) {
    throw new MemberRequestArchiveError(
      'Session administrateur introuvable. Reconnectez-vous.',
      'no_actor',
    );
  }

  let response: Response;
  try {
    response = await fetch('/api/admin/member-requests/archive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objectId, action, actorId }),
    });
  } catch {
    throw new MemberRequestArchiveError(
      'Connexion au serveur impossible. Vérifiez votre réseau.',
      'network_error',
    );
  }

  const payload = (await response.json().catch(() => ({}))) as ArchiveResponse;
  if (!response.ok || !payload.success) {
    throw new MemberRequestArchiveError(
      payload.error || 'L’opération a échoué. Veuillez réessayer.',
      payload.code || `http_${response.status}`,
    );
  }
  return payload.status ?? '';
};

/** Archive la demande (réversible) et renvoie son nouveau statut. */
export const archiveMemberRequest = (objectId: string) =>
  callArchiveRoute(objectId, 'archive');

/** Restaure une demande archivée dans son statut d’origine. */
export const restoreMemberRequest = (objectId: string) =>
  callArchiveRoute(objectId, 'restore');
