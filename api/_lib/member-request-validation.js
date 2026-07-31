/**
 * Validation des champs d’une demande de carte membre — source de vérité unique
 * partagée par le formulaire et la fonction d’enregistrement.
 *
 * Objectif : bloquer les saisies manifestement fantaisistes (« ZZTest »,
 * « Preprod », « azerty ») sans rejeter de vrais patronymes ouest-africains,
 * souvent courts et parfois composés (Ba, Sy, Ndiaye, N’Diaye, Ba-Diallo).
 */

/** Mots interdits, comparés sur la forme normalisée sans accent ni séparateur. */
const BANNED_WORDS = [
  'test', 'tests', 'testing', 'preprod', 'prod', 'staging', 'recette',
  'essai', 'essais', 'demo', 'sample', 'exemple', 'example',
  'asdf', 'qwerty', 'azerty', 'qwertz', 'wxcv',
  'lorem', 'ipsum', 'null', 'undefined', 'nan', 'none', 'nobody',
  'aaa', 'bbb', 'xxx', 'yyy', 'zzz', 'abc', 'abcd',
  'toto', 'tata', 'titi', 'tutu', 'truc', 'machin', 'bidon',
  'anonyme', 'inconnu', 'unknown', 'jean dupont', 'john doe', 'johndoe',
  'admin', 'root', 'user', 'utilisateur',
];

/** Domaines et TLD non délivrables ou jetables. */
const BANNED_EMAIL_DOMAINS = [
  'example.com', 'example.org', 'example.net', 'test.com', 'domain.com',
  'mailinator.com', 'yopmail.com', 'yopmail.fr', 'guerrillamail.com',
  '10minutemail.com', 'tempmail.com', 'temp-mail.org', 'throwawaymail.com',
  'trashmail.com', 'getnada.com', 'maildrop.cc', 'sharklasers.com',
  'jetable.org', 'mailnesia.com', 'dispostable.com', 'fakeinbox.com',
];

/** TLD réservés par la RFC 2606 : jamais délivrables. */
const BANNED_EMAIL_TLDS = ['invalid', 'test', 'local', 'localhost', 'example'];

const NAME_PATTERN = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\- ]{1,39}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

export const compactWhitespace = (value) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';

/** Minuscules, sans accent ni séparateur : « N’Diaye » et « ndiaye » convergent. */
const normalizeForComparison = (value) =>
  compactWhitespace(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’\-\s]/g, '');

/** Nombre de caractères distincts, pour repérer « ZZZZ » ou « ababab ». */
const distinctLetterCount = (value) => new Set(normalizeForComparison(value)).size;

/**
 * Vrai si le texte ressemble à un remplissage de test plutôt qu’à une vraie
 * valeur : mot interdit, caractère unique répété, ou trop peu de variété.
 */
export const isJunkText = (value) => {
  const normalized = normalizeForComparison(value);
  if (!normalized) return true;

  // Mot interdit isolé ou collé à un autre (« zztest », « test technique »).
  const compactWords = compactWhitespace(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[\s'’\-]+/)
    .filter(Boolean);
  for (const banned of BANNED_WORDS) {
    const bannedCompact = banned.replace(/\s/g, '');
    if (compactWords.includes(banned)) return true;
    if (normalized === bannedCompact) return true;
    // « zztest », « testtest » : le mot interdit forme l’essentiel de la saisie.
    if (
      normalized.includes(bannedCompact) &&
      bannedCompact.length >= 4 &&
      bannedCompact.length >= normalized.length - 2
    ) {
      return true;
    }
  }

  // « ZZZZ », « aaaa » : une seule lettre répétée.
  if (distinctLetterCount(normalized) === 1) return true;
  // « ababab », « zzzzxx » : variété insuffisante sur une saisie longue.
  if (normalized.length >= 6 && distinctLetterCount(normalized) === 2) return true;
  // Trois fois la même lettre d’affilée n’existe dans aucun patronyme.
  if (/(.)\1{2,}/.test(normalized)) return true;

  return false;
};

/** Valide un nom ou un prénom. Renvoie un message d’erreur ou `null`. */
export const validatePersonName = (value, label) => {
  const compact = compactWhitespace(value);
  if (compact.length < 2) return `${label} doit contenir au moins 2 caractères.`;
  if (compact.length > 40) return `${label} ne doit pas dépasser 40 caractères.`;
  if (!NAME_PATTERN.test(compact)) {
    return `${label} ne doit contenir que des lettres, apostrophes ou tirets.`;
  }
  if (isJunkText(compact)) return `${label} saisi ne semble pas réel.`;
  return null;
};

/** Vrai si l’adresse pointe vers un domaine non délivrable ou jetable. */
export const isDisposableEmail = (value) => {
  const domain = compactWhitespace(value).toLowerCase().split('@')[1];
  if (!domain) return true;
  const tld = domain.split('.').pop();
  if (BANNED_EMAIL_TLDS.includes(tld)) return true;
  return BANNED_EMAIL_DOMAINS.some(
    (banned) => domain === banned || domain.endsWith(`.${banned}`),
  );
};

/**
 * Valide l’adresse e-mail. Elle est facultative : le SMS est le canal
 * principal, une adresse vide est donc acceptée.
 */
export const validateEmail = (value) => {
  const compact = compactWhitespace(value).toLowerCase();
  if (!compact) return null;
  if (!EMAIL_PATTERN.test(compact)) return 'L’adresse e-mail est invalide.';
  if (isDisposableEmail(compact)) {
    return 'Cette adresse e-mail n’est pas acceptée. Utilisez une adresse valide et durable.';
  }
  // La partie locale n’est jugée qu’à partir de 4 caractères : « a@… » ou
  // « jp@… » sont courts mais parfaitement légitimes.
  const localPart = compact.split('@')[0];
  if (localPart.length >= 4 && isJunkText(localPart)) {
    return 'Cette adresse e-mail ne semble pas réelle.';
  }
  return null;
};

/** Valide le village ou l’adresse. */
export const validateVillage = (value) => {
  const compact = compactWhitespace(value);
  if (compact.length < 3) return 'L’adresse ou la ville doit contenir au moins 3 caractères.';
  if (compact.length > 80) return 'L’adresse ou la ville est trop longue.';
  if (isJunkText(compact)) return 'Entrez une ville ou une adresse réelle.';
  return null;
};

/** Valide la profession libre saisie quand « Autre » est sélectionné. */
export const validateProfessionAutre = (value) => {
  const compact = compactWhitespace(value);
  if (compact.length < 3) return 'Précisez votre profession (3 caractères minimum).';
  if (compact.length > 60) return 'La profession précisée est trop longue.';
  if (!/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\-() ]{2,59}$/.test(compact)) {
    return 'La profession ne doit contenir que des lettres.';
  }
  if (isJunkText(compact)) return 'Entrez une profession réelle.';
  return null;
};

/**
 * Refuse les dossiers où les champs se répètent : un formulaire rempli à la
 * va-vite reprend souvent la même valeur partout.
 */
export const validateFieldDistinctness = ({
  firstName,
  lastName,
  village,
  professionAutre,
}) => {
  const values = [firstName, lastName, village, professionAutre]
    .map(normalizeForComparison)
    .filter(Boolean);
  const distinct = new Set(values);
  if (values.length >= 3 && distinct.size === 1) {
    return 'Les informations saisies semblent incomplètes. Vérifiez chaque champ.';
  }
  return null;
};
