/**
 * Cycle de vie de la carte membre — distinct du statut de la demande.
 *
 * Une demande « Validé » ne signifie pas que la carte est fabriquée et
 * retirable. Confondre les deux ferait déplacer des membres depuis leur village
 * pour rien : seul l’état `Disponible` autorise un rappel de retrait.
 */

export const CARD_STATES = {
  TO_PRINT: 'À éditer',
  PRINTED: 'Éditée',
  AVAILABLE: 'Disponible',
  HANDED_OVER: 'Remise',
};

export const CARD_STATE_ORDER = [
  CARD_STATES.TO_PRINT,
  CARD_STATES.PRINTED,
  CARD_STATES.AVAILABLE,
  CARD_STATES.HANDED_OVER,
];

const CARD_STATE_SET = new Set(CARD_STATE_ORDER);

/** Seul état autorisant l’envoi d’un rappel « votre carte est disponible ». */
export const REMINDABLE_STATE = CARD_STATES.AVAILABLE;

export const isCardState = (value) => CARD_STATE_SET.has(value);

/**
 * État par défaut d’une demande dont la carte n’a jamais été suivie.
 * Les demandes antérieures à cette fonctionnalité n’ont pas le champ : elles
 * sont considérées « à éditer » si validées, et sans carte sinon.
 */
export const defaultCardState = (requestStatus) =>
  requestStatus === 'Validé' ? CARD_STATES.TO_PRINT : null;

/**
 * Valide les informations de retrait exigées par l’état `Disponible`.
 * Renvoie un message d’erreur ou `null`.
 */
export const validatePickupDetails = ({ location, date, hours }) => {
  const trimmedLocation = String(location ?? '').trim();
  const trimmedHours = String(hours ?? '').trim();
  const trimmedDate = String(date ?? '').trim();

  if (trimmedLocation.length < 3) {
    return 'Indiquez le lieu de retrait (3 caractères minimum).';
  }
  if (trimmedLocation.length > 120) return 'Le lieu de retrait est trop long.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
    return 'Indiquez la date de disponibilité au format AAAA-MM-JJ.';
  }
  if (Number.isNaN(new Date(`${trimmedDate}T00:00:00Z`).getTime())) {
    return 'La date de disponibilité est invalide.';
  }
  if (trimmedHours.length < 3) {
    return 'Indiquez les horaires de retrait (ex. 9h-16h).';
  }
  if (trimmedHours.length > 80) return 'Les horaires sont trop longs.';
  return null;
};

/** Champs Parse à écrire pour passer une carte à un état donné. */
export const cardStateFields = (state, pickup = {}, actor = {}) => {
  const now = { __type: 'Date', iso: new Date().toISOString() };
  const fields = { cardState: state, cardStateUpdatedAt: now };

  if (state === CARD_STATES.AVAILABLE) {
    fields.pickupLocation = String(pickup.location ?? '').trim();
    fields.pickupDate = String(pickup.date ?? '').trim();
    fields.pickupHours = String(pickup.hours ?? '').trim();
    fields.availableSince = now;
  }
  if (state === CARD_STATES.HANDED_OVER) {
    fields.handedOverAt = now;
    fields.handedOverBy = String(actor.name ?? '').trim();
  }
  return fields;
};
