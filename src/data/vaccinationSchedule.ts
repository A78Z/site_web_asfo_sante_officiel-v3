// ---------------------------------------------------------------------------
// Calendrier vaccinal ASFO — source de données UNIQUE et scalable.
//
// IMPORTANT (sécurité médicale) : AUCUN nom de vaccin précis, âge, dose ou
// rappel n'est publié tant que le calendrier n'a pas été vérifié et validé
// par l'équipe médicale de l'ASFO à partir d'une source officielle à jour.
//
// Les « stages » de la timeline ne sont que des repères d'étapes (Naissance,
// Enfance…) — ils ne contiennent aucune donnée vaccinale tant qu'ils ne sont
// pas publiés. Seules les entrées « publie » sont visibles publiquement.
//
// À ce jour, aucune donnée n'est validée : les 3 catégories et les étapes
// sont toutes « a_venir ».
// ---------------------------------------------------------------------------

export type VaccineStatus =
  | 'brouillon'
  | 'en_relecture'
  | 'valide'
  | 'publie'
  | 'archive'
  | 'a_venir';

/** Métadonnées de validation médicale (remplies uniquement à la publication). */
export interface MedicalReview {
  author?: string;
  reviewer?: string;
  validatedAt?: string;
  updatedAt?: string;
  sources?: string[];
}

/** Une catégorie de population (carte principale). */
export interface VaccineCategory {
  slug: string;
  title: string;
  description: string;
  ageRange: string;
  icon: string;
  status: VaccineStatus;
  review?: MedicalReview;
}

/**
 * Une entrée détaillée du calendrier (âge → vaccin). Vide tant qu'aucun
 * contenu validé n'existe. Structure prête pour l'administration.
 */
export interface VaccineEntry {
  categorySlug: string;
  period: string; // ex. « Naissance », « 6 semaines »
  vaccine: string;
  disease: string;
  dose: string;
  booster?: string;
  population?: string;
  note?: string;
  status: VaccineStatus;
  review?: MedicalReview;
}

/** Étape générale de la timeline (repère, sans donnée vaccinale). */
export interface VaccineStage {
  slug: string;
  label: string;
  icon: string;
  intro: string;
  status: VaccineStatus;
}

export const VACCINE_CATEGORIES: VaccineCategory[] = [
  {
    slug: 'nourrissons',
    title: 'Nourrissons (0–2 ans)',
    description: 'BCG, polio, pentavalent, rougeole…',
    ageRange: '0 – 2 ans',
    icon: 'baby',
    status: 'a_venir',
  },
  {
    slug: 'enfants-adolescents',
    title: 'Enfants & adolescents',
    description: 'Rappels et rattrapages vaccinaux.',
    ageRange: 'Enfance & adolescence',
    icon: 'activity',
    status: 'a_venir',
  },
  {
    slug: 'adultes-femmes-enceintes',
    title: 'Adultes & femmes enceintes',
    description: 'Tétanos, hépatite B et vaccins spécifiques.',
    ageRange: 'Âge adulte',
    icon: 'userPlus',
    status: 'a_venir',
  },
];

/** Étapes de la timeline — repères généraux, sans données vaccinales. */
export const VACCINE_STAGES: VaccineStage[] = [
  { slug: 'naissance', label: 'Naissance', icon: 'baby', intro: 'Les tout premiers repères de la vaccination.', status: 'a_venir' },
  { slug: 'premiers-mois', label: 'Premiers mois', icon: 'milk', intro: 'Le suivi rapproché des premières semaines.', status: 'a_venir' },
  { slug: 'premiere-annee', label: 'Première année', icon: 'calendarClock', intro: 'Les étapes clés de la première année.', status: 'a_venir' },
  { slug: 'enfance', label: 'Enfance', icon: 'activity', intro: 'Rappels et suivi durant l’enfance.', status: 'a_venir' },
  { slug: 'adolescence', label: 'Adolescence', icon: 'users', intro: 'Rattrapages et rappels à l’adolescence.', status: 'a_venir' },
  { slug: 'age-adulte', label: 'Âge adulte', icon: 'userPlus', intro: 'Rappels et situations particulières à l’âge adulte.', status: 'a_venir' },
];

/** Entrées détaillées réellement publiées (aucune pour le moment). */
export const VACCINE_ENTRIES: VaccineEntry[] = [];

export const isCategoryPublished = (c: VaccineCategory) => c.status === 'publie';
export const PUBLISHED_CATEGORIES = VACCINE_CATEGORIES.filter(isCategoryPublished);
export const PUBLISHED_ENTRIES = VACCINE_ENTRIES.filter((e) => e.status === 'publie');

/** Date de dernière mise à jour du calendrier publié (null tant que rien n'est publié). */
export const SCHEDULE_UPDATED_AT: string | null = null;

export const getCategory = (slug: string) =>
  VACCINE_CATEGORIES.find((c) => c.slug === slug);
