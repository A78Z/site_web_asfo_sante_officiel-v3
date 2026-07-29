export type SponsorshipStatus =
  | 'En attente de parrain'
  | 'Parrainage en étude'
  | 'Partiellement soutenu'
  | 'Parrainé'
  | 'Suspendu';

export interface SponsorshipVillage {
  id: string;
  name: string;
  region: string;
  department: string;
  imageUrl: string;
  healthContext: string;
  priorityNeeds: string[];
  status: SponsorshipStatus;
  isPublished: boolean;
}

/**
 * Seuls les villages validés administrativement et autorisés à la publication
 * doivent être ajoutés ici. Aucune donnée publique n'est disponible à ce jour.
 */
export const sponsorshipVillages: SponsorshipVillage[] = [];

export const sponsorshipObjectives = [
  {
    title: 'Soins médicaux',
    description: 'Soutenir l’accès aux consultations et aux prises en charge organisées par l’ASFO.',
  },
  {
    title: 'Prévention',
    description: 'Accompagner les actions de dépistage et de prévention menées dans les communautés.',
  },
  {
    title: 'Suivi des patients',
    description: 'Contribuer à la continuité des orientations et du suivi après les interventions.',
  },
  {
    title: 'Sensibilisation communautaire',
    description: 'Renforcer l’information sanitaire auprès des populations et des relais locaux.',
  },
] as const;

export const sponsorshipSteps = [
  {
    title: 'Découvrir les villages',
    description: 'Consulter les villages publiés après étude et validation administrative.',
  },
  {
    title: 'Consulter les besoins',
    description: 'Prendre connaissance des besoins sanitaires rendus publics par l’ASFO.',
  },
  {
    title: 'Choisir un mode de soutien',
    description: 'Identifier la forme d’accompagnement adaptée à votre organisation.',
  },
  {
    title: 'Soumettre une intention',
    description: 'Transmettre vos coordonnées et votre proposition sans effectuer de paiement.',
  },
  {
    title: 'Validation par l’ASFO',
    description: 'L’équipe étudie la proposition et vérifie sa cohérence avec les besoins.',
  },
  {
    title: 'Confirmer l’engagement',
    description: 'Le périmètre, la durée et les modalités sont définis avec l’ASFO.',
  },
  {
    title: 'Suivre les actions',
    description: 'Les modalités de suivi et de reporting sont précisées dans l’engagement validé.',
  },
] as const;

export const sponsorTypes = [
  {
    id: 'particulier',
    title: 'Particulier',
    description: 'Construire un soutien adapté à vos possibilités et à la durée envisagée.',
    supports: ['Action ciblée', 'Soutien régulier', 'Don ponctuel'],
  },
  {
    id: 'entreprise',
    title: 'Entreprise',
    description: 'Mobiliser l’organisation autour d’un engagement sanitaire structuré.',
    supports: ['Parrainage institutionnel', 'Soutien matériel', 'Action ciblée'],
  },
  {
    id: 'fondation',
    title: 'Fondation',
    description: 'Accompagner un programme défini avec des objectifs et un suivi convenus.',
    supports: ['Programme annuel', 'Projet de santé', 'Soutien sur mesure'],
  },
  {
    id: 'organisation',
    title: 'Association ou organisation',
    description: 'Co-construire une intervention ou apporter des ressources complémentaires.',
    supports: ['Coopération', 'Appui logistique', 'Soutien sur mesure'],
  },
] as const;

export const supportedNeeds = [
  'Consultations médicales',
  'Médicaments et consommables',
  'Dépistage',
  'Santé maternelle et infantile',
  'Prévention',
  'Suivi des patients',
  'Logistique médicale',
  'Formation communautaire',
] as const;

export const sponsorshipOptions = [
  {
    id: 'targeted',
    title: 'Soutien ciblé',
    description: 'Une contribution à une action précise, définie avec l’ASFO.',
  },
  {
    id: 'annual',
    title: 'Parrainage annuel',
    description: 'Un soutien régulier sur une période déterminée avec l’équipe ASFO.',
  },
  {
    id: 'institutional',
    title: 'Parrainage institutionnel',
    description: 'Un accompagnement plus large avec un cadre de suivi convenu.',
  },
  {
    id: 'custom',
    title: 'Parrainage sur mesure',
    description: 'Un engagement construit selon les besoins validés du village et les possibilités du parrain.',
  },
] as const;

export const postSubmissionSteps = [
  'Réception de la proposition',
  'Étude par l’ASFO',
  'Échange avec le parrain',
  'Validation du périmètre',
  'Convention ou engagement',
  'Mise en place du soutien',
  'Suivi et reporting',
] as const;

export const transparencyCommitments = [
  {
    title: 'Rapports périodiques',
    description: 'La fréquence et le contenu des rapports sont définis dans le cadre du parrainage validé.',
  },
  {
    title: 'Photos de terrain',
    description: 'Les images partageables sont sélectionnées dans le respect des personnes et des autorisations.',
  },
  {
    title: 'Bilan des actions',
    description: 'Les actions réalisées sont rapprochées des objectifs convenus avec le parrain.',
  },
  {
    title: 'Points de suivi',
    description: 'Des échanges peuvent être planifiés avec l’équipe ASFO selon le périmètre retenu.',
  },
  {
    title: 'Résultats mesurables',
    description: 'Les indicateurs disponibles sont issus des actions réellement documentées.',
  },
  {
    title: 'Équipe ASFO',
    description: 'Un canal de contact est défini après validation de l’engagement.',
  },
] as const;

export const sponsorshipFaq = [
  {
    question: 'Qui peut parrainer un village ?',
    answer:
      'Une personne, une entreprise, une fondation, une association ou une organisation peut soumettre une intention de parrainage à l’ASFO.',
  },
  {
    question: 'Comment les villages sont-ils sélectionnés ?',
    answer:
      'Les villages sont étudiés et validés administrativement par l’ASFO avant toute publication dans l’espace de parrainage.',
  },
  {
    question: 'Puis-je choisir un village ?',
    answer:
      'Vous pouvez indiquer une préférence dans votre proposition. L’affectation éventuelle dépend des villages validés, de leurs besoins et de l’étude menée par l’ASFO.',
  },
  {
    question: 'Quelle est la durée d’un parrainage ?',
    answer:
      'Aucune durée unique n’est imposée sur cette page. La période est définie avec l’ASFO selon le type de soutien et les besoins retenus.',
  },
  {
    question: 'Comment sont utilisés les fonds ?',
    answer:
      'Le périmètre d’utilisation, le montant et les modalités de suivi sont définis après étude et validation de la proposition. Aucun paiement n’est demandé lors de l’envoi du formulaire.',
  },
  {
    question: 'Quels rapports vais-je recevoir ?',
    answer:
      'Les documents de suivi sont convenus avec l’ASFO en fonction du parrainage validé et des données réellement disponibles.',
  },
  {
    question: 'Puis-je arrêter ou renouveler mon engagement ?',
    answer:
      'Les conditions d’arrêt ou de renouvellement sont précisées dans la convention ou la confirmation d’engagement établie avec l’ASFO.',
  },
  {
    question: 'Quelle différence entre parrainage et don ponctuel ?',
    answer:
      'Le parrainage est un engagement construit avec l’ASFO autour d’un périmètre et d’une durée. Le don ponctuel est une contribution sans engagement de durée effectuée depuis la page dédiée.',
  },
  {
    question: 'Le parrainage donne-t-il droit à un avantage fiscal ?',
    answer:
      'Aucune information juridique officielle n’est publiée à ce sujet sur le site. Contactez l’ASFO avant toute décision fondée sur un éventuel avantage fiscal.',
  },
] as const;
