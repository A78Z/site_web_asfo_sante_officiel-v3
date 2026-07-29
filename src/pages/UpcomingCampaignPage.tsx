import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  HandHeart,
  HeartHandshake,
  HeartPulse,
  Megaphone,
  Microscope,
  PackageCheck,
  SearchCheck,
  Send,
  ShieldCheck,
  Stethoscope,
  Truck,
  UserRoundCheck,
  Users,
} from 'lucide-react';
import {
  applicationProcess,
  campaignObjectives,
  candidateCriteria,
  plannedSpecialties,
  preparationSteps,
  previousCampaigns,
  requiredApplicationDocuments,
  upcomingCampaign,
  type PreparationStatus,
} from '../data/upcomingCampaign';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.58, delay, ease: 'easeOut' as const },
});

const objectiveIcons = [
  Stethoscope,
  Microscope,
  ShieldCheck,
  Megaphone,
  Building2,
  UserRoundCheck,
  Users,
];

const specialtyIcons = [Stethoscope, Eye, HeartPulse, Building2];

const preparationIcons = [
  Megaphone,
  FileText,
  SearchCheck,
  ClipboardCheck,
  Users,
  Truck,
  HeartPulse,
];

const welcomeRequirements = [
  {
    icon: Users,
    title: 'Mobilisation locale',
    text: 'Associer les représentants de la localité et préparer l’accueil avec les acteurs communautaires.',
  },
  {
    icon: HeartPulse,
    title: 'Identification des besoins sanitaires',
    text: 'Documenter la situation sanitaire, les priorités de soins et les difficultés d’accès existantes.',
  },
  {
    icon: Building2,
    title: 'Mise à disposition des espaces',
    text: 'Identifier les lieux pouvant accueillir les consultations, l’orientation et la logistique.',
  },
  {
    icon: HeartHandshake,
    title: 'Coordination avec l’ASFO',
    text: 'Désigner un contact local et faciliter la préparation avec les équipes responsables.',
  },
];

const campaignNeeds = [
  { icon: Stethoscope, title: 'Professionnels de santé' },
  { icon: HandHeart, title: 'Bénévoles' },
  { icon: HeartHandshake, title: 'Partenaires' },
  { icon: Truck, title: 'Logistique' },
  { icon: PackageCheck, title: 'Matériel médical' },
  { icon: Megaphone, title: 'Communication' },
];

const faqItems = [
  {
    question: 'Quand les dates seront-elles publiées ?',
    answer:
      'Le calendrier définitif de la campagne et les villages retenus ne sont pas encore publiés. Cette page sera mise à jour après validation officielle par l’ASFO.',
  },
  {
    question: 'Qui peut proposer un village ?',
    answer:
      'Une association de développement, une amicale d’étudiants, un comité local ou une collectivité représentant la localité peut déposer une candidature en ligne.',
  },
  {
    question: 'Quels documents sont nécessaires ?',
    answer:
      'Le dossier comprend une lettre officielle adressée au Président de l’ASFO, une présentation géographique de la localité et une présentation de sa situation sanitaire. Les justificatifs sont transmis en PDF.',
  },
  {
    question: 'Comment les villages sont-ils sélectionnés ?',
    answer:
      'Les dossiers sont étudiés selon les besoins sanitaires, l’enclavement, la distance aux structures de santé et la capacité d’accueil locale. Aucun village n’est sélectionné automatiquement.',
  },
  {
    question: 'Comment devenir bénévole ?',
    answer:
      'La candidature bénévole s’effectue depuis la page Nous rejoindre. L’équipe ASFO étudie ensuite le profil, les compétences et les disponibilités.',
  },
  {
    question: 'Comment soutenir la campagne ?',
    answer:
      'Vous pouvez rejoindre l’ASFO comme partenaire ou effectuer un don depuis les pages existantes. Aucune collecte distincte propre à cette campagne n’est actuellement publiée.',
  },
  {
    question: 'Comment suivre ma candidature ?',
    answer:
      'Conservez le numéro de dossier remis après l’enregistrement et communiquez-le à l’ASFO via la page Contact. Aucun délai fixe de traitement n’est publié.',
  },
];

const statusStyles: Record<
  PreparationStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  published: {
    label: 'Publié',
    className: 'bg-teal-50 text-teal-700 ring-teal-100',
    icon: CheckCircle2,
  },
  'documented-period': {
    label: 'Période documentée',
    className: 'bg-sky-50 text-sky-700 ring-sky-100',
    icon: CalendarDays,
  },
  upcoming: {
    label: 'À venir',
    className: 'bg-amber-50 text-amber-700 ring-amber-100',
    icon: Clock3,
  },
};

const UpcomingCampaignPage: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = `${upcomingCampaign.officialTitle} | ASFO`;
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="overflow-hidden bg-gradient-to-b from-white via-[#f4fbfa] to-white text-slate-900">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-40 -top-44 h-[540px] w-[540px] rounded-full bg-teal-100/55 blur-[125px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-48 top-40 h-[460px] w-[460px] rounded-full bg-cyan-50/80 blur-[120px]" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.62, ease: 'easeOut' }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/85 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur"
              style={poppins}
            >
              <HeartPulse className="h-3.5 w-3.5" aria-hidden="true" />
              Missions &amp; Campagnes
            </span>
            <h1
              className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.07] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
              style={poppins}
            >
              27e Grande Campagne{' '}
              <span className="bg-gradient-to-r from-teal-700 to-[#2fb391] bg-clip-text text-transparent">
                Médicale ASFO
              </span>
            </h1>
            <p className="mt-4 text-lg font-bold text-teal-700 sm:text-xl">
              Département de Podor — 2026
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Cette nouvelle campagne mobilisera les équipes de l’ASFO au service des populations
              du Fouta, dans la continuité des missions médicales et humanitaires de l’association.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollTo('preparation-status')}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-[0_16px_36px_-18px_rgba(15,118,110,0.85)] transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                Suivre les préparatifs
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link
                to={upcomingCampaign.application.route}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                Proposer mon village
                <Send className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.68, delay: 0.08, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-2xl pb-12"
          >
            <div className="grid grid-cols-[1.3fr_0.7fr] grid-rows-2 gap-3 sm:gap-4">
              <figure className="group relative row-span-2 aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_30px_80px_-38px_rgba(18,63,56,0.55)]">
                <img
                  src="/last-mission.webp"
                  alt="Équipe de l’ASFO réunie lors d’une mission médicale"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent px-5 pb-5 pt-24 text-xs font-semibold text-white">
                  Une mobilisation médicale et communautaire portée par l’ASFO.
                </figcaption>
              </figure>
              <figure className="group relative aspect-square overflow-hidden rounded-[1.5rem] border-4 border-white bg-white shadow-[0_22px_55px_-32px_rgba(18,63,56,0.5)]">
                <img
                  src="/medicalteam.webp"
                  alt="Professionnels de santé mobilisés avec l’ASFO"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </figure>
              <figure className="group relative aspect-square overflow-hidden rounded-[1.5rem] border-4 border-white bg-white shadow-[0_22px_55px_-32px_rgba(18,63,56,0.5)]">
                <img
                  src="/village-bode-lao.webp"
                  alt="Mission médicale ASFO menée dans un village"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </figure>
            </div>

            <motion.span
              animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-1 top-8 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 text-xs font-extrabold text-teal-800 shadow-[0_18px_45px_-24px_rgba(18,63,56,0.5)] backdrop-blur sm:-left-6"
              style={poppins}
            >
              27e édition
            </motion.span>
            <motion.span
              animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-1 top-[48%] rounded-2xl border border-white/80 bg-white/95 px-4 py-3 text-xs font-extrabold text-teal-800 shadow-[0_18px_45px_-24px_rgba(18,63,56,0.5)] backdrop-blur sm:-right-5"
              style={poppins}
            >
              Podor — 2026
            </motion.span>
            <div className="absolute bottom-0 left-4 right-4 rounded-2xl border border-white/80 bg-white/95 px-5 py-4 shadow-[0_22px_55px_-28px_rgba(18,63,56,0.55)] backdrop-blur sm:left-8 sm:right-auto">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Stethoscope className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-slate-900" style={poppins}>Campagne multidisciplinaire</p>
                  <p className="text-xs text-slate-500">Programmation en cours</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Mission 2026
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Une nouvelle mobilisation au service des communautés
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              La campagne réunira les compétences médicales, la prévention et la mobilisation
              locale pour rapprocher les soins des populations du département de Podor.
            </p>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {campaignObjectives.map((objective, index) => {
              const Icon = objectiveIcons[index];
              return (
                <motion.article
                  key={objective}
                  {...fadeUp(index * 0.05)}
                  className={`flex items-center gap-4 rounded-2xl border border-slate-200 bg-[#fbfdfc] p-5 ${
                    index === campaignObjectives.length - 1 ? 'lg:col-start-2' : ''
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-800" style={poppins}>{objective}</h3>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trois rubriques */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Informations officielles
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Calendrier, candidature et programmation médicale
            </h2>
          </motion.div>

          <div className="mt-10 grid items-start gap-6 lg:grid-cols-3">
            <motion.article
              {...fadeUp(0.04)}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_22px_58px_-44px_rgba(18,63,56,0.5)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-100">
                <Clock3 className="h-3 w-3" aria-hidden="true" />
                Annonce à venir
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-slate-950" style={poppins}>Dates &amp; lieux</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Le calendrier définitif et la liste des villages retenus ne sont pas encore publiés.
              </p>
              <div className="mt-6 border-l-2 border-teal-100 pl-5">
                {[
                  ['Dates de campagne', 'À venir'],
                  ['Villages sélectionnés', 'À venir'],
                  ['Département', 'Podor'],
                ].map(([label, value]) => (
                  <div key={label} className="relative pb-5 last:pb-0">
                    <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-teal-300 ring-4 ring-white" aria-hidden="true" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-extrabold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
              <span
                className="mt-7 inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-400"
                aria-disabled="true"
                title="Le calendrier sera activé après publication officielle."
              >
                Consulter le calendrier
                <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </motion.article>

            <motion.article
              {...fadeUp(0.09)}
              className="overflow-hidden rounded-3xl border border-teal-200 bg-white shadow-[0_26px_65px_-40px_rgba(18,63,56,0.55)] lg:-mt-4"
            >
              <figure className="relative h-56 overflow-hidden bg-teal-50">
                <img
                  src="/campagne-asfo-2026.jpeg"
                  alt="Affiche officielle de candidature pour la campagne médicale ASFO 2026"
                  className="h-full w-full object-cover object-top"
                />
                <span className="absolute left-4 top-4 inline-flex rounded-full bg-teal-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                  Candidature en ligne
                </span>
              </figure>
              <div className="p-7">
                <h3 className="text-2xl font-extrabold text-slate-950" style={poppins}>
                  Votre localité souhaite accueillir la caravane ?
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Les structures représentant leur localité peuvent transmettre leur dossier via
                  le portail officiel. Chaque candidature fait l’objet d’une étude humaine.
                </p>
                <div className="mt-6 flex flex-col gap-2.5">
                  <Link
                    to={upcomingCampaign.application.route}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                  >
                    Déposer une candidature
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a
                    href={upcomingCampaign.application.guidePdf}
                    download
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    Télécharger le guide
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
                <ol className="mt-7 space-y-3 border-t border-slate-100 pt-6">
                  {applicationProcess.map((step, index) => (
                    <li key={step} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[10px] font-black text-teal-700">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </motion.article>

            <motion.article
              {...fadeUp(0.14)}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_22px_58px_-44px_rgba(18,63,56,0.5)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <Stethoscope className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700 ring-1 ring-sky-100">
                <Clock3 className="h-3 w-3" aria-hidden="true" />
                Programmation en cours
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-slate-950" style={poppins}>Spécialités mobilisées</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Les disciplines déjà annoncées restent soumises à la validation de la programmation définitive.
              </p>
              <div className="mt-6 space-y-3">
                {plannedSpecialties.map((specialty, index) => {
                  const Icon = specialtyIcons[index];
                  return (
                    <div key={specialty} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-[#fbfdfc] p-3.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">{specialty}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">Programmation en cours</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Préparatifs */}
      <section id="preparation-status" className="scroll-mt-24 border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Suivi officiel
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Où en sont les préparatifs ?
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              La timeline reflète uniquement les informations effectivement publiées. Elle ne simule aucun pourcentage d’avancement.
            </p>
          </motion.div>

          <ol className="relative mt-12 grid gap-4 lg:grid-cols-7 lg:gap-3">
            <div className="absolute left-[6%] right-[6%] top-7 hidden h-px bg-teal-100 lg:block" aria-hidden="true" />
            {preparationSteps.map((step, index) => {
              const style = statusStyles[step.status];
              const StatusIcon = style.icon;
              const StepIcon = preparationIcons[index];
              return (
                <motion.li
                  key={step.title}
                  {...fadeUp(index * 0.05)}
                  className="relative grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-slate-200 bg-[#fbfdfc] p-4 lg:block lg:border-0 lg:bg-transparent lg:p-0 lg:text-center"
                >
                  <span className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white shadow-md ${
                    step.status === 'upcoming' ? 'bg-slate-100 text-slate-400' : 'bg-teal-700 text-white'
                  }`}>
                    <StepIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 lg:mt-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ring-1 ${style.className}`}>
                      <StatusIcon className="h-3 w-3" aria-hidden="true" />
                      {style.label}
                    </span>
                    <h3 className="mt-2 text-xs font-extrabold leading-5 text-slate-800" style={poppins}>{step.title}</h3>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">{step.note}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Accueillir la campagne */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Préparation locale
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Comment accueillir la campagne ?
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Une candidature solide repose sur une connaissance précise des besoins et une coordination locale disponible.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {welcomeRequirements.map((item, index) => (
              <motion.article
                key={item.title}
                {...fadeUp(index * 0.06)}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_48px_-38px_rgba(18,63,56,0.5)] transition hover:-translate-y-1 hover:border-teal-200"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-base font-extrabold text-slate-900" style={poppins}>{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Candidature détaillée */}
      <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-8">
          <motion.div {...fadeUp()} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-teal-50 shadow-[0_28px_70px_-46px_rgba(18,63,56,0.5)]">
            <img
              src="/campagne-asfo-2026.jpeg"
              alt="Appel officiel à candidatures ASFO pour les villages du département de Podor"
              loading="lazy"
              className="w-full object-cover"
            />
          </motion.div>

          <motion.div {...fadeUp(0.08)}>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Villages candidats
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Préparer un dossier complet et vérifiable
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              La candidature se fait exclusivement en ligne. La structure candidate décrit sa
              localité, sa situation sanitaire et transmet les documents demandés au format PDF.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {candidateCriteria.map((criterion) => (
                <div key={criterion.title} className="rounded-2xl border border-slate-200 bg-[#fbfdfc] p-4">
                  <h3 className="text-xs font-extrabold text-slate-800" style={poppins}>{criterion.title}</h3>
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">{criterion.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-teal-800">Pièces principales</p>
              <ul className="mt-3 space-y-2.5">
                {requiredApplicationDocuments.map((document) => (
                  <li key={document} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
                    <FileCheck2 className="mt-1 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                    {document}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-amber-800">Frais de dossier</p>
              <p className="mt-2 text-2xl font-black text-amber-900" style={poppins}>
                {upcomingCampaign.application.fee.toLocaleString('fr-FR')} FCFA
              </p>
              <p className="mt-1 text-xs leading-5 text-amber-800">
                Le règlement intervient {upcomingCampaign.application.feeTiming}, selon le parcours actuel du portail.
              </p>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
              <p className="text-sm font-semibold leading-7 text-blue-950">
                Aucun village n’est sélectionné automatiquement. Chaque dossier est étudié par
                l’ASFO selon les besoins sanitaires, la faisabilité logistique et les critères officiels.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to={upcomingCampaign.application.route}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                Déposer ma candidature
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to={upcomingCampaign.application.guideRoute}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                Lire le guide
                <FileText className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Besoins */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Rejoindre la mobilisation
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Nos besoins pour la campagne
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Les catégories ci-dessous décrivent les besoins généraux d’une grande campagne. Aucune collecte spécifique distincte n’est publiée.
            </p>
          </motion.div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {campaignNeeds.map((need, index) => (
              <motion.article
                key={need.title}
                {...fadeUp(index * 0.05)}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-center"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <need.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xs font-extrabold leading-5 text-slate-800" style={poppins}>{need.title}</h3>
              </motion.article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { to: '/join', label: 'Devenir bénévole', primary: true },
              { to: '/about/partenaires', label: 'Devenir partenaire' },
              { to: '/donate', label: 'Faire un don' },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                  action.primary
                    ? 'bg-teal-700 text-white hover:bg-teal-800'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:text-teal-700'
                }`}
              >
                {action.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Campagnes précédentes */}
      <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <motion.div {...fadeUp()} className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
                Mémoire des missions
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
                Les campagnes précédentes
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Trois missions réellement documentées dans les archives ASFO.
              </p>
            </motion.div>
            <Link
              to="/archives"
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              Toutes les archives
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {previousCampaigns.map((mission, index) => (
              <motion.article
                key={mission.id}
                {...fadeUp(index * 0.07)}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-[#fbfdfc] shadow-[0_22px_58px_-44px_rgba(18,63,56,0.5)] transition hover:-translate-y-1 hover:border-teal-200"
              >
                <figure className="relative aspect-[16/10] overflow-hidden bg-teal-50">
                  <img
                    src={mission.imageUrl}
                    alt={`Mission médicale ASFO à ${mission.location} en ${mission.year}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-teal-700 shadow-sm backdrop-blur">
                    {mission.year}
                  </span>
                </figure>
                <div className="p-6">
                  <h3 className="text-lg font-extrabold text-slate-950" style={poppins}>{mission.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{mission.location}</p>
                  <p className="mt-4 text-2xl font-black text-teal-700" style={poppins}>
                    {mission.consultations.toLocaleString('fr-FR')}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">consultations documentées</p>
                  <Link
                    to={`/archives/${mission.id}`}
                    className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    Voir la mission
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:px-8">
          <motion.div {...fadeUp()} className="lg:sticky lg:top-28">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Questions fréquentes
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Préparer et suivre la campagne
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Les réponses reprennent le fonctionnement actuel du portail et les critères du guide officiel.
            </p>
            <Link
              to="/contact"
              className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              Contacter l’ASFO
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.article
                  key={item.question}
                  {...fadeUp(index * 0.035)}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`campaign-answer-${index}`}
                      className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-extrabold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 sm:px-6"
                      style={poppins}
                    >
                      {item.question}
                      <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                  </h3>
                  {isOpen && (
                    <div id={`campaign-answer-${index}`} className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-slate-600 sm:px-6">
                      {item.answer}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <motion.div
          {...fadeUp()}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-teal-100 bg-gradient-to-br from-white via-[#f4fbfa] to-teal-50 px-6 py-14 text-center shadow-[0_30px_80px_-52px_rgba(18,63,56,0.55)] sm:px-10 sm:py-16"
        >
          <div className="pointer-events-none absolute -left-24 -top-32 h-72 w-72 rounded-full bg-teal-100/60 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl">
            <HeartPulse className="mx-auto h-8 w-8 text-teal-500" aria-hidden="true" />
            <h2 className="mt-5 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Ensemble, préparons la 27e Grande Campagne Médicale de l’ASFO.
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Villages, professionnels de santé, bénévoles et partenaires : rejoignez cette
              mobilisation au service des populations du département de Podor.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                { to: '/candidature', label: 'Proposer mon village', primary: true },
                { to: '/join', label: 'Devenir bénévole' },
                { to: '/donate', label: 'Soutenir la campagne' },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                    action.primary
                      ? 'bg-teal-700 text-white shadow-[0_16px_36px_-18px_rgba(15,118,110,0.85)] hover:bg-teal-800'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:text-teal-700'
                  }`}
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default UpcomingCampaignPage;
