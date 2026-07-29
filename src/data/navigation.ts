import type React from 'react';
import {
  Info,
  History,
  Target,
  Building2,
  Users,
  Stethoscope,
  FileText,
  BarChart3,
  Film,
  CalendarDays,
  ClipboardList,
  ScrollText,
  Map,
  Archive,
  HandHeart,
  CreditCard,
  Handshake,
  Heart,
  HeartHandshake,
  BookOpenCheck,
  ShieldCheck,
  Syringe,
  LifeBuoy,
  HelpCircle,
  Newspaper,
  Mail,
  Images,
  Rss,
} from 'lucide-react';

export interface MenuItemDef {
  to: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface MenuColumnDef {
  heading: string;
  items: MenuItemDef[];
}

export interface MegaMenuDef {
  label: string;
  /** préfixes de routes qui rendent ce menu « actif » */
  basePaths: string[];
  columns: MenuColumnDef[];
  cta?: { title: string; description: string; to: string; buttonLabel: string };
}

export const megaMenus: MegaMenuDef[] = [
  {
    label: 'ASFO',
    basePaths: ['/about', '/president-message', '/presidents', '/notre-equipe-medicale', '/rapport', '/impact', '/documentaire'],
    columns: [
      {
        heading: "L'association",
        items: [
          { to: '/about', title: 'Qui sommes-nous', description: "L'ASFO en quelques mots.", icon: Info },
          { to: '/about/historique', title: 'Notre histoire', description: 'Plus de vingt ans au service du Fouta.', icon: History },
          { to: '/about/mission', title: 'Nos valeurs & missions', description: 'Soigner, former, sensibiliser.', icon: Target },
        ],
      },
      {
        heading: 'Organisation',
        items: [
          { to: '/about/organisation', title: 'Bureau & Coordination', description: 'Structure, délégations et sections.', icon: Building2 },
          { to: '/presidents', title: 'Nos présidents', description: "Celles et ceux qui ont porté l'ASFO.", icon: Users },
          { to: '/notre-equipe-medicale', title: 'Équipe médicale', description: 'Les professionnels de nos missions.', icon: Stethoscope },
        ],
      },
      {
        heading: 'Transparence',
        items: [
          { to: '/rapport', title: 'Rapports annuels', description: 'Nos bilans, publiés chaque année.', icon: FileText },
          { to: '/impact', title: 'Impact & chiffres', description: "L'effet concret de nos actions.", icon: BarChart3 },
          { to: '/documentaire', title: 'Documentaire', description: "L'ASFO en images.", icon: Film },
        ],
      },
    ],
    cta: {
      title: "Rejoignez l'ASFO",
      description: 'Devenez membre et recevez votre carte numérique.',
      to: '/member-card',
      buttonLabel: 'Devenir membre',
    },
  },
  {
    label: 'Missions',
    basePaths: ['/missions', '/candidature', '/guide-candidature', '/archives'],
    columns: [
      {
        heading: 'Campagnes',
        items: [
          { to: '/missions/prochaine-campagne', title: 'Prochaine campagne', description: 'Dates, lieux et préparation de la 27e édition.', icon: CalendarDays },
          { to: '/candidature', title: 'Candidature village', description: 'Accueillir une caravane médicale ASFO.', icon: ClipboardList },
          { to: '/guide-candidature', title: 'Guide de candidature', description: 'Les étapes pour déposer un dossier.', icon: ScrollText },
        ],
      },
      {
        heading: 'Interventions',
        items: [
          { to: '/missions/carte', title: 'Carte des interventions', description: 'Nos missions à travers le Fouta.', icon: Map },
          { to: '/archives', title: 'Archives des missions', description: 'Toutes les campagnes passées.', icon: Archive },
          { to: '/rapport', title: 'Résultats & rapports', description: 'Les bilans de chaque mission.', icon: FileText },
        ],
      },
    ],
    cta: {
      title: 'Votre village souhaite accueillir une caravane ?',
      description: 'Les candidatures pour la campagne 2026 sont ouvertes.',
      to: '/candidature',
      buttonLabel: 'Candidater',
    },
  },
  {
    label: "S'engager",
    basePaths: ['/join', '/member-card', '/donate', '/parrainer'],
    columns: [
      {
        heading: 'Rejoindre',
        items: [
          { to: '/join', title: 'Devenir bénévole', description: 'Participez à nos missions sur le terrain.', icon: HandHeart },
          { to: '/member-card', title: 'Devenir membre', description: 'Adhérez et obtenez votre carte numérique.', icon: CreditCard },
          { to: '/about/partenaires', title: 'Devenir partenaire', description: 'Institutions, entreprises, mécènes.', icon: Handshake },
        ],
      },
      {
        heading: 'Soutenir',
        items: [
          { to: '/donate', title: 'Faire un don', description: 'Chaque contribution transforme des vies.', icon: Heart },
          { to: '/parrainer', title: 'Parrainer un village', description: "Soutenez durablement une communauté.", icon: HeartHandshake },
        ],
      },
    ],
    cta: {
      title: 'Votre soutien change des vies',
      description: 'Un don, même modeste, finance soins et médicaments.',
      to: '/donate',
      buttonLabel: 'Faire un don',
    },
  },
  {
    label: 'Santé',
    basePaths: ['/sante'],
    columns: [
      {
        heading: 'Comprendre',
        items: [
          { to: '/sante/fiches', title: 'Fiches santé', description: 'Paludisme, diabète, hypertension, santé bucco-dentaire…', icon: BookOpenCheck },
          { to: '/sante/prevention', title: 'Conseils de prévention', description: 'Les bons gestes du quotidien.', icon: ShieldCheck },
        ],
      },
      {
        heading: 'Pratique',
        items: [
          { to: '/sante/vaccination', title: 'Calendrier vaccinal', description: 'Les vaccins recommandés, âge par âge.', icon: Syringe },
          { to: '/sante/gestes-qui-sauvent', title: 'Gestes qui sauvent', description: "Réagir face à l'urgence.", icon: LifeBuoy },
          { to: '/sante/faq', title: 'FAQ santé', description: 'Les questions les plus fréquentes.', icon: HelpCircle },
        ],
      },
    ],
    cta: {
      title: 'Une question de santé ?',
      description: 'Consultez nos fiches rédigées par des professionnels.',
      to: '/sante',
      buttonLabel: 'Espace santé',
    },
  },
  {
    label: 'Ressources',
    basePaths: ['/presse', '/newsletter', '/gallery', '/news'],
    columns: [
      {
        heading: 'Publications',
        items: [
          { to: '/rapport', title: 'Rapports annuels', description: 'Nos bilans détaillés.', icon: FileText },
          { to: '/presse', title: 'Communiqués & presse', description: 'Espace presse et médias.', icon: Newspaper },
          { to: '/newsletter', title: 'Newsletter', description: 'Recevez nos annonces par email.', icon: Mail },
        ],
      },
      {
        heading: 'Médias',
        items: [
          { to: '/gallery', title: 'Médiathèque', description: 'Photos de nos missions.', icon: Images },
          { to: '/documentaire', title: 'Documentaire & vidéos', description: "L'ASFO en images.", icon: Film },
          { to: '/news', title: 'Actualités', description: 'Articles et comptes-rendus.', icon: Rss },
        ],
      },
    ],
  },
];
