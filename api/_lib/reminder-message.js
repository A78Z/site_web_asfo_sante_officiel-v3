/**
 * Composition des messages de rappel écrits par l’administrateur.
 *
 * Le texte est libre : aucun message n’est imposé. Ce module se charge de
 * l’interpolation des variables, du retrait des accents (qui maintient
 * l’encodage GSM-7 et divise par deux le nombre de segments facturés) et du
 * décompte des segments.
 */

import { PAYMENT_PHONE, smsSegmentCount, toGsm7 } from './sms-templates.js';

/**
 * Retire tous les accents, y compris ceux que le GSM-7 accepte (é, è, à).
 * Techniquement ces trois-là ne coûtent pas de segment supplémentaire, mais un
 * texte purement ASCII traverse sans surprise les passerelles et s’affiche
 * correctement sur tous les terminaux — c’est la règle retenue pour les rappels.
 */
export const stripAccents = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'OE')
    .replace(/æ/g, 'ae')
    .replace(/Æ/g, 'AE');

/** Variables insérables, avec leur libellé pour l’interface. */
export const MESSAGE_VARIABLES = [
  { token: '{prenom}', label: 'Prénom', field: 'firstName' },
  { token: '{nom}', label: 'Nom', field: 'lastName' },
  { token: '{village}', label: 'Village', field: 'village' },
  { token: '{profession}', label: 'Profession', field: 'profession' },
  { token: '{lieu_retrait}', label: 'Lieu de retrait', field: 'pickupLocation' },
  { token: '{date_disponibilite}', label: 'Date de disponibilité', field: 'pickupDate' },
  { token: '{horaires}', label: 'Horaires', field: 'pickupHours' },
  { token: '{numero_carte}', label: 'Numéro de carte', field: 'cardNumber' },
  { token: '{numero_paiement}', label: 'Numéro Wave / Orange Money', field: 'paymentPhone' },
];

const VARIABLE_BY_TOKEN = new Map(
  MESSAGE_VARIABLES.map((variable) => [variable.token, variable]),
);

/** Plafond de segments par défaut, surchargeable par l’administrateur. */
export const DEFAULT_SEGMENT_CAP = 2;

/** Date lisible en français, sans accent (« 12 fevrier 2026 »). */
const FRENCH_MONTHS = [
  'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre',
];

export const formatPickupDate = (isoDate) => {
  if (!isoDate) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate).trim());
  if (!match) return String(isoDate);
  const [, year, month, day] = match;
  const monthLabel = FRENCH_MONTHS[Number(month) - 1] ?? month;
  return `${Number(day)} ${monthLabel} ${year}`;
};

/** Valeurs de substitution pour un destinataire donné. */
export const recipientVariables = (member) => ({
  '{prenom}': member.firstName ?? '',
  '{nom}': member.lastName ?? '',
  '{village}': member.village ?? '',
  '{profession}': member.professionLabel ?? member.profession ?? '',
  '{lieu_retrait}': member.pickupLocation ?? '',
  '{date_disponibilite}': formatPickupDate(member.pickupDate),
  '{horaires}': member.pickupHours ?? '',
  '{numero_carte}': member.cardNumber ?? member.objectId ?? '',
  // Valeur de configuration, identique pour tous les destinataires.
  '{numero_paiement}': PAYMENT_PHONE,
});

/** Jetons présents dans un modèle mais inconnus du système. */
export const unknownTokens = (template) => {
  const found = String(template ?? '').match(/\{[a-z_]+\}/gi) ?? [];
  return [...new Set(found.filter((token) => !VARIABLE_BY_TOKEN.has(token.toLowerCase())))];
};

/**
 * Rend le message final pour un destinataire.
 * Le résultat est normalisé en GSM-7 : les accents sont retirés, jamais
 * silencieusement — l’interface montre le texte transformé avant l’envoi.
 */
export const renderReminder = (template, member) => {
  const values = recipientVariables(member);
  const rendered = String(template ?? '').replace(
    /\{[a-z_]+\}/gi,
    (token) => values[token.toLowerCase()] ?? token,
  );
  return toGsm7(stripAccents(rendered)).trim();
};

/** Détail de segmentation d’un message déjà rendu. */
export const messageMetrics = (message) => ({
  characters: message.length,
  segments: smsSegmentCount(message),
});

/**
 * Analyse un modèle sur toute une sélection.
 * Renvoie le total de segments et le **pire cas** : un nom long change le
 * nombre de segments, l’administrateur doit voir le maximum réel.
 */
export const analyseTemplate = (template, members) => {
  let totalSegments = 0;
  let worst = null;

  for (const member of members) {
    const message = renderReminder(template, member);
    const metrics = messageMetrics(message);
    totalSegments += metrics.segments;
    if (!worst || metrics.segments > worst.segments || metrics.characters > worst.characters) {
      worst = { ...metrics, message, memberId: member.objectId };
    }
  }

  return {
    totalSegments,
    recipientCount: members.length,
    worstCase: worst,
    unknownTokens: unknownTokens(template),
  };
};
