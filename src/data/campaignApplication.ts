export const CAMPAIGN_APPLICATION_FEE = 20_000;

export const campaignApplication = {
  route: '/candidature',
  guideRoute: '/guide-candidature',
  guidePdf: '/GUIDE_DE_CANDIDATURE_CAMPAGNE_MEDICALE_ASFO.pdf',
  guidePreview: '/guide-candidature-apercu.jpg',
  guideSize: '4,2 Mo',
  guideAvailable: true,
  depositPeriod: 'Du 5 mars au 5 avril 2026',
  depositOpening: '5 mars 2026',
  depositClosing: '5 avril 2026',
  fee: CAMPAIGN_APPLICATION_FEE,
  feeTiming: 'après l’enregistrement de la candidature',
  feeRefundable: false,
  paymentMethods: ['Wave', 'Orange Money'],
  onlineOnly: true,
} as const;

export const eligibilityCriteria = [
  {
    id: 'sanitaires',
    title: 'Critères sanitaires',
    description:
      'La commission apprécie la situation sanitaire locale et le niveau des besoins médicaux.',
    items: [
      'État des infrastructures sanitaires locales',
      'Besoins urgents de la population en soins médicaux',
      'Situation sanitaire et besoins majeurs à prendre en charge',
    ],
  },
  {
    id: 'geographiques',
    title: 'Critères géographiques',
    description:
      'La localisation du village et son éloignement des structures de soins sont examinés.',
    items: [
      'Enclavement de la localité',
      'Distance par rapport aux centres hospitaliers régionaux',
      'Conditions d’accès liées à la situation géographique',
    ],
  },
  {
    id: 'organisationnels',
    title: 'Critères organisationnels',
    description:
      'La capacité de la structure candidate à accueillir et accompagner la mission est vérifiée.',
    items: [
      'Capacité d’accueil de l’amicale ou de la structure candidate',
      'Disponibilité des logements pour l’équipe médicale',
      'Hébergement prévu pour un minimum de 100 personnes',
    ],
  },
] as const;

export const candidateCriteria = eligibilityCriteria.map(({ title, description }) => ({
  title: title
    .replace('Critères sanitaires', 'Besoins sanitaires')
    .replace('Critères géographiques', 'Situation géographique')
    .replace('Critères organisationnels', 'Capacité d’accueil'),
  description,
}));

export const applicationDocuments = [
  {
    id: 'lettre',
    title: 'Lettre de candidature officielle',
    description: 'Une lettre adressée au Président de l’ASFO.',
    advice: 'Faites signer la lettre par le responsable habilité de la structure candidate.',
  },
  {
    id: 'geographie',
    title: 'Note de présentation géographique',
    description: 'Une présentation détaillée de la localité et de sa situation géographique.',
    advice: 'Précisez les repères utiles, l’accessibilité et l’éloignement des structures de soins.',
  },
  {
    id: 'sante',
    title: 'Note sur la situation sanitaire',
    description: 'Une note soulignant les besoins majeurs à prendre en charge.',
    advice: 'Présentez les besoins de façon factuelle et rassemblez les informations dans un document lisible.',
  },
  {
    id: 'paiement',
    title: 'Preuve de paiement des frais de dossier',
    description: `La preuve du règlement de ${CAMPAIGN_APPLICATION_FEE.toLocaleString('fr-FR')} FCFA non remboursables.`,
    advice: 'Le règlement intervient après l’enregistrement, selon les instructions affichées par le portail.',
  },
] as const;

export const requiredApplicationDocuments = applicationDocuments.map(({ title }) => title);

export const applicantProfiles = [
  'Amicale d’étudiants ou de ressortissants représentant la localité',
  'Association de développement du village',
  'Comité local',
  'Collectivité ou structure communautaire représentative du village',
] as const;

export const applicationContact = {
  email: 'asfosante@gmail.com',
  primaryPhone: {
    display: '+221 71 040 17 60',
    href: 'tel:+221710401760',
  },
  secondaryPhone: {
    display: '+221 77 090 88 49',
    href: 'tel:+221770908849',
  },
  whatsappUrl: 'https://wa.me/221710401760',
} as const;

export const applicationCalendar = [
  {
    title: 'Préparation du dossier',
    description: 'Lire le guide et vérifier l’éligibilité de la localité.',
  },
  {
    title: 'Constitution des pièces',
    description: 'Rassembler les quatre pièces obligatoires dans un seul fichier PDF.',
  },
  {
    title: 'Paiement des frais',
    description: 'Suivre les instructions communiquées après l’enregistrement.',
  },
  {
    title: 'Dépôt en ligne',
    description: `Transmettre la candidature pendant la période officielle : ${campaignApplication.depositPeriod.toLowerCase()}.`,
  },
  {
    title: 'Vérification administrative',
    description: 'L’administration contrôle la complétude et la recevabilité du dossier.',
  },
  {
    title: 'Étude par la commission',
    description: 'La Commission Planification et Logistique étudie chaque candidature.',
  },
  {
    title: 'Notification de la décision',
    description: 'La structure candidate est informée après la décision de la commission.',
  },
] as const;

export const submissionChecklist = [
  'Tous les documents sont lisibles',
  'Les informations du village sont exactes',
  'Les coordonnées du contact sont valides',
  'La preuve de paiement est jointe',
  'Le fichier PDF final est complet',
  'Les délais de dépôt sont respectés',
] as const;

export const submissionSteps = [
  {
    title: 'Lire le guide',
    description: 'Prendre connaissance des critères, des pièces et des règles de dépôt.',
  },
  {
    title: 'Préparer les pièces',
    description: 'Rédiger et vérifier chaque document obligatoire.',
  },
  {
    title: 'Regrouper le dossier',
    description: 'Assembler toutes les pièces dans un seul fichier PDF lisible.',
  },
  {
    title: 'Remplir le formulaire',
    description: 'Renseigner précisément les informations du village et de la structure.',
  },
  {
    title: 'Envoyer et conserver le numéro',
    description: 'Valider le dépôt puis conserver le numéro de suivi communiqué.',
  },
] as const;

export const applicationFaq = [
  {
    question: 'Qui peut déposer une candidature ?',
    answer:
      'Une amicale d’étudiants ou de ressortissants, une association de développement, un comité local, une collectivité ou une structure communautaire représentative du village.',
  },
  {
    question: 'Quels documents sont obligatoires ?',
    answer:
      'Le dossier comprend une lettre officielle adressée au Président de l’ASFO, une note géographique, une note sur la situation sanitaire et la preuve de paiement des frais de dossier. Toutes les pièces sont regroupées dans un seul fichier PDF.',
  },
  {
    question: 'Les frais de dossier sont-ils remboursables ?',
    answer: `Non. Les frais de dossier de ${CAMPAIGN_APPLICATION_FEE.toLocaleString('fr-FR')} FCFA sont non remboursables.`,
  },
  {
    question: 'Comment transmettre la preuve de paiement ?',
    answer:
      'Le paiement intervient après l’enregistrement, selon les instructions et les numéros affichés sur la confirmation. La preuve obtenue doit être intégrée au dossier.',
  },
  {
    question: 'Un dossier incomplet peut-il être étudié ?',
    answer: 'Non. Tout dossier incomplet est automatiquement rejeté.',
  },
  {
    question: 'Les dossiers physiques sont-ils acceptés ?',
    answer: 'Non. Les candidatures sont déposées exclusivement via le portail en ligne.',
  },
  {
    question: 'Comment suivre la candidature ?',
    answer:
      'Conservez le numéro de dossier remis après l’enregistrement et communiquez-le à l’ASFO par téléphone ou par email pour toute demande de suivi.',
  },
  {
    question: 'Quand les villages retenus seront-ils annoncés ?',
    answer:
      'Aucune date d’annonce n’est actuellement publiée. La décision intervient après la vérification administrative et l’étude humaine des dossiers par la commission.',
  },
] as const;
