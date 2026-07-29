/* ------------------------------------------------------------------------
 * Source de données UNIQUE des rapports d'activité de l'ASFO (2000 → 2025).
 *
 * Aucune année n'est codée en dur ailleurs : les pages consomment ce module.
 *
 * Disponibilité = fichier RÉELLEMENT présent et non vide dans public/.
 * Vérification au 26/07/2026 :
 *   - public/Rapport2020.pdf  → 4,0 Mo  → RÉEL, téléchargeable
 *   - public/rapport2021.pdf  → 0 octet → placeholder, NON téléchargeable
 *   - public/rapport2022.pdf  → 0 octet → placeholder, NON téléchargeable
 *   - public/rapport2023.pdf  → 0 octet → placeholder, NON téléchargeable
 *   - public/rapport2024.pdf  → 0 octet → placeholder, NON téléchargeable
 *   - (aucun fichier pour 2025 ni 2000–2019)
 *
 * Pour rendre une nouvelle année téléchargeable : déposer le vrai PDF dans
 * public/ puis ajouter son entrée dans REAL_FILES ci-dessous. Rien d'autre.
 * ---------------------------------------------------------------------- */

export interface Report {
  /** Année sous forme de chaîne, ex. "2020". */
  year: string;
  yearNumber: number;
  title: string;
  description: string;
  /** URL publique du PDF (chemin exact, sensible à la casse). */
  downloadUrl: string | null;
  /** true uniquement si le PDF existe réellement et n'est pas vide. */
  isAvailable: boolean;
}

/**
 * PDF réellement présents (chemins exacts, casse comprise).
 * Seules les années listées ici sont marquées disponibles.
 */
const REAL_FILES: Record<string, string> = {
  '2020': '/Rapport2020.pdf',
};

/** Première et dernière année couvertes par la bibliothèque. */
export const FIRST_YEAR = 2000;
export const LAST_YEAR = 2025;

/** Liste complète, dérivée (de la plus récente à la plus ancienne). */
export const REPORTS: Report[] = Array.from(
  { length: LAST_YEAR - FIRST_YEAR + 1 },
  (_, i) => LAST_YEAR - i,
).map((y) => {
  const year = y.toString();
  const downloadUrl = REAL_FILES[year] ?? null;
  return {
    year,
    yearNumber: y,
    title: `Rapport d'activité ${year}`,
    description: `Bilan de la campagne sanitaire et des activités menées par l'ASFO en ${year} : consultations, actions communautaires, formations et impact sur les populations bénéficiaires.`,
    downloadUrl,
    isAvailable: downloadUrl !== null,
  };
});

/** Nombre de rapports référencés au total. */
export const TOTAL_REPORTS = REPORTS.length;

/** Rapports réellement téléchargeables. */
export const AVAILABLE_REPORTS = REPORTS.filter((r) => r.isAvailable);

/** Le rapport disponible le plus récent (ou undefined si aucun). */
export const LATEST_AVAILABLE: Report | undefined = AVAILABLE_REPORTS[0];

/** Récupère un rapport par année. */
export const getReport = (year: string | number): Report | undefined =>
  REPORTS.find((r) => r.year === year.toString());
