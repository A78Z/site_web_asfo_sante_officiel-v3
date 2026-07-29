// ---------------------------------------------------------------------------
// Conseils de prévention ASFO — source de données UNIQUE et scalable.
//
// IMPORTANT (déontologie médicale) : aucune thématique ne contient de conseil
// médical détaillé tant qu'il n'a pas été rédigé, relu et validé par l'équipe
// médicale de l'ASFO. Les « topics » ci-dessous ne sont que la structure
// visuelle des sujets qui seront abordés — ce ne sont pas des recommandations.
//
// Seuls les conseils au statut « publie » sont visibles publiquement. À ce
// jour, les 3 thématiques existent mais aucun contenu n'est encore validé :
// elles sont donc toutes « a_venir ».
// ---------------------------------------------------------------------------

export type TipStatus =
  | 'brouillon'
  | 'en_relecture'
  | 'valide'
  | 'publie'
  | 'archive'
  | 'a_venir';

/** Catégories réellement utilisées par les thématiques ci-dessous. */
export type TipCategory = 'Hygiène' | 'Nutrition' | 'Prévention du paludisme';

/** Métadonnées de validation médicale (remplies uniquement à la publication). */
export interface MedicalReview {
  author?: string;
  reviewer?: string;
  validatedAt?: string;
  updatedAt?: string;
  sources?: string[];
}

export interface PreventionTip {
  slug: string;
  title: string;
  description: string;
  category: TipCategory;
  /** Clé d'icône, mappée vers un composant Lucide dans la page. */
  icon: string;
  /** Sujets qui seront abordés (repères visuels, pas des conseils médicaux). */
  topics: string[];
  status: TipStatus;
  review?: MedicalReview;
}

export const PREVENTION_TIPS: PreventionTip[] = [
  {
    slug: 'hygiene-eau-potable',
    title: 'Hygiène & eau potable',
    description: 'Prévenir les maladies hydriques et digestives.',
    category: 'Hygiène',
    icon: 'droplets',
    topics: ['Eau sûre', 'Lavage des mains', 'Conservation des aliments', 'Environnement propre'],
    status: 'a_venir',
  },
  {
    slug: 'nutrition',
    title: 'Nutrition',
    description: 'Bien se nourrir avec les ressources locales.',
    category: 'Nutrition',
    icon: 'salad',
    topics: ['Alimentation équilibrée', 'Ressources locales', 'Santé de l’enfant', 'Prévention des carences'],
    status: 'a_venir',
  },
  {
    slug: 'moustiquaires-paludisme',
    title: 'Moustiquaires & paludisme',
    description: 'Se protéger efficacement des piqûres.',
    category: 'Prévention du paludisme',
    icon: 'bug',
    topics: ['Protection contre les piqûres', 'Usage de la moustiquaire', 'Environnement', 'Consultation rapide'],
    status: 'a_venir',
  },
];

/** Un conseil est disponible publiquement uniquement s'il est publié. */
export const isTipPublished = (t: PreventionTip) => t.status === 'publie';

/** Conseils visibles publiquement (publiés et validés). */
export const PUBLISHED_TIPS = PREVENTION_TIPS.filter(isTipPublished);

/** Catégories réellement présentes (dans l'ordre d'apparition). */
export const TIP_CATEGORIES: TipCategory[] = [
  ...new Set(PREVENTION_TIPS.map((t) => t.category)),
] as TipCategory[];

export const getTip = (slug: string) => PREVENTION_TIPS.find((t) => t.slug === slug);
