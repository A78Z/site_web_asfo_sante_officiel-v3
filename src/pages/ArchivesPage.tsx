import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/common/SectionTitle';
import ArchiveFilters from '../components/archives/ArchiveFilters';
import YearSection from '../components/archives/YearSection';
import ArchiveSkeletonLoader from '../components/archives/ArchiveSkeletonLoader';
import { Search, Archive, TrendingUp } from 'lucide-react';

// Enhanced archives data with summaries
const archives = [
  {
    id: "2024-guede-village",
    year: "2024",
    title: "Guédé Village",
    location: "Guédé Village",
    date: "2024",
    participants: 0,
    consultations: 1122,
    imageUrl: "/guede-village.webp",
    summary: "Une mission exceptionnelle à Guédé Village qui a permis de toucher plus de 1100 patients. L'équipe médicale pluridisciplinaire a offert des soins de qualité dans un esprit de solidarité et d'engagement communautaire.",
    specialties: [
      { name: "Médecine générale", count: 408 },
      { name: "Gériatrie", count: 154 },
      { name: "Pédiatrie", count: 241 },
      { name: "Gynécologie", count: 44 },
      { name: "Psychiatrie", count: 18 },
      { name: "Chirurgie dentaire", count: 160 },
      { name: "Ophtalmologie", count: 0 },
      { name: "Circoncisions", count: 97 }
    ]
  },
  {
    id: "2024-village-tatqui",
    year: "2024",
    title: "Village Tatqui",
    location: "Village Tatqui",
    date: "2024",
    participants: 0,
    consultations: 1250,
    imageUrl: "/2024-TATQUI.jpg",
    summary: "La campagne de Tatqui s'est distinguée par une approche holistique de la santé, combinant soins curatifs et actions préventives. Focus particulier sur la santé maternelle et infantile.",
    specialties: [
      { name: "Médecine générale", count: 386 },
      { name: "Gériatrie", count: 153 },
      { name: "Pédiatrie", count: 347 },
      { name: "Gynécologie", count: 110 },
      { name: "Psychiatrie", count: 18 },
      { name: "Chirurgie dentaire", count: 89 },
      { name: "Ophtalmologie", count: 108 },
      { name: "Circoncisions", count: 39 }
    ]
  },
  {
    id: "2024-village-diattar",
    year: "2024",
    title: "Village Diattar",
    location: "Village Diattar",
    date: "2024",
    participants: 0,
    consultations: 1242,
    imageUrl: "/village-diattar.webp",
    summary: "Mission médicale remarquable axée sur l'innovation et l'excellence des soins. Introduction de nouvelles techniques de diagnostic et renforcement des capacités locales.",
    specialties: [
      { name: "Médecine générale", count: 314 },
      { name: "Gériatrie", count: 131 },
      { name: "Pédiatrie", count: 353 },
      { name: "Gynécologie", count: 90 },
      { name: "Psychiatrie", count: 7 },
      { name: "Chirurgie dentaire", count: 176 },
      { name: "Ophtalmologie", count: 127 },
      { name: "Circoncisions", count: 44 }
    ]
  },
  {
    id: "2024-bode-lao",
    year: "2024",
    title: "Village Bodé Lao",
    location: "Village Bodé Lao",
    date: "2024",
    participants: 0,
    consultations: 1948,
    imageUrl: "/village-bode-lao.webp",
    summary: "Notre plus grande campagne de 2024 avec près de 2000 consultations. Mission d'envergure démontrant la capacité de mobilisation exceptionnelle de l'ASFO.",
    specialties: [
      { name: "Médecine générale", count: 470 },
      { name: "Gériatrie", count: 199 },
      { name: "Pédiatrie", count: 377 },
      { name: "Gynécologie", count: 395 },
      { name: "Psychiatrie", count: 11 },
      { name: "Chirurgie dentaire", count: 154 },
      { name: "Ophtalmologie", count: 225 },
      { name: "Circoncisions", count: 117 }
    ]
  },
  {
    id: "2024-madina-ndiathbe",
    year: "2024",
    title: "Village Madina Ndiathbé",
    location: "Village Madina Ndiathbé",
    date: "2024",
    participants: 0,
    consultations: 1616,
    imageUrl: "/medina-diathbe.webp",
    summary: "Mission médicale intensive focalisée sur la prévention et l'éducation sanitaire. Approche innovante de sensibilisation de la population locale.",
    specialties: [
      { name: "Médecine générale", count: 485 },
      { name: "Gériatrie", count: 177 },
      { name: "Pédiatrie", count: 519 },
      { name: "Gynécologie", count: 157 },
      { name: "Psychiatrie", count: 16 },
      { name: "Chirurgie dentaire", count: 158 },
      { name: "Ophtalmologie", count: 60 },
      { name: "Circoncisions", count: 44 }
    ]
  },
  {
    id: "2024-diaba",
    year: "2024",
    title: "Village Diaba",
    location: "Village Diaba",
    date: "2024",
    participants: 0,
    consultations: 1054,
    imageUrl: "/2024-DIABA.jpg",
    summary: "Mission clôturant l'année 2024 avec un focus sur la santé mentale et le bien-être psychologique. Approche novatrice brisant les tabous locaux.",
    specialties: [
      { name: "Médecine générale", count: 368 },
      { name: "Gériatrie", count: 120 },
      { name: "Pédiatrie", count: 228 },
      { name: "Gynécologie", count: 123 },
      { name: "Psychiatrie", count: 28 },
      { name: "Chirurgie dentaire", count: 72 },
      { name: "Ophtalmologie", count: 68 },
      { name: "Circoncisions", count: 47 }
    ]
  },
  {
    id: "2023-velingara-ferlo",
    year: "2023",
    title: "Village Velingara Ferlo",
    location: "Village Velingara Ferlo",
    date: "2023",
    participants: 0,
    consultations: 1041,
    imageUrl: "/2023-VELEGARA-FERLO.jpg",
    summary: "Mission marquant le début d'une nouvelle ère pour l'ASFO en 2023, axée sur l'innovation technologique et l'amélioration de l'accès aux soins.",
    specialties: [
      { name: "Médecine générale", count: 376 },
      { name: "Gériatrie", count: 138 },
      { name: "Pédiatrie", count: 242 },
      { name: "Gynécologie", count: 75 },
      { name: "Chirurgie dentaire", count: 98 },
      { name: "Circoncisions", count: 112 }
    ]
  },
  {
    id: "2023-barkewi",
    year: "2023",
    title: "Village Barkéwi",
    location: "Village Barkéwi",
    date: "2023",
    participants: 0,
    consultations: 729,
    imageUrl: "/barkewi.webp",
    summary: "Mission médicale centrée sur la santé pédiatrique et la nutrition infantile. Approche spécialisée répondant aux défis sanitaires de la communauté.",
    specialties: [
      { name: "Médecine générale", count: 166 },
      { name: "Gériatrie", count: 69 },
      { name: "Pédiatrie", count: 292 },
      { name: "Gynécologie", count: 78 },
      { name: "Chirurgie dentaire", count: 124 },
      { name: "Circoncisions", count: 0 }
    ]
  },
  {
    id: "2023-aoure",
    year: "2023",
    title: "Village Aouré",
    location: "Village Aouré",
    date: "2023",
    participants: 0,
    consultations: 1076,
    imageUrl: "/aoure.webp",
    summary: "Mission médicale complète avec un focus sur les soins ophtalmologiques et la santé maternelle. Une approche intégrée pour répondre aux besoins diversifiés de la communauté.",
    specialties: [
      { name: "Médecine générale", count: 306 },
      { name: "Pédiatrie", count: 374 },
      { name: "Gynécologie", count: 141 },
      { name: "Ophtalmologie", count: 124 },
      { name: "Chirurgie générale", count: 34 }
    ]
  },
  {
    id: "2023-ndouloumadji-founebe",
    year: "2023",
    title: "Village Ndouloumadji Founébé",
    location: "Village Ndouloumadji Founébé",
    date: "2023",
    participants: 0,
    consultations: 1316,
    imageUrl: "/village-ndouloumadji-founebe.webp",
    summary: "Mission d'envergure avec une forte mobilisation en ophtalmologie et chirurgie générale. Intervention complète touchant tous les groupes d'âge de la communauté.",
    specialties: [
      { name: "Médecine générale", count: 394 },
      { name: "Pédiatrie", count: 214 },
      { name: "Gynécologie", count: 193 },
      { name: "Ophtalmologie", count: 214 },
      { name: "Chirurgie générale", count: 138 }
    ]
  },
  {
    id: "2023-doumga-ouro-alpha",
    year: "2023",
    title: "Village Doumga Ouro Alpha",
    location: "Village Doumga Ouro Alpha",
    date: "2023",
    participants: 0,
    consultations: 1302,
    imageUrl: "/village-doumga-ouro-alpha.webp",
    summary: "Mission remarquable avec une forte concentration en ophtalmologie et médecine générale. Intervention stratégique pour améliorer l'accès aux soins spécialisés.",
    specialties: [
      { name: "Médecine générale", count: 430 },
      { name: "Pédiatrie", count: 247 },
      { name: "Gynécologie", count: 114 },
      { name: "Ophtalmologie", count: 271 },
      { name: "Chirurgie générale", count: 113 }
    ]
  },
  {
    id: "2023-sadel",
    year: "2023",
    title: "Village Sadel",
    location: "Village Sadel",
    date: "2023",
    participants: 0,
    consultations: 1093,
    imageUrl: "/2023-SADEL.jpg",
    summary: "Mission médicale équilibrée avec une intervention chirurgicale importante. Focus sur la chirurgie générale et les soins ophtalmologiques pour la communauté locale.",
    specialties: [
      { name: "Médecine générale", count: 278 },
      { name: "Pédiatrie", count: 165 },
      { name: "Gynécologie", count: 131 },
      { name: "Ophtalmologie", count: 165 },
      { name: "Chirurgie générale", count: 236 }
    ]
  },
  {
    id: "2022-walalde",
    year: "2022",
    title: "Village Walaldé",
    location: "Village Walaldé",
    date: "2022",
    participants: 0,
    consultations: 593,
    imageUrl: "/2022-WALALDE.jpg",
    summary: "Mission médicale complète avec un focus équilibré sur la pédiatrie et la médecine générale. Intervention diversifiée couvrant 10 spécialités médicales pour répondre aux besoins variés de la communauté.",
    specialties: [
      { name: "Médecine générale", count: 208 },
      { name: "Pédiatrie", count: 173 },
      { name: "Gynécologie", count: 75 },
      { name: "Ophtalmologie", count: 70 },
      { name: "Chirurgie générale", count: 57 }
    ]
  },
  {
    id: "2022-bokil-sountoube",
    year: "2022",
    title: "Village Bokil Sountoubé",
    location: "Village Bokil Sountoubé",
    date: "2022",
    participants: 0,
    consultations: 671,
    imageUrl: "/bocke-mbaybe-salsalbe.webp",
    summary: "Mission médicale d'envergure avec une forte mobilisation pédiatrique. Intervention complète couvrant 10 spécialités médicales pour une prise en charge globale de la population.",
    specialties: [
      { name: "Médecine générale", count: 137 },
      { name: "Pédiatrie", count: 192 },
      { name: "Gynécologie", count: 127 },
      { name: "Ophtalmologie", count: 93 },
      { name: "Chirurgie générale", count: 72 }
    ]
  },
  {
    id: "2022-cas-cas",
    year: "2022",
    title: "Village Cas-Cas",
    location: "Village Cas-Cas",
    date: "2022",
    participants: 0,
    consultations: 865,
    imageUrl: "/cas-cas.webp",
    summary: "Mission médicale remarquable avec une forte concentration en médecine générale et pédiatrie. Intervention ophtalmologique importante pour améliorer la santé visuelle de la communauté.",
    specialties: [
      { name: "Médecine générale", count: 256 },
      { name: "Pédiatrie", count: 211 },
      { name: "Gynécologie", count: 126 },
      { name: "Ophtalmologie", count: 169 },
      { name: "Chirurgie générale", count: 103 }
    ]
  },
  {
    id: "2022-marda",
    year: "2022",
    title: "Village Marda",
    location: "Village Marda",
    date: "2022",
    participants: 0,
    consultations: 685,
    imageUrl: "/2022-MARDA.jpg",
    summary: "Mission médicale équilibrée avec un focus sur la médecine générale et la pédiatrie. Intervention adaptée aux besoins spécifiques de la population locale avec des soins gynécologiques et ophtalmologiques.",
    specialties: [
      { name: "Médecine générale", count: 220 },
      { name: "Pédiatrie", count: 213 },
      { name: "Gynécologie", count: 102 },
      { name: "Ophtalmologie", count: 95 },
      { name: "Chirurgie générale", count: 55 }
    ]
  },
  {
    id: "2022-ndiewara",
    year: "2022",
    title: "Village Ndiéwara",
    location: "Village Ndiéwara",
    date: "2022",
    participants: 0,
    consultations: 826,
    imageUrl: "/ndiawara.webp",
    summary: "Mission médicale exceptionnelle avec une forte mobilisation pédiatrique. Intervention complète avec des soins spécialisés couvrant plusieurs domaines médicaux pour la communauté.",
    specialties: [
      { name: "Médecine générale", count: 212 },
      { name: "Pédiatrie", count: 306 },
      { name: "Gynécologie", count: 91 },
      { name: "Ophtalmologie", count: 105 },
      { name: "Chirurgie générale", count: 30 }
    ]
  },
  {
    id: "2022-bocke-mbeybe-sallalbe",
    year: "2022",
    title: "Village Bocké Mbéybé et Sallaobé",
    location: "Village Bocké Mbéybé et Sallaobé",
    date: "2022",
    participants: 0,
    consultations: 681,
    imageUrl: "/bocke-mbaybe-salsalbe.webp",
    summary: "Mission médicale conjointe dans deux villages avec une forte concentration pédiatrique. Intervention coordonnée pour maximiser l'impact sur la santé communautaire des deux localités.",
    specialties: [
      { name: "Médecine générale", count: 184 },
      { name: "Pédiatrie", count: 221 },
      { name: "Gynécologie", count: 133 },
      { name: "Ophtalmologie", count: 79 },
      { name: "Chirurgie générale", count: 23 }
    ]
  },
  {
    id: "2022-diagu-amaly",
    year: "2022",
    title: "Village Diagu Amaly",
    location: "Village Diagu Amaly",
    date: "2022",
    participants: 0,
    consultations: 941,
    imageUrl: "/diaga-awgaly.webp",
    summary: "Mission médicale d'envergure avec près de 1000 consultations. Intervention complète avec une forte mobilisation en médecine générale, pédiatrie et gynécologie pour une prise en charge globale.",
    specialties: [
      { name: "Médecine générale", count: 305 },
      { name: "Pédiatrie", count: 247 },
      { name: "Gynécologie", count: 170 },
      { name: "Ophtalmologie", count: 109 },
      { name: "Chirurgie générale", count: 110 }
    ]
  },
  {
    id: "2021-doudou",
    year: "2021",
    title: "Village Doudou",
    location: "Village Doudou",
    date: "2021",
    participants: 0,
    consultations: 970,
    imageUrl: "/doudou.webp",
    summary: "Mission médicale remarquable avec une forte mobilisation pédiatrique. Intervention complète avec 970 consultations touchant tous les groupes d'âge de la communauté.",
    specialties: [
      { name: "Médecine générale", count: 238 },
      { name: "Pédiatrie", count: 312 },
      { name: "Gynécologie", count: 155 },
      { name: "Ophtalmologie", count: 102 },
      { name: "Chirurgie générale", count: 123 }
    ]
  },
  {
    id: "2021-mboloyel",
    year: "2021",
    title: "Village Mboloyel",
    location: "Village Mboloyel",
    date: "2021",
    participants: 0,
    consultations: 669,
    imageUrl: "/mboloyel.webp",
    summary: "Mission médicale équilibrée avec un focus sur la pédiatrie et la médecine générale. Intervention diversifiée couvrant plusieurs spécialités pour une prise en charge complète.",
    specialties: [
      { name: "Médecine générale", count: 142 },
      { name: "Pédiatrie", count: 247 },
      { name: "Gynécologie", count: 127 },
      { name: "Ophtalmologie", count: 59 },
      { name: "Chirurgie générale", count: 86 }
    ]
  },
  {
    id: "2021-nguidjilone",
    year: "2021",
    title: "Village NGuidjilone",
    location: "Village NGuidjilone",
    date: "2021",
    participants: 0,
    consultations: 471,
    imageUrl: "/nguidjilone.webp",
    summary: "Mission médicale ciblée avec une approche spécialisée en gynécologie et chirurgie générale. Intervention adaptée aux besoins spécifiques de la communauté locale.",
    specialties: [
      { name: "Médecine générale", count: 80 },
      { name: "Pédiatrie", count: 97 },
      { name: "Gynécologie", count: 111 },
      { name: "Ophtalmologie", count: 63 },
      { name: "Chirurgie générale", count: 86 }
    ]
  },
  {
    id: "2021-thilogne",
    year: "2021",
    title: "Village Thilogne",
    location: "Village Thilogne",
    date: "2021",
    participants: 0,
    consultations: 1157,
    imageUrl: "/thilogne.webp",
    summary: "Mission médicale d'envergure avec plus de 1100 consultations. Intervention complète avec une forte mobilisation en médecine générale et pédiatrie pour une couverture sanitaire optimale.",
    specialties: [
      { name: "Médecine générale", count: 382 },
      { name: "Pédiatrie", count: 318 },
      { name: "Gynécologie", count: 203 },
      { name: "Ophtalmologie", count: 127 },
      { name: "Chirurgie générale", count: 94 }
    ]
  },
  {
    id: "2019-dodel",
    year: "2019",
    title: "Village Dodel",
    location: "Village Dodel",
    date: "2019",
    participants: 0,
    consultations: 663,
    imageUrl: "/dodel.webp",
    summary: "Mission médicale équilibrée avec une forte mobilisation en médecine générale et chirurgie dentaire. Intervention adaptée aux besoins spécifiques de la communauté locale avec un focus sur la santé bucco-dentaire.",
    specialties: [
      { name: "Médecine générale", count: 287 },
      { name: "Pédiatrie", count: 183 },
      { name: "Gynécologie", count: 55 },
      { name: "Ophtalmologie", count: 33 },
      { name: "Chirurgie dentaire", count: 105 }
    ]
  },
  {
    id: "2019-decolle-taredji",
    year: "2019",
    title: "Village Décolle Taredji",
    location: "Village Décolle Taredji",
    date: "2019",
    participants: 0,
    consultations: 792,
    imageUrl: "/decole-tareji.webp",
    summary: "Mission médicale d'envergure avec une forte concentration en médecine générale et pédiatrie. Intervention complète avec des soins dentaires importants pour améliorer la santé bucco-dentaire de la communauté.",
    specialties: [
      { name: "Médecine générale", count: 326 },
      { name: "Pédiatrie", count: 236 },
      { name: "Gynécologie", count: 82 },
      { name: "Ophtalmologie", count: 32 },
      { name: "Chirurgie dentaire", count: 106 }
    ]
  },
  {
    id: "2019-fanaye",
    year: "2019",
    title: "Village Fanaye",
    location: "Village Fanaye",
    date: "2019",
    participants: 0,
    consultations: 717,
    imageUrl: "/fanaye.webp",
    summary: "Mission médicale remarquable avec une forte mobilisation en médecine générale et chirurgie dentaire. Intervention prioritaire sur la santé bucco-dentaire avec 134 soins dentaires dispensés.",
    specialties: [
      { name: "Médecine générale", count: 374 },
      { name: "Pédiatrie", count: 148 },
      { name: "Gynécologie", count: 35 },
      { name: "Ophtalmologie", count: 26 },
      { name: "Chirurgie dentaire", count: 134 }
    ]
  },
  {
    id: "2019-ndiouruba",
    year: "2019",
    title: "Village Ndiouruba",
    location: "Village Ndiouruba",
    date: "2019",
    participants: 0,
    consultations: 633,
    imageUrl: "/ndieurba.webp",
    summary: "Mission médicale spécialisée avec une intervention majeure en chirurgie dentaire. Focus particulier sur la santé bucco-dentaire avec 178 soins dentaires, représentant la plus forte mobilisation dentaire de l'année.",
    specialties: [
      { name: "Médecine générale", count: 288 },
      { name: "Pédiatrie", count: 88 },
      { name: "Gynécologie", count: 55 },
      { name: "Ophtalmologie", count: 24 },
      { name: "Chirurgie dentaire", count: 178 }
    ]
  },
  {
    id: "2019-thiangaye",
    year: "2019",
    title: "Village Thiangaye",
    location: "Village Thiangaye",
    date: "2019",
    participants: 0,
    consultations: 623,
    imageUrl: "/thiangaye.webp",
    summary: "Mission médicale équilibrée avec une forte concentration en médecine générale et chirurgie dentaire. Intervention complète touchant tous les groupes d'âge avec un accent sur la santé bucco-dentaire.",
    specialties: [
      { name: "Médecine générale", count: 280 },
      { name: "Pédiatrie", count: 134 },
      { name: "Gynécologie", count: 25 },
      { name: "Ophtalmologie", count: 31 },
      { name: "Chirurgie dentaire", count: 153 }
    ]
  },
  {
    id: "2019-tatki",
    year: "2019",
    title: "Village Tatki",
    location: "Village Tatki",
    date: "2019",
    participants: 0,
    consultations: 632,
    imageUrl: "/tatki-tatki.webp",
    summary: "Mission médicale remarquable avec une forte mobilisation en médecine générale. Intervention équilibrée couvrant plusieurs spécialités avec des soins dentaires et ophtalmologiques adaptés aux besoins locaux.",
    specialties: [
      { name: "Médecine générale", count: 373 },
      { name: "Pédiatrie", count: 128 },
      { name: "Gynécologie", count: 25 },
      { name: "Ophtalmologie", count: 26 },
      { name: "Chirurgie dentaire", count: 80 }
    ]
  },
  {
    id: "2018-polel-diaoube",
    year: "2018",
    title: "Village Polel Diaoubé",
    location: "Village Polel Diaoubé",
    date: "2018",
    participants: 0,
    consultations: 577,
    imageUrl: "/polel-diaoube.webp",
    summary: "Mission médicale ciblée avec une forte concentration en médecine générale et pédiatrie. Intervention adaptée aux besoins spécifiques de la communauté sans intervention dentaire.",
    specialties: [
      { name: "Médecine générale", count: 258 },
      { name: "Pédiatrie", count: 204 },
      { name: "Gynécologie", count: 57 },
      { name: "Ophtalmologie", count: 55 },
      { name: "Chirurgie dentaire", count: 0 }
    ]
  },
  {
    id: "2018-nagano",
    year: "2018",
    title: "Village Nagano",
    location: "Village Nagano",
    date: "2018",
    participants: 0,
    consultations: 828,
    imageUrl: "/nagano.webp",
    summary: "Mission médicale d'envergure avec une forte mobilisation pédiatrique et en médecine générale. Intervention complète avec des soins dentaires importants pour la communauté.",
    specialties: [
      { name: "Médecine générale", count: 279 },
      { name: "Pédiatrie", count: 310 },
      { name: "Gynécologie", count: 91 },
      { name: "Ophtalmologie", count: 55 },
      { name: "Chirurgie dentaire", count: 113 }
    ]
  },
  {
    id: "2018-orkadere",
    year: "2018",
    title: "Village Orkadéré",
    location: "Village Orkadéré",
    date: "2018",
    participants: 0,
    consultations: 563,
    imageUrl: "/slide-3.webp",
    summary: "Mission médicale spécialisée avec un focus remarquable sur l'ophtalmologie. Intervention ciblée répondant aux besoins visuels importants de la communauté sans soins dentaires.",
    specialties: [
      { name: "Médecine générale", count: 215 },
      { name: "Pédiatrie", count: 124 },
      { name: "Gynécologie", count: 78 },
      { name: "Ophtalmologie", count: 146 },
      { name: "Chirurgie dentaire", count: 0 }
    ]
  },
  {
    id: "2018-dounga-rindiaw",
    year: "2018",
    title: "Village Dounga Rindiaw",
    location: "Village Dounga Rindiaw",
    date: "2018",
    participants: 0,
    consultations: 1112,
    imageUrl: "/dounga-rindiaw.webp",
    summary: "Mission médicale majeure avec plus de 1100 consultations. Intervention d'envergure avec une forte mobilisation en médecine générale, pédiatrie et gynécologie pour une couverture sanitaire optimale.",
    specialties: [
      { name: "Médecine générale", count: 435 },
      { name: "Pédiatrie", count: 328 },
      { name: "Gynécologie", count: 217 },
      { name: "Ophtalmologie", count: 127 },
      { name: "Chirurgie dentaire", count: 5 }
    ]
  },
  {
    id: "2018-thiambe",
    year: "2018",
    title: "Village Thiambé",
    location: "Village Thiambé",
    date: "2018",
    participants: 0,
    consultations: 1113,
    imageUrl: "/thiambe.webp",
    summary: "Mission médicale exceptionnelle avec plus de 1100 consultations. Intervention complète avec une forte concentration en médecine générale, pédiatrie et gynécologie, complétée par des soins dentaires.",
    specialties: [
      { name: "Médecine générale", count: 426 },
      { name: "Pédiatrie", count: 313 },
      { name: "Gynécologie", count: 226 },
      { name: "Ophtalmologie", count: 58 },
      { name: "Chirurgie dentaire", count: 90 }
    ]
  },
  {
    id: "2016-gaol",
    year: "2016",
    title: "Village Gaol",
    location: "Village Gaol",
    date: "2016",
    participants: 0,
    consultations: 550,
    imageUrl: "/gaol.webp",
    summary: "Mission médicale équilibrée avec une forte concentration en médecine générale et pédiatrie. Intervention complète avec des soins ophtalmologiques et dentaires adaptés aux besoins de la communauté.",
    specialties: [
      { name: "Médecine générale", count: 133 },
      { name: "Pédiatrie", count: 112 },
      { name: "Gynécologie", count: 63 },
      { name: "Ophtalmologie", count: 84 },
      { name: "Chirurgie dentaire", count: 63 }
    ]
  },
  {
    id: "2016-sadel",
    year: "2016",
    title: "Village Sadel",
    location: "Village Sadel",
    date: "2016",
    participants: 0,
    consultations: 495,
    imageUrl: "/sadel-sadel.webp",
    summary: "Mission médicale spécialisée avec une forte mobilisation en gynécologie et ophtalmologie. Intervention ciblée répondant aux besoins spécifiques de santé reproductive et visuelle de la communauté.",
    specialties: [
      { name: "Médecine générale", count: 76 },
      { name: "Pédiatrie", count: 41 },
      { name: "Gynécologie", count: 137 },
      { name: "Ophtalmologie", count: 124 },
      { name: "Chirurgie dentaire", count: 91 }
    ]
  },
  {
    id: "2016-ndouloumadji",
    year: "2016",
    title: "Village Ndouloumadji",
    location: "Village Ndouloumadji",
    date: "2016",
    participants: 0,
    consultations: 221,
    imageUrl: "/ndouloumadji.webp",
    summary: "Mission médicale ciblée avec un focus remarquable sur l'ophtalmologie. Intervention spécialisée dans une communauté de taille réduite avec des soins visuels prioritaires.",
    specialties: [
      { name: "Médecine générale", count: 39 },
      { name: "Pédiatrie", count: 35 },
      { name: "Gynécologie", count: 41 },
      { name: "Ophtalmologie", count: 69 },
      { name: "Chirurgie dentaire", count: 37 }
    ]
  }
];

const ArchivesPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Set page title
  React.useEffect(() => {
    document.title = 'Archives | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedYear]);

  // Get unique years from archives
  const years = Array.from(new Set(archives.map(archive => archive.year))).sort((a, b) => parseInt(b) - parseInt(a));

  // Filter archives based on selected year and search term
  const filteredArchives = archives.filter(archive => {
    const matchesYear = selectedYear === "" || archive.year === selectedYear;
    const matchesSearch = searchTerm === "" ||
      archive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      archive.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      archive.summary.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesYear && matchesSearch;
  });

  // Group archives by year
  const archivesByYear = filteredArchives.reduce((acc, archive) => {
    if (!acc[archive.year]) {
      acc[archive.year] = [];
    }
    acc[archive.year].push(archive);
    return acc;
  }, {} as Record<string, typeof archives>);

  const handleYearChange = (year: string) => {
    setIsLoading(true);
    setSelectedYear(year);
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700">
        <div className="absolute inset-0 z-0">
          <img
            src="/barre.webp"
            alt="ASFO volunteers"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-700/90 to-teal-500/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Archive className="mr-2" size={16} />
              <span>Nos missions humanitaires</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Archives des Missions
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              Explorez l'historique complet des missions médicales d'ASFO, témoins de notre engagement
              constant auprès des communautés du Fouta depuis plus de deux décennies.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Archive className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-2xl font-bold text-white mb-2">{archives.length}+</h3>
                <p className="text-white/80">Missions réalisées</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Archive className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-2xl font-bold text-white mb-2">{years.length}</h3>
                <p className="text-white/80">Années d'activité</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <TrendingUp className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-2xl font-bold text-white mb-2">25K+</h3>
                <p className="text-white/80">Consultations totales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Archives Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Nos Missions Passées"
            subtitle="Découvrez l'impact de nos actions humanitaires à travers les années, mission par mission"
            center
          />

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une mission, un lieu..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <ArchiveFilters
            years={years}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            totalCount={archives.length}
            filteredCount={filteredArchives.length}
          />

          {/* Loading State */}
          {isLoading ? (
            <ArchiveSkeletonLoader />
          ) : (
            <>
              {/* Archives by Year */}
              {Object.keys(archivesByYear)
                .sort((a, b) => parseInt(b) - parseInt(a))
                .map((year) => (
                  <YearSection
                    key={year}
                    year={year}
                    archives={archivesByYear[year]}
                    initialShowCount={3}
                  />
                ))}

              {/* No Results */}
              {filteredArchives.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Aucune mission trouvée</h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Aucune mission ne correspond à vos critères de recherche.
                    Essayez d'autres filtres ou termes de recherche.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedYear("");
                      setSearchTerm("");
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ArchivesPage;