/**
 * Paramètres du recrutement : ouverture et fermeture des spécialités.
 *
 * L’état vit en base, pas dans le code : ouvrir une spécialité est un clic
 * dans le back-office, sans déploiement. La classe `RecruitmentSpecialties`
 * est créée à la première écriture ; tant qu’elle n’existe pas, le catalogue
 * fournit les valeurs par défaut.
 */

import {
  serverEnvironment,
  missingEnvironmentNames,
  createObject,
  findObjects,
  updateObject,
  parseDate,
} from '../../_lib/parse-server.js';
import { authorizeAdmin } from '../../_lib/admin-auth.js';
import { readJsonBody, sendError } from '../../_lib/http.js';
import {
  SPECIALTY_CLASS,
  categoryBySlug,
  mergeSpecialtyStates,
} from '../../_lib/recruitment.js';

const readStates = async (environment) => {
  const found = await findObjects(environment, SPECIALTY_CLASS, {
    limit: 200,
    keys: 'slug,open,updatedBy',
  });
  return found.results ?? [];
};

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendError(response, 405, 'Méthode non autorisée.', 'method_not_allowed');
    return;
  }

  const environment = serverEnvironment();
  const missing = missingEnvironmentNames(environment);
  if (missing.length > 0) {
    console.error('[recruitment-settings] missing_configuration', { missing });
    sendError(
      response,
      503,
      `Configuration du serveur manquante : ${missing.join(', ')}.`,
      'missing_configuration',
    );
    return;
  }

  const payload = await readJsonBody(request);
  if (!payload || typeof payload !== 'object') {
    sendError(response, 400, 'Requête illisible.', 'unreadable_body');
    return;
  }

  const authorization = await authorizeAdmin(environment, payload.actorId);
  if (authorization.error) {
    sendError(response, authorization.status, authorization.error, authorization.code);
    return;
  }

  const action = payload.action === 'set' ? 'set' : 'list';

  if (action === 'list') {
    let rows = [];
    try {
      rows = await readStates(environment);
    } catch (error) {
      console.error('[recruitment-settings] lookup_failed', {
        reason: error?.message ?? 'unknown',
      });
    }
    response.status(200).json({ success: true, specialties: mergeSpecialtyStates(rows) });
    return;
  }

  const category = categoryBySlug(payload.slug);
  if (!category) {
    sendError(response, 400, 'Catégorie inconnue.', 'unknown_category');
    return;
  }
  if (typeof payload.open !== 'boolean') {
    sendError(response, 400, 'État d’ouverture invalide.', 'invalid_state');
    return;
  }

  const fields = {
    slug: category.slug,
    label: category.label,
    recruitmentCategory: category.key,
    open: payload.open,
    updatedBy: authorization.actor.name ?? '',
    updatedAt: parseDate(new Date()),
  };

  try {
    const existing = await findObjects(environment, SPECIALTY_CLASS, {
      where: { slug: category.slug },
      limit: 1,
      keys: 'slug',
    });
    const row = existing.results?.[0];
    if (row) {
      await updateObject(environment, SPECIALTY_CLASS, row.objectId, fields);
    } else {
      await createObject(environment, SPECIALTY_CLASS, fields);
    }
  } catch (error) {
    console.error('[recruitment-settings] write_failed', {
      reason: error?.message ?? 'unknown',
    });
    sendError(response, 502, 'Le paramètre n’a pas pu être enregistré.', 'write_failed');
    return;
  }

  let rows = [];
  try {
    rows = await readStates(environment);
  } catch {
    rows = [];
  }

  console.info('[recruitment-settings] updated', {
    slug: category.slug,
    open: payload.open,
    actorId: payload.actorId,
  });

  response.status(200).json({
    success: true,
    specialties: mergeSpecialtyStates(rows),
    message: payload.open
      ? `Les inscriptions « ${category.label} » sont ouvertes.`
      : `Les inscriptions « ${category.label} » sont fermées.`,
  });
}
