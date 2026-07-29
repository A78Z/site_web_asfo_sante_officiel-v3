export type HealthFaqStatus =
  | 'brouillon'
  | 'en_relecture'
  | 'validee'
  | 'publiee'
  | 'archivee';

export type HealthFaqCategoryId =
  | 'consultations-asfo'
  | 'medicaments'
  | 'quand-consulter';

export type HealthFaqCategoryIcon =
  | 'consultations'
  | 'medicines'
  | 'consult';

export interface HealthFaqCategory {
  id: HealthFaqCategoryId;
  title: string;
  description: string;
  icon: HealthFaqCategoryIcon;
  topics: string[];
}

export interface HealthFaqReviewer {
  name: string;
  qualification: string;
}

export interface HealthFaqQuestion {
  id: string;
  question: string;
  answer: string;
  categoryId: HealthFaqCategoryId;
  keywords: string[];
  author: string;
  medicalReviewer: HealthFaqReviewer | null;
  validatedAt: string | null;
  updatedAt: string | null;
  sources: string[];
  status: HealthFaqStatus;
}

export const HEALTH_FAQ_CATEGORIES: HealthFaqCategory[] = [
  {
    id: 'consultations-asfo',
    title: 'Consultations ASFO',
    description: 'Comment bénéficier des soins gratuits lors des missions.',
    icon: 'consultations',
    topics: [
      'Accès aux consultations',
      'Lieux des missions',
      'Accueil et orientation',
      'Suivi après consultation',
    ],
  },
  {
    id: 'medicaments',
    title: 'Médicaments',
    description: 'Bon usage, conservation et contrefaçons.',
    icon: 'medicines',
    topics: [
      'Bon usage',
      'Conservation',
      'Respect de la prescription',
      'Effets inhabituels',
    ],
  },
  {
    id: 'quand-consulter',
    title: 'Quand consulter ?',
    description: 'Les signes qui doivent alerter.',
    icon: 'consult',
    topics: [
      'Symptômes persistants',
      'Aggravation rapide',
      'Difficulté à respirer',
      'Personnes fragiles',
    ],
  },
];

/**
 * Source éditoriale unique des réponses de la FAQ santé.
 *
 * Aucune réponse n'est ajoutée ici tant qu'elle ne dispose pas d'un auteur,
 * d'un relecteur médical qualifié, d'une date de validation et de sources.
 */
export const HEALTH_FAQ_QUESTIONS: HealthFaqQuestion[] = [];

export const isPublishedHealthFaq = (
  question: HealthFaqQuestion,
): boolean =>
  Boolean(
    question.status === 'publiee' &&
      question.answer.trim() &&
      question.medicalReviewer &&
      question.validatedAt &&
      question.sources.length > 0,
  );

export const PUBLISHED_HEALTH_FAQ_QUESTIONS =
  HEALTH_FAQ_QUESTIONS.filter(isPublishedHealthFaq);

export const getHealthFaqCategory = (id: HealthFaqCategoryId) =>
  HEALTH_FAQ_CATEGORIES.find((category) => category.id === id);
