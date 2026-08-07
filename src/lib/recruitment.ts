/**
 * Client public du module « Recrutement médical ».
 *
 * Tout passe par les fonctions serverless : le navigateur ne parle jamais
 * directement à Back4App pour ce module, et la clé master ne quitte pas le
 * serveur.
 */

import type { ParseFile } from './parse';
import {
  FILE_RULES,
  type RecruitmentCategoryState,
} from '../../api/_lib/recruitment.js';

export type { RecruitmentCategoryState };
/** Alias temporaire pour les écrans existants ; le contenu est désormais une catégorie. */
export type RecruitmentSpecialtyState = RecruitmentCategoryState;

export type FileKind = 'cv' | 'diploma' | 'photo';

export class RecruitmentError extends Error {
  readonly code: string;
  /** Champ du formulaire mis en cause, quand le serveur le précise. */
  readonly field?: string;

  constructor(message: string, code: string, field?: string) {
    super(message);
    this.name = 'RecruitmentError';
    this.code = code;
    this.field = field;
  }
}

interface ErrorPayload {
  success?: boolean;
  error?: string;
  code?: string;
  field?: string;
}

/** Catalogue des cinq catégories et leur état d’ouverture. */
export const fetchSpecialties = async (): Promise<{
  campaign: string;
  specialties: RecruitmentSpecialtyState[];
}> => {
  let response: Response;
  try {
    response = await fetch('/api/recrutement/specialites');
  } catch {
    throw new RecruitmentError(
      'Connexion impossible. Vérifiez votre réseau puis réessayez.',
      'network_error',
    );
  }
  const payload = (await response.json().catch(() => ({}))) as ErrorPayload & {
    campaign?: string;
    specialties?: RecruitmentSpecialtyState[];
  };
  if (!response.ok || !payload.specialties) {
    throw new RecruitmentError(
      payload.error || 'Les spécialités n’ont pas pu être chargées.',
      payload.code || `http_${response.status}`,
    );
  }
  return { campaign: payload.campaign ?? '', specialties: payload.specialties };
};

/**
 * Contrôle client d’un fichier, avant tout envoi.
 * Le serveur refait exactement les mêmes vérifications — celle-ci n’existe que
 * pour éviter au candidat d’attendre un téléversement voué à l’échec.
 */
export const checkFile = (kind: FileKind, file: File): string | null => {
  const rule = FILE_RULES[kind];
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!rule.extensions.includes(extension)) {
    return `Format interdit. Utilisez un fichier ${rule.formatLabel}.`;
  }
  if (file.type && !rule.mimeTypes.includes(file.type)) {
    return `Format interdit. Utilisez un fichier ${rule.formatLabel}.`;
  }
  if (file.size > rule.maxBytes) {
    return `Ce fichier dépasse ${rule.maxLabel}.`;
  }
  if (file.size === 0) return 'Ce fichier est vide.';
  return null;
};

/** Téléverse une pièce et renvoie la référence de fichier Parse. */
export const uploadRecruitmentFile = async (
  kind: FileKind,
  file: File,
): Promise<ParseFile> => {
  const body = new FormData();
  body.append('file', file, file.name);

  let response: Response;
  try {
    response = await fetch(`/api/recrutement/upload?kind=${kind}`, {
      method: 'POST',
      headers: { 'X-Upload-Kind': kind },
      body,
    });
  } catch {
    throw new RecruitmentError(
      'Le téléversement a été interrompu. Vérifiez votre réseau puis réessayez.',
      'network_error',
    );
  }

  const payload = (await response.json().catch(() => ({}))) as ErrorPayload & {
    file?: ParseFile;
  };
  if (!response.ok || !payload.file) {
    throw new RecruitmentError(
      payload.error || 'Le fichier n’a pas pu être téléversé.',
      payload.code || `http_${response.status}`,
    );
  }
  return payload.file;
};

export interface ApplicationPayload {
  submissionId: string;
  recruitmentCategory: string;
  specialty?: string;
  lastName: string;
  firstName: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  region?: string;
  department?: string;
  orderNumber?: string;
  university?: string;
  educationLevel?: string;
  speciality?: string;
  otherSpeciality?: string;
  diplomaTitle?: string;
  graduationYear?: string;
  stockExperience?: string;
  experience?: number;
  employer?: string;
  availability?: string;
  motivation?: string;
  /** Appartenance à l’ASFO ; les deux précisions ne valent que si `true`. */
  isMember: boolean;
  memberCardNumber?: string;
  memberSince?: string;
  /** Pièces facultatives : la commission les réclame à l’instruction. */
  cvFile?: ParseFile;
  diplomaFile?: ParseFile;
  photoFile?: ParseFile;
  consentAccepted: true;
  website?: string;
  filledInMs?: number;
}

export interface ApplicationReceipt {
  objectId: string;
  reference: string;
  createdAt: string;
  smsStatus: string;
  emailStatus: string;
}

/** Dépose la candidature. Le SMS et l’e-mail partent côté serveur. */
export const submitApplication = async (
  payload: ApplicationPayload,
): Promise<{ application: ApplicationReceipt; message: string }> => {
  let response: Response;
  try {
    response = await fetch('/api/recrutement/candidature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new RecruitmentError(
      'La connexion avec le serveur a été interrompue. Vérifiez votre réseau puis réessayez.',
      'network_error',
    );
  }

  const result = (await response.json().catch(() => ({}))) as ErrorPayload & {
    application?: ApplicationReceipt;
    message?: string;
  };
  if (!response.ok || !result.application) {
    throw new RecruitmentError(
      result.error || 'La candidature n’a pas pu être enregistrée.',
      result.code || `http_${response.status}`,
      result.field,
    );
  }
  return { application: result.application, message: result.message ?? '' };
};

/** Identifiant de dépôt, garant de l’idempotence côté serveur. */
export const createSubmissionId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};
