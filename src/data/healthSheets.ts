// ---------------------------------------------------------------------------
// Fiches santé ASFO — source de données UNIQUE et scalable.
//
// IMPORTANT (déontologie médicale) : aucune fiche ne contient de contenu
// médical (symptômes, traitements…) tant qu'il n'a pas été rédigé, relu et
// validé par l'équipe médicale de l'ASFO. Seules les fiches dont le statut
// est « publie » sont considérées comme disponibles publiquement.
//
// À ce jour, les 6 thématiques existent mais aucune fiche n'est encore
// rédigée/validée : elles sont donc toutes « a_venir ». Pour publier une
// fiche, renseigner son contenu validé + les métadonnées de validation
// (auteur, relecteur, sources, dates) et passer status à « publie ».
// ---------------------------------------------------------------------------

export type SheetStatus =
  | 'brouillon'
  | 'en_relecture'
  | 'valide'
  | 'publie'
  | 'archive'
  | 'a_venir';

/** Catégories réellement utilisées par les fiches ci-dessous. */
export type SheetCategory =
  | 'Maladies infectieuses'
  | 'Maladies chroniques'
  | 'Santé mentale'
  | 'Santé bucco-dentaire'
  | 'Santé maternelle et infantile';

/** Métadonnées de validation médicale (remplies uniquement à la publication). */
export interface MedicalReview {
  author?: string;
  reviewer?: string;
  validatedAt?: string;
  updatedAt?: string;
  sources?: string[];
}

export interface HealthSheet {
  slug: string;
  title: string;
  description: string;
  category: SheetCategory;
  /** Clé d'icône, mappée vers un composant Lucide dans la page. */
  icon: string;
  /** Thèmes que la fiche couvrira (repères, pas des affirmations médicales). */
  topics: string[];
  status: SheetStatus;
  review?: MedicalReview;
}

export const HEALTH_SHEETS: HealthSheet[] = [
  {
    slug: 'paludisme',
    title: 'Paludisme',
    description: 'Prévention, symptômes et prise en charge.',
    category: 'Maladies infectieuses',
    icon: 'bug',
    topics: ['Prévention', 'Symptômes', 'Quand consulter'],
    status: 'a_venir',
  },
  {
    slug: 'diabete',
    title: 'Diabète',
    description: 'Dépistage, alimentation et suivi au quotidien.',
    category: 'Maladies chroniques',
    icon: 'droplet',
    topics: ['Dépistage', 'Alimentation', 'Suivi'],
    status: 'a_venir',
  },
  {
    slug: 'hypertension',
    title: 'Hypertension',
    description: 'Comprendre et contrôler sa tension artérielle.',
    category: 'Maladies chroniques',
    icon: 'heartPulse',
    topics: ['Prévention', 'Dépistage', 'Suivi'],
    status: 'a_venir',
  },
  {
    slug: 'sante-bucco-dentaire',
    title: 'Santé bucco-dentaire',
    description: 'Hygiène, caries et soins dentaires.',
    category: 'Santé bucco-dentaire',
    icon: 'smile',
    topics: ['Hygiène', 'Prévention', 'Conseils pratiques'],
    status: 'a_venir',
  },
  {
    slug: 'sante-mentale',
    title: 'Santé mentale',
    description: 'Bien-être psychologique et où trouver de l’aide.',
    category: 'Santé mentale',
    icon: 'brain',
    topics: ['Bien-être', 'Où trouver de l’aide', 'Quand consulter'],
    status: 'a_venir',
  },
  {
    slug: 'sante-mere-enfant',
    title: 'Santé de la mère et de l’enfant',
    description: 'Grossesse, vaccination et nutrition infantile.',
    category: 'Santé maternelle et infantile',
    icon: 'baby',
    topics: ['Grossesse', 'Vaccination', 'Nutrition'],
    status: 'a_venir',
  },
];

/** Une fiche est disponible publiquement uniquement si elle est publiée. */
export const isSheetPublished = (s: HealthSheet) => s.status === 'publie';

/** Fiches visibles publiquement (publiées et validées). */
export const PUBLISHED_SHEETS = HEALTH_SHEETS.filter(isSheetPublished);

/** Catégories réellement présentes (dans l'ordre d'apparition). */
export const SHEET_CATEGORIES: SheetCategory[] = [
  ...new Set(HEALTH_SHEETS.map((s) => s.category)),
] as SheetCategory[];

export const getSheet = (slug: string) =>
  HEALTH_SHEETS.find((s) => s.slug === slug);
