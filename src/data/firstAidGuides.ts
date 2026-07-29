export type FirstAidGuideStatus =
  | 'brouillon'
  | 'en_relecture'
  | 'valide'
  | 'publie'
  | 'archive';

export type FirstAidGuideIcon = 'recovery' | 'bleeding' | 'choking';

export interface FirstAidReviewer {
  name: string;
  qualification: string;
}

export interface FirstAidGuideValidation {
  author: string | null;
  reviewer: FirstAidReviewer | null;
  validatedAt: string | null;
  updatedAt: string | null;
  sources: string[];
}

export interface FirstAidGuide {
  slug: string;
  category: string;
  title: string;
  description: string;
  icon: FirstAidGuideIcon;
  status: FirstAidGuideStatus;
  objectives: string[];
  context: string;
  signs: string[];
  actions: string[];
  actionsToAvoid: string[];
  whenToCall: string[];
  visualMedia: string[];
  validation: FirstAidGuideValidation;
}

const EMPTY_VALIDATION: FirstAidGuideValidation = {
  author: null,
  reviewer: null,
  validatedAt: null,
  updatedAt: null,
  sources: [],
};

/**
 * Source éditoriale unique des guides de premiers secours.
 *
 * Aucun guide n'est publiable sans statut `publie`, relecteur qualifié,
 * date de validation et sources. Les champs médicaux restent volontairement
 * vides tant que le contenu n'a pas été relu par un professionnel.
 */
export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  {
    slug: 'position-laterale-securite',
    category: 'Personne inconsciente',
    title: 'Position latérale de sécurité',
    description: 'Protéger une personne inconsciente qui respire.',
    icon: 'recovery',
    status: 'en_relecture',
    objectives: [
      'Comprendre le rôle général de la position de sécurité.',
      'Identifier les limites d’une intervention sans formation.',
      'Savoir pourquoi l’alerte des secours reste prioritaire.',
    ],
    context: '',
    signs: [],
    actions: [],
    actionsToAvoid: [],
    whenToCall: [],
    visualMedia: [],
    validation: { ...EMPTY_VALIDATION },
  },
  {
    slug: 'hemorragies-plaies',
    category: 'Saignement',
    title: 'Hémorragies & plaies',
    description: 'Compresser, protéger, alerter.',
    icon: 'bleeding',
    status: 'en_relecture',
    objectives: [
      'Reconnaître qu’un saignement peut nécessiter une alerte rapide.',
      'Comprendre les principes généraux de protection et d’alerte.',
      'Connaître les limites des gestes non maîtrisés.',
    ],
    context: '',
    signs: [],
    actions: [],
    actionsToAvoid: [],
    whenToCall: [],
    visualMedia: [],
    validation: { ...EMPTY_VALIDATION },
  },
  {
    slug: 'etouffement',
    category: 'Obstruction des voies aériennes',
    title: 'Étouffement',
    description: 'Les gestes de désobstruction chez l’adulte et l’enfant.',
    icon: 'choking',
    status: 'brouillon',
    objectives: [
      'Comprendre qu’une obstruction peut constituer une urgence.',
      'Distinguer information générale et apprentissage pratique.',
      'Apprendre à suivre les consignes données par les secours.',
    ],
    context: '',
    signs: [],
    actions: [],
    actionsToAvoid: [],
    whenToCall: [],
    visualMedia: [],
    validation: { ...EMPTY_VALIDATION },
  },
];

export const getFirstAidGuide = (slug: string | undefined) =>
  FIRST_AID_GUIDES.find((guide) => guide.slug === slug);

export const isPublishedFirstAidGuide = (
  guide: FirstAidGuide | undefined,
): guide is FirstAidGuide =>
  Boolean(
    guide &&
      guide.status === 'publie' &&
      guide.validation.reviewer &&
      guide.validation.validatedAt &&
      guide.validation.sources.length > 0,
  );
