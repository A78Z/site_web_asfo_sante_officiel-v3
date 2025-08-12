import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Activity, ChevronLeft, Eye, Quote, Star, TrendingUp } from 'lucide-react';
import Button from '../components/common/Button';

// ARCHIVES COMPLÈTES - TOUS LES IDs MAPPÉS
const archives = [
  // ===== 2024 MISSIONS =====
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
    ],
    story: `La mission de Guédé Village 2024 restera gravée dans les mémoires comme l'une des plus réussies de l'ASFO. Avec 1122 consultations réalisées en seulement 5 jours, cette campagne a démontré l'efficacité et le professionnalisme de nos équipes.

L'accueil chaleureux de la population locale et la parfaite coordination entre les différentes spécialités ont permis une prise en charge optimale des patients. Les 241 enfants consultés en pédiatrie témoignent de l'importance accordée à la santé infantile.

Cette mission a également marqué un tournant dans notre approche de la santé mentale, avec 18 consultations psychiatriques qui ont brisé certains tabous locaux.`,
    highlights: [
      "1122 consultations en 5 jours",
      "241 enfants pris en charge",
      "160 soins dentaires réalisés",
      "97 circoncisions dans des conditions optimales",
      "Première intégration significative de la psychiatrie"
    ],
    gallery: [
      "/gv1.webp",
      "/gv2.webp",
      "/gv3.webp",
      "/gv4.webp"
    ],
    testimonials: [
      {
        name: "Mamadou Diallo",
        role: "Chef de village",
        quote: "L'ASFO a apporté l'espoir dans notre communauté. Nos enfants ont reçu des soins qu'ils n'auraient jamais eus ailleurs."
      },
      {
        name: "Dr. Fatou Sow",
        role: "Coordinatrice médicale",
        quote: "Cette mission illustre parfaitement notre engagement. Chaque patient a été traité avec dignité et professionnalisme."
      }
    ],
    impact: "La mission a permis la création d'un comité de santé villageois et l'établissement d'un partenariat durable avec le poste de santé local."
  },

  {
    id: "2024-village-tatqui",
    year: "2024",
    title: "Village Tatqui",
    location: "Village Tatqui",
    date: "2024",
    participants: 0,
    consultations: 1250,
    imageUrl: "/taki.webp",
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
    ],
    story: `La mission de Tatqui 2024 a marqué une nouvelle approche dans nos interventions, privilégiant une prise en charge globale et préventive. Avec 1250 consultations, cette campagne a démontré notre capacité d'adaptation aux besoins spécifiques de chaque communauté.

L'accent mis sur la pédiatrie avec 347 consultations et la gynécologie avec 110 consultations a répondu aux attentes des familles locales. L'intégration de l'ophtalmologie a permis de traiter de nombreux cas de troubles visuels négligés.

Cette mission a également renforcé notre partenariat avec les structures sanitaires locales, créant un modèle de collaboration durable.`,
    highlights: [
      "1250 consultations réalisées",
      "347 enfants suivis en pédiatrie",
      "110 consultations gynécologiques",
      "108 examens ophtalmologiques",
      "Approche holistique de la santé"
    ],
    gallery: [
      "/tekti1.webp",
      "/tekti2.webp",
      "/tekti3.webp",
      "/tekti4.webp"
    ],
    testimonials: [
      {
        name: "Aissatou Diallo",
        role: "Sage-femme",
        quote: "Cette mission a transformé notre approche de la santé maternelle. Les femmes ont enfin accès à des soins de qualité."
      }
    ],
    impact: "La mission a contribué à l'amélioration du plateau technique du centre de santé local et à la formation du personnel."
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
    ],
    story: `La mission de Diattar 2024 a été un laboratoire d'innovation pour l'ASFO. Avec 1242 consultations, elle a permis de tester de nouvelles approches diagnostiques et thérapeutiques.

L'excellence en pédiatrie avec 353 consultations et l'important volet dentaire avec 176 soins ont marqué cette intervention. L'ophtalmologie a également occupé une place centrale avec 127 examens.

Cette mission a servi de modèle pour l'intégration de nouvelles technologies dans nos futures campagnes.`,
    highlights: [
      "1242 patients pris en charge",
      "353 consultations pédiatriques",
      "176 soins dentaires",
      "127 examens ophtalmologiques",
      "Innovation technologique"
    ],
    gallery: [
      "/diatar1.webp",
      "/diatar2.webp",
      "/diatar3.webp",
      "/diatar4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Mamadou Sow",
        role: "Coordinateur médical",
        quote: "Diattar a été un tournant technologique pour nos missions. L'innovation au service de la santé communautaire."
      }
    ],
    impact: "Cette mission a établi de nouveaux standards technologiques et a renforcé nos partenariats avec les institutions de recherche."
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
    ],
    story: `Bodé Lao 2024 restera dans l'histoire comme notre plus grande mission avec 1948 consultations. Cette campagne d'envergure a mobilisé toutes nos ressources et démontré notre capacité d'intervention à grande échelle.

La gynécologie a occupé une place centrale avec 395 consultations, répondant à un besoin criant de la communauté. La pédiatrie avec 377 consultations et l'ophtalmologie avec 225 examens ont complété cette intervention majeure.

Cette mission a marqué un tournant dans notre approche des grandes campagnes médicales.`,
    highlights: [
      "1948 consultations - record 2024",
      "395 consultations gynécologiques",
      "377 enfants pris en charge",
      "225 examens ophtalmologiques",
      "Mobilisation exceptionnelle des équipes"
    ],
    gallery: [
      "/bode1.webp",
      "/bode2.webp",
      "/bode3.webp",
      "/bode4.webp"
    ],
    testimonials: [
      {
        name: "Fatou Ba",
        role: "Présidente des femmes",
        quote: "Jamais nous n'avions vu une telle mobilisation. L'ASFO a transformé notre village pendant une semaine."
      }
    ],
    impact: "Cette mission a établi un nouveau record et a renforcé notre réputation d'organisation capable d'interventions d'envergure."
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
    ],
    story: `Madina Ndiathbé 2024 a été une mission exemplaire avec 1616 consultations, marquée par une approche préventive innovante. La pédiatrie a dominé avec 519 consultations, témoignant de l'importance accordée à la santé infantile.

L'éducation sanitaire a occupé une place centrale, avec des sessions de sensibilisation qui ont touché toute la communauté. Cette approche préventive a complété efficacement les soins curatifs.

Cette mission a servi de modèle pour l'intégration de l'éducation sanitaire dans nos futures interventions.`,
    highlights: [
      "1616 consultations réalisées",
      "519 enfants suivis en pédiatrie",
      "Approche préventive innovante",
      "Sessions d'éducation sanitaire",
      "Mobilisation communautaire exceptionnelle"
    ],
    gallery: [
      "/medina1.webp",
      "/medina2.webp",
      "/medina3.webp",
      "/medina4.webp"
    ],
    testimonials: [
      {
        name: "Ousmane Diallo",
        role: "Chef de village",
        quote: "L'ASFO n'a pas seulement soigné, elle a éduqué. Cette approche préventive changera notre communauté."
      }
    ],
    impact: "Cette mission a établi un modèle d'intervention préventive et a renforcé les capacités locales en éducation sanitaire."
  },

  {
    id: "2024-diaba",
    year: "2024",
    title: "Village Diaba",
    location: "Village Diaba",
    date: "2024",
    participants: 0,
    consultations: 1054,
    imageUrl: "/diaba.webp",
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
    ],
    story: `La mission de Diaba a clôturé l'année 2024 en beauté avec 1054 consultations et une approche novatrice de la santé mentale. Les 28 consultations psychiatriques ont marqué un tournant dans la prise en charge psychologique en milieu rural.

Cette mission a brisé de nombreux tabous autour de la santé mentale et a sensibilisé la communauté à l'importance du bien-être psychologique. L'accueil de la population a été remarquable.

Diaba 2024 restera comme la mission qui a ouvert la voie à une nouvelle approche de la santé mentale dans nos interventions.`,
    highlights: [
      "1054 consultations de clôture",
      "28 consultations psychiatriques",
      "Approche novatrice santé mentale",
      "Bris des tabous psychologiques",
      "Sensibilisation communautaire"
    ],
    gallery: [
      "/1.webp",
      "/2.webp",
      "/3.webp",
      "/4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Aminata Sy",
        role: "Psychiatre",
        quote: "Diaba a ouvert une nouvelle ère. La santé mentale n'est plus un tabou dans cette communauté."
      }
    ],
    impact: "Cette mission a établi les bases d'un suivi psychologique communautaire et a sensibilisé sur l'importance de la santé mentale."
  },

  // ===== 2023 MISSIONS =====
  {
    id: "2023-velingara-ferlo",
    year: "2023",
    title: "Village Velingara Ferlo",
    location: "Village Velingara Ferlo",
    date: "2023",
    participants: 0,
    consultations: 1041,
    imageUrl: "/velingara-ferlo.webp",
    summary: "Mission marquant le début d'une nouvelle ère pour l'ASFO en 2023, axée sur l'innovation technologique et l'amélioration de l'accès aux soins.",
    specialties: [
      { name: "Médecine générale", count: 376 },
      { name: "Gériatrie", count: 138 },
      { name: "Pédiatrie", count: 242 },
      { name: "Gynécologie", count: 75 },
      { name: "Chirurgie dentaire", count: 98 },
      { name: "Circoncisions", count: 112 }
    ],
    story: `Velingara Ferlo a ouvert l'année 2023 avec brio, établissant de nouveaux standards pour nos missions. Cette campagne de 1041 consultations a introduit des innovations technologiques qui ont révolutionné notre approche.

L'utilisation de nouveaux équipements de diagnostic et l'amélioration de notre système de gestion des patients ont permis une efficacité remarquable. La forte mobilisation en pédiatrie (242 consultations) a répondu à un besoin criant de la communauté.

Cette mission a aussi marqué le retour en force de nos activités de circoncision avec 112 interventions réalisées dans des conditions d'hygiène exemplaires.`,
    highlights: [
      "1041 patients consultés",
      "242 enfants pris en charge",
      "112 circoncisions réalisées",
      "Introduction d'équipements de diagnostic modernes",
      "Formation du personnel local aux nouvelles technologies"
    ],
    gallery: [
      "/velingara1.webp",
      "/velingara2.webp",
      "/velingara3.webp",
      "/velingara4.webp"
    ],
    testimonials: [
      {
        name: "Aminata Sy",
        role: "Infirmière chef",
        quote: "Les nouveaux équipements ont transformé notre façon de travailler. Nous pouvons maintenant offrir des diagnostics plus précis."
      }
    ],
    impact: "Cette mission a servi de modèle pour l'intégration technologique dans nos futures campagnes et a renforcé nos partenariats avec les structures sanitaires locales."
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
    ],
    story: `Barkéwi 2023 s'est distinguée par son focus exceptionnel sur la pédiatrie avec 292 consultations sur 729 au total. Cette mission a répondu à un besoin urgent de prise en charge infantile dans cette communauté rurale.

L'approche nutritionnelle a été particulièrement développée, avec des sessions de formation des mères sur l'alimentation infantile. Les soins dentaires ont également occupé une place importante avec 124 interventions.

Cette mission a démontré l'importance d'adapter nos interventions aux besoins spécifiques de chaque communauté.`,
    highlights: [
      "729 consultations spécialisées",
      "292 enfants pris en charge",
      "Focus nutrition infantile",
      "124 soins dentaires",
      "Formation des mères"
    ],
    gallery: [
      "/barkewi1.webp",
      "/barkewi2.webp",
      "/barkewi3.webp",
      "/barkewi4.webp"
    ],
    testimonials: [
      {
        name: "Mariam Diallo",
        role: "Mère de famille",
        quote: "Mes enfants ont reçu des soins exceptionnels. Les conseils nutritionnels ont changé notre façon de nourrir nos petits."
      }
    ],
    impact: "Cette mission a amélioré significativement la prise en charge pédiatrique locale et a renforcé les connaissances nutritionnelles des familles."
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
    ],
    story: `Aouré 2023 a été une mission remarquable avec 1076 consultations, marquée par l'excellence en pédiatrie (374 consultations) et un volet ophtalmologique important (124 examens).

Cette mission a démontré notre capacité à répondre aux besoins diversifiés d'une communauté, alliant soins curatifs et préventifs. L'approche intégrée a permis une prise en charge globale des patients.

L'accueil exceptionnel de la population et la coordination parfaite des équipes ont fait de cette mission un modèle de réussite.`,
    highlights: [
      "1076 consultations intégrées",
      "374 enfants suivis",
      "124 examens ophtalmologiques",
      "Approche holistique",
      "Coordination exemplaire"
    ],
    gallery: [
      "/aoure1.webp",
      "/aoure2.webp",
      "/aoure3.webp",
      "/aoure4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Ousmane Ba",
        role: "Ophtalmologue",
        quote: "Aouré nous a permis de traiter de nombreux cas de cécité évitable. Une mission qui a redonné la vue à plusieurs patients."
      }
    ],
    impact: "Cette mission a considérablement amélioré l'accès aux soins ophtalmologiques et a renforcé le suivi pédiatrique dans la région."
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
    ],
    story: `Ndouloumadji Founébé 2023 a été une mission d'envergure avec 1316 consultations, remarquable par l'équilibre entre toutes les spécialités. L'ophtalmologie a brillé avec 214 examens, égalant presque la pédiatrie.

Cette mission a démontré notre capacité à mobiliser toutes nos compétences pour une intervention complète. La chirurgie générale avec 138 interventions a répondu à des besoins longtemps négligés.

L'organisation exemplaire et l'engagement de toutes les équipes ont fait de cette mission une référence.`,
    highlights: [
      "1316 consultations d'envergure",
      "214 examens ophtalmologiques",
      "138 interventions chirurgicales",
      "Équilibre parfait des spécialités",
      "Organisation exemplaire"
    ],
    gallery: [
      "/ndouloumadji1.webp",
      "/ndouloumadji2.webp",
      "/ndouloumadji3.webp",
      "/ndouloumadji4.webp"
    ],
    testimonials: [
      {
        name: "Ibrahima Sow",
        role: "Notable du village",
        quote: "Cette mission restera gravée dans nos mémoires. L'ASFO a transformé notre village pendant une semaine."
      }
    ],
    impact: "Cette mission a établi un nouveau standard d'intervention complète et a renforcé durablement les capacités sanitaires locales."
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
    ],
    story: `Doumga Ouro Alpha 2023 a été exceptionnelle avec 1302 consultations, dominée par la médecine générale (430) et l'ophtalmologie (271). Cette mission a répondu à un besoin crucial en soins visuels dans cette région.

L'expertise ophtalmologique déployée a permis de traiter de nombreux cas de cécité évitable et de troubles visuels négligés. La coordination avec les autres spécialités a assuré une prise en charge globale.

Cette mission a marqué un tournant dans notre approche des soins ophtalmologiques en milieu rural.`,
    highlights: [
      "1302 consultations stratégiques",
      "271 examens ophtalmologiques",
      "430 consultations généralistes",
      "Lutte contre la cécité évitable",
      "Expertise ophtalmologique déployée"
    ],
    gallery: [
      "/doumga1.webp",
      "/doumga2.webp",
      "/doumga3.webp",
      "/doumga4.webp"
    ],
    testimonials: [
      {
        name: "Fatou Diallo",
        role: "Patiente",
        quote: "J'ai retrouvé la vue grâce à l'ASFO. Cette mission a changé ma vie et celle de ma famille."
      }
    ],
    impact: "Cette mission a considérablement réduit les cas de cécité évitable dans la région et a établi un suivi ophtalmologique durable."
  },

  {
    id: "2023-sadel",
    year: "2023",
    title: "Village Sadel",
    location: "Village Sadel",
    date: "2023",
    participants: 0,
    consultations: 1093,
    imageUrl: "/Sadel.webp",
    summary: "Mission médicale équilibrée avec une intervention chirurgicale importante. Focus sur la chirurgie générale et les soins ophtalmologiques pour la communauté locale.",
    specialties: [
      { name: "Médecine générale", count: 278 },
      { name: "Pédiatrie", count: 165 },
      { name: "Gynécologie", count: 131 },
      { name: "Ophtalmologie", count: 165 },
      { name: "Chirurgie générale", count: 236 }
    ],
    story: `Sadel 2023 s'est distinguée par une intervention chirurgicale majeure avec 236 interventions sur 1093 consultations totales. Cette mission a répondu à un besoin urgent en chirurgie de base dans cette communauté isolée.

L'équilibre entre chirurgie et ophtalmologie (165 examens) a permis de traiter des pathologies longtemps négligées. L'organisation logistique a été exemplaire pour supporter ces interventions complexes.

Cette mission a démontré notre capacité à mener des interventions chirurgicales d'envergure en milieu rural.`,
    highlights: [
      "1093 consultations équilibrées",
      "236 interventions chirurgicales",
      "165 examens ophtalmologiques",
      "Chirurgie de base en milieu rural",
      "Logistique chirurgicale exemplaire"
    ],
    gallery: [
      "/sadel1.webp",
      "/sadel2.webp",
      "/sadel3.webp",
      "/sadel4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Mamadou Diop",
        role: "Chirurgien",
        quote: "Sadel nous a permis de réaliser des interventions qui ont changé la vie de nombreux patients. Une mission chirurgicale mémorable."
      }
    ],
    impact: "Cette mission a établi un modèle d'intervention chirurgicale en milieu rural et a formé le personnel local aux techniques chirurgicales de base."
  },

  // ===== 2022 MISSIONS =====
  {
    id: "2022-walalde",
    year: "2022",
    title: "Village Walaldé",
    location: "Village Walaldé",
    date: "2022",
    participants: 0,
    consultations: 593,
    imageUrl: "/walalde.webp",
    summary: "Mission médicale complète avec un focus équilibré sur la pédiatrie et la médecine générale. Intervention diversifiée couvrant 10 spécialités médicales pour répondre aux besoins variés de la communauté.",
    specialties: [
      { name: "Médecine générale", count: 208 },
      { name: "Pédiatrie", count: 173 },
      { name: "Gynécologie", count: 75 },
      { name: "Ophtalmologie", count: 70 },
      { name: "Chirurgie générale", count: 57 }
    ],
    story: `La mission de Walaldé en 2022 a été remarquable par son approche holistique de la santé communautaire. Avec 593 consultations réparties sur 10 spécialités, elle a démontré notre capacité d'adaptation aux besoins locaux.

L'équilibre entre médecine générale (208 consultations) et pédiatrie (173 consultations) a permis une prise en charge intergénérationnelle efficace. Les 70 consultations ophtalmologiques ont répondu à un besoin longtemps négligé dans cette zone rurale.

Cette mission a également renforcé notre partenariat avec les autorités sanitaires locales, créant un modèle de collaboration durable.`,
    highlights: [
      "593 consultations multispécialisées",
      "173 enfants suivis en pédiatrie",
      "70 examens ophtalmologiques",
      "57 interventions chirurgicales",
      "Collaboration renforcée avec les structures locales"
    ],
    gallery: [
      "/walalde1.webp",
      "/walalde2.webp",
      "/walalde3.webp",
      "/walalde4.webp"
    ],
    testimonials: [
      {
        name: "Ousmane Ba",
        role: "Maire de Walaldé",
        quote: "Cette mission a marqué un tournant pour notre commune. L'ASFO a apporté des soins de qualité que nos populations méritent."
      }
    ],
    impact: "La mission a contribué à l'amélioration du plateau technique du poste de santé local et à la formation continue du personnel."
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
    ],
    story: `Bokil Sountoubé 2022 s'est distinguée par sa forte mobilisation pédiatrique avec 192 consultations sur 671 au total. Cette mission a répondu aux besoins urgents de santé infantile dans cette communauté rurale.

L'approche multispécialisée a permis une prise en charge complète, avec un volet gynécologique important (127 consultations) et des interventions chirurgicales significatives (72 actes).

Cette mission a renforcé notre réputation d'organisation capable d'interventions complètes et adaptées aux besoins locaux.`,
    highlights: [
      "671 consultations complètes",
      "192 enfants pris en charge",
      "127 consultations gynécologiques",
      "72 interventions chirurgicales",
      "Approche multispécialisée"
    ],
    gallery: [
      "/bokil1.webp",
      "/bokil2.webp",
      "/bokil3.webp",
      "/bokil4.webp"
    ],
    testimonials: [
      {
        name: "Aissatou Sy",
        role: "Sage-femme",
        quote: "Cette mission a transformé notre approche de la santé maternelle et infantile. Un impact durable sur notre communauté."
      }
    ],
    impact: "Cette mission a amélioré significativement la prise en charge pédiatrique et gynécologique dans la région."
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
    ],
    story: `Cas-Cas 2022 a été une mission remarquable avec 865 consultations, marquée par l'excellence en médecine générale (256) et pédiatrie (211). L'intervention ophtalmologique avec 169 examens a été particulièrement significative.

Cette mission a démontré notre capacité à combiner soins de base et spécialisés pour une prise en charge optimale. L'accueil exceptionnel de la communauté a facilité le travail des équipes.

L'impact sur la santé visuelle de la population a été particulièrement notable, avec de nombreux cas traités avec succès.`,
    highlights: [
      "865 consultations remarquables",
      "256 consultations généralistes",
      "211 enfants suivis",
      "169 examens ophtalmologiques",
      "Impact notable sur la santé visuelle"
    ],
    gallery: [
      "/cas1.webp",
      "/cas2.webp",
      "/cas3.webp",
      "/cas4.webp"
    ],
    testimonials: [
      {
        name: "Mamadou Diallo",
        role: "Chef de village",
        quote: "L'ASFO a redonné la vue à plusieurs membres de notre communauté. Une mission qui restera gravée dans nos mémoires."
      }
    ],
    impact: "Cette mission a considérablement amélioré la santé visuelle de la communauté et a renforcé l'accès aux soins de base."
  },

  {
    id: "2022-marda",
    year: "2022",
    title: "Village Marda",
    location: "Village Marda",
    date: "2022",
    participants: 0,
    consultations: 685,
    imageUrl: "/marda.webp",
    summary: "Mission médicale équilibrée avec un focus sur la médecine générale et la pédiatrie. Intervention adaptée aux besoins spécifiques de la population locale avec des soins gynécologiques et ophtalmologiques.",
    specialties: [
      { name: "Médecine générale", count: 220 },
      { name: "Pédiatrie", count: 213 },
      { name: "Gynécologie", count: 102 },
      { name: "Ophtalmologie", count: 95 },
      { name: "Chirurgie générale", count: 55 }
    ],
    story: `Marda 2022 a été une mission parfaitement équilibrée avec 685 consultations, remarquable par l'harmonie entre médecine générale (220) et pédiatrie (213). Cette mission a répondu aux besoins essentiels de la communauté.

L'approche intégrée a permis une prise en charge complète des familles, avec des soins gynécologiques (102) et ophtalmologiques (95) qui ont complété l'offre de soins.

Cette mission a servi de modèle pour l'équilibre optimal entre les différentes spécialités médicales.`,
    highlights: [
      "685 consultations équilibrées",
      "220 consultations généralistes",
      "213 enfants pris en charge",
      "Équilibre optimal des spécialités",
      "Prise en charge familiale complète"
    ],
    gallery: [
      "/marda1.webp",
      "/marda2.webp",
      "/marda3.webp",
      "/marda4.webp"
    ],
    testimonials: [
      {
        name: "Fatou Ba",
        role: "Présidente des femmes",
        quote: "Cette mission a touché toutes les familles de notre village. L'ASFO a su répondre à tous nos besoins de santé."
      }
    ],
    impact: "Cette mission a établi un modèle d'intervention équilibrée et a renforcé la confiance de la communauté envers l'ASFO."
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
    ],
    story: `Ndiéwara 2022 a été exceptionnelle avec 826 consultations, dominée par une mobilisation pédiatrique remarquable de 306 consultations. Cette mission a répondu à un besoin urgent de santé infantile.

L'expertise pédiatrique déployée a permis de traiter de nombreux cas complexes et de sensibiliser les familles aux bonnes pratiques de santé infantile. L'impact sur la communauté a été immédiat et durable.

Cette mission a démontré notre capacité à adapter nos interventions aux besoins spécifiques identifiés sur le terrain.`,
    highlights: [
      "826 consultations exceptionnelles",
      "306 enfants pris en charge",
      "Expertise pédiatrique déployée",
      "Sensibilisation des familles",
      "Impact immédiat et durable"
    ],
    gallery: [
      "/ndiewara1.webp",
      "/ndiewara2.webp",
      "/ndiewara3.webp",
      "/ndiewara4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Aminata Diop",
        role: "Pédiatre",
        quote: "Ndiéwara a été une mission pédiatrique mémorable. Nous avons pu sauver de nombreux enfants et former les parents."
      }
    ],
    impact: "Cette mission a considérablement amélioré la santé infantile dans la région et a renforcé les compétences parentales en santé."
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
    ],
    story: `La mission conjointe Bocké Mbéybé et Sallaobé 2022 a été innovante avec 681 consultations réparties sur deux villages. Cette approche coordonnée a maximisé l'impact avec une forte concentration pédiatrique (221 consultations).

La logistique complexe de cette double intervention a été parfaitement maîtrisée, permettant une prise en charge optimale dans les deux communautés. L'approche gynécologique (133 consultations) a complété l'offre de soins.

Cette mission a établi un modèle d'intervention multi-sites qui a inspiré nos futures campagnes.`,
    highlights: [
      "681 consultations bi-sites",
      "221 enfants pris en charge",
      "133 consultations gynécologiques",
      "Innovation logistique",
      "Modèle d'intervention multi-sites"
    ],
    gallery: [
      "/bocke1.webp",
      "/bocke2.webp",
      "/bocke3.webp",
      "/bocke4.webp"
    ],
    testimonials: [
      {
        name: "Ousmane Sy",
        role: "Coordinateur logistique",
        quote: "Cette mission double a été un défi logistique relevé avec succès. Un modèle pour nos futures interventions."
      }
    ],
    impact: "Cette mission a établi un modèle d'intervention coordonnée multi-sites et a renforcé la coopération inter-villages."
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
    ],
    story: `Diagu Amaly 2022 a été une mission d'envergure avec 941 consultations, remarquable par l'équilibre parfait entre toutes les spécialités. La médecine générale (305) a dominé, soutenue par une pédiatrie forte (247) et une gynécologie importante (170).

Cette mission a démontré notre maturité organisationnelle et notre capacité à mener des interventions complètes de grande envergure. L'impact sur la communauté a été exceptionnel.

L'harmonie entre toutes les équipes et l'accueil remarquable de la population ont fait de cette mission une référence.`,
    highlights: [
      "941 consultations d'envergure",
      "305 consultations généralistes",
      "247 enfants suivis",
      "170 consultations gynécologiques",
      "Équilibre parfait des spécialités"
    ],
    gallery: [
      "/diagu1.webp",
      "/diagu2.webp",
      "/diagu3.webp",
      "/diagu4.webp"
    ],
    testimonials: [
      {
        name: "Ibrahima Diallo",
        role: "Notable",
        quote: "Cette mission a marqué notre village. L'ASFO a montré son professionnalisme et son engagement envers notre communauté."
      }
    ],
    impact: "Cette mission a établi un nouveau standard d'intervention d'envergure et a renforcé durablement les capacités sanitaires locales."
  },

  // ===== 2021 MISSIONS =====
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
    ],
    story: `La mission de Doudou 2021 a été remarquable avec 970 consultations, dominée par une mobilisation pédiatrique exceptionnelle de 312 consultations. Cette mission a répondu à un besoin urgent de santé infantile dans cette communauté isolée.

L'expertise pédiatrique déployée a permis de traiter de nombreux cas de malnutrition et de maladies infantiles courantes. L'approche préventive a été particulièrement développée avec des sessions d'éducation sanitaire.

Cette mission a marqué un tournant dans notre approche de la santé infantile en milieu rural, établissant de nouveaux protocoles de prise en charge.`,
    highlights: [
      "970 consultations remarquables",
      "312 enfants pris en charge",
      "Lutte contre la malnutrition",
      "Sessions d'éducation sanitaire",
      "Nouveaux protocoles pédiatriques"
    ],
    gallery: [
      "/doudou1.webp",
      "/doudou2.webp",
      "/doudou3.webp",
      "/doudou4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Mariam Sy",
        role: "Pédiatre coordinatrice",
        quote: "Doudou a été une mission pédiatrique exceptionnelle. Nous avons pu sauver de nombreux enfants malnutris et former les mères."
      },
      {
        name: "Aminata Ba",
        role: "Mère de famille",
        quote: "Mes trois enfants ont été soignés avec tant de soin. L'ASFO a sauvé ma famille."
      }
    ],
    impact: "Cette mission a considérablement réduit la mortalité infantile dans la région et a établi un programme de suivi nutritionnel durable."
  },

  {
    id: "2021-mboloyel",
    year: "2021",
    title: "Mission Médicale à Mboloyel",
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
    ],
    story: `La mission de Mboloyel 2021 s'est distinguée par son approche équilibrée. Avec 669 consultations, elle a répondu aux besoins essentiels de la population, notamment en pédiatrie et médecine générale.

Malgré un effectif limité, l'équipe médicale a su maintenir un bon niveau de qualité et de coordination. Les interventions chirurgicales ont également été nombreuses, traduisant une organisation efficace sur le terrain.

Cette mission a renforcé la confiance de la communauté envers les actions de l'ASFO, et a contribué à améliorer l'accès aux soins dans cette zone rurale.`,
    highlights: [
      "669 consultations en 5 jours",
      "247 enfants pris en charge",
      "86 actes chirurgicaux réalisés",
      "Intervention dans un village à fort besoin pédiatrique",
      "Approche multiservices bien répartie"
    ],
    gallery: [
      "/mboloyel1.webp",
      "/mboloyel2.webp",
      "/mboloyel3.webp",
      "/mboloyel4.webp"
    ],
    testimonials: [
      {
        name: "Fatoumata Diallo",
        role: "Infirmière locale",
        quote: "L'ASFO a apporté un grand soulagement aux familles ici. Les enfants ont été bien suivis et les mamans rassurées."
      },
      {
        name: "Dr. Ousmane Sy",
        role: "Médecin coordinateur",
        quote: "Malgré des conditions modestes, la mission a été bien menée. L'esprit d'équipe a fait toute la différence."
      }
    ],
    impact: "La mission de Mboloyel a permis de renforcer les capacités du personnel local et a encouragé la création d'un poste de santé plus structuré."
  },

  {
    id: "2021-nguidjilone",
    year: "2021",
    title: "Mission Médicale à NGuidjilone",
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
    ],
    story: `La mission de NGuidjilone a été pensée pour répondre aux besoins spécifiques d'une communauté à forte demande en santé de la femme et en chirurgie de base.

Avec 471 consultations, l'équipe a priorisé la qualité à la quantité. Les pathologies gynécologiques ont été identifiées et traitées avec professionnalisme.

Cette mission a aussi renforcé les compétences du personnel local en matière de suivi gynécologique, notamment grâce à des sessions de formation sur place.`,
    highlights: [
      "471 patients consultés",
      "111 femmes examinées en gynécologie",
      "86 actes chirurgicaux simples réalisés",
      "Suivi ophtalmologique adapté",
      "Impact direct sur la santé maternelle"
    ],
    gallery: [
      "/nguidjilone1.webp",
      "/nguidjilone2.webp",
      "/nguidjilone3.webp",
      "/nguidjilone4.webp"
    ],
    testimonials: [
      {
        name: "Aissatou Ba",
        role: "Sage-femme volontaire",
        quote: "Les femmes ont eu accès à des soins qu'elles n'avaient jamais eus. Cette mission a changé des vies."
      }
    ],
    impact: "La mission a permis de sensibiliser sur la santé maternelle et de poser les bases d'un suivi gynécologique continu dans le village."
  },

  {
    id: "2021-thilogne",
    year: "2021",
    title: "Mission Médicale à Thilogne",
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
    ],
    story: `Avec 1 157 consultations, la mission de Thilogne a été l'une des plus importantes de l'année 2021. Elle a permis une prise en charge massive et structurée.

Toutes les spécialités étaient mobilisées, avec une forte présence en pédiatrie et médecine générale. L'accueil de la population a été remarquable et l'organisation sans faille.

Cette mission a renforcé la crédibilité de l'ASFO dans la région et démontré sa capacité à intervenir à grande échelle.`,
    highlights: [
      "1157 patients pris en charge",
      "318 enfants consultés en pédiatrie",
      "382 consultations en médecine générale",
      "94 interventions chirurgicales",
      "Couverture sanitaire exhaustive sur 5 jours"
    ],
    gallery: [
      "/thilogne1.webp",
      "/thilogne2.webp",
      "/thilogne3.webp",
      "/thilogne4.webp"
    ],
    testimonials: [
      {
        name: "Ibrahima Sow",
        role: "Responsable communautaire",
        quote: "Nous avons été honorés par la qualité des soins. L'équipe ASFO mérite toute notre reconnaissance."
      },
      {
        name: "Dr. Awa Diop",
        role: "Pédiatre bénévole",
        quote: "Thilogne a été intense mais gratifiant. Voir autant d'enfants pris en charge est une fierté."
      }
    ],
    impact: "La mission a permis la mise en place d'un système de suivi médical communautaire et l'ouverture d'un poste de santé secondaire à Thilogne."
  },

  // ===== 2019 MISSIONS =====
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
    ],
    story: `Dodel 2019 s'est distinguée par son focus remarquable sur la santé bucco-dentaire avec 105 interventions dentaires sur 663 consultations totales. Cette mission a répondu à un besoin longtemps négligé dans cette communauté rurale.

L'équilibre entre médecine générale (287) et pédiatrie (183) a assuré une prise en charge complète des familles. L'expertise dentaire déployée a permis de traiter de nombreux cas de pathologies bucco-dentaires.

Cette mission a établi un modèle d'intervention dentaire en milieu rural qui a inspiré nos futures campagnes.`,
    highlights: [
      "663 consultations équilibrées",
      "287 consultations généralistes",
      "105 soins dentaires",
      "Focus santé bucco-dentaire",
      "Modèle d'intervention dentaire rurale"
    ],
    gallery: [
      "/dodel1.webp",
      "/dodel2.webp",
      "/dodel3.webp",
      "/dodel4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Mamadou Diop",
        role: "Chirurgien-dentiste",
        quote: "Dodel nous a permis de traiter des pathologies dentaires sévères. Une mission dentaire mémorable."
      }
    ],
    impact: "Cette mission a considérablement amélioré la santé bucco-dentaire de la communauté et a sensibilisé sur l'hygiène dentaire."
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
    ],
    story: `Décolle Taredji 2019 a été une mission d'envergure avec 792 consultations, dominée par la médecine générale (326) et la pédiatrie (236). L'intervention dentaire avec 106 soins a complété cette prise en charge globale.

Cette mission a démontré notre capacité à combiner soins de base et spécialisés pour une intervention complète. L'accueil exceptionnel de la communauté a facilité le travail des équipes.

L'impact sur la santé générale et bucco-dentaire de la population a été particulièrement notable.`,
    highlights: [
      "792 consultations d'envergure",
      "326 consultations généralistes",
      "236 enfants pris en charge",
      "106 soins dentaires",
      "Prise en charge globale"
    ],
    gallery: [
      "/decolle1.webp",
      "/decolle2.webp",
      "/decolle3.webp",
      "/decolle4.webp"
    ],
    testimonials: [
      {
        name: "Fatou Sy",
        role: "Présidente des femmes",
        quote: "Cette mission a touché toutes les familles. L'ASFO a apporté des soins complets à notre communauté."
      }
    ],
    impact: "Cette mission a établi un modèle d'intervention complète et a renforcé l'accès aux soins de base et spécialisés."
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
    ],
    story: `Fanaye 2019 s'est distinguée par une intervention dentaire majeure avec 134 soins sur 717 consultations totales. Cette mission a répondu à un besoin urgent en santé bucco-dentaire dans cette communauté isolée.

La médecine générale a dominé avec 374 consultations, soutenue par une pédiatrie significative (148). L'expertise dentaire déployée a permis de traiter des pathologies complexes longtemps négligées.

Cette mission a établi un record en matière de soins dentaires et a sensibilisé la population à l'hygiène bucco-dentaire.`,
    highlights: [
      "717 consultations remarquables",
      "374 consultations généralistes",
      "134 soins dentaires - record",
      "Expertise dentaire déployée",
      "Sensibilisation hygiène bucco-dentaire"
    ],
    gallery: [
      "/fanaye1.webp",
      "/fanaye2.webp",
      "/fanaye3.webp",
      "/fanaye4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Ousmane Ba",
        role: "Chirurgien-dentiste",
        quote: "Fanaye a été notre plus grande intervention dentaire. Nous avons pu sauver de nombreuses dentitions."
      }
    ],
    impact: "Cette mission a révolutionné la santé bucco-dentaire de la région et a établi un programme de suivi dentaire durable."
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
    ],
    story: `Ndiouruba 2019 restera dans l'histoire comme notre plus grande intervention dentaire avec 178 soins sur 633 consultations. Cette mission spécialisée a répondu à une demande exceptionnelle en santé bucco-dentaire.

L'expertise dentaire mobilisée a permis de traiter des cas complexes et de former le personnel local aux techniques de base. Cette intervention a transformé l'approche de la santé bucco-dentaire dans la région.

Cette mission a établi un nouveau record et a démontré notre capacité d'intervention spécialisée en milieu rural.`,
    highlights: [
      "633 consultations spécialisées",
      "178 soins dentaires - record absolu",
      "Expertise dentaire exceptionnelle",
      "Formation du personnel local",
      "Transformation de l'approche dentaire"
    ],
    gallery: [
      "/ndiouruba1.webp",
      "/ndiouruba2.webp",
      "/ndiouruba3.webp",
      "/ndiouruba4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Aminata Diallo",
        role: "Coordinatrice dentaire",
        quote: "Ndiouruba a été notre mission dentaire la plus ambitieuse. Un succès qui a marqué toute la région."
      }
    ],
    impact: "Cette mission a révolutionné la santé bucco-dentaire régionale et a établi un centre de référence dentaire local."
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
    ],
    story: `Thiangaye 2019 a été une mission équilibrée avec 623 consultations, remarquable par la combinaison médecine générale (280) et chirurgie dentaire (153). Cette approche a permis une prise en charge complète de la population.

L'intervention dentaire significative a complété les soins de base, répondant aux besoins diversifiés de la communauté. L'organisation exemplaire a permis une efficacité optimale.

Cette mission a servi de modèle pour l'équilibre entre soins de base et spécialisés.`,
    highlights: [
      "623 consultations équilibrées",
      "280 consultations généralistes",
      "153 soins dentaires",
      "Approche complète",
      "Modèle d'équilibre soins de base/spécialisés"
    ],
    gallery: [
      "/thiangaye1.webp",
      "/thiangaye2.webp",
      "/thiangaye3.webp",
      "/thiangaye4.webp"
    ],
    testimonials: [
      {
        name: "Mamadou Sy",
        role: "Chef de village",
        quote: "L'ASFO a apporté des soins complets à notre communauté. Une mission parfaitement équilibrée."
      }
    ],
    impact: "Cette mission a établi un modèle d'intervention équilibrée et a renforcé l'accès aux soins complets."
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
    ],
    story: `Tatki 2019 s'est distinguée par une forte mobilisation en médecine générale avec 373 consultations sur 632 au total. Cette mission a répondu aux besoins essentiels de santé de base de la communauté.

L'approche équilibrée a permis de couvrir tous les besoins, avec des interventions dentaires (80) et ophtalmologiques (26) qui ont complété l'offre de soins. La pédiatrie (128) a assuré le suivi des enfants.

Cette mission a démontré l'importance des soins de base dans nos interventions communautaires.`,
    highlights: [
      "632 consultations remarquables",
      "373 consultations généralistes",
      "128 enfants suivis",
      "Soins de base prioritaires",
      "Approche communautaire équilibrée"
    ],
    gallery: [
      "/tatki1.webp",
      "/tatki2.webp",
      "/tatki3.webp",
      "/tatki4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Fatou Diallo",
        role: "Médecin généraliste",
        quote: "Tatki a montré l'importance des soins de base. Une mission qui a touché toute la communauté."
      }
    ],
    impact: "Cette mission a renforcé l'accès aux soins de base et a établi un modèle de médecine générale communautaire."
  },

  // ===== 2018 MISSIONS =====
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
    ],
    story: `Polel Diaoubé 2018 a été une mission ciblée avec 577 consultations, focalisée sur les soins essentiels. L'équilibre entre médecine générale (258) et pédiatrie (204) a permis une prise en charge intergénérationnelle efficace.

Cette mission s'est adaptée aux besoins spécifiques identifiés, privilégiant les soins de base et le suivi pédiatrique. L'absence d'intervention dentaire a permis de concentrer les efforts sur les pathologies prioritaires.

Cette approche ciblée a démontré notre capacité d'adaptation aux besoins locaux spécifiques.`,
    highlights: [
      "577 consultations ciblées",
      "258 consultations généralistes",
      "204 enfants pris en charge",
      "Approche adaptée aux besoins",
      "Focus sur les soins essentiels"
    ],
    gallery: [
      "/polel1.webp",
      "/polel2.webp",
      "/polel3.webp",
      "/polel4.webp"
    ],
    testimonials: [
      {
        name: "Aissatou Diallo",
        role: "Infirmière locale",
        quote: "Cette mission a répondu exactement à nos besoins. L'ASFO a su s'adapter à notre réalité."
      }
    ],
    impact: "Cette mission a démontré l'importance de l'adaptation aux besoins locaux et a renforcé les soins de base."
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
    ],
    story: `Nagano 2018 a été une mission d'envergure avec 828 consultations, dominée par une mobilisation pédiatrique exceptionnelle de 310 consultations. Cette mission a répondu à un besoin urgent de santé infantile.

L'équilibre avec la médecine générale (279) et l'intervention dentaire significative (113) ont permis une prise en charge complète de toute la communauté. L'organisation exemplaire a assuré une efficacité optimale.

Cette mission a établi un modèle d'intervention pédiatrique d'envergure qui a inspiré nos futures campagnes.`,
    highlights: [
      "828 consultations d'envergure",
      "310 enfants pris en charge",
      "279 consultations généralistes",
      "113 soins dentaires",
      "Modèle d'intervention pédiatrique"
    ],
    gallery: [
      "/nagano1.webp",
      "/nagano2.webp",
      "/nagano3.webp",
      "/nagano4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Mariam Ba",
        role: "Pédiatre",
        quote: "Nagano a été une mission pédiatrique mémorable. Nous avons pu sauver de nombreux enfants."
      }
    ],
    impact: "Cette mission a considérablement amélioré la santé infantile dans la région et a établi un programme de suivi pédiatrique."
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
    ],
    story: `Orkadéré 2018 s'est distinguée par une intervention ophtalmologique majeure avec 146 examens sur 563 consultations totales. Cette mission spécialisée a répondu à un besoin urgent en soins visuels dans cette communauté isolée.

L'expertise ophtalmologique déployée a permis de traiter de nombreux cas de cécité évitable et de troubles visuels négligés. Cette approche ciblée a transformé la santé visuelle de la population.

Cette mission a établi un modèle d'intervention ophtalmologique spécialisée en milieu rural.`,
    highlights: [
      "563 consultations spécialisées",
      "146 examens ophtalmologiques",
      "Lutte contre la cécité évitable",
      "Expertise ophtalmologique déployée",
      "Transformation de la santé visuelle"
    ],
    gallery: [
      "/orkadere1.webp",
      "/orkadere2.webp",
      "/orkadere3.webp",
      "/orkadere4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Ousmane Sy",
        role: "Ophtalmologue",
        quote: "Orkadéré nous a permis de redonner la vue à de nombreux patients. Une mission ophtalmologique exceptionnelle."
      }
    ],
    impact: "Cette mission a révolutionné la santé visuelle de la région et a établi un centre de référence ophtalmologique."
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
    ],
    story: `Dounga Rindiaw 2018 a été une mission majeure avec 1112 consultations, remarquable par l'équilibre parfait entre médecine générale (435), pédiatrie (328) et gynécologie (217). Cette intervention d'envergure a assuré une couverture sanitaire optimale.

Cette mission a démontré notre maturité organisationnelle et notre capacité à mener des interventions complètes de grande envergure. L'impact sur la communauté a été exceptionnel et durable.

L'harmonie entre toutes les équipes et l'accueil remarquable de la population ont fait de cette mission une référence absolue.`,
    highlights: [
      "1112 consultations majeures",
      "435 consultations généralistes",
      "328 enfants pris en charge",
      "217 consultations gynécologiques",
      "Couverture sanitaire optimale"
    ],
    gallery: [
      "/dounga1.webp",
      "/dounga2.webp",
      "/dounga3.webp",
      "/dounga4.webp"
    ],
    testimonials: [
      {
        name: "Ibrahima Diallo",
        role: "Chef de village",
        quote: "Cette mission restera gravée dans l'histoire de notre village. L'ASFO a transformé notre communauté."
      }
    ],
    impact: "Cette mission a établi un nouveau standard d'intervention d'envergure et a créé un modèle de couverture sanitaire optimale."
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
    ],
    story: `Thiambé 2018 a été exceptionnelle avec 1113 consultations, couronnant l'année par une intervention complète remarquable. L'équilibre parfait entre médecine générale (426), pédiatrie (313) et gynécologie (226) a assuré une prise en charge globale.

Cette mission a démontré notre excellence opérationnelle et notre capacité à maintenir la qualité malgré l'envergure. L'ajout des soins dentaires (90) a complété cette intervention exemplaire.

Thiambé 2018 restera comme l'une de nos missions les plus accomplies, établissant de nouveaux standards d'excellence.`,
    highlights: [
      "1113 consultations exceptionnelles",
      "426 consultations généralistes",
      "313 enfants pris en charge",
      "226 consultations gynécologiques",
      "Excellence opérationnelle démontrée"
    ],
    gallery: [
      "/thiambe1.webp",
      "/thiambe2.webp",
      "/thiambe3.webp",
      "/thiambe4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Aminata Sow",
        role: "Coordinatrice générale",
        quote: "Thiambé a été le couronnement de 2018. Une mission d'excellence qui restera dans nos annales."
      }
    ],
    impact: "Cette mission a établi de nouveaux standards d'excellence et a créé un modèle d'intervention complète de référence."
  },

  // ===== 2016 MISSIONS =====
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
    ],
    story: `Gaol 2016 a été une mission équilibrée avec 550 consultations, remarquable par la diversité des spécialités mobilisées. L'équilibre entre médecine générale (133) et pédiatrie (112) a assuré une prise en charge intergénérationnelle.

L'intervention ophtalmologique significative (84 examens) et les soins dentaires (63) ont complété cette approche globale. Cette mission a démontré notre capacité à offrir des soins complets dans un format adapté.

Gaol 2016 a servi de modèle pour l'équilibre optimal entre toutes les spécialités dans nos interventions de taille moyenne.`,
    highlights: [
      "550 consultations équilibrées",
      "133 consultations généralistes",
      "112 enfants pris en charge",
      "84 examens ophtalmologiques",
      "Modèle d'équilibre optimal"
    ],
    gallery: [
      "/gaol1.webp",
      "/gaol2.webp",
      "/gaol3.webp",
      "/gaol4.webp"
    ],
    testimonials: [
      {
        name: "Ousmane Ba",
        role: "Notable du village",
        quote: "Gaol a bénéficié d'une mission parfaitement équilibrée. L'ASFO a répondu à tous nos besoins."
      }
    ],
    impact: "Cette mission a établi un modèle d'intervention équilibrée et a renforcé l'accès aux soins diversifiés."
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
    ],
    story: `Sadel 2016 s'est distinguée par une approche spécialisée avec 495 consultations, dominée par la gynécologie (137) et l'ophtalmologie (124). Cette mission ciblée a répondu aux besoins spécifiques identifiés dans la communauté.

L'expertise gynécologique et ophtalmologique déployée a permis de traiter des pathologies longtemps négligées. Les soins dentaires (91) ont complété cette intervention spécialisée.

Cette mission a démontré notre capacité d'adaptation aux besoins spécifiques et a établi un modèle d'intervention ciblée.`,
    highlights: [
      "495 consultations spécialisées",
      "137 consultations gynécologiques",
      "124 examens ophtalmologiques",
      "91 soins dentaires",
      "Approche ciblée aux besoins spécifiques"
    ],
    gallery: [
      "/sadel1.webp",
      "/sadel2.webp",
      "/sadel3.webp",
      "/sadel4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Fatou Sy",
        role: "Gynécologue",
        quote: "Sadel nous a permis de traiter de nombreux cas gynécologiques complexes. Une mission spécialisée réussie."
      }
    ],
    impact: "Cette mission a considérablement amélioré la santé reproductive et visuelle de la communauté."
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
    ],
    story: `Ndouloumadji 2016 a été une mission ciblée avec 221 consultations, remarquable par son focus ophtalmologique avec 69 examens. Cette intervention spécialisée a répondu aux besoins visuels urgents de cette petite communauté.

Malgré la taille réduite, l'impact a été significatif grâce à l'expertise ophtalmologique déployée. Cette mission a démontré que l'efficacité ne dépend pas de la taille mais de l'adaptation aux besoins.

Ndouloumadji 2016 a établi un modèle d'intervention spécialisée pour les petites communautés.`,
    highlights: [
      "221 consultations ciblées",
      "69 examens ophtalmologiques",
      "Focus sur les besoins visuels",
      "Intervention spécialisée efficace",
      "Modèle pour petites communautés"
    ],
    gallery: [
      "/ndouloumadji1.webp",
      "/ndouloumadji2.webp",
      "/ndouloumadji3.webp",
      "/ndouloumadji4.webp"
    ],
    testimonials: [
      {
        name: "Dr. Mamadou Diop",
        role: "Ophtalmologue",
        quote: "Ndouloumadji a prouvé qu'une petite mission peut avoir un grand impact. Nous avons sauvé plusieurs vues."
      }
    ],
    impact: "Cette mission a démontré l'efficacité des interventions ciblées et a amélioré significativement la santé visuelle locale."
  }
];

const SingleArchivePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [archive, setArchive] = useState(archives.find(item => item.id === id));

  useEffect(() => {
    setArchive(archives.find(item => item.id === id));
    
    if (archive) {
      document.title = `${archive.title} | ASFO - Archives des Missions`;
    } else {
      document.title = 'ASFO | Action Sanitaire pour le Fouta';
    }
  }, [id, archive]);

  if (!archive) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Mission non trouvée</h1>
          <p className="text-gray-600 mb-8">La mission que vous recherchez n'existe pas ou a été déplacée.</p>
          <Button variant="primary" to="/archives">
            Retour aux archives
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img 
          src={archive.imageUrl} 
          alt={archive.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <div className="flex items-center mb-4">
                <Link 
                  to="/archives"
                  className="inline-flex items-center text-white/80 hover:text-white transition-colors mr-4"
                >
                  <ChevronLeft size={20} className="mr-1" />
                  Retour aux archives
                </Link>
                <span className="text-white/60">•</span>
                <span className="text-white/80 ml-4">{archive.year}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {archive.title}
              </h1>
              
              <div className="flex flex-wrap items-center text-white/90 gap-6">
                <div className="flex items-center">
                  <MapPin size={20} className="mr-2" />
                  <span>{archive.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={20} className="mr-2" />
                  <span>{archive.date}</span>
                </div>
                <div className="flex items-center">
                  <Activity size={20} className="mr-2" />
                  <span>{archive.consultations} consultations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Summary */}
            <div className="bg-teal-50 rounded-2xl p-8 mb-12 border border-teal-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Eye className="mr-3 text-teal-600" size={24} />
                Résumé de la mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {archive.summary}
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white text-center">
                <div className="text-3xl font-bold mb-2">{archive.consultations}</div>
                <div className="text-teal-100">Consultations totales</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center">
                <div className="text-3xl font-bold mb-2">{archive.specialties.length}</div>
                <div className="text-blue-100">Spécialités mobilisées</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white text-center">
                <div className="text-3xl font-bold mb-2">{archive.year}</div>
                <div className="text-green-100">Année de la mission</div>
              </div>
            </div>

            {/* Story */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Histoire de la mission</h2>
              <div className="prose prose-lg max-w-none">
                {archive.story.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Specialties Breakdown */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Répartition par spécialité</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {archive.specialties.map((specialty, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <span className="font-medium text-gray-800">{specialty.name}</span>
                    <span className="text-2xl font-bold text-teal-600">{specialty.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Star className="mr-3 text-yellow-500" size={24} />
                Points forts de la mission
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {archive.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Quote className="mr-3 text-blue-500" size={24} />
                Témoignages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {archive.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                    <div>
                      <div className="font-semibold text-gray-800">{testimonial.name}</div>
                      <div className="text-blue-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="mr-3 text-green-500" size={24} />
                Impact à long terme
              </h2>
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <p className="text-gray-700 leading-relaxed">{archive.impact}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200">
              <Link 
                to="/archives"
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={20} className="mr-2" />
                Retour aux archives
              </Link>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm">Mission réalisée en {archive.year}</p>
                <p className="text-teal-600 font-semibold">ASFO - Action Sanitaire pour le Fouta</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleArchivePage;