import { missionDetails } from './missionDetails';

export type GeoCoordinate = readonly [longitude: number, latitude: number];

export type CoordinateStatus = 'validated' | 'to-validate';

interface PodorVillageSource {
  id: number;
  missionId: string;
  name: string;
  coordinate: GeoCoordinate;
  markerOffset: readonly [x: number, y: number];
  coordinateStatus: CoordinateStatus;
  coordinateSource: string;
}

const villageSources: PodorVillageSource[] = [
  {
    id: 1,
    missionId: '2024-village-tatqui',
    name: 'Village Tatqui',
    coordinate: [-15.28286, 16.2305],
    markerOffset: [-20, 18],
    coordinateStatus: 'validated',
    coordinateSource: 'OpenStreetMap — poste de santé de Tatqui',
  },
  {
    id: 2,
    missionId: '2024-village-diattar',
    name: 'Village Diattar',
    coordinate: [-14.91669, 16.63368],
    markerOffset: [-23, -17],
    coordinateStatus: 'validated',
    coordinateSource: 'OpenStreetMap / Wikidata',
  },
  {
    id: 3,
    missionId: '2024-guede-village',
    name: 'Guédé Village',
    coordinate: [-14.80289, 16.54128],
    markerOffset: [10, -28],
    coordinateStatus: 'validated',
    coordinateSource: 'OpenStreetMap / GeoNames',
  },
  {
    id: 4,
    missionId: '2024-bode-lao',
    name: 'Village Bodé Lao',
    coordinate: [-14.35115, 16.44446],
    markerOffset: [20, -11],
    coordinateStatus: 'validated',
    coordinateSource: 'OpenStreetMap / Wikidata',
  },
  {
    id: 5,
    missionId: '2024-madina-ndiathbe',
    name: 'Village Madina Ndiathbé',
    coordinate: [-14.13957, 16.29391],
    markerOffset: [29, 5],
    coordinateStatus: 'validated',
    coordinateSource: 'OpenStreetMap / GeoNames',
  },
  {
    id: 6,
    missionId: '2024-diaba',
    name: 'Village Diaba',
    coordinate: [-13.75937, 16.0552],
    markerOffset: [28, 24],
    coordinateStatus: 'to-validate',
    coordinateSource: 'Position indicative de Diâba Déklé — OpenStreetMap',
  },
];

const missionById = new Map(missionDetails.map((mission) => [mission.id, mission]));

export const podorVillages = villageSources.map((village) => {
  const mission = missionById.get(village.missionId);

  if (!mission) {
    throw new Error(`Mission ASFO introuvable pour ${village.name}`);
  }

  return {
    ...village,
    year: mission.year,
    consultations: mission.consultations,
    missionPath: `/archives/${mission.id}`,
  };
});

/*
 * Contour national issu du jeu public Natural Earth (projection WGS84).
 * La forme conserve notamment l'enclave gambienne, indispensable pour rendre
 * la silhouette du Sénégal immédiatement reconnaissable.
 */
export const senegalOutline: GeoCoordinate[] = [
  [-16.713729, 13.594959],
  [-17.126107, 14.373516],
  [-17.625043, 14.729541],
  [-17.185173, 14.919477],
  [-16.700706, 15.621527],
  [-16.463098, 16.135036],
  [-16.12069, 16.455663],
  [-15.623666, 16.369337],
  [-15.135737, 16.587282],
  [-14.577348, 16.598264],
  [-14.099521, 16.304302],
  [-13.435738, 16.039383],
  [-12.830658, 15.303692],
  [-12.17075, 14.616834],
  [-12.124887, 13.994727],
  [-11.927716, 13.422075],
  [-11.553398, 13.141214],
  [-11.467899, 12.754519],
  [-11.513943, 12.442988],
  [-11.658301, 12.386583],
  [-12.203565, 12.465648],
  [-12.278599, 12.35444],
  [-12.499051, 12.33209],
  [-13.217818, 12.575874],
  [-13.700476, 12.586183],
  [-15.548477, 12.62817],
  [-15.816574, 12.515567],
  [-16.147717, 12.547762],
  [-16.677452, 12.384852],
  [-16.841525, 13.151394],
  [-15.931296, 13.130284],
  [-15.691001, 13.270353],
  [-15.511813, 13.27857],
  [-15.141163, 13.509512],
  [-14.712197, 13.298207],
  [-14.277702, 13.280585],
  [-13.844963, 13.505042],
  [-14.046992, 13.794068],
  [-14.376714, 13.62568],
  [-14.687031, 13.630357],
  [-15.081735, 13.876492],
  [-15.39877, 13.860369],
  [-15.624596, 13.623587],
  [-16.713729, 13.594959],
];

/*
 * Département de Podor (ADM2), simplifié pour l'affichage web.
 * Source : Gouvernement du Sénégal / OCHA ROWCA via geoBoundaries.
 */
export const podorBoundary: GeoCoordinate[] = [
  [-15.43887, 15.99998],
  [-14.86525, 16.00045],
  [-14.75565, 15.9411],
  [-14.59486, 15.93358],
  [-14.40556, 15.6203],
  [-14.42224, 15.49382],
  [-14.33374, 15.49609],
  [-14.30021, 15.52509],
  [-14.26222, 15.51591],
  [-14.22867, 15.60832],
  [-13.84522, 16.00726],
  [-13.74229, 16.0461],
  [-13.70227, 16.17601],
  [-13.81109, 16.13951],
  [-13.85168, 16.10688],
  [-13.87939, 16.1546],
  [-13.87299, 16.19008],
  [-13.91196, 16.19347],
  [-13.92139, 16.22791],
  [-13.97421, 16.22152],
  [-13.95233, 16.26972],
  [-13.9865, 16.27454],
  [-13.99147, 16.30286],
  [-13.95961, 16.30712],
  [-13.9688, 16.33363],
  [-14.02767, 16.34565],
  [-14.13813, 16.45316],
  [-14.1313, 16.47743],
  [-14.15311, 16.47337],
  [-14.2209, 16.54347],
  [-14.25299, 16.54274],
  [-14.25687, 16.51439],
  [-14.27498, 16.58138],
  [-14.333, 16.56871],
  [-14.33754, 16.64149],
  [-14.40525, 16.63281],
  [-14.41985, 16.65205],
  [-14.44893, 16.62374],
  [-14.50067, 16.61368],
  [-14.54336, 16.64429],
  [-14.55735, 16.61793],
  [-14.63855, 16.61759],
  [-14.64179, 16.64928],
  [-14.72395, 16.64704],
  [-14.73526, 16.61981],
  [-14.76295, 16.65616],
  [-14.78709, 16.6318],
  [-14.81253, 16.65565],
  [-14.82523, 16.63733],
  [-14.85783, 16.6384],
  [-14.87821, 16.66324],
  [-14.89541, 16.63443],
  [-14.9142, 16.65112],
  [-14.93765, 16.63363],
  [-14.95083, 16.67899],
  [-14.98614, 16.69373],
  [-14.99966, 16.64689],
  [-15.032, 16.62957],
  [-15.05309, 16.62715],
  [-15.09662, 16.67769],
  [-15.12149, 16.64014],
  [-15.08458, 16.6072],
  [-15.11751, 16.57738],
  [-15.17032, 16.59026],
  [-15.23004, 16.55128],
  [-15.31534, 16.57488],
  [-15.33318, 16.56115],
  [-15.33398, 16.5018],
  [-15.43633, 16.43649],
  [-15.40002, 16.21105],
  [-15.4276, 16.16066],
  [-15.43887, 15.99998],
];

export const senegalRiverValley: GeoCoordinate[] = [
  [-16.4631, 16.13504],
  [-16.12069, 16.45566],
  [-15.62367, 16.36934],
  [-15.13574, 16.58728],
  [-14.57735, 16.59826],
  [-14.09952, 16.3043],
  [-13.43574, 16.03938],
];
