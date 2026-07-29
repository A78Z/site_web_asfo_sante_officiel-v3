// ---------------------------------------------------------------------------
// Médiathèque vidéo ASFO — source de données UNIQUE, partagée entre la page
// /documentaire et la section « Documentaire » de la page d'accueil.
//
// Données réelles : vidéos publiées sur la chaîne YouTube « ASFO Santé »
// (@asfosante2751). Aucune vidéo fictive. Les miniatures proviennent
// directement de YouTube (i.ytimg.com/vi/<id>/hqdefault.jpg).
// ---------------------------------------------------------------------------

export const CHANNEL_URL = 'https://youtube.com/@asfosante2751';

export interface DocVideo {
  id: string; // ID YouTube réel
  title: string;
  tag: string;
  duration: string;
  year?: string;
  zone?: string;
  note?: string;
}

export const VIDEOS: DocVideo[] = [
  {
    id: 'TjVqSYDwYcg',
    title: 'Campagne médicale ASFO — Matam 2025',
    tag: 'Film officiel',
    duration: '2:28',
    year: '2025',
    zone: 'Matam',
    note: '26e Grande Campagne Médicale · du 11 au 17 septembre 2025',
  },
  {
    id: 'QtCIyH1yuOQ',
    title: 'Campagne médicale ASFO — Podor 2024',
    tag: 'Campagne',
    duration: '8:57',
    year: '2024',
    zone: 'Podor',
    note: '25e Grande Campagne Médicale · immersion au cœur des consultations',
  },
  {
    id: 'WkBuM1jhdcM',
    title: 'Podor 2024 — Bilan des équipes B & C',
    tag: 'Bilan de mission',
    duration: '3:21',
    year: '2024',
    zone: 'Podor',
    note: 'Le débrief des équipes de terrain à l’issue de la campagne',
  },
  {
    id: 'HGyDjPaxPqQ',
    title: 'Panel pré-campagne : les cancers urogénitaux',
    tag: 'Panel santé',
    duration: '3:17',
    year: '2025',
    zone: 'Matam',
    note: 'Temps scientifique organisé en amont de la campagne 2025',
  },
  {
    id: 'MreucTsFOEo',
    title: 'Sensibilisation au cancer du sein',
    tag: 'Sensibilisation',
    duration: '2:58',
    zone: 'Fouta',
    note: 'Prévention et dépistage, en français',
  },
  {
    id: 'E9Iik7h0Mvg',
    title: 'La santé mentale — avec Dr Abou Sy',
    tag: 'Sensibilisation',
    duration: '0:54',
    zone: 'Fouta',
    note: 'Parole d’expert sur un enjeu de santé souvent tabou',
  },
];

/** Miniature YouTube réelle d'une vidéo. */
export const videoThumb = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** URL de partage réelle (page YouTube de la vidéo). */
export const videoWatchUrl = (id: string) =>
  `https://www.youtube.com/watch?v=${id}`;

/** URL d'intégration (chargée uniquement à la lecture). */
export const videoEmbedUrl = (id: string, autoplay = true) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0${autoplay ? '&autoplay=1' : ''}`;
