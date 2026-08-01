/** Client des routes d’administration : états de carte, rappels, modèles. */

export interface ReminderRecipient {
  objectId: string;
  firstName?: string;
  lastName?: string;
  village?: string;
  profession?: string;
  professionLabel?: string;
  phone?: string;
  phoneNormalized?: string;
  email?: string;
  cardState?: string | null;
  pickupLocation?: string;
  pickupDate?: string;
  pickupHours?: string;
  cardNumber?: string;
  lastReminderAt?: string;
}

export interface SendResult {
  objectId: string;
  name: string;
  /** `accepted_by_provider` atteste d’une remise à l’opérateur, pas d’une réception. */
  status: 'accepted_by_provider' | 'failed' | 'skipped';
  providerStatus?: string;
  providerId?: string | null;
  detail?: string | null;
  segments?: number;
}

export class AdminActionError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'AdminActionError';
    this.code = code;
  }
}

/** Identité de l’administrateur connecté, posée à la connexion. */
export const currentActor = (): { objectId: string; name?: string } | null => {
  try {
    const stored = window.localStorage.getItem('asfo_admin');
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { objectId?: string; name?: string };
    return parsed.objectId ? { objectId: parsed.objectId, name: parsed.name } : null;
  } catch {
    return null;
  }
};

const post = async <T>(path: string, body: Record<string, unknown>): Promise<T> => {
  const actor = currentActor();
  if (!actor) {
    throw new AdminActionError(
      'Session administrateur introuvable. Reconnectez-vous.',
      'no_actor',
    );
  }

  let response: Response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, actorId: actor.objectId }),
    });
  } catch {
    throw new AdminActionError(
      'Connexion au serveur impossible. Vérifiez votre réseau.',
      'network_error',
    );
  }

  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    error?: string;
    code?: string;
  };
  if (!response.ok || !payload.success) {
    throw new AdminActionError(
      payload.error || 'L’opération a échoué.',
      payload.code || `http_${response.status}`,
    );
  }
  return payload as T;
};

/** Applique un état de carte à une sélection. */
export const updateCardState = (
  objectIds: string[],
  state: string,
  pickup?: { location: string; date: string; hours: string },
) =>
  post<{ updated: string[]; failed: { objectId: string }[] }>(
    '/api/admin/cards/update-state',
    { objectIds, state, pickup },
  );

export interface CardNotifyResult {
  objectId: string;
  /** `failed` n’est pas une erreur d’appel : le dossier reste « SMS non envoyé ». */
  status: 'sent' | 'failed';
  resend: boolean;
  sentAt: string | null;
  providerId: string;
  segments: number;
  message: string;
}

/**
 * Notifie un membre que sa carte est disponible, avec le message officiel.
 * Le serveur refuse l’envoi si la carte n’est pas au statut « Disponible », si
 * le numéro est invalide, ou si le membre a déjà été notifié — sauf renvoi
 * explicite (`force`).
 */
export const notifyCardAvailable = (objectId: string, force = false) =>
  post<CardNotifyResult>('/api/admin/cards/notify', { objectId, force });

/** Envoie un lot de rappels. `mode: 'test'` expédie au numéro de l’administrateur. */
export const sendReminderBatch = (params: {
  template: string;
  recipients: ReminderRecipient[];
  segmentCap: number;
  campaignId?: string;
  mode?: 'live' | 'test';
  testPhone?: string;
}) => post<{ accepted: number; failed: number; results: SendResult[] }>(
  '/api/admin/reminders/send',
  params as unknown as Record<string, unknown>,
);

export interface StoredTemplate {
  objectId: string;
  name: string;
  body: string;
}

export const listTemplates = () =>
  post<{ templates: StoredTemplate[] }>('/api/admin/reminders/templates', {
    action: 'list',
  });

export const saveTemplate = (name: string, body: string, objectId?: string) =>
  post<{ objectId: string }>('/api/admin/reminders/templates', {
    action: 'save',
    name,
    body,
    objectId,
  });

export const archiveTemplate = (objectId: string) =>
  post('/api/admin/reminders/templates', { action: 'archive', objectId });
