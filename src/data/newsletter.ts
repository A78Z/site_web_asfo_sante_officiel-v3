export type NewsletterPreferenceId =
  | 'official'
  | 'missions'
  | 'applications'
  | 'events'
  | 'news'
  | 'reports'
  | 'partners'
  | 'volunteering'
  | 'solidarity';

export type NewsletterIconKey =
  | 'megaphone'
  | 'stethoscope'
  | 'clipboard'
  | 'calendar'
  | 'newspaper'
  | 'report'
  | 'handshake'
  | 'users'
  | 'heart';

export interface NewsletterPreference {
  id: NewsletterPreferenceId;
  label: string;
  shortLabel: string;
  description: string;
  icon: NewsletterIconKey;
}

export const NEWSLETTER_PREFERENCES: NewsletterPreference[] = [
  {
    id: 'official',
    label: 'Annonces officielles',
    shortLabel: 'Annonces',
    description: 'Communiqués et informations institutionnelles de l’ASFO.',
    icon: 'megaphone',
  },
  {
    id: 'missions',
    label: 'Missions médicales',
    shortLabel: 'Missions',
    description: 'Préparation, dates, localités et résultats des campagnes.',
    icon: 'stethoscope',
  },
  {
    id: 'applications',
    label: 'Appels à candidatures',
    shortLabel: 'Candidatures',
    description: 'Ouvertures de candidatures pour les villages et les missions.',
    icon: 'clipboard',
  },
  {
    id: 'events',
    label: 'Convocations et événements',
    shortLabel: 'Événements',
    description: 'Rencontres, convocations et rendez-vous de l’association.',
    icon: 'calendar',
  },
  {
    id: 'news',
    label: 'Actualités',
    shortLabel: 'Actualités',
    description: 'Publications et nouvelles diffusées par l’ASFO.',
    icon: 'newspaper',
  },
  {
    id: 'reports',
    label: 'Rapports et comptes-rendus',
    shortLabel: 'Rapports',
    description: 'Bilans, résultats et documents publiés après les actions.',
    icon: 'report',
  },
  {
    id: 'partners',
    label: 'Partenariats',
    shortLabel: 'Partenariats',
    description: 'Informations destinées aux partenaires et soutiens de l’ASFO.',
    icon: 'handshake',
  },
  {
    id: 'volunteering',
    label: 'Bénévolat',
    shortLabel: 'Bénévolat',
    description: 'Besoins bénévoles et possibilités de rejoindre les équipes.',
    icon: 'users',
  },
  {
    id: 'solidarity',
    label: 'Dons et campagnes solidaires',
    shortLabel: 'Solidarité',
    description: 'Appels à soutien et campagnes solidaires en cours.',
    icon: 'heart',
  },
];

export const NEWSLETTER_INTRO_CATEGORIES = [
  {
    title: 'Campagnes médicales',
    description: 'Dates, localités, préparation et résultats des missions.',
    icon: 'stethoscope' as const,
  },
  {
    title: 'Convocations et événements',
    description: 'Les rendez-vous importants de la vie de l’association.',
    icon: 'calendar' as const,
  },
  {
    title: 'Actualités de l’ASFO',
    description: 'Les publications et nouvelles diffusées par l’équipe.',
    icon: 'newspaper' as const,
  },
  {
    title: 'Comptes-rendus et rapports',
    description: 'Les bilans, résultats et documents rendus publics.',
    icon: 'report' as const,
  },
];

export const NEWSLETTER_RECEIVE_CARDS = [
  {
    title: 'Annonces officielles',
    description: 'Convocations, appels à candidatures et informations institutionnelles.',
    icon: 'megaphone' as const,
  },
  {
    title: 'Campagnes médicales',
    description: 'Dates, localités, préparatifs et résultats.',
    icon: 'stethoscope' as const,
  },
  {
    title: 'Actualités et événements',
    description: 'Publications, rencontres et activités de l’association.',
    icon: 'newspaper' as const,
  },
  {
    title: 'Rapports et comptes-rendus',
    description: 'Bilans, résultats et documents publiés.',
    icon: 'report' as const,
  },
];

export const NEWSLETTER_FAQ = [
  {
    question: 'Quelles informations vais-je recevoir ?',
    answer:
      'Uniquement les catégories que vous sélectionnez : annonces, missions, candidatures, événements, actualités, rapports, partenariats, bénévolat ou solidarité.',
  },
  {
    question: 'À quelle fréquence ?',
    answer:
      'L’ASFO ne publie pas encore de fréquence fixe. Les communications sont envoyées en fonction des informations réellement disponibles, sans promesse de rythme artificiel.',
  },
  {
    question: 'L’inscription est-elle gratuite ?',
    answer:
      'Oui. L’inscription à la lettre d’information ne nécessite aucun paiement.',
  },
  {
    question: 'Comment modifier mes préférences ?',
    answer:
      'Le centre sécurisé de gestion des préférences est encore en préparation. Pour le moment, contactez l’ASFO afin que l’équipe traite votre demande.',
  },
  {
    question: 'Comment me désabonner ?',
    answer:
      'Vous pouvez demander votre désabonnement à tout moment en contactant l’ASFO. Le lien autonome et sécurisé de désabonnement sera proposé lorsque l’infrastructure d’envoi sera connectée.',
  },
  {
    question: 'Comment activer les alertes SMS ?',
    answer:
      'Le service SMS n’est pas encore connecté. Aucun numéro ni consentement SMS n’est recueilli sur cette page tant que ce canal reste en préparation.',
  },
  {
    question: 'Mes données sont-elles protégées ?',
    answer:
      'Vos coordonnées servent uniquement à gérer votre inscription et les catégories choisies. Elles ne sont pas affichées publiquement.',
  },
  {
    question: 'Pourquoi n’ai-je pas reçu l’email de confirmation ?',
    answer:
      'Aucun service d’email de confirmation n’est actuellement connecté. Une inscription réussie est confirmée uniquement à l’écran après son enregistrement réel sur le serveur.',
  },
];

export const SMS_ALERTS_AVAILABLE = false;
export const SECURE_PREFERENCES_AVAILABLE = false;
