/** Typage du module partagé `recruitment.js`. */

export interface RecruitmentFormLabels {
  orderLabel: string;
  orderPlaceholder: string;
  employerLabel: string;
  employerPlaceholder: string;
  asksStockExperience: boolean;
}

export interface RecruitmentSpecialty {
  slug: string;
  label: string;
  emoji: string;
  description: string;
  defaultOpen: boolean;
  /** Accroche affichée sous la description sur la page publique. */
  openingNote?: string;
  /** Libellé du bouton principal ; « S’inscrire » par défaut. */
  ctaLabel?: string;
  /** Illustration affichée en regard de la carte, si le site en possède une. */
  image?: { src: string; alt: string };
  /** Intitulés propres au métier ; les absents reprennent les valeurs par défaut. */
  form?: Partial<RecruitmentFormLabels>;
}

export interface RecruitmentSpecialtyState extends RecruitmentSpecialty {
  open: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
}

export type RecruitmentCategoryKey =
  | 'dentiste'
  | 'pharmacien'
  | 'paramedical'
  | 'medecins'
  | 'specialiste'
  | 'generaliste';

export type MedicalProfileKey = 'generaliste' | 'specialiste';

export interface MedicalProfile {
  key: MedicalProfileKey;
  label: string;
  description: string;
}

export interface RecruitmentCategory {
  key: RecruitmentCategoryKey;
  slug: string;
  label: string;
  /** Sous-titre affiché sous le nom de la catégorie (porte unique « Médecins »). */
  subtitle?: string;
  formTitle: string;
  emoji: string;
  description: string;
  defaultOpen: boolean;
  formKind: 'complete' | 'simplified';
  /** Libellé du bouton public ; « S’inscrire » par défaut. */
  ctaLabel?: string;
  /** Catégorie fusionnée dans une autre : plus proposée, mais toujours résolue. */
  hidden?: boolean;
  /** Clé de la porte qui remplace cette catégorie ; ses liens y redirigent. */
  mergedInto?: string;
  legacySpecialtySlug?: string;
  legacyCategoryKeys?: string[];
  legacySpecialtySlugs?: string[];
}

export interface RecruitmentCategoryState extends RecruitmentCategory {
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
export declare const RECRUITMENT_CATEGORIES: RecruitmentCategory[];
export declare const MEDICAL_PROFILES: MedicalProfile[];
export declare function medicalProfileByKey(
  key: string | null | undefined,
): MedicalProfile | null;
export declare const SPECIALTIES: RecruitmentSpecialty[];
export declare const PARAMEDICAL_SPECIALITIES: string[];
export declare const MEDICAL_SPECIALITIES: string[];
export declare const EDUCATION_LEVELS: string[];
export declare const OTHER_EDUCATION_LEVEL: string;
export declare const OTHER_HEALTH_DIPLOMA: string;
export declare function isOtherEducationLevel(value: string): boolean;
export declare const OTHER_CURRENT_STUDY_LEVEL: string;
export declare function currentStudyLevelsForEducation(
  educationLevel: string | null | undefined,
): string[];
export declare function educationLevelsForCategory(
  category: RecruitmentCategory | string | null | undefined,
): string[];
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
export declare const MIN_GRADUATION_YEAR: number;
export declare const STOCK_EXPERIENCE_OPTIONS: string[];
export declare function specialtyFormLabels(
  specialty: RecruitmentSpecialty | null,
): RecruitmentFormLabels;

export declare function specialtyBySlug(slug: unknown): RecruitmentSpecialty | null;
export declare function categoryByKey(key: unknown): RecruitmentCategory | null;
export declare function categoryBySlug(slug: unknown): RecruitmentCategory | null;
export declare function categoryByLegacySpecialty(slug: unknown): RecruitmentCategory | null;
export declare function resolvedSpeciality(
  category: RecruitmentCategory | null,
  payload?: Record<string, unknown>,
): string;
export declare function professionForCategory(
  category: RecruitmentCategory | null,
  payload?: Record<string, unknown>,
): string;
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
): RecruitmentCategoryState[];
