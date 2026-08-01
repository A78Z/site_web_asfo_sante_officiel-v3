/**
 * Gabarits SMS du parcours carte membre ASFO.
 *
 * Ce dossier est préfixé d’un tiret bas : Vercel n’en fait pas une route HTTP,
 * c’est un module partagé importé par les fonctions de `api/`.
 *
 * Règle de coût : un SMS tient en 160 caractères s’il est intégralement en
 * GSM-7. Un seul caractère hors alphabet (« ç », « ê », une apostrophe
 * typographique, un emoji) bascule le message entier en UCS-2, où un segment ne
 * contient plus que 70 caractères — le prix est alors multiplié. Les gabarits
 * ci-dessous sont donc écrits sans accent, et toute valeur interpolée est
 * normalisée par `toGsm7` avant insertion.
 */

/** Montant de la carte membre, source unique pour l’affichage et les SMS. */
export const MEMBER_CARD_PRICE = '2 500 FCFA';

/**
 * Numéro Wave / Orange Money vers lequel le paiement est régulé.
 *
 * Configurable par la variable d’environnement `PAYMENT_PHONE` : le numéro se
 * change depuis Vercel sans toucher au code. La valeur ci-dessous n’est qu’un
 * repli, pour qu’un SMS ne parte jamais avec un numéro vide si la variable
 * venait à manquer.
 *
 * Le format influe sur le coût : « +221 77 753 15 09 » (avec espaces) laisse
 * 8 caractères de marge dans un segment unique. Un libellé plus long ferait
 * basculer l’accusé de réception à deux segments.
 */
const configuredPaymentPhone = () => {
  // Côté serveur (fonctions Vercel) : variable d’environnement Node.
  // La garde `typeof` est indispensable — ce module est aussi importé par le
  // formulaire et le back-office, où `process` n’existe pas : y accéder sans
  // protection interrompt le rendu de toute la page.
  if (typeof process !== 'undefined' && process.env?.PAYMENT_PHONE) {
    return process.env.PAYMENT_PHONE;
  }
  // Côté navigateur : Vite n’expose que les variables préfixées VITE_.
  try {
    return import.meta.env?.VITE_PAYMENT_PHONE || '';
  } catch {
    return '';
  }
};

export const PAYMENT_PHONE = configuredPaymentPhone() || '+221 77 753 15 09';

/** Alphabet GSM-7 de base (norme GSM 03.38). */
const GSM7_BASE =
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà';

/** Caractères d’extension : valides, mais comptant double. */
const GSM7_EXTENDED = '^{}\\[~]|€';

const GSM7_BASE_SET = new Set(GSM7_BASE);
const GSM7_EXTENDED_SET = new Set(GSM7_EXTENDED);

/** Substitutions explicites pour la ponctuation typographique. */
const TYPOGRAPHIC_REPLACEMENTS = {
  '’': "'",
  '‘': "'",
  '“': '"',
  '”': '"',
  '…': '...',
  '–': '-',
  '—': '-',
  ' ': ' ',
  ' ': ' ',
  'œ': 'oe',
  'Œ': 'OE',
};

/**
 * Rend une valeur sûre pour le GSM-7 : ponctuation typographique remplacée,
 * diacritiques non supportés retirés (« François » → « Francois »), et tout
 * caractère restant hors alphabet supprimé. Indispensable pour les prénoms,
 * qui sinon feraient basculer le message entier en UCS-2.
 */
export const toGsm7 = (value) => {
  const text = String(value ?? '');
  let result = '';

  for (const character of text) {
    const replacement = TYPOGRAPHIC_REPLACEMENTS[character] ?? character;
    for (const candidate of replacement) {
      if (GSM7_BASE_SET.has(candidate) || GSM7_EXTENDED_SET.has(candidate)) {
        result += candidate;
        continue;
      }
      // Dernier recours : on retire l’accent et on garde la lettre de base.
      const stripped = candidate
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
      for (const letter of stripped) {
        if (GSM7_BASE_SET.has(letter) || GSM7_EXTENDED_SET.has(letter)) {
          result += letter;
        }
      }
    }
  }

  return result;
};

/** Longueur facturée : les caractères d’extension comptent pour deux. */
const billedLength = (message) =>
  [...message].reduce(
    (total, character) => total + (GSM7_EXTENDED_SET.has(character) ? 2 : 1),
    0,
  );

/** Nombre de segments facturés pour un message déjà normalisé en GSM-7. */
export const smsSegmentCount = (message) => {
  const length = billedLength(message);
  if (length === 0) return 0;
  return length <= 160 ? 1 : Math.ceil(length / 153);
};

/**
 * Gabarits du parcours. Variables disponibles : {NOM}, {REF}, {MONTANT},
 * {DATE}, {LIEN}, {PAYMENT_PHONE}.
 *
 * Sauf mention contraire, le corps ne répète pas « ASFO SANTE » : l’expéditeur
 * affiche déjà ce nom sur le téléphone, et les caractères économisés évitent
 * un segment facturé de plus.
 */
export const SMS_TEMPLATES = {
  /**
   * Accusé de réception officiel, envoyé automatiquement une fois la demande
   * réellement enregistrée dans Back4App — jamais avant.
   *
   * Le texte reprend mot pour mot le message validé par l’association. Trois
   * éléments de la version d’origine ne sont pas repris, parce qu’ils sont
   * propres à une messagerie enrichie et non au SMS :
   *   - l’emoji « 📱 », les puces « • » et le filet « ━ », hors alphabet GSM-7 :
   *     un seul de ces caractères bascule le message entier en UCS-2, où un
   *     segment ne porte plus que 70 caractères (facture multipliée par deux) ;
   *   - le gras Markdown « ** », qui s’afficherait tel quel sur le téléphone.
   * La mention « uniquement apres validation » reste la protection du demandeur
   * contre un paiement prématuré ou une sollicitation frauduleuse.
   */
  requestReceived:
    'ASFO : Votre demande de carte membre a bien ete enregistree.\n' +
    'Reference : {REF}\n' +
    'Pour finaliser votre demande, veuillez effectuer le paiement de {MONTANT}, ' +
    'uniquement apres validation de votre dossier, via :\n' +
    '- Wave\n' +
    '- Orange Money\n' +
    '{PAYMENT_PHONE}\n' +
    'Votre carte sera traitee des confirmation du paiement.\n' +
    'Vous serez informe(e) de l\'evolution de votre demande par SMS ou WhatsApp.\n' +
    'Merci de votre confiance.',

  /** Prêt à l’emploi : à déclencher depuis le back-office à la validation. */
  requestApproved:
    'Bonne nouvelle {NOM}, demande {REF} validee. Reglez {MONTANT} via ' +
    'Wave/Orange Money au {PAYMENT_PHONE} pour editer votre carte.',

  /** Code de vérification du numéro, envoyé avant la soumission. */
  verificationCode:
    'ASFO SANTE : votre code de verification est {CODE}. Valable {MINUTES} minutes. ' +
    'Ne le communiquez a personne.',

  /**
   * Message officiel annonçant qu’une carte est retirable. Envoyé uniquement
   * depuis le back-office, et uniquement sur une carte à l’état « Disponible ».
   *
   * Le texte ne comporte ni lieu ni horaire : l’association a choisi de fixer
   * les modalités de retrait au cas par cas, par contact direct. C’est aussi ce
   * qui met fin aux messages tronqués du type « Retrait a , , a partir du . »,
   * produits par un rappel libre dont les variables de retrait étaient vides.
   *
   * Comme pour l’accusé de réception, l’emoji, les puces et le gras de la
   * version d’origine ne sont pas repris : ils feraient basculer le message en
   * UCS-2 (70 caractères par segment au lieu de 160).
   */
  cardAvailable:
    'Bonjour {PRENOM} {NOM},\n' +
    'Nous avons le plaisir de vous informer que votre carte de membre ASFO ' +
    'est desormais disponible.\n' +
    'Merci de nous contacter afin de convenir des modalites de recuperation ' +
    'de votre carte.\n' +
    'Le jour du retrait, veuillez vous munir d\'une piece d\'identite en cours ' +
    'de validite.\n' +
    'Nous restons a votre disposition et serons heureux de vous remettre ' +
    'personnellement votre carte.\n' +
    'L\'equipe ASFO',
};

/**
 * Interpole un gabarit et garantit un rendu GSM-7.
 * Lève une erreur si une variable du gabarit n’a pas été fournie, pour qu’un
 * `{LIEN}` non remplacé ne parte jamais dans un vrai SMS.
 */
export const renderSms = (template, variables = {}) => {
  const missing = [];
  const message = template.replace(/\{([A-Z_]+)\}/g, (placeholder, name) => {
    const value = variables[name];
    if (value === undefined || value === null || value === '') {
      missing.push(name);
      return placeholder;
    }
    return toGsm7(value);
  });

  if (missing.length > 0) {
    throw new Error(`Variables SMS manquantes : ${missing.join(', ')}.`);
  }
  return toGsm7(message);
};

/**
 * SMS portant le code de vérification.
 * Le préfixe « ASFO SANTE » est conservé ici, contrairement aux autres
 * gabarits : sur un code à usage unique, voir l’émetteur dans le corps du
 * message aide à repérer les tentatives d’hameçonnage.
 */
export const verificationCodeSms = (code, minutes) =>
  renderSms(SMS_TEMPLATES.verificationCode, { CODE: code, MINUTES: minutes });

/** Accusé de réception envoyé à l’enregistrement de la demande. */
export const memberCardReceivedSms = (reference) =>
  renderSms(SMS_TEMPLATES.requestReceived, {
    REF: reference,
    MONTANT: MEMBER_CARD_PRICE,
    PAYMENT_PHONE,
  });

/** SMS annonçant la validation, avec les coordonnées de paiement. */
export const memberCardApprovedSms = (name, reference) =>
  renderSms(SMS_TEMPLATES.requestApproved, {
    NOM: name,
    REF: reference,
    MONTANT: MEMBER_CARD_PRICE,
    PAYMENT_PHONE,
  });

/**
 * SMS officiel « votre carte est disponible ».
 * `renderSms` lève une erreur si le prénom ou le nom est vide : un message
 * commençant par « Bonjour , » ne peut donc pas partir.
 */
export const memberCardAvailableSms = (firstName, lastName) =>
  renderSms(SMS_TEMPLATES.cardAvailable, {
    PRENOM: firstName,
    NOM: lastName,
  });
