// ---------------------------------------------------------------------------
// Partenaires officiels de l'ASFO — source de données UNIQUE pour la page
// /about/partenaires. Aucun partenaire fictif : noms, logos, catégories,
// descriptions et sites sont conservés à l'identique de la page existante.
//
// Les logos restent dans public/ et sont affichés en object-contain (jamais
// déformés ni recolorés).
// ---------------------------------------------------------------------------

export type PartnerCategory =
  | 'Institutionnel'
  | 'Éducation'
  | 'Humanitaire'
  | 'Professionnel';

export interface Partner {
  slug: string;
  name: string;
  logo: string;
  description: string;
  category: PartnerCategory;
  website?: string;
}

export const PARTNERS: Partner[] = [
  {
    slug: 'ministere-sante-action-sociale',
    name: "Ministère de la Santé et de l'Action Sociale",
    logo: '/msascoro.jpg',
    description:
      'Partenaire institutionnel principal pour le développement de la santé communautaire au Sénégal.',
    category: 'Institutionnel',
    website: 'https://www.sante.gouv.sn',
  },
  {
    slug: 'ucad',
    name: 'Université Cheikh Anta Diop de Dakar',
    logo: '/Logo_ucad_2.png',
    description: "Formation médicale d'excellence et recherche en santé publique.",
    category: 'Éducation',
    website: 'https://www.ucad.sn',
  },
  {
    slug: 'ugb',
    name: 'Université Gaston Berger de Saint-Louis',
    logo: '/logo-ugb.jpg',
    description:
      'Partenaire académique pour la formation des professionnels de santé du Nord.',
    category: 'Éducation',
    website: 'https://www.ugb.sn',
  },
  {
    slug: 'croix-rouge-senegalaise',
    name: 'Croix-Rouge Sénégalaise',
    logo: '/logo-croix-rouge.jpg',
    description: "Collaboration humanitaire et actions d'urgence sanitaire.",
    category: 'Humanitaire',
    website: 'https://www.croixrouge.sn',
  },
  {
    slug: 'fmpo',
    name: 'Faculté de Médecine, Pharmacie et Odontologie',
    logo: '/logo-medecine.jpg',
    description: 'Formation médicale spécialisée et recherche clinique.',
    category: 'Éducation',
  },
  {
    slug: 'acds',
    name: 'Association des Chirurgiens Dentistes du Sénégal',
    logo: '/AECDS.jpg',
    description: 'Partenaire pour les soins dentaires et la formation odontologique.',
    category: 'Professionnel',
  },
];

/** Ordre d'affichage des catégories (celles réellement présentes). */
const CATEGORY_ORDER: PartnerCategory[] = [
  'Institutionnel',
  'Éducation',
  'Humanitaire',
  'Professionnel',
];

/** Catégories réellement utilisées, dans l'ordre défini. */
export const PARTNER_CATEGORIES: PartnerCategory[] = CATEGORY_ORDER.filter((c) =>
  PARTNERS.some((p) => p.category === c),
);

export const getPartner = (slug: string) => PARTNERS.find((p) => p.slug === slug);
