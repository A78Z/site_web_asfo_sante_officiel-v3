import type { GeoCoordinate } from './podorIntervention';

export type InterventionZoneStatus = 'priority' | 'covered';
export type InterventionCoordinateStatus = 'validated' | 'to-complete';

export interface AboutInterventionZone {
  id: string;
  name: string;
  coordinate: GeoCoordinate | null;
  status: InterventionZoneStatus;
  coordinateStatus: InterventionCoordinateStatus;
  coordinateSource: string;
  route: string | null;
}

/*
 * Les trois zones prioritaires utilisent les coordonnées publiées par
 * OpenStreetMap/Nominatim. Les autres points sont les centroïdes des régions
 * ADM1 du jeu Gouvernement du Sénégal / OCHA ROWCA distribué par geoBoundaries.
 * Toute future zone sans coordonnée validée doit rester à `to-complete` et sera
 * volontairement exclue de la carte.
 */
export const aboutInterventionZones: AboutInterventionZone[] = [
  {
    id: 'saint-louis',
    name: 'Saint-Louis',
    coordinate: [-16.5048686, 16.0280445],
    status: 'priority',
    coordinateStatus: 'validated',
    coordinateSource: 'OpenStreetMap / Nominatim — relation 12989616',
    route: '/missions/carte',
  },
  {
    id: 'podor',
    name: 'Podor',
    coordinate: [-14.958669, 16.652705],
    status: 'priority',
    coordinateStatus: 'validated',
    coordinateSource: 'OpenStreetMap / Nominatim — relation 12989624',
    route: '/missions/carte',
  },
  {
    id: 'matam',
    name: 'Matam',
    coordinate: [-13.255916, 15.656563],
    status: 'priority',
    coordinateStatus: 'validated',
    coordinateSource: 'OpenStreetMap / Nominatim — relation 13006383',
    route: '/missions/carte',
  },
  {
    id: 'dakar',
    name: 'Dakar',
    coordinate: [-17.27059, 14.75589],
    status: 'covered',
    coordinateStatus: 'validated',
    coordinateSource: 'Gouvernement du Sénégal / OCHA ROWCA — geoBoundaries ADM1',
    route: null,
  },
  {
    id: 'diourbel',
    name: 'Diourbel',
    coordinate: [-16.11349, 14.77966],
    status: 'covered',
    coordinateStatus: 'validated',
    coordinateSource: 'Gouvernement du Sénégal / OCHA ROWCA — geoBoundaries ADM1',
    route: null,
  },
  {
    id: 'fatick',
    name: 'Fatick',
    coordinate: [-16.33033, 14.16569],
    status: 'covered',
    coordinateStatus: 'validated',
    coordinateSource: 'Gouvernement du Sénégal / OCHA ROWCA — geoBoundaries ADM1',
    route: null,
  },
  {
    id: 'kaffrine',
    name: 'Kaffrine',
    coordinate: [-15.18216, 14.20775],
    status: 'covered',
    coordinateStatus: 'validated',
    coordinateSource: 'Gouvernement du Sénégal / OCHA ROWCA — geoBoundaries ADM1',
    route: null,
  },
  {
    id: 'kaolack',
    name: 'Kaolack',
    coordinate: [-15.93478, 13.96612],
    status: 'covered',
    coordinateStatus: 'validated',
    coordinateSource: 'Gouvernement du Sénégal / OCHA ROWCA — geoBoundaries ADM1',
    route: null,
  },
  {
    id: 'kolda',
    name: 'Kolda',
    coordinate: [-14.41993, 13.03095],
    status: 'covered',
    coordinateStatus: 'validated',
    coordinateSource: 'Gouvernement du Sénégal / OCHA ROWCA — geoBoundaries ADM1',
    route: null,
  },
  {
    id: 'louga',
    name: 'Louga',
    coordinate: [-15.52767, 15.42297],
    status: 'covered',
    coordinateStatus: 'validated',
    coordinateSource: 'Gouvernement du Sénégal / OCHA ROWCA — geoBoundaries ADM1',
    route: null,
  },
  {
    id: 'sedhiou',
    name: 'Sédhiou',
    coordinate: [-15.58692, 12.89397],
    status: 'covered',
    coordinateStatus: 'validated',
    coordinateSource: 'Gouvernement du Sénégal / OCHA ROWCA — geoBoundaries ADM1',
    route: null,
  },
  {
    id: 'tambacounda',
    name: 'Tambacounda',
    coordinate: [-13.22129, 13.88724],
    status: 'covered',
    coordinateStatus: 'validated',
    coordinateSource: 'Gouvernement du Sénégal / OCHA ROWCA — geoBoundaries ADM1',
    route: null,
  },
  {
    id: 'thies',
    name: 'Thiès',
    coordinate: [-16.75636, 14.82407],
    status: 'covered',
    coordinateStatus: 'validated',
    coordinateSource: 'Gouvernement du Sénégal / OCHA ROWCA — geoBoundaries ADM1',
    route: null,
  },
  {
    id: 'ziguinchor',
    name: 'Ziguinchor',
    coordinate: [-16.37458, 12.78044],
    status: 'covered',
    coordinateStatus: 'validated',
    coordinateSource: 'Gouvernement du Sénégal / OCHA ROWCA — geoBoundaries ADM1',
    route: null,
  },
  {
    id: 'kedougou',
    name: 'Kédougou',
    coordinate: [-12.19703, 12.84328],
    status: 'covered',
    coordinateStatus: 'validated',
    coordinateSource: 'Gouvernement du Sénégal / OCHA ROWCA — geoBoundaries ADM1',
    route: null,
  },
];

export const mauritaniaIntervention = {
  name: 'Mauritanie',
  label: 'Intervention internationale',
  documented: true,
} as const;

export const validatedAboutInterventionZones = aboutInterventionZones.filter(
  (
    zone,
  ): zone is AboutInterventionZone & {
    coordinate: GeoCoordinate;
    coordinateStatus: 'validated';
  } => zone.coordinateStatus === 'validated' && zone.coordinate !== null,
);

export const priorityAboutInterventionZones = validatedAboutInterventionZones.filter(
  (zone) => zone.status === 'priority',
);
