import { archives, type ArchiveMission } from './archives';
import { campaignApplication } from './campaignApplication';

export {
  candidateCriteria,
  requiredApplicationDocuments,
} from './campaignApplication';

export const upcomingCampaign = {
  edition: 27,
  officialTitle: '27e Grande Campagne Médicale ASFO',
  department: 'Département de Podor',
  year: 2026,
  executionDates: null,
  selectedVillages: [],
  application: campaignApplication,
} as const;

export const campaignObjectives = [
  'Consultations médicales',
  'Dépistage',
  'Prévention',
  'Sensibilisation',
  'Soins spécialisés',
  'Orientation des patients',
  'Mobilisation communautaire',
] as const;

/**
 * La liste existait déjà sur la page d'attente. Son statut reste en cours de
 * programmation tant qu'aucune liste définitive n'est publiée.
 */
export const plannedSpecialties = [
  'Médecine générale',
  'Ophtalmologie',
  'Soins dentaires',
  'Pédiatrie',
] as const;

export const applicationProcess = [
  'Préparer le dossier',
  'Remplir le formulaire',
  'Transmettre les documents',
  'Étude par l’ASFO',
  'Notification de la décision',
] as const;

export type PreparationStatus = 'published' | 'documented-period' | 'upcoming';

export interface PreparationStep {
  title: string;
  status: PreparationStatus;
  note: string;
}

export const preparationSteps: PreparationStep[] = [
  {
    title: 'Appel à candidatures',
    status: 'published',
    note: 'Appel publié pour les villages du département de Podor.',
  },
  {
    title: 'Réception des dossiers',
    status: 'documented-period',
    note: upcomingCampaign.application.depositPeriod,
  },
  {
    title: 'Étude des villages',
    status: 'upcoming',
    note: 'État d’avancement non publié.',
  },
  {
    title: 'Sélection des localités',
    status: 'upcoming',
    note: 'Aucun village retenu n’est encore publié.',
  },
  {
    title: 'Mobilisation des équipes',
    status: 'upcoming',
    note: 'À venir.',
  },
  {
    title: 'Préparation logistique',
    status: 'upcoming',
    note: 'À venir.',
  },
  {
    title: 'Lancement de la campagne',
    status: 'upcoming',
    note: 'Date à venir.',
  },
];

export const previousCampaigns: ArchiveMission[] = archives.slice(0, 3);
