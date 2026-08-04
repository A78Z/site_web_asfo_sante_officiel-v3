/**
 * Lecture des candidatures pour le back-office : liste filtrée et statistiques.
 *
 * La lecture passe par le serveur avec la clé master plutôt que par le client :
 * les dossiers contiennent des pièces d’identité et des coordonnées, ils ne
 * doivent jamais être exposés à une requête publique.
 */

import {
  serverEnvironment,
  missingEnvironmentNames,
  findObjects,
} from '../../_lib/parse-server.js';
import { authorizeAdmin } from '../../_lib/admin-auth.js';
import { readJsonBody, sendError } from '../../_lib/http.js';
import {
  RECRUITMENT_CLASS,
  RECRUITMENT_STATUSES,
  SELECTED_STATUSES,
  SPECIALTIES,
  isRecruitmentStatus,
  specialtyBySlug,
} from '../../_lib/recruitment.js';

const MAX_ROWS = 1000;

const startOfToday = (now) =>
  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

/** Lundi de la semaine en cours, à minuit UTC. */
const startOfWeek = (now) => {
  const today = startOfToday(now);
  // getUTCDay : 0 = dimanche. On ramène la semaine au lundi, usage courant en
  // France et au Sénégal.
  const shift = (today.getUTCDay() + 6) % 7;
  return new Date(today.getTime() - shift * 86_400_000);
};

const startOfMonth = (now) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

const countBy = (rows, pick) => {
  const counts = {};
  for (const row of rows) {
    const key = pick(row);
    if (!key) continue;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const buildStats = (rows, now = new Date()) => {
  const todayIso = startOfToday(now).toISOString();
  const weekIso = startOfWeek(now).toISOString();
  const monthIso = startOfMonth(now).toISOString();
  const createdAt = (row) => String(row.createdAt ?? '');

  const byStatus = Object.fromEntries(
    RECRUITMENT_STATUSES.map((status) => [
      status,
      rows.filter((row) => row.status === status).length,
    ]),
  );

  return {
    total: rows.length,
    byStatus,
    bySpecialty: countBy(rows, (row) => specialtyBySlug(row.specialty)?.label ?? row.profession),
    byRegion: countBy(rows, (row) => row.region),
    byDepartment: countBy(rows, (row) => row.department),
    today: rows.filter((row) => createdAt(row) >= todayIso).length,
    thisWeek: rows.filter((row) => createdAt(row) >= weekIso).length,
    thisMonth: rows.filter((row) => createdAt(row) >= monthIso).length,
    selected: rows.filter((row) => SELECTED_STATUSES.includes(row.status)).length,
  };
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
    console.error('[recruitment-list] missing_configuration', { missing });
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

  // Les filtres appliqués en base allègent la réponse ; la recherche libre et
  // la pagination restent côté client, sur un volume déjà réduit.
  //
  // `$ne: true` couvre aussi les dossiers antérieurs au champ : dans Parse, un
  // champ absent satisfait `$ne`. Les candidatures supprimées sortent donc de
  // la liste, mais aussi des statistiques et des exports qui en découlent.
  const where = { archived: { $ne: true } };
  if (isRecruitmentStatus(payload.status)) where.status = payload.status;
  if (specialtyBySlug(payload.specialty)) where.specialty = payload.specialty;
  if (typeof payload.region === 'string' && payload.region.trim()) {
    where.region = payload.region.trim();
  }
  if (typeof payload.department === 'string' && payload.department.trim()) {
    where.department = payload.department.trim();
  }

  let rows = [];
  try {
    const found = await findObjects(environment, RECRUITMENT_CLASS, {
      where,
      limit: MAX_ROWS,
      order: '-createdAt',
    });
    rows = found.results ?? [];
  } catch (error) {
    console.error('[recruitment-list] lookup_failed', { reason: error?.message ?? 'unknown' });
    sendError(
      response,
      502,
      'Les candidatures n’ont pas pu être chargées.',
      'lookup_failed',
    );
    return;
  }

  response.status(200).json({
    success: true,
    applications: rows,
    stats: buildStats(rows),
    statuses: RECRUITMENT_STATUSES,
    specialties: SPECIALTIES.map(({ slug, label, emoji }) => ({ slug, label, emoji })),
    // Signale une liste plafonnée plutôt que de laisser croire à l’exhaustivité.
    truncated: rows.length >= MAX_ROWS,
  });
}
