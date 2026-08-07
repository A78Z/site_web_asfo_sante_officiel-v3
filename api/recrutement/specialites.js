/**
 * Catalogue public des cinq catégories et de leur état d’ouverture.
 *
 * Route en lecture seule, sans authentification : c’est elle qui alimente la
 * page publique. L’état vient de la classe `RecruitmentSpecialties`, pilotée
 * par le back-office — ouvrir une catégorie ne demande aucun déploiement.
 *
 * Si la classe n’existe pas encore (module fraîchement installé), la lecture
 * renvoie une liste vide et le catalogue reprend ses valeurs par défaut : la
 * page reste fonctionnelle.
 */

import { serverEnvironment, missingEnvironmentNames, findObjects } from '../_lib/parse-server.js';
import {
  RECRUITMENT_CAMPAIGN,
  SPECIALTY_CLASS,
  mergeSpecialtyStates,
} from '../_lib/recruitment.js';
import { sendError } from '../_lib/http.js';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    sendError(response, 405, 'Méthode non autorisée.', 'method_not_allowed');
    return;
  }

  const environment = serverEnvironment();
  if (missingEnvironmentNames(environment).length > 0) {
    // Le catalogue par défaut vaut mieux qu’une page vide : la configuration
    // manquante est journalisée, le visiteur voit quand même les spécialités.
    console.error('[recruitment-specialties] missing_configuration');
    response.setHeader('Cache-Control', 'no-store');
    response.status(200).json({
      success: true,
      campaign: RECRUITMENT_CAMPAIGN,
      specialties: mergeSpecialtyStates([]),
      degraded: true,
    });
    return;
  }

  let rows = [];
  try {
    const found = await findObjects(environment, SPECIALTY_CLASS, {
      limit: 200,
      keys: 'slug,open,updatedBy',
    });
    rows = found.results ?? [];
  } catch (error) {
    console.error('[recruitment-specialties] lookup_failed', {
      reason: error?.message ?? 'unknown',
    });
  }

  // Aucun cache partagé : un changement dans l’administration doit être visible
  // dès le prochain chargement de la page publique.
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({
    success: true,
    campaign: RECRUITMENT_CAMPAIGN,
    specialties: mergeSpecialtyStates(rows),
  });
}
