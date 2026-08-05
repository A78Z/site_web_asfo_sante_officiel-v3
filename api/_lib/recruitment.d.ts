/** Typage du module partagé `recruitment.js`. */

export interface RecruitmentSpecialty {
  slug: string;
  label: string;
  emoji: string;
  description: string;
  defaultOpen: boolean;
}

export interface RecruitmentSpecialtyState extends RecruitmentSpecialty {
  open: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface RecruitmentFileRule {
  field: string;
  label: string;
  maxBytes: number;
  maxLabel: string;
  accept: string;
  mimeTypes: string[];
  extensions: string[];
  formatLabel: string;
  required: boolean;
}

export interface RecruitmentFieldError {
  field: string;
  message: string;
}

export declare const RECRUITMENT_CAMPAIGN: string;
export declare const RECRUITMENT_YEAR: string;
export declare const RECRUITMENT_CLASS: string;
export declare const SPECIALTY_CLASS: string;
export declare const SPECIALTIES: RecruitmentSpecialty[];
export declare const EMAIL_NOTIFICATIONS_ENABLED: boolean;
export declare const RECRUITMENT_STATUSES: string[];
export declare const DEFAULT_RECRUITMENT_STATUS: string;
export declare const SELECTED_STATUSES: string[];
export declare const GENDERS: string[];
export declare const AVAILABILITY_OPTIONS: string[];
export declare const SENEGAL_REGIONS: string[];
export declare const FILE_RULES: Record<'cv' | 'diploma' | 'photo', RecruitmentFileRule>;
export declare const FILE_KINDS: Array<'cv' | 'diploma' | 'photo'>;
export declare const MIN_RECRUITMENT_AGE: number;
export declare const MAX_RECRUITMENT_AGE: number;
export declare const MIN_MEMBERSHIP_YEAR: number;

export declare function specialtyBySlug(slug: unknown): RecruitmentSpecialty | null;
export declare function isRecruitmentStatus(value: unknown): boolean;
export declare function validateRecruitmentApplication(
  payload?: Record<string, unknown>,
  today?: Date,
): RecruitmentFieldError | null;
export declare function validateRecruitmentFiles(
  payload?: Record<string, unknown>,
): RecruitmentFieldError | null;
export declare function buildRecruitmentReference(
  randomBytes: Uint8Array | number[],
): string;
export declare function isRecruitmentReference(value: unknown): boolean;
export declare function mergeSpecialtyStates(
  rows?: Array<{ slug: string; open?: boolean; updatedAt?: string; updatedBy?: string }>,
): RecruitmentSpecialtyState[];
