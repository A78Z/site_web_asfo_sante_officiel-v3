import { senegalOutline, type GeoCoordinate } from './podorIntervention';

export const SENEGAL_MAP_WIDTH = 400;
export const SENEGAL_MAP_HEIGHT = 300;
export const SENEGAL_MAP_PADDING = 22;

const SENEGAL_MAP_BOUNDS = {
  left: -17.8,
  right: -11.3,
  top: 16.9,
  bottom: 12.2,
} as const;

export const projectSenegalCoordinate = ([longitude, latitude]: GeoCoordinate) => ({
  x:
    SENEGAL_MAP_PADDING +
    ((longitude - SENEGAL_MAP_BOUNDS.left) /
      (SENEGAL_MAP_BOUNDS.right - SENEGAL_MAP_BOUNDS.left)) *
      (SENEGAL_MAP_WIDTH - SENEGAL_MAP_PADDING * 2),
  y:
    SENEGAL_MAP_PADDING +
    ((SENEGAL_MAP_BOUNDS.top - latitude) /
      (SENEGAL_MAP_BOUNDS.top - SENEGAL_MAP_BOUNDS.bottom)) *
      (SENEGAL_MAP_HEIGHT - SENEGAL_MAP_PADDING * 2),
});

export const SENEGAL_OUTLINE_PATH = `${senegalOutline
  .map((coordinate, index) => {
    const { x, y } = projectSenegalCoordinate(coordinate);
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  })
  .join(' ')} Z`;

export const SENEGAL_LOCATIONS = {
  dakar: [-17.4677, 14.7167] as GeoCoordinate,
  thies: [-16.9256, 14.791] as GeoCoordinate,
  saintLouis: [-16.4896, 16.0326] as GeoCoordinate,
  podor: [-14.9598, 16.6527] as GeoCoordinate,
  matam: [-13.2554, 15.6559] as GeoCoordinate,
  kanel: [-13.1763, 15.4916] as GeoCoordinate,
  bakel: [-12.455, 14.9017] as GeoCoordinate,
} as const;
