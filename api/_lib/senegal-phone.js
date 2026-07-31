/**
 * Numéros de mobile sénégalais — source de vérité unique, partagée par le
 * formulaire (client) et la fonction d’enregistrement (serveur).
 *
 * Ce dossier est préfixé d’un tiret bas : Vercel n’en fait pas une route HTTP.
 * Le module est écrit en JavaScript sans dépendance pour rester importable des
 * deux côtés ; son typage TypeScript est décrit dans `senegal-phone.d.ts`.
 */

/** Indicatif pays, jamais saisi par l’utilisateur. */
export const SENEGAL_DIALLING_CODE = '+221';

/** Longueur du numéro local, indicatif exclu. */
export const SENEGAL_LOCAL_LENGTH = 9;

/**
 * Préfixes mobiles pouvant recevoir un SMS :
 * Orange 77/78, Free 76, Promobile 75, Expresso 70.
 * Les fixes (33x) en sont volontairement exclus.
 */
export const SENEGAL_MOBILE_PREFIXES = ['70', '75', '76', '77', '78'];

const MOBILE_PATTERN = /^7[05678]\d{7}$/;
const LANDLINE_PATTERN = /^3[0-9]\d{7}$/;

/**
 * Extrait les 9 chiffres locaux d’une saisie quelconque.
 * Accepte les séparateurs (espaces, tirets, points, parenthèses) et les
 * différentes écritures de l’indicatif : +221, 221, 00221, ou un 0 initial.
 * Ne juge pas de la validité du préfixe : voir `normalizeSenegalPhone`.
 */
export const extractSenegalLocalDigits = (input) => {
  const digits = String(input ?? '').replace(/\D/g, '');
  if (!digits) return '';

  let local = digits;
  if (local.startsWith('00221')) local = local.slice(5);
  else if (local.startsWith('221')) local = local.slice(3);

  // Un 0 initial est une habitude de numérotation nationale : on le retire.
  if (local.length > SENEGAL_LOCAL_LENGTH && local.startsWith('0')) {
    local = local.slice(1);
  }

  return local;
};

/**
 * Renvoie le numéro au format E.164 (`+221XXXXXXXXX`) ou `null` si la saisie
 * n’est pas un mobile sénégalais valide.
 */
export const normalizeSenegalPhone = (input) => {
  const local = extractSenegalLocalDigits(input);
  if (!MOBILE_PATTERN.test(local)) return null;
  return `${SENEGAL_DIALLING_CODE}${local}`;
};

/**
 * Qualifie une saisie invalide pour afficher un message adapté.
 * Renvoie `null` quand le numéro est valide.
 */
export const senegalPhoneIssue = (input) => {
  const local = extractSenegalLocalDigits(input);
  if (!local) return 'empty';
  if (LANDLINE_PATTERN.test(local)) return 'landline';
  if (local.length < SENEGAL_LOCAL_LENGTH) return 'too_short';
  if (local.length > SENEGAL_LOCAL_LENGTH) return 'too_long';
  if (!MOBILE_PATTERN.test(local)) return 'not_mobile';
  return null;
};

/** Découpe lisible pour l’affichage : `77 123 45 67`. Ne sert jamais au stockage. */
export const formatSenegalLocal = (digits) => {
  const local = String(digits ?? '').replace(/\D/g, '').slice(0, SENEGAL_LOCAL_LENGTH);
  const groups = [local.slice(0, 2), local.slice(2, 5), local.slice(5, 7), local.slice(7, 9)];
  return groups.filter(Boolean).join(' ');
};
