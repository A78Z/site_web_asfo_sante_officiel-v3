import { archives, type ArchiveMission } from './archives';
import {
  AVAILABLE_REPORTS,
  LATEST_AVAILABLE,
  REPORTS,
  type Report,
} from './reports';

export type ImpactIconKey =
  | 'missions'
  | 'patients'
  | 'specialties'
  | 'archive'
  | 'consultations'
  | 'years';

export interface ImpactIndicator {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  source: string;
  period: string;
  icon: ImpactIconKey;
  sourceHref?: string;
}

/**
 * Chiffres institutionnels déjà publiés sur la page Impact et dans les
 * composants du site. Ils sont conservés sans extrapolation.
 */
export const institutionalIndicators: ImpactIndicator[] = [
  {
    id: 'missions-institutionnelles',
    value: 37,
    suffix: '+',
    label: 'Missions réalisées',
    description: 'Campagnes et missions sanitaires menées par l’ASFO.',
    source: 'Référence institutionnelle du site',
    period: 'Depuis 2000',
    icon: 'missions',
  },
  {
    id: 'patients-institutionnels',
    value: 25000,
    suffix: '+',
    label: 'Patients soignés',
    description: 'Volume institutionnel publié sur les supports actuels de l’ASFO.',
    source: 'Référence institutionnelle du site',
    period: 'Depuis 2000',
    icon: 'patients',
  },
  {
    id: 'specialites-institutionnelles',
    value: 7,
    suffix: '',
    label: 'Spécialités mobilisées',
    description: 'Disciplines médicales mobilisées dans les campagnes.',
    source: 'Page Impact & chiffres',
    period: 'Référence actuelle',
    icon: 'specialties',
  },
];

export interface AnnualImpact {
  year: number;
  missions: number;
  consultations: number;
}

const yearly = new Map<number, AnnualImpact>();

archives.forEach((mission) => {
  const year = Number(mission.year);
  const current = yearly.get(year) ?? { year, missions: 0, consultations: 0 };
  current.missions += 1;
  current.consultations += mission.consultations;
  yearly.set(year, current);
});

export const annualImpact: AnnualImpact[] = [...yearly.values()].sort(
  (a, b) => a.year - b.year,
);

export interface SpecialtyImpact {
  name: string;
  consultations: number;
}

const specialtyTotals = new Map<string, number>();

archives.forEach((mission) => {
  mission.specialties.forEach((specialty) => {
    specialtyTotals.set(
      specialty.name,
      (specialtyTotals.get(specialty.name) ?? 0) + specialty.count,
    );
  });
});

export const specialtyImpact: SpecialtyImpact[] = [...specialtyTotals.entries()]
  .map(([name, consultations]) => ({ name, consultations }))
  .sort((a, b) => b.consultations - a.consultations);

export const archiveSnapshot = {
  missions: archives.length,
  consultations: archives.reduce((total, mission) => total + mission.consultations, 0),
  campaignYears: annualImpact.length,
  firstYear: annualImpact[0]?.year ?? null,
  lastYear: annualImpact.at(-1)?.year ?? null,
  recordedCategories: specialtyImpact.length,
};

export const archiveIndicators: ImpactIndicator[] = [
  {
    id: 'missions-archivees',
    value: archiveSnapshot.missions,
    suffix: '',
    label: 'Missions documentées',
    description: 'Fiches de missions actuellement disponibles dans les archives en ligne.',
    source: 'Archives des missions ASFO',
    period: `${archiveSnapshot.firstYear}–${archiveSnapshot.lastYear}`,
    icon: 'archive',
    sourceHref: '/archives',
  },
  {
    id: 'consultations-archivees',
    value: archiveSnapshot.consultations,
    suffix: '',
    label: 'Consultations documentées',
    description: 'Somme exacte des consultations renseignées dans les fiches de mission.',
    source: 'Archives des missions ASFO',
    period: `${archiveSnapshot.firstYear}–${archiveSnapshot.lastYear}`,
    icon: 'consultations',
    sourceHref: '/archives',
  },
  {
    id: 'annees-archivees',
    value: archiveSnapshot.campaignYears,
    suffix: '',
    label: 'Années de campagnes documentées',
    description: 'Années disposant d’au moins une mission structurée dans les archives.',
    source: 'Archives des missions ASFO',
    period: `${archiveSnapshot.firstYear}–${archiveSnapshot.lastYear}`,
    icon: 'years',
    sourceHref: '/archives',
  },
];

export const impactMissions: ArchiveMission[] = archives;

export const impactReports: Report[] = REPORTS;
export const availableImpactReports: Report[] = AVAILABLE_REPORTS;
export const latestImpactReport: Report | undefined = LATEST_AVAILABLE;

export const reportFileMetadata: Record<string, { size: string; type: string }> = {
  '2020': { size: '4,0 Mo', type: 'PDF' },
};

/** Aucun document de gouvernance validé n'est actuellement présent. */
export const governanceDocuments: never[] = [];
