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
 * `RecruitmentSpecialties`, toutes deux nouvelles.
 */

import { compactWhitespace, isJunkText } from './member-request-validation.js';
import { senegalPhoneIssue } from './senegal-phone.js';

/** Campagne concernée par la session de recrutement en cours. */
export const RECRUITMENT_CAMPAIGN = '27e Grande Caravane Médicale ASFO 2026';
export const RECRUITMENT_YEAR = '2026';

export const RECRUITMENT_CLASS = 'MedicalRecruitments';
export const SPECIALTY_CLASS = 'RecruitmentSpecialties';

/**
 * Catalogue des spécialités.
 *
 * `defaultOpen` n’est qu’une valeur de départ : l’état réel vient de la classe
 * `RecruitmentSpecialties`, pilotée depuis le back-office. Ouvrir une
 * spécialité ne demande donc aucune modification de code.
 */
export const SPECIALTIES = [
  {
    slug: 'chirurgien-dentiste',
    label: 'Chirurgien-dentiste',
    emoji: '🦷',
    description:
      'Consultations, soins conservateurs et extractions au sein de l’unité dentaire mobile.',
    defaultOpen: true,
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
    label: 'Pharmacien',
    emoji: '💊',
    description: 'Gestion de la pharmacie de campagne, dispensation et conseil.',
    defaultOpen: false,
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

/**
 * Valide une candidature complète.
 * Renvoie `{ field, message }` au premier problème rencontré, ou `null`.
 * L’ordre suit celui du formulaire : l’erreur renvoyée est donc toujours la
 * première que le candidat rencontrerait à l’écran.
 */
export const validateRecruitmentApplication = (payload = {}, today = new Date()) => {
  const fail = (field, message) => ({ field, message });

  const specialty = specialtyBySlug(payload.specialty);
  if (!specialty) return fail('specialty', 'Spécialité inconnue.');

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

  const emergencyName = textRule(payload.emergencyContactName, {
    label: 'La personne à contacter en cas d’urgence',
    min: 3,
    max: 80,
  });
  if (emergencyName) return fail('emergencyContactName', emergencyName);

  const emergencyPhoneIssue = senegalPhoneIssue(payload.emergencyContactPhone);
  if (emergencyPhoneIssue) {
    return fail(
      'emergencyContactPhone',
      'Entrez un numéro sénégalais valide pour le contact d’urgence.',
    );
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
  return SPECIALTIES.map((specialty) => {
    const row = byslug.get(specialty.slug);
    return {
      ...specialty,
      open: typeof row?.open === 'boolean' ? row.open : specialty.defaultOpen,
      updatedAt: row?.updatedAt ?? null,
      updatedBy: row?.updatedBy ?? null,
    };
  });
};
