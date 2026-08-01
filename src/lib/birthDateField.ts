/**
 * Saisie de la date de naissance en clair : masque `JJ/MM/AAAA`, conversions
 * vers l’ISO `AAAA-MM-JJ` attendu par l’API, et bornes du sélecteur natif.
 *
 * Le formulaire manipule la valeur *affichée* (`JJ/MM/AAAA`) ; la conversion
 * vers l’ISO n’a lieu qu’au moment de l’envoi et de l’aperçu récapitulatif,
 * pour ne rien changer au format déjà stocké dans Back4App.
 */
import {
  MIN_MEMBER_AGE,
  validateBirthDate,
} from '../../api/_lib/member-request-validation.js';

export const BIRTH_DATE_PLACEHOLDER = 'Ex. 15/08/1990';

export const BIRTH_DATE_MESSAGES = {
  required: 'La date de naissance est requise.',
  invalid: 'Veuillez saisir une date valide au format JJ/MM/AAAA.',
  future: 'La date de naissance ne peut pas être dans le futur.',
  tooYoung: `L’adhésion est réservée aux personnes âgées de ${MIN_MEMBER_AGE} ans et plus.`,
} as const;

const isLeapYear = (year: number) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

/** Nombre de jours du mois (1-12), année bissextile comprise. */
const daysInMonth = (month: number, year: number) => {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;
};

const pad2 = (value: number) => String(value).padStart(2, '0');

/**
 * Réécrit la saisie en `JJ/MM/AAAA` : seuls les chiffres sont retenus, les
 * séparateurs sont posés *entre* les groupes — jamais en fin de chaîne, sinon
 * la touche « retour arrière » resterait bloquée sur le `/` qu’on vient
 * d’ajouter. Une date collée au format ISO est convertie plutôt que hachée.
 */
export const maskBirthDateInput = (raw: string): string => {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  const digits = (iso ? `${iso[3]}${iso[2]}${iso[1]}` : raw.replace(/\D/g, '')).slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

/**
 * Position du curseur après `digitCount` chiffres dans la valeur masquée :
 * sans elle, corriger un chiffre au milieu renverrait le curseur en fin de
 * champ à chaque frappe.
 */
export const caretPositionAfterDigits = (masked: string, digitCount: number): number => {
  if (digitCount <= 0) return 0;
  let seen = 0;
  for (let index = 0; index < masked.length; index += 1) {
    if (/\d/.test(masked[index])) {
      seen += 1;
      if (seen === digitCount) return index + 1;
    }
  }
  return masked.length;
};

/** Décompose `JJ/MM/AAAA` si — et seulement si — la date existe réellement. */
const parseFrenchDate = (value: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value ?? '').trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(month, year)) return null;
  if (year < 1000) return null;
  return { day, month, year };
};

/** `JJ/MM/AAAA` → `AAAA-MM-JJ` ; chaîne vide si la date n’existe pas. */
export const frenchDateToIso = (value: string): string => {
  const parts = parseFrenchDate(value);
  if (!parts) return '';
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
};

/** `AAAA-MM-JJ` → `JJ/MM/AAAA` ; la valeur est renvoyée telle quelle sinon. */
export const isoToFrenchDate = (value: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? '').trim());
  if (!match) return String(value ?? '').trim();
  return `${match[3]}/${match[2]}/${match[1]}`;
};

/**
 * Accepte indifféremment `JJ/MM/AAAA` ou l’ancien ISO `AAAA-MM-JJ` : les
 * brouillons enregistrés avant ce champ contiennent encore des dates ISO.
 */
export const normalizeBirthDateForDisplay = (value?: string): string => {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  return maskBirthDateInput(isoToFrenchDate(raw));
};

/** Jour courant ramené à minuit UTC, comme la validation serveur. */
const todayUtc = (today: Date) =>
  new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

/** Âge révolu à la date du jour, calculé sur la date complète. */
export const ageOnDate = (iso: string, today: Date = new Date()): number | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const reference = todayUtc(today);
  let age = reference.getUTCFullYear() - year;
  const monthDiff = reference.getUTCMonth() + 1 - month;
  if (monthDiff < 0 || (monthDiff === 0 && reference.getUTCDate() < day)) age -= 1;
  return age;
};

const shiftYears = (today: Date, years: number) => {
  const reference = todayUtc(today);
  const year = reference.getUTCFullYear() - years;
  const month = reference.getUTCMonth() + 1;
  // Le 29 février retombe sur le 28 les années non bissextiles, plutôt que de
  // déborder sur le 1er mars et d’ouvrir un jour de trop.
  const day = Math.min(reference.getUTCDate(), daysInMonth(month, year));
  return `${year}-${pad2(month)}-${pad2(day)}`;
};

/** Date maximale sélectionnable : la personne doit avoir 15 ans révolus. */
export const maxBirthDateIso = (today: Date = new Date()) =>
  shiftYears(today, MIN_MEMBER_AGE);

/** Date minimale sélectionnable : borne d’âge plausible haute. */
export const minBirthDateIso = (today: Date = new Date()) => shiftYears(today, 120);

/**
 * Valide la date affichée. Renvoie le message d’erreur, ou `null` si la date
 * est acceptable. Les cas résiduels (âge invraisemblable) restent délégués à
 * la validation partagée avec le serveur, pour éviter deux verdicts.
 */
export const validateBirthDateInput = (value: string, today: Date = new Date()): string | null => {
  const display = String(value ?? '').trim();
  if (!display) return BIRTH_DATE_MESSAGES.required;

  const iso = frenchDateToIso(display);
  if (!iso) return BIRTH_DATE_MESSAGES.invalid;

  if (iso > shiftYears(today, 0)) return BIRTH_DATE_MESSAGES.future;

  const age = ageOnDate(iso, today);
  if (age === null || age < MIN_MEMBER_AGE) return BIRTH_DATE_MESSAGES.tooYoung;

  return validateBirthDate(iso);
};
