export type HistoryCategory =
  | 'Création'
  | 'Mission'
  | 'Expansion'
  | 'Partenariat'
  | 'Impact'
  | 'Digitalisation';

export interface HistoryMilestone {
  year: string;
  title: string;
  description: string;
  category: HistoryCategory;
  image?: {
    src: string;
    alt: string;
    caption: string;
  };
}

/**
 * Source unique de la chronologie historique.
 * Les textes reprennent les jalons déjà présents sur la page avant sa refonte.
 */
export const historyMilestones: HistoryMilestone[] = [
  {
    year: '2000',
    title: "Création de l'ASFO",
    description:
      "Un groupe de jeunes professionnels de santé originaires du Fouta fonde l'Action Sanitaire pour le Fouta, avec la vision d'améliorer l'accès aux soins dans les zones reculées.",
    category: 'Création',
  },
  {
    year: '2002',
    title: 'Première mission médicale',
    description:
      "Organisation de la toute première campagne de consultations médicales gratuites dans le département de Matam, marquant le début d'un engagement durable.",
    category: 'Mission',
  },
  {
    year: '2008',
    title: 'Extension géographique',
    description:
      "L'ASFO élargit ses interventions à l'ensemble de la région du Fouta, couvrant les départements de Matam, Kanel, Ranérou et Podor.",
    category: 'Expansion',
  },
  {
    year: '2012',
    title: 'Partenariats institutionnels',
    description:
      "Signature de conventions avec le Ministère de la Santé, les universités et les organisations humanitaires pour renforcer l'impact des missions.",
    category: 'Partenariat',
  },
  {
    year: '2018',
    title: 'Cap des 20 000 consultations',
    description:
      "L'ASFO franchit le cap symbolique de 20 000 consultations gratuites réalisées, témoignant de la confiance des populations et de l'engagement des bénévoles.",
    category: 'Impact',
    image: {
      src: '/polel-diaoube.webp',
      alt: "Mission médicale de l'ASFO à Polel Diaoubé en 2018",
      caption: 'Mission de Polel Diaoubé · 2018',
    },
  },
  {
    year: '2024',
    title: 'Modernisation et digitalisation',
    description:
      'Lancement de la plateforme numérique ASFO Santé et renforcement des outils de suivi médical pour une meilleure prise en charge des patients.',
    category: 'Digitalisation',
    image: {
      src: '/guede-village.webp',
      alt: "Mission médicale de l'ASFO à Guédé Village en 2024",
      caption: 'Mission de Guédé Village · 2024',
    },
  },
];

export const historyPeriods = [
  { label: '2000–2005', targetYear: '2000' },
  { label: '2006–2010', targetYear: '2008' },
  { label: '2011–2015', targetYear: '2012' },
  { label: '2016–2020', targetYear: '2018' },
  { label: "2021–Aujourd'hui", targetYear: '2024' },
] as const;
