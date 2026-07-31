/**
 * Contrôle du rôle administrateur côté serveur.
 *
 * ⚠️ Limite connue et documentée : l’authentification actuelle ne produit aucun
 * jeton de session. L’identifiant d’acteur est transmis par le client, et ce
 * module vérifie — avec la clé master — que cet acteur existe, est actif et a un
 * rôle suffisant. C’est un contrôle réel sur les droits, mais pas une preuve
 * d’identité : tant que la connexion admin reste côté navigateur, un appelant
 * malveillant peut se présenter avec l’identifiant d’un administrateur.
 * Corriger cela suppose des sessions Parse et des CLP fermées.
 */

import { findObjects } from './parse-server.js';

const ADMIN_USER_CLASS = 'AdminUsers';

/** Rôles autorisés aux opérations sensibles (envoi en masse, état des cartes). */
export const PRIVILEGED_ROLES = new Set(['Super Admin', 'Admin']);

const isValidObjectId = (value) =>
  typeof value === 'string' && /^[A-Za-z0-9]{6,20}$/.test(value);

/**
 * Renvoie `{ actor }` si l’acteur est habilité, sinon `{ error, status }`.
 */
export const authorizeAdmin = async (environment, actorId) => {
  if (!isValidObjectId(actorId)) {
    return {
      error: 'Session administrateur invalide. Reconnectez-vous.',
      code: 'invalid_actor',
      status: 401,
    };
  }

  let results;
  try {
    ({ results } = await findObjects(environment, ADMIN_USER_CLASS, {
      where: { objectId: actorId },
      keys: 'name,role,status',
      limit: 1,
    }));
  } catch {
    return {
      error: 'Vérification des droits impossible.',
      code: 'actor_lookup_failed',
      status: 502,
    };
  }

  const actor = results?.[0];
  if (!actor) {
    return {
      error: 'Session administrateur invalide. Reconnectez-vous.',
      code: 'unknown_actor',
      status: 401,
    };
  }
  if (actor.status !== 'Actif') {
    return { error: 'Ce compte est désactivé.', code: 'inactive_actor', status: 403 };
  }
  if (!PRIVILEGED_ROLES.has(actor.role)) {
    return {
      error: 'Votre rôle ne permet pas cette opération.',
      code: 'forbidden_role',
      status: 403,
    };
  }
  return { actor };
};
