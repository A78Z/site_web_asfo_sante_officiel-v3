import { archives, type ArchiveMission } from './archives';
import { missionDetails } from './missionDetails';
import { podorVillages } from './podorIntervention';
import { LATEST_AVAILABLE } from './reports';

export interface MissionGeography {
  latitude: number | null;
  longitude: number | null;
  region: string | null;
  department: string | null;
  precision: string | null;
  source: string | null;
  validatedAt: string | null;
}

export interface TerritorialMission {
  mission: ArchiveMission;
  geography: MissionGeography;
  interventionType: 'Campagne médicale';
  route: string | null;
}

const geographyPending: MissionGeography = {
  latitude: null,
  longitude: null,
  region: null,
  department: null,
  precision: null,
  source: null,
  validatedAt: null,
};

const VALIDATED_AT = '2026-07-28';

const geography = (
  latitude: number,
  longitude: number,
  region: string,
  department: string,
  precision = 'Village',
): MissionGeography => ({
  latitude,
  longitude,
  region,
  department,
  precision,
  source: 'OpenStreetMap / Nominatim',
  validatedAt: VALIDATED_AT,
});

const validatedPodorGeography = Object.fromEntries(
  podorVillages
    .filter(({ coordinateStatus }) => coordinateStatus === 'validated')
    .map((village) => [
      village.missionId,
      {
        latitude: village.coordinate[1],
        longitude: village.coordinate[0],
        region: 'Saint-Louis',
        department: 'Podor',
        precision: village.coordinateSource.includes('poste de santé')
          ? 'Poste de santé du village'
          : 'Village',
        source: village.coordinateSource,
        validatedAt: VALIDATED_AT,
      } satisfies MissionGeography,
    ]),
);

/*
 * Coordonnées publiées par OpenStreetMap pour les localités correspondant
 * sans ambiguïté aux archives ASFO. Les missions absentes de cette table
 * restent volontairement en état « coordonnées à compléter ».
 */
const validatedGeographyByMissionId: Record<string, MissionGeography> = {
  ...validatedPodorGeography,
  '2023-velingara-ferlo': geography(15.00072, -14.67964, 'Matam', 'Ranérou-Ferlo'),
  '2023-aoure': geography(15.14243, -12.9477, 'Matam', 'Kanel'),
  '2023-ndouloumadji-founebe': geography(15.8194, -13.4242, 'Matam', 'Matam'),
  '2023-doumga-ouro-alpha': geography(15.83106, -13.45151, 'Matam', 'Matam'),
  '2023-sadel': geography(15.90044, -13.33487, 'Matam', 'Matam'),
  '2022-walalde': geography(16.50878, -14.20354, 'Saint-Louis', 'Podor'),
  '2022-cas-cas': geography(16.38272, -14.05637, 'Saint-Louis', 'Podor'),
  '2021-mboloyel': geography(
    15.87262,
    -13.47732,
    'Matam',
    'Matam',
    'Poste de santé du village',
  ),
  '2021-nguidjilone': geography(15.93975, -13.35001, 'Matam', 'Matam'),
  '2021-thilogne': geography(15.96602, -13.59401, 'Matam', 'Matam'),
  '2019-dodel': geography(16.48766, -14.42596, 'Saint-Louis', 'Podor'),
  '2019-fanaye': geography(16.54045, -15.22413, 'Saint-Louis', 'Podor'),
  '2019-thiangaye': geography(16.52696, -15.17402, 'Saint-Louis', 'Podor'),
  '2019-tatki': geography(16.23097, -15.28309, 'Saint-Louis', 'Podor'),
  '2018-polel-diaoube': geography(15.26889, -13.00232, 'Matam', 'Kanel'),
  '2018-orkadere': geography(15.28443, -12.96193, 'Matam', 'Kanel'),
  '2018-dounga-rindiaw': geography(15.86721, -13.4673, 'Matam', 'Matam'),
  '2016-gaol': geography(16.07344, -13.48805, 'Matam', 'Matam', 'Poste de santé'),
  '2016-sadel': geography(15.90044, -13.33487, 'Matam', 'Matam'),
  '2016-ndouloumadji': geography(15.8194, -13.4242, 'Matam', 'Matam'),
};

const detailIds = new Set(missionDetails.map(({ id }) => id));

/**
 * Les archives restent la source unique. La couche géographique ne renseigne
 * que les localités validées et laisse toutes les autres à compléter.
 */
export const territorialMissions: TerritorialMission[] = archives.map((mission) => ({
  mission,
  geography: validatedGeographyByMissionId[mission.id] ?? { ...geographyPending },
  interventionType: 'Campagne médicale',
  route: detailIds.has(mission.id) ? `/archives/${mission.id}` : null,
}));

export interface GeolocatedMission extends TerritorialMission {
  geography: MissionGeography & {
    latitude: number;
    longitude: number;
    region: string;
    department: string;
    source: string;
  };
}

export const geolocatedMissions = territorialMissions.filter(
  (entry): entry is GeolocatedMission =>
    entry.geography.latitude !== null &&
    entry.geography.longitude !== null &&
    entry.geography.region !== null &&
    entry.geography.department !== null &&
    entry.geography.source !== null,
);

export const interventionYears = [...new Set(archives.map(({ year }) => year))].sort(
  (a, b) => Number(b) - Number(a),
);

export const interventionLocations = [...new Set(archives.map(({ location }) => location))].sort(
  (a, b) => a.localeCompare(b, 'fr'),
);

export const interventionSpecialties = [
  ...new Set(archives.flatMap(({ specialties }) => specialties.map(({ name }) => name))),
].sort((a, b) => a.localeCompare(b, 'fr'));

export const territorialSnapshot = {
  missions: archives.length,
  locations: interventionLocations.length,
  consultations: archives.reduce((total, mission) => total + mission.consultations, 0),
  specialties: interventionSpecialties.length,
  firstYear: Math.min(...archives.map(({ year }) => Number(year))),
  lastYear: Math.max(...archives.map(({ year }) => Number(year))),
  geolocatedMissions: geolocatedMissions.length,
} as const;

export interface AnnualTerritorialImpact {
  year: number;
  missions: number;
  consultations: number;
}

const annualTotals = new Map<number, AnnualTerritorialImpact>();

archives.forEach((mission) => {
  const year = Number(mission.year);
  const current = annualTotals.get(year) ?? { year, missions: 0, consultations: 0 };
  current.missions += 1;
  current.consultations += mission.consultations;
  annualTotals.set(year, current);
});

export const annualTerritorialImpact = [...annualTotals.values()].sort(
  (a, b) => a.year - b.year,
);

export const interventionPeriods = [
  { id: '2000-2005', label: '2000–2005', start: 2000, end: 2005 },
  { id: '2006-2010', label: '2006–2010', start: 2006, end: 2010 },
  { id: '2011-2015', label: '2011–2015', start: 2011, end: 2015 },
  { id: '2016-2020', label: '2016–2020', start: 2016, end: 2020 },
  { id: '2021-today', label: '2021–Aujourd’hui', start: 2021, end: 9999 },
] as const;

export const latestTerritorialMissions = territorialMissions.slice(0, 6);
export const latestTerritorialReport = LATEST_AVAILABLE;

export const territorialMapStatus = {
  ready: geolocatedMissions.length > 0,
  label: geolocatedMissions.length > 0 ? 'Carte disponible' : 'En préparation',
  description:
    geolocatedMissions.length > 0
      ? 'Les missions disposant de coordonnées validées sont visibles sur la carte.'
      : 'Les localisations détaillées seront publiées après validation de leurs données géographiques. Toutes les missions restent accessibles dans la vue liste.',
} as const;
