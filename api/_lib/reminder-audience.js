/**
 * Contrôles de l’audience avant envoi.
 *
 * Chaque exclusion est nommée et motivée : rien n’est écarté silencieusement,
 * et l’administrateur peut réintégrer manuellement ce qu’il souhaite.
 */

import { normalizeSenegalPhone } from './senegal-phone.js';
import { isJunkText, isDisposableEmail } from './member-request-validation.js';
import { REMINDABLE_STATE } from './card-lifecycle.js';

export const EXCLUSION_REASONS = {
  NO_PHONE: 'no_phone',
  INVALID_PHONE: 'invalid_phone',
  TEST_ACCOUNT: 'test_account',
  DUPLICATE_PHONE: 'duplicate_phone',
  ALREADY_NOTIFIED: 'already_notified',
  CARD_NOT_AVAILABLE: 'card_not_available',
};

export const EXCLUSION_LABELS = {
  [EXCLUSION_REASONS.NO_PHONE]: 'Sans numéro de téléphone',
  [EXCLUSION_REASONS.INVALID_PHONE]: 'Numéro invalide',
  [EXCLUSION_REASONS.TEST_ACCOUNT]: 'Compte de test',
  [EXCLUSION_REASONS.DUPLICATE_PHONE]: 'Numéro en doublon',
  [EXCLUSION_REASONS.ALREADY_NOTIFIED]: 'Rappel déjà envoyé',
  [EXCLUSION_REASONS.CARD_NOT_AVAILABLE]: 'Carte non disponible',
};

/** Repère un enregistrement de test sur son identité ou son adresse. */
export const looksLikeTestAccount = (member) => {
  const email = String(member.email ?? '');
  if (email && isDisposableEmail(email)) return true;
  return (
    isJunkText(member.firstName ?? '') ||
    isJunkText(member.lastName ?? '') ||
    isJunkText(member.village ?? '')
  );
};

const fullName = (member) =>
  `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim() || '(sans nom)';

/**
 * Répartit une sélection entre destinataires retenus et exclus.
 *
 * `options` :
 *  - `skipAlreadyNotified` (défaut vrai) : ignore ceux déjà notifiés
 *  - `includeTestAccounts` : réintègre les comptes de test
 *  - `allowUnavailableCards` : autorise les cartes non `Disponible`
 *  - `requireAvailableCard` (défaut vrai) : applique le contrôle d’état
 */
export const buildAudience = (members, options = {}) => {
  const {
    skipAlreadyNotified = true,
    includeTestAccounts = false,
    allowUnavailableCards = false,
    requireAvailableCard = true,
  } = options;

  const recipients = [];
  const excluded = [];
  const seenPhones = new Map();

  for (const member of members) {
    const name = fullName(member);
    const exclude = (reason, detail) => {
      excluded.push({ objectId: member.objectId, name, reason, detail });
    };

    if (requireAvailableCard && !allowUnavailableCards && member.cardState !== REMINDABLE_STATE) {
      exclude(
        EXCLUSION_REASONS.CARD_NOT_AVAILABLE,
        member.cardState ?? 'aucun état de carte',
      );
      continue;
    }
    if (!includeTestAccounts && looksLikeTestAccount(member)) {
      exclude(EXCLUSION_REASONS.TEST_ACCOUNT, member.email ?? '');
      continue;
    }
    if (skipAlreadyNotified && member.lastReminderAt) {
      exclude(EXCLUSION_REASONS.ALREADY_NOTIFIED, member.lastReminderAt);
      continue;
    }

    const rawPhone = member.phoneNormalized || member.phone || '';
    if (!String(rawPhone).trim()) {
      exclude(EXCLUSION_REASONS.NO_PHONE);
      continue;
    }
    const phone = normalizeSenegalPhone(rawPhone);
    if (!phone) {
      exclude(EXCLUSION_REASONS.INVALID_PHONE, String(rawPhone));
      continue;
    }

    // Deux membres au même numéro : un seul SMS, les deux noms signalés.
    const alreadyTargeting = seenPhones.get(phone);
    if (alreadyTargeting) {
      exclude(EXCLUSION_REASONS.DUPLICATE_PHONE, `même numéro que ${alreadyTargeting}`);
      continue;
    }
    seenPhones.set(phone, name);
    recipients.push({ ...member, name, phone });
  }

  return { recipients, excluded };
};

/** Résumé chiffré affiché avant confirmation. */
export const audienceSummary = (audience, totalSegments) => {
  const byReason = new Map();
  for (const item of audience.excluded) {
    byReason.set(item.reason, (byReason.get(item.reason) ?? 0) + 1);
  }
  return {
    recipientCount: audience.recipients.length,
    excludedCount: audience.excluded.length,
    totalSegments,
    excludedByReason: [...byReason.entries()].map(([reason, count]) => ({
      reason,
      label: EXCLUSION_LABELS[reason] ?? reason,
      count,
    })),
  };
};
