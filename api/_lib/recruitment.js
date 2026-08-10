/**
 * Socle du module « Recrutement médical » — catalogue, statuts et validation.
 *
 * Ce fichier est la source unique de vérité, importée à la fois par les
 * fonctions serverless (`api/`) et par le site (`src/`) : une règle décrite ici
 * s’applique donc côté client ET côté serveur, sans risque de divergence.
 *
 * Il est écrit en JavaScript, comme les autres modules de `api/_lib/` : le
 * typage est fourni par le fichier `.d.ts` voisin. Aucune classe existante
 * n’est touchée — ce module n’adresse que `MedicalRecruitments` et
 * `RecruitmentSpecialties`. La refonte 2026 ajoute des champs aux nouveaux
 * objets, sans réécrire les candidatures déjà présentes.
 */

import { compactWhitespace, isJunkText } from './member-request-validation.js';
import { senegalPhoneIssue } from './senegal-phone.js';

/** Campagne concernée par la session de recrutement en cours. */
export const RECRUITMENT_CAMPAIGN = '27e Grande Caravane Médicale ASFO 2026';
export const RECRUITMENT_YEAR = '2026';

export const RECRUITMENT_CLASS = 'MedicalRecruitments';
export const SPECIALTY_CLASS = 'RecruitmentSpecialties';

/**
 * Les portes d’entrée publiques du recrutement 2026.
 *
 * Les clés sont volontairement stables et correspondent aux valeurs écrites
 * dans `recruitmentCategory`. Elles servent également de `slug` dans
 * `RecruitmentSpecialties`, ce qui permet de réutiliser la classe de réglages
 * existante sans migration destructive.
 *
 * Quatre catégories sont visibles : les médecins généralistes et spécialistes
 * partagent désormais une porte unique « Médecins », dont le formulaire
 * commence par le choix du profil. Les deux anciennes catégories restent dans
 * le catalogue avec `hidden: true` : elles ne sont plus proposées nulle part,
 * mais les candidatures enregistrées sous leurs clés continuent d’être
 * résolues, affichées et filtrées, et leurs anciens liens redirigent vers la
 * porte unique via `mergedInto`.
 */
export const RECRUITMENT_CATEGORIES = [
  {
    key: 'dentiste',
    slug: 'dentiste',
    label: 'Chirurgiens-dentistes',
    formTitle: 'Inscription des Chirurgiens-dentistes — Caravane Médicale ASFO 2026',
    emoji: '🦷',
    description:
      'Rejoignez l’unité dentaire pour les consultations, soins conservateurs et prises en charge de terrain.',
    defaultOpen: false,
    formKind: 'complete',
    legacySpecialtySlug: 'chirurgien-dentiste',
    legacySpecialtySlugs: ['chirurgien-dentiste'],
  },
  {
    key: 'pharmacien',
    slug: 'pharmacien',
    label: 'Pharmaciens',
    formTitle: 'Inscription des Pharmaciens — Caravane Médicale ASFO 2026',
    emoji: '💊',
    description:
      'Participez à la dispensation sécurisée des médicaments et à la gestion de la pharmacie de campagne.',
    defaultOpen: true,
    formKind: 'complete',
    legacySpecialtySlug: 'pharmacien',
    legacySpecialtySlugs: ['pharmacien'],
  },
  {
    key: 'paramedical',
    slug: 'paramedical',
    label: 'Paramédicaux',
    formTitle: 'Inscription des Paramédicaux — Caravane Médicale ASFO 2026',
    emoji: '🩹',
    description:
      'Infirmiers, sages-femmes, biologistes, nutritionnistes et autres métiers paramédicaux réunis dans un parcours unique.',
    defaultOpen: false,
    formKind: 'simplified',
    legacySpecialtySlugs: [
      'laboratoire',
      'kinesitherapeute',
      'nutritionniste',
      'infirmier',
      'sage-femme',
      'technicien-imagerie',
    ],
  },
  {
    key: 'medecins',
    slug: 'medecins',
    label: 'Médecins',
    subtitle: 'Médecins généralistes & spécialistes',
    formTitle: 'Inscription des Médecins — Caravane Médicale ASFO 2026',
    emoji: '🩺',
    description:
      'Généralistes et spécialistes réunis dans un formulaire unique : choisissez votre profil, le parcours s’adapte automatiquement.',
    defaultOpen: false,
    formKind: 'simplified',
    ctaLabel: 'S’inscrire comme médecin',
    // Anciennes clés de catégorie couvertes par cette porte : elles servent au
    // contrôle de doublon et au regroupement dans l’administration.
    legacyCategoryKeys: ['generaliste', 'specialiste'],
    legacySpecialtySlugs: [
      'medecin-generaliste',
      'pediatre',
      'ophtalmologue',
      'psychiatre',
      'gynecologue',
      'cardiologue',
      'radiologue',
    ],
  },
  {
    key: 'specialiste',
    slug: 'specialiste',
    label: 'Médecins spécialistes',
    formTitle: 'Inscription des Médecins spécialistes — Caravane Médicale ASFO 2026',
    emoji: '🫀',
    description:
      'Toutes les spécialités médicales dans un formulaire commun avec sélection rapide de votre discipline.',
    defaultOpen: false,
    formKind: 'simplified',
    hidden: true,
    mergedInto: 'medecins',
    legacySpecialtySlugs: [],
  },
  {
    key: 'generaliste',
    slug: 'generaliste',
    label: 'Médecins généralistes',
    formTitle: 'Inscription des Médecins généralistes — Caravane Médicale ASFO 2026',
    emoji: '🩺',
    description:
      'Consultations générales, orientation des patients et suivi des pathologies courantes pendant la caravane.',
    defaultOpen: false,
    formKind: 'simplified',
    hidden: true,
    mergedInto: 'medecins',
    legacySpecialtySlugs: [],
  },
];

/**
 * Les deux profils proposés par la porte unique « Médecins ». Leurs clés
 * reprennent volontairement celles des anciennes catégories : le filtre de
 * l’administration regroupe ainsi anciens et nouveaux dossiers sans mapping.
 */
export const MEDICAL_PROFILES = [
  {
    key: 'generaliste',
    label: 'Médecin généraliste',
    description: 'Consultations générales, orientation des patients et suivi des pathologies courantes.',
  },
  {
    key: 'specialiste',
    label: 'Médecin spécialiste',
    description: 'Cardiologie, pédiatrie, gynécologie… Vous préciserez votre spécialité juste après.',
  },
];

const MEDICAL_PROFILE_BY_KEY = new Map(MEDICAL_PROFILES.map((item) => [item.key, item]));
export const medicalProfileByKey = (key) => MEDICAL_PROFILE_BY_KEY.get(String(key ?? '')) ?? null;

const CATEGORY_BY_KEY = new Map(RECRUITMENT_CATEGORIES.map((item) => [item.key, item]));
const CATEGORY_BY_SLUG = new Map(RECRUITMENT_CATEGORIES.map((item) => [item.slug, item]));
const CATEGORY_BY_LEGACY_SPECIALTY = new Map(
  RECRUITMENT_CATEGORIES.flatMap((category) =>
    (category.legacySpecialtySlugs ?? []).map((slug) => [slug, category]),
  ),
);

export const categoryByKey = (key) => CATEGORY_BY_KEY.get(String(key ?? '')) ?? null;
export const categoryBySlug = (slug) => CATEGORY_BY_SLUG.get(String(slug ?? '')) ?? null;
export const categoryByLegacySpecialty = (slug) =>
  CATEGORY_BY_LEGACY_SPECIALTY.get(String(slug ?? '')) ?? null;

export const PARAMEDICAL_SPECIALITIES = [
  'Laboratoire / Biologie',
  'Sage-femme',
  'Infirmier(ère)',
  'Nutritionniste',
  'Kinésithérapeute',
  'Technicien(ne) en imagerie médicale',
  'Aide-soignant(e)',
  'Autre profession paramédicale',
];

export const MEDICAL_SPECIALITIES = [
  'Pédiatrie',
  'Gynécologie / Obstétrique',
  'Ophtalmologie',
  'Psychiatrie',
  'Cardiologie',
  'Radiologie',
  'Dermatologie',
  'ORL',
  'Neurologie',
  'Anesthésie-Réanimation',
  'Chirurgie',
  'Médecine interne',
  'Pneumologie',
  'Gastro-entérologie',
  'Néphrologie',
  'Endocrinologie',
  'Rhumatologie',
  'Infectiologie',
  'Urologie',
  'Autre spécialité médicale',
];

/**
 * Niveaux d’études, catégorie par catégorie.
 *
 * Une seule liste commune proposait un doctorat en médecine ou en pharmacie à
 * un(e) infirmier(ère) : le champ devenait illisible et incitait à des choix
 * faux. Chaque parcours simplifié dispose donc de sa propre liste, et le
 * serveur valide la valeur reçue avec la liste de la catégorie déclarée.
 *
 * Les deux formulaires complets (chirurgiens-dentistes, pharmaciens) n’ont pas
 * ce champ : ils saisissent librement l’intitulé de leur diplôme
 * (`diplomaTitle`), ce qui reste inchangé.
 */
export const OTHER_EDUCATION_LEVEL = 'Autre niveau ou diplôme';
export const OTHER_HEALTH_DIPLOMA = 'Autre diplôme de santé';

/** Choix « Autre » : ils ouvrent un champ libre de précision, obligatoire. */
export const isOtherEducationLevel = (value) =>
  value === OTHER_EDUCATION_LEVEL || value === OTHER_HEALTH_DIPLOMA;

const PARAMEDICAL_EDUCATION_LEVELS = [
  'BEP / CAP sanitaire',
  'BT / Brevet de technicien',
  'Bac',
  'Bac+1',
  'Bac+2 / Diplôme d’État',
  'Bac+3 / Licence',
  'Bac+4',
  'Bac+5 / Master',
  'Diplôme professionnel de santé',
  OTHER_EDUCATION_LEVEL,
];

const SPECIALIST_EDUCATION_LEVELS = ['Diplôme de spécialisation (DES)', OTHER_HEALTH_DIPLOMA];

// Écartés : le DES, qui désigne une spécialisation et relève du formulaire
// « Médecins spécialistes », et le doctorat en pharmacie, étranger au parcours
// d’un médecin généraliste.
const GENERAL_PRACTITIONER_EDUCATION_LEVELS = [
  'Bac+2 / Diplôme d’État',
  'Bac+3 / Licence',
  'Bac+5 / Master',
  'Doctorat en médecine',
  OTHER_HEALTH_DIPLOMA,
];

/**
 * Liste historique. Elle n’alimente plus aucun formulaire mais sert de repli
 * de validation pour toute catégorie sans liste dédiée, afin qu’un parcours
 * ajouté plus tard ne soit jamais rejeté faute de configuration.
 */
export const EDUCATION_LEVELS = [
  'Bac+2 / Diplôme d’État',
  'Bac+3 / Licence',
  'Bac+5 / Master',
  'Doctorat en médecine',
  'Doctorat en pharmacie',
  'Diplôme de spécialisation (DES)',
  'Autre diplôme de santé',
];

const EDUCATION_LEVELS_BY_CATEGORY = {
  paramedical: PARAMEDICAL_EDUCATION_LEVELS,
  specialiste: SPECIALIST_EDUCATION_LEVELS,
  generaliste: GENERAL_PRACTITIONER_EDUCATION_LEVELS,
};

/** Niveaux acceptés pour une catégorie, désignée par sa clé ou par son objet. */
export const educationLevelsForCategory = (category) => {
  const key = typeof category === 'string' ? category : category?.key;
  return EDUCATION_LEVELS_BY_CATEGORY[String(key ?? '')] ?? EDUCATION_LEVELS;
};

/**
 * Année ou niveau actuel dans le cursus — formulaire « Médecins » uniquement.
 *
 * Le niveau d’études dit quel diplôme est visé ou obtenu ; ce champ précise où
 * la personne en est réellement : il distingue l’étudiant en médecine, le
 * doctorant, la personne en année de thèse et le médecin diplômé. Les choix
 * proposés dépendent du niveau d’études sélectionné, et un niveau sans liste
 * dédiée reçoit la liste générique.
 */
export const OTHER_CURRENT_STUDY_LEVEL = 'Autre';

const GENERIC_CURRENT_STUDY_LEVELS = [
  'En cours',
  'Dernière année',
  'Diplôme obtenu',
  OTHER_CURRENT_STUDY_LEVEL,
];

const CURRENT_STUDY_LEVELS_BY_EDUCATION = new Map([
  [
    'Bac+3 / Licence',
    ['Licence 1', 'Licence 2', 'Licence 3', 'Diplôme obtenu', OTHER_CURRENT_STUDY_LEVEL],
  ],
  ['Bac+5 / Master', ['Master 1', 'Master 2', 'Diplôme obtenu', OTHER_CURRENT_STUDY_LEVEL]],
  [
    'Doctorat en médecine',
    [
      'Doctorat 1',
      'Doctorat 2',
      'Doctorat 3',
      'Année de thèse',
      'Thèse soutenue',
      'Diplôme obtenu',
      OTHER_CURRENT_STUDY_LEVEL,
    ],
  ],
  [
    'Diplôme de spécialisation (DES)',
    [
      'DES 1',
      'DES 2',
      'DES 3',
      'DES 4',
      'Fin de spécialisation',
      'Diplôme obtenu',
      OTHER_CURRENT_STUDY_LEVEL,
    ],
  ],
]);

/** Années / niveaux proposés pour un niveau d’études donné. */
export const currentStudyLevelsForEducation = (educationLevel) =>
  CURRENT_STUDY_LEVELS_BY_EDUCATION.get(String(educationLevel ?? '')) ??
  GENERIC_CURRENT_STUDY_LEVELS;

const OTHER_PARAMEDICAL = 'Autre profession paramédicale';
const OTHER_SPECIALIST = 'Autre spécialité médicale';

/** Le parcours demande-t-il une spécialité médicale (porte unique comprise) ? */
const isSpecialistPath = (category, payload = {}) =>
  category?.key === 'specialiste' ||
  (category?.key === 'medecins' && compactWhitespace(payload.medicalProfile) === 'specialiste');

/** Spécialité finale, après résolution du choix « Autre ». */
export const resolvedSpeciality = (category, payload = {}) => {
  // Un généraliste de la porte unique n’a pas de spécialité, même si le
  // navigateur en transmettait une par erreur.
  if (category?.key === 'medecins' && !isSpecialistPath(category, payload)) return '';
  const selected = compactWhitespace(payload.speciality);
  if (
    (category?.key === 'paramedical' && selected === OTHER_PARAMEDICAL) ||
    (isSpecialistPath(category, payload) && selected === OTHER_SPECIALIST)
  ) {
    return compactWhitespace(payload.otherSpeciality);
  }
  return selected;
};

/** Profession enregistrée : toujours calculée par le serveur, jamais fiable depuis le navigateur. */
export const professionForCategory = (category, payload = {}) => {
  if (category?.key === 'generaliste') return 'Médecin généraliste';
  if (category?.key === 'specialiste') return 'Médecin spécialiste';
  if (category?.key === 'medecins') {
    return isSpecialistPath(category, payload) ? 'Médecin spécialiste' : 'Médecin généraliste';
  }
  if (category?.key === 'paramedical') return resolvedSpeciality(category, payload);
  const legacy = specialtyBySlug(category?.legacySpecialtySlug);
  return legacy?.label ?? category?.label ?? '';
};

/**
 * Catalogue historique des spécialités.
 *
 * Il reste disponible pour afficher et filtrer les anciennes candidatures.
 * Il n’alimente plus la page publique ni les contrôles d’ouverture.
 */
export const SPECIALTIES = [
  {
    slug: 'chirurgien-dentiste',
    label: 'Chirurgien-dentiste',
    emoji: '🦷',
    description:
      'Consultations, soins conservateurs et extractions au sein de l’unité dentaire mobile.',
    defaultOpen: false,
  },
  {
    slug: 'medecin-generaliste',
    label: 'Médecin généraliste',
    emoji: '🩺',
    description:
      'Consultations générales, orientation des cas complexes et suivi des pathologies chroniques.',
    defaultOpen: false,
  },
  {
    slug: 'pediatre',
    label: 'Pédiatre',
    emoji: '👶',
    description: 'Prise en charge des nourrissons et des enfants, dépistage et vaccination.',
    defaultOpen: false,
  },
  {
    slug: 'ophtalmologue',
    label: 'Ophtalmologue',
    emoji: '👁️',
    description: 'Dépistage visuel, prescription de correction et repérage des cataractes.',
    defaultOpen: false,
  },
  {
    slug: 'psychiatre',
    label: 'Psychiatre',
    emoji: '🧠',
    description: 'Consultations de santé mentale et accompagnement des familles.',
    defaultOpen: false,
  },
  {
    slug: 'gynecologue',
    label: 'Gynécologue',
    emoji: '🌸',
    description: 'Santé de la femme, suivi de grossesse et dépistages gynécologiques.',
    defaultOpen: false,
  },
  {
    slug: 'cardiologue',
    label: 'Cardiologue',
    emoji: '❤️',
    description: 'Dépistage de l’hypertension et des pathologies cardiovasculaires.',
    defaultOpen: false,
  },
  {
    slug: 'radiologue',
    label: 'Radiologue',
    emoji: '🩻',
    description: 'Lecture des examens d’imagerie réalisés pendant la caravane.',
    defaultOpen: false,
  },
  {
    slug: 'laboratoire',
    label: 'Laboratoire / Biologiste',
    emoji: '🧪',
    description: 'Analyses biologiques de terrain et contrôle qualité des prélèvements.',
    defaultOpen: false,
  },
  {
    slug: 'pharmacien',
    label: 'Pharmacien(ne)',
    emoji: '💊',
    description:
      'Participez à la gestion de la pharmacie de campagne, à la dispensation sécurisée des médicaments, au conseil pharmaceutique et au suivi des stocks pendant la 27e Grande Caravane Médicale ASFO 2026.',
    defaultOpen: true,
    /** Accroche et libellé de bouton propres à la campagne en cours. */
    openingNote: 'Les candidatures des pharmaciens sont ouvertes dès aujourd’hui.',
    ctaLabel: 'S’inscrire comme pharmacien',
    /** Illustration réelle du site, affichée en regard de la carte. */
    image: {
      src: '/soins-medicaux-base.webp',
      alt: 'Professionnel de santé préparant des soins lors d’une mission ASFO',
    },
    // Libellés propres au métier : le formulaire est commun, seuls les
    // intitulés s’ajustent pour parler la langue du candidat.
    form: {
      orderLabel: 'Numéro d’inscription à l’Ordre des pharmaciens',
      orderPlaceholder: 'Ex. ONPS-04582',
      employerLabel: 'Officine, hôpital, laboratoire ou établissement actuel',
      employerPlaceholder: 'Ex. Pharmacie du Fleuve, Ndioum',
      asksStockExperience: true,
    },
  },
  {
    slug: 'kinesitherapeute',
    label: 'Kinésithérapeute',
    emoji: '🦵',
    description: 'Rééducation fonctionnelle et prise en charge des douleurs chroniques.',
    defaultOpen: false,
  },
  {
    slug: 'nutritionniste',
    label: 'Nutritionniste',
    emoji: '🥗',
    description: 'Dépistage de la malnutrition et éducation nutritionnelle des familles.',
    defaultOpen: false,
  },
  {
    slug: 'infirmier',
    label: 'Infirmier(e)',
    emoji: '💉',
    description: 'Soins, pansements, injections et accueil des patients.',
    defaultOpen: false,
  },
  {
    slug: 'sage-femme',
    label: 'Sage-femme',
    emoji: '🤰',
    description: 'Consultations prénatales, accouchements et santé maternelle.',
    defaultOpen: false,
  },
  {
    slug: 'technicien-imagerie',
    label: 'Technicien en imagerie',
    emoji: '📡',
    description: 'Réalisation des examens d’échographie et de radiologie mobile.',
    defaultOpen: false,
  },
];

const SPECIALTY_BY_SLUG = new Map(SPECIALTIES.map((item) => [item.slug, item]));

export const specialtyBySlug = (slug) => SPECIALTY_BY_SLUG.get(String(slug ?? '')) ?? null;

/** Intitulés par défaut du formulaire, valables pour toute spécialité. */
const DEFAULT_FORM_LABELS = {
  orderLabel: 'Numéro d’inscription à l’Ordre',
  orderPlaceholder: 'Ex. ONMS-12345',
  employerLabel: 'Employeur actuel',
  employerPlaceholder: 'Ex. Hôpital régional de Ndioum',
  asksStockExperience: false,
};

/** Intitulés effectifs pour une spécialité, valeurs par défaut comprises. */
export const specialtyFormLabels = (specialty) => ({
  ...DEFAULT_FORM_LABELS,
  ...(specialty?.form ?? {}),
});

/** Niveaux d’expérience en gestion de médicaments et de stocks. */
export const STOCK_EXPERIENCE_OPTIONS = [
  'Aucune expérience',
  'Quelques expériences ponctuelles',
  'Expérience confirmée',
];

/**
 * Notifications par e-mail : interrupteur unique du module.
 *
 * `false` tant que le service d’envoi n’est pas configuré en production
 * (`RESEND_API_KEY` et `EMAIL_FROM` côté Vercel). Seul le SMS est annoncé au
 * candidat et proposé au back-office — mieux vaut ne rien promettre que
 * promettre un e-mail qui ne partira pas.
 *
 * Le code d’envoi reste en place : basculer cette constante à `true` réactive
 * l’ensemble, sans autre modification.
 */
export const EMAIL_NOTIFICATIONS_ENABLED = false;

/** Statuts d’instruction d’une candidature. */
export const RECRUITMENT_STATUSES = [
  'En attente',
  'Présélectionné',
  'Accepté',
  'Refusé',
  'Liste d’attente',
];

export const DEFAULT_RECRUITMENT_STATUS = 'En attente';

const STATUS_SET = new Set(RECRUITMENT_STATUSES);
export const isRecruitmentStatus = (value) => STATUS_SET.has(value);

/** Statuts considérés comme « professionnels retenus ». */
export const SELECTED_STATUSES = ['Accepté', 'Présélectionné'];

export const GENDERS = ['Femme', 'Homme'];

export const AVAILABILITY_OPTIONS = [
  'Toute la durée de la caravane',
  'Une semaine',
  'Quelques jours',
  'Week-ends uniquement',
  'À préciser avec la commission',
];

/** Les 14 régions administratives du Sénégal. */
export const SENEGAL_REGIONS = [
  'Dakar',
  'Diourbel',
  'Fatick',
  'Kaffrine',
  'Kaolack',
  'Kedougou',
  'Kolda',
  'Louga',
  'Matam',
  'Saint-Louis',
  'Sedhiou',
  'Tambacounda',
  'Thies',
  'Ziguinchor',
];

/**
 * Comparaison de régions insensible aux accents : la liste de référence du
 * site écrit « Kédougou », celle-ci « Kedougou ». Refuser l’un ou l’autre
 * bloquerait des candidatures parfaitement valables.
 */
const foldAccents = (value) =>
  compactWhitespace(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleLowerCase('fr');

const REGION_SET = new Set(SENEGAL_REGIONS.map(foldAccents));

/**
 * Règles de fichiers, appliquées à l’identique par le client et le serveur.
 *
 * `required: false` sur les trois pièces : une candidature part sans elles, la
 * commission réclamant les documents manquants au moment de l’instruction.
 * Le contrôle de format, de taille et de contenu reste entier — il s’applique
 * dès qu’un fichier est effectivement joint.
 */
export const FILE_RULES = {
  cv: {
    field: 'cvFile',
    label: 'CV',
    maxBytes: 5 * 1024 * 1024,
    maxLabel: '5 Mo',
    accept: '.pdf',
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf'],
    formatLabel: 'PDF',
    required: false,
  },
  diploma: {
    field: 'diplomaFile',
    label: 'Diplôme',
    maxBytes: 5 * 1024 * 1024,
    maxLabel: '5 Mo',
    accept: '.pdf',
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf'],
    formatLabel: 'PDF',
    required: false,
  },
  photo: {
    field: 'photoFile',
    label: 'Photo',
    maxBytes: 2 * 1024 * 1024,
    maxLabel: '2 Mo',
    accept: '.jpg,.jpeg,.png,.webp',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    formatLabel: 'JPG, PNG ou WEBP',
    required: false,
  },
};

export const FILE_KINDS = Object.keys(FILE_RULES);

/** Âge plausible pour un professionnel de santé diplômé. */
export const MIN_RECRUITMENT_AGE = 21;
export const MAX_RECRUITMENT_AGE = 75;

/**
 * Année d’adhésion la plus ancienne acceptée. Volontairement antérieure à la
 * création de l’association : la borne sert à écarter les fautes de frappe,
 * pas à contester l’ancienneté déclarée par un membre.
 */
export const MIN_MEMBERSHIP_YEAR = 1990;

/** Année d’obtention de diplôme la plus ancienne acceptée. */
export const MIN_GRADUATION_YEAR = 1960;

const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const ageFromIso = (iso, today = new Date()) => {
  const [year, month, day] = iso.split('-').map(Number);
  const reference = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  let age = reference.getUTCFullYear() - year;
  const monthDiff = reference.getUTCMonth() + 1 - month;
  if (monthDiff < 0 || (monthDiff === 0 && reference.getUTCDate() < day)) age -= 1;
  return age;
};

/** Vérifie qu’une date ISO désigne un jour réel (29 février compris). */
const isRealIsoDate = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  if (month < 1 || month > 12) return false;
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const lengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= lengths[month - 1];
};

const textRule = (value, { label, min, max, junkCheck = true }) => {
  const compact = compactWhitespace(value);
  if (compact.length < min) return `${label} est requis (${min} caractères minimum).`;
  if (compact.length > max) return `${label} est trop long (${max} caractères maximum).`;
  if (junkCheck && isJunkText(compact)) return `Renseignez ${label.toLowerCase()} réel.`;
  return null;
};

/** Validation des parcours 2026 volontairement courts et sans pièce jointe. */
const validateSimplifiedRecruitmentApplication = (payload, category, today) => {
  const fail = (field, message) => ({ field, message });

  // La porte unique « Médecins » commence par le choix du profil : c’est la
  // première question du formulaire, donc la première contrôlée.
  if (category.key === 'medecins' && !medicalProfileByKey(payload.medicalProfile)) {
    return fail('medicalProfile', 'Sélectionnez votre profil médical.');
  }

  const lastName = textRule(payload.lastName, { label: 'Le nom', min: 2, max: 60 });
  if (lastName) return fail('lastName', lastName);

  const firstName = textRule(payload.firstName, { label: 'Le prénom', min: 2, max: 60 });
  if (firstName) return fail('firstName', firstName);

  if (!GENDERS.includes(compactWhitespace(payload.gender))) {
    return fail('gender', 'Sélectionnez le sexe.');
  }

  const birthDate = compactWhitespace(payload.birthDate);
  if (!isIsoDate(birthDate) || !isRealIsoDate(birthDate)) {
    return fail('birthDate', 'Veuillez saisir une date valide au format JJ/MM/AAAA.');
  }
  const age = ageFromIso(birthDate, today);
  if (age < MIN_RECRUITMENT_AGE) {
    return fail(
      'birthDate',
      `Le recrutement est réservé aux professionnels âgés de ${MIN_RECRUITMENT_AGE} ans et plus.`,
    );
  }
  if (age > MAX_RECRUITMENT_AGE) {
    return fail('birthDate', 'Vérifiez la date de naissance saisie.');
  }

  const address = textRule(payload.address, { label: 'L’adresse', min: 3, max: 160 });
  if (address) return fail('address', address);

  const phoneIssue = senegalPhoneIssue(payload.phone);
  if (phoneIssue) {
    return fail(
      'phone',
      phoneIssue === 'landline'
        ? 'Indiquez un mobile sénégalais : les numéros fixes ne reçoivent pas de SMS.'
        : 'Entrez un numéro de mobile sénégalais valide (+221 suivi de 9 chiffres).',
    );
  }

  const email = compactWhitespace(payload.email).toLocaleLowerCase('fr');
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) || email.length > 120) {
    return fail('email', 'Entrez une adresse e-mail valide.');
  }

  // Porte unique : les niveaux acceptés sont ceux du profil choisi, les clés
  // des profils reprenant celles des anciennes catégories.
  const educationLevel = compactWhitespace(payload.educationLevel);
  const levelsKey = category.key === 'medecins' ? compactWhitespace(payload.medicalProfile) : category;
  if (!educationLevelsForCategory(levelsKey).includes(educationLevel)) {
    return fail('educationLevel', 'Sélectionnez votre niveau d’études.');
  }

  // Le niveau libre n’est réclamé que si la liste de la catégorie propose un
  // choix « Autre » et qu’il a été retenu.
  if (isOtherEducationLevel(educationLevel)) {
    const otherLevel = textRule(payload.educationLevelOther, {
      label: 'Le niveau ou diplôme',
      min: 2,
      max: 100,
    });
    if (otherLevel) return fail('educationLevelOther', otherLevel);
  }

  // Formulaire « Médecins » : l’année ou le niveau actuel de formation est
  // obligatoire et doit appartenir à la liste du niveau d’études choisi. Les
  // dossiers des autres catégories, comme les anciens, ne portent pas ce champ.
  if (category.key === 'medecins') {
    const currentStudyLevel = compactWhitespace(payload.currentStudyLevel);
    if (!currentStudyLevelsForEducation(educationLevel).includes(currentStudyLevel)) {
      return fail('currentStudyLevel', 'Précisez votre année ou niveau actuel de formation.');
    }
    if (currentStudyLevel === OTHER_CURRENT_STUDY_LEVEL) {
      const other = textRule(payload.currentStudyLevelOther, {
        label: 'Le niveau actuel',
        min: 2,
        max: 100,
      });
      if (other) return fail('currentStudyLevelOther', other);
    }
  }

  if (category.key === 'paramedical') {
    const selected = compactWhitespace(payload.speciality);
    if (!PARAMEDICAL_SPECIALITIES.includes(selected)) {
      return fail('speciality', 'Sélectionnez votre spécialité paramédicale.');
    }
    if (selected === OTHER_PARAMEDICAL) {
      const other = textRule(payload.otherSpeciality, {
        label: 'La profession paramédicale',
        min: 2,
        max: 100,
      });
      if (other) return fail('otherSpeciality', other);
    }
  }

  if (isSpecialistPath(category, payload)) {
    const selected = compactWhitespace(payload.speciality);
    if (!MEDICAL_SPECIALITIES.includes(selected)) {
      return fail('speciality', 'Sélectionnez votre spécialité médicale.');
    }
    if (selected === OTHER_SPECIALIST) {
      const other = textRule(payload.otherSpeciality, {
        label: 'La spécialité médicale',
        min: 2,
        max: 100,
      });
      if (other) return fail('otherSpeciality', other);
    }
  }

  if (typeof payload.isMember !== 'boolean') {
    return fail('isMember', 'Indiquez si vous êtes membre de l’ASFO.');
  }

  if (payload.isMember) {
    const memberCardNumber = compactWhitespace(payload.memberCardNumber);
    if (memberCardNumber && !/^[A-Za-z0-9][A-Za-z0-9./\- ]{2,39}$/.test(memberCardNumber)) {
      return fail('memberCardNumber', 'Le numéro de carte membre est invalide.');
    }
    const memberSince = compactWhitespace(payload.memberSince);
    if (memberSince) {
      const year = Number(memberSince);
      if (
        !Number.isInteger(year) ||
        year < MIN_MEMBERSHIP_YEAR ||
        year > new Date().getUTCFullYear()
      ) {
        return fail('memberSince', 'Vérifiez votre année d’adhésion.');
      }
    }
  }

  if (payload.consentAccepted !== true) {
    return fail('consentAccepted', 'Vous devez accepter les conditions pour candidater.');
  }

  return null;
};

/**
 * Valide une candidature complète.
 * Renvoie `{ field, message }` au premier problème rencontré, ou `null`.
 * L’ordre suit celui du formulaire : l’erreur renvoyée est donc toujours la
 * première que le candidat rencontrerait à l’écran.
 */
export const validateRecruitmentApplication = (payload = {}, today = new Date()) => {
  const fail = (field, message) => ({ field, message });

  const category = categoryByKey(payload.recruitmentCategory);
  if (!category) return fail('recruitmentCategory', 'Catégorie de recrutement inconnue.');
  if (category.formKind === 'simplified') {
    return validateSimplifiedRecruitmentApplication(payload, category, today);
  }

  const specialty = specialtyBySlug(payload.specialty);
  if (!specialty || specialty.slug !== category.legacySpecialtySlug) {
    return fail('specialty', 'Spécialité inconnue.');
  }

  const lastName = textRule(payload.lastName, { label: 'Le nom', min: 2, max: 60 });
  if (lastName) return fail('lastName', lastName);

  const firstName = textRule(payload.firstName, { label: 'Le prénom', min: 2, max: 60 });
  if (firstName) return fail('firstName', firstName);

  if (!GENDERS.includes(compactWhitespace(payload.gender))) {
    return fail('gender', 'Sélectionnez le sexe.');
  }

  const birthDate = compactWhitespace(payload.birthDate);
  if (!isIsoDate(birthDate) || !isRealIsoDate(birthDate)) {
    return fail('birthDate', 'Veuillez saisir une date valide au format JJ/MM/AAAA.');
  }
  const age = ageFromIso(birthDate, today);
  if (age < MIN_RECRUITMENT_AGE) {
    return fail(
      'birthDate',
      `Le recrutement est réservé aux professionnels âgés de ${MIN_RECRUITMENT_AGE} ans et plus.`,
    );
  }
  if (age > MAX_RECRUITMENT_AGE) {
    return fail('birthDate', 'Vérifiez la date de naissance saisie.');
  }

  const phoneIssue = senegalPhoneIssue(payload.phone);
  if (phoneIssue) {
    return fail(
      'phone',
      phoneIssue === 'landline'
        ? 'Indiquez un mobile sénégalais : les numéros fixes ne reçoivent pas de SMS.'
        : 'Entrez un numéro de mobile sénégalais valide (+221 suivi de 9 chiffres).',
    );
  }

  const email = compactWhitespace(payload.email).toLocaleLowerCase('fr');
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) || email.length > 120) {
    return fail('email', 'Entrez une adresse e-mail valide.');
  }

  const address = textRule(payload.address, { label: 'L’adresse', min: 3, max: 160 });
  if (address) return fail('address', address);

  const region = compactWhitespace(payload.region);
  if (!REGION_SET.has(foldAccents(region))) {
    return fail('region', 'Sélectionnez une région du Sénégal.');
  }

  const department = textRule(payload.department, {
    label: 'Le département',
    min: 2,
    max: 60,
  });
  if (department) return fail('department', department);

  // Numéro d’Ordre facultatif : il n’est pas toujours en main au moment de la
  // candidature, et la commission le vérifie de toute façon à l’instruction.
  // Le format reste contrôlé dès qu’une valeur est saisie.
  const orderNumber = compactWhitespace(payload.orderNumber);
  if (orderNumber && !/^[A-Za-z0-9][A-Za-z0-9./\- ]{2,39}$/.test(orderNumber)) {
    return fail(
      'orderNumber',
      'Le numéro d’inscription à l’Ordre est invalide (3 à 40 caractères).',
    );
  }

  const university = textRule(payload.university, {
    label: 'L’université',
    min: 3,
    max: 120,
  });
  if (university) return fail('university', university);

  // Diplôme, année d’obtention et expérience de gestion : facultatifs, mais
  // contrôlés dès qu’ils sont renseignés.
  const diplomaTitle = compactWhitespace(payload.diplomaTitle);
  if (diplomaTitle && (diplomaTitle.length < 3 || diplomaTitle.length > 120)) {
    return fail('diplomaTitle', 'L’intitulé du diplôme doit compter 3 à 120 caractères.');
  }

  const graduationYear = compactWhitespace(payload.graduationYear);
  if (graduationYear) {
    const year = Number(graduationYear);
    const thisYear = new Date().getUTCFullYear();
    if (!Number.isInteger(year) || year < MIN_GRADUATION_YEAR || year > thisYear) {
      return fail(
        'graduationYear',
        `Indiquez une année d’obtention comprise entre ${MIN_GRADUATION_YEAR} et ${thisYear}.`,
      );
    }
  }

  const stockExperience = compactWhitespace(payload.stockExperience);
  if (stockExperience && !STOCK_EXPERIENCE_OPTIONS.includes(stockExperience)) {
    return fail('stockExperience', 'Sélectionnez un niveau d’expérience proposé.');
  }

  const experience = Number(payload.experience);
  if (!Number.isInteger(experience) || experience < 0 || experience > 60) {
    return fail('experience', 'Indiquez vos années d’expérience (0 à 60).');
  }

  // L’employeur reste facultatif : un professionnel fraîchement diplômé ou en
  // exercice libéral n’en a pas, et l’exiger écarterait des candidats valables.
  const employer = compactWhitespace(payload.employer);
  if (employer.length > 120) return fail('employer', 'L’employeur saisi est trop long.');

  if (!AVAILABILITY_OPTIONS.includes(compactWhitespace(payload.availability))) {
    return fail('availability', 'Indiquez votre disponibilité.');
  }

  const motivation = textRule(payload.motivation, {
    label: 'La motivation',
    min: 30,
    max: 2000,
    junkCheck: false,
  });
  if (motivation) return fail('motivation', motivation);

  // Appartenance à l’ASFO : la réponse est obligatoire, mais les précisions
  // qui la suivent ne le sont pas — un membre de longue date ne retrouve pas
  // toujours son numéro de carte au moment de candidater.
  if (typeof payload.isMember !== 'boolean') {
    return fail('isMember', 'Indiquez si vous êtes déjà membre de l’ASFO.');
  }

  if (payload.isMember) {
    const memberCardNumber = compactWhitespace(payload.memberCardNumber);
    if (memberCardNumber && !/^[A-Za-z0-9][A-Za-z0-9./\- ]{2,39}$/.test(memberCardNumber)) {
      return fail(
        'memberCardNumber',
        'Le numéro de carte membre est invalide (3 à 40 caractères).',
      );
    }

    const memberSince = compactWhitespace(payload.memberSince);
    if (memberSince) {
      const year = Number(memberSince);
      if (
        !Number.isInteger(year) ||
        year < MIN_MEMBERSHIP_YEAR ||
        year > new Date().getUTCFullYear()
      ) {
        return fail(
          'memberSince',
          `Indiquez une année d’adhésion comprise entre ${MIN_MEMBERSHIP_YEAR} et ${new Date().getUTCFullYear()}.`,
        );
      }
    }
  }

  if (payload.consentAccepted !== true) {
    return fail('consentAccepted', 'Vous devez accepter les conditions pour candidater.');
  }

  return null;
};

/** Contrôle des fichiers joints : présence et forme de la référence Parse. */
export const validateRecruitmentFiles = (payload = {}) => {
  for (const kind of FILE_KINDS) {
    const rule = FILE_RULES[kind];
    const file = payload[rule.field];
    if (!file) {
      if (rule.required) {
        return { field: rule.field, message: `Le fichier « ${rule.label} » est requis.` };
      }
      continue;
    }
    if (
      file.__type !== 'File' ||
      typeof file.name !== 'string' ||
      typeof file.url !== 'string'
    ) {
      return {
        field: rule.field,
        message: `Le fichier « ${rule.label} » n’a pas été téléversé correctement.`,
      };
    }
  }
  return null;
};

const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Référence de dossier lisible : `ASFO-2026-XXXXXX`.
 * L’alphabet exclut les caractères confondables (0/O, 1/I/L) : la référence
 * est dictée au téléphone et recopiée à la main par la commission.
 */
export const buildRecruitmentReference = (randomBytes) => {
  let suffix = '';
  for (let index = 0; index < 6; index += 1) {
    suffix += REFERENCE_ALPHABET[randomBytes[index] % REFERENCE_ALPHABET.length];
  }
  return `ASFO-${RECRUITMENT_YEAR}-${suffix}`;
};

export const isRecruitmentReference = (value) =>
  typeof value === 'string' && /^ASFO-\d{4}-[A-Z0-9]{6}$/.test(value);

/**
 * Fusionne le catalogue et les états enregistrés en base.
 * Une spécialité absente de la base garde sa valeur par défaut : le module
 * fonctionne donc avant même que la classe `RecruitmentSpecialties` existe.
 */
export const mergeSpecialtyStates = (rows = []) => {
  const byslug = new Map(rows.map((row) => [row.slug, row]));
  // Les catégories fusionnées dans une porte unique ne sont plus pilotables ni
  // affichées : seule la porte qui les remplace apparaît.
  return RECRUITMENT_CATEGORIES.filter((category) => !category.hidden).map((category) => {
    const row = byslug.get(category.slug);
    return {
      ...category,
      open: typeof row?.open === 'boolean' ? row.open : category.defaultOpen,
      updatedAt: row?.updatedAt ?? null,
      updatedBy: row?.updatedBy ?? null,
    };
  });
};
