/**
 * Client back-office du recrutement médical.
 *
 * Toutes les lectures et écritures passent par les routes serveur : les
 * dossiers contiennent des pièces d’identité, ils ne transitent jamais par une
 * requête Parse publique.
 */

import type { ParseFile } from './parse';
import { AdminActionError, currentActor } from './adminReminders';
import type { RecruitmentSpecialtyState } from '../../api/_lib/recruitment.js';

export { AdminActionError };
export type { RecruitmentSpecialtyState };

export interface RecruitmentHistoryEntry {
  at: string;
  by: string;
  type: string;
  from?: string;
  to?: string;
  text?: string;
  result?: string;
}

export interface RecruitmentApplication {
  objectId: string;
  createdAt: string;
  updatedAt?: string;
  reference: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender?: string;
  birthDate?: string;
  phone: string;
  phoneNormalized?: string;
  email: string;
  address?: string;
  region?: string;
  department?: string;
  specialty: string;
  profession: string;
  orderNumber?: string;
  university?: string;
  diplomaTitle?: string;
  graduationYear?: number;
  stockExperience?: string;
  experience?: number;
  employer?: string;
  availability?: string;
  motivation?: string;
  isMember?: boolean;
  memberCardNumber?: string;
  memberSince?: number;
  cvFile?: ParseFile;
  diplomaFile?: ParseFile;
  photoFile?: ParseFile;
  status: string;
  comments?: string;
  reviewedBy?: string;
  reviewDate?: string | { __type: 'Date'; iso: string };
  history?: RecruitmentHistoryEntry[];
  smsStatus?: string;
  emailStatus?: string;
  decisionSmsStatus?: string;
  decisionEmailStatus?: string;
}

export interface RecruitmentStats {
  total: number;
  byStatus: Record<string, number>;
  bySpecialty: Record<string, number>;
  byRegion: Record<string, number>;
  byDepartment: Record<string, number>;
  today: number;
  thisWeek: number;
  thisMonth: number;
  selected: number;
}

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

export const listApplications = (filters: {
  status?: string;
  specialty?: string;
  region?: string;
  department?: string;
} = {}) =>
  post<{
    applications: RecruitmentApplication[];
    stats: RecruitmentStats;
    statuses: string[];
    specialties: Array<{ slug: string; label: string; emoji: string }>;
    truncated: boolean;
  }>('/api/admin/recrutement/list', filters);

export const setApplicationStatus = (objectId: string, status: string) =>
  post<{ status: string; message: string }>('/api/admin/recrutement/update', {
    action: 'decision',
    objectId,
    status,
  });

export const addApplicationComment = (objectId: string, comment: string) =>
  post<{ message: string }>('/api/admin/recrutement/update', {
    action: 'comment',
    objectId,
    comment,
  });

export const notifyApplicant = (
  objectId: string,
  channel: 'sms' | 'email',
  comment = '',
) =>
  post<{ status: string; message: string; channel: string }>(
    '/api/admin/recrutement/update',
    { action: 'notify', objectId, channel, comment },
  );

/**
 * Retire une candidature des listes. Réversible : rien n’est effacé en base,
 * `restoreApplication` remet le dossier en place.
 */
export const archiveApplication = (objectId: string) =>
  post<{ message: string }>('/api/admin/recrutement/archive', {
    action: 'archive',
    objectId,
  });

export const restoreApplication = (objectId: string) =>
  post<{ message: string }>('/api/admin/recrutement/archive', {
    action: 'restore',
    objectId,
  });

export const listSpecialtySettings = () =>
  post<{ specialties: RecruitmentSpecialtyState[] }>(
    '/api/admin/recrutement/specialites',
    { action: 'list' },
  );

export const setSpecialtyOpen = (slug: string, open: boolean) =>
  post<{ specialties: RecruitmentSpecialtyState[]; message: string }>(
    '/api/admin/recrutement/specialites',
    { action: 'set', slug, open },
  );
