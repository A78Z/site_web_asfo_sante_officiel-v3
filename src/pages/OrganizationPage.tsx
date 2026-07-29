import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Users,
  Target,
  CalendarDays,
  MapPin,
  Briefcase,
  Heart,
  TrendingUp,
  Award,
  Building2,
  Network,
  Zap,
  Globe,
  Landmark,
  Crown,
  ChevronDown,
  Scale,
  ArrowRight,
  Camera,
  Mail,
  Vote,
} from 'lucide-react';
import {
  SENEGAL_LOCATIONS,
  SENEGAL_MAP_HEIGHT,
  SENEGAL_MAP_WIDTH,
  SENEGAL_OUTLINE_PATH,
  projectSenegalCoordinate,
} from '../data/senegalMap';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

/* ------------------------------------------------------------------ */
/* Animations                                                           */
/* ------------------------------------------------------------------ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const StatCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1600, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <span ref={ref}>
      {display.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Données (contenu existant, inchangé)                                 */
/* ------------------------------------------------------------------ */

const COMMISSIONS = [
  { icon: Target, title: 'Plan & logistique', description: 'Organisation des campagnes et extra-campagnes' },
  { icon: Award, title: 'Commission scientifique', description: 'Formations, ateliers, journées scientifiques, panels' },
  { icon: Heart, title: 'Médico-sociale', description: 'Actions sociales, solidarité, dons, suivi des patients' },
  { icon: Briefcase, title: 'Finances', description: 'Gestion budgétaire, cotisations, dépenses' },
  { icon: Network, title: 'Presse & Information', description: 'Communication interne/externe, visuels, réseaux sociaux' },
  { icon: Globe, title: 'Relations extérieures', description: 'Partenariats et collaborations' },
  { icon: Zap, title: 'Organisation', description: 'Transversale, active sur tous les fronts' },
];

const SECTIONS = [
  {
    name: 'ASFO/Saint-Louis',
    university: 'Université Gaston Berger',
    year: '2021',
    status: 'Établie',
    image: '/logo-ugb.jpg',
    progress: 100,
    progressLabel: 'Pleinement opérationnelle',
  },
  {
    name: 'ASFO/Thiès',
    university: 'UFR Santé de Thiès',
    year: '2025',
    status: 'Prometteuse',
    image: '/logo-thies.jpg',
    progress: 75,
    progressLabel: 'En développement',
  },
];

const ORG_CHART = [
  { icon: Landmark, title: 'Assemblée Générale', text: 'Bilan annuel, priorités et élections' },
  { icon: Crown, title: 'Président', text: 'Porte la vision et représente l’ASFO' },
  { icon: Briefcase, title: 'Bureau Exécutif', text: 'Coordonne et applique les décisions de l’AG' },
  { icon: Network, title: 'Commissions', text: '7 commissions spécialisées' },
  { icon: MapPin, title: 'Sections régionales', text: 'Dakar, Saint-Louis, Thiès' },
  { icon: Users, title: 'Bénévoles', text: '600+ membres actifs sur le terrain' },
];

const GOV_VALUES = [
  { icon: Scale, title: 'Transparence', text: 'Bilans présentés chaque année en Assemblée Générale.' },
  { icon: Vote, title: 'Participation', text: 'Un bureau élu, où chaque membre a sa voix.' },
  { icon: Globe, title: 'Inclusion', text: 'Professionnels de santé et membres d’autres secteurs.' },
  { icon: Heart, title: 'Engagement', text: 'Le bénévolat au cœur de toutes nos actions.' },
];

/* Implantations universitaires projetées depuis leurs coordonnées géographiques. */
const SECTION_POINTS = [
  {
    ...projectSenegalCoordinate(SENEGAL_LOCATIONS.dakar),
    label: 'Dakar',
    info: 'Siège national — UCAD',
    labelPos: 'below' as const,
  },
  {
    ...projectSenegalCoordinate(SENEGAL_LOCATIONS.saintLouis),
    label: 'Saint-Louis',
    info: 'ASFO/Saint-Louis — UGB · 2021',
    labelPos: 'above' as const,
  },
  {
    ...projectSenegalCoordinate(SENEGAL_LOCATIONS.thies),
    label: 'Thiès',
    info: 'ASFO/Thiès — UFR Santé · 2025',
    labelPos: 'below' as const,
  },
];

const GALLERY = [
  { src: '/medicalteam.webp', label: 'Notre équipe médicale' },
  { src: '/images/formation-hero.webp', label: 'Formations' },
  { src: '/28.webp', label: 'En campagne médicale' },
  { src: '/11.webp', label: 'Avec les communautés' },
];

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const OrganizationPage: React.FC = () => {
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = 'Notre organisation | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-44 top-64 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[44%] top-8 hidden h-28 w-28 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10">
          {/* Texte */}
          <div>
            <motion.span
              {...fadeUp(0)}
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm"
              style={poppins}
            >
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              Notre gouvernance
            </motion.span>

            <motion.h1
              {...fadeUp(0.08)}
              className="mt-6 text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl xl:text-6xl"
              style={poppins}
            >
              Découvrez les femmes et les hommes qui{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
                pilotent l’ASFO
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8">
              Une association structurée, portée par une équipe de jeunes professionnels et
              d'étudiants engagés, tous animés par une même ambition :{' '}
              <em>servir les populations rurales du Sénégal à travers la santé, la solidarité
              et l'action de terrain.</em>
            </motion.p>

            <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <Link
                to="/notre-equipe-medicale"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                Découvrir notre équipe
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/join"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                Rejoindre l'organisation
              </Link>
            </motion.div>
          </div>

          {/* Composition photo */}
          <motion.div {...fadeUp(0.15)} className="relative">
            <div className="grid grid-cols-3 grid-rows-3 gap-3.5">
              <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl border border-white/80 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.45)]">
                <img
                  src="/medicalteam.webp"
                  alt="L'équipe médicale de l'ASFO"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="row-span-2 overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img
                  src="/images/engagement-hero.webp"
                  alt="Membres de l'ASFO en action"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img
                  src="/9.webp"
                  alt="L'équipe devant l'unité mobile"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            <motion.div
              animate={reduce ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-4 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-[0_20px_50px_-20px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:-left-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2fb391] to-[#178066]">
                  <Landmark className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-gray-900" style={poppins}>25 ans d'engagement</p>
                  <p className="text-[11px] font-semibold text-gray-500">600+ bénévoles · Structure nationale</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ STATISTIQUES ════════════════ */}
      <section className="relative pb-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-6 sm:gap-4 sm:px-8 lg:grid-cols-4 lg:px-10">
          {[
            { icon: Users, value: 600, suffix: '+', label: 'Bénévoles actifs' },
            { icon: MapPin, value: 3, suffix: '', label: 'Sections régionales' },
            { icon: CalendarDays, value: 25, suffix: '+', label: "Années d'expérience" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              {...fadeUp(0.05 + i * 0.07)}
              className="rounded-2xl border border-white/80 bg-white/80 px-5 py-6 text-center shadow-[0_15px_40px_-20px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
                <stat.icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
              </span>
              <p className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}>
                <StatCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
          <motion.div
            {...fadeUp(0.26)}
            className="rounded-2xl border border-white/80 bg-white/80 px-5 py-6 text-center shadow-[0_15px_40px_-20px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white"
          >
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
              <Vote className="h-5 w-5 text-teal-600" aria-hidden="true" />
            </span>
            <p className="mt-3 text-lg font-extrabold leading-tight text-gray-900 sm:text-xl" style={poppins}>
              Organisation démocratique
            </p>
            <p className="mt-1 text-sm text-gray-600">Bureau élu chaque année</p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ GOUVERNANCE ════════════════ */}
      <section className="relative overflow-hidden pb-24">
        <div className="pointer-events-none absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-teal-100/30 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp(0)} className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Target className="h-3.5 w-3.5" aria-hidden="true" />
              Gouvernance et fonctionnement
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl" style={poppins}>
              Une structure démocratique et{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">transparente</span>
            </h2>
          </motion.div>

          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Cartes AG + Bureau */}
            <div className="min-w-0 space-y-6 self-start">
              <motion.div
                {...fadeUp(0.08)}
                className="rounded-3xl border border-white/80 bg-white/80 p-7 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 sm:p-8"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_10px_25px_-10px_rgba(23,128,102,0.6)]">
                    <Landmark className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-bold text-gray-900" style={poppins}>Assemblée Générale Ordinaire</h3>
                </div>
                <p className="mt-4 text-[15px] leading-7 text-gray-700">
                  Chaque année, l'ASFO tient une <strong className="text-gray-900">Assemblée Générale Ordinaire</strong> :
                  bilan annuel, définition des priorités, et élection du Bureau Exécutif chargé de
                  mettre en œuvre la feuille de route.
                </p>
              </motion.div>

              <motion.div
                {...fadeUp(0.14)}
                className="rounded-3xl border border-white/80 bg-white/80 p-7 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 sm:p-8"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_10px_25px_-10px_rgba(23,128,102,0.6)]">
                    <Briefcase className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-bold text-gray-900" style={poppins}>Bureau Exécutif</h3>
                </div>
                <p className="mt-4 text-[15px] leading-7 text-gray-700">
                  <strong className="text-gray-900">Le Bureau Exécutif</strong> est composé de membres élus pour :
                </p>
                <ul className="mt-3 space-y-2.5">
                  {['Coordonner les actions', 'Superviser les activités', "Représenter l'association", "Appliquer les décisions de l'AG"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-[15px] text-gray-700">
                      <span className="h-1.5 w-1.5 flex-none rounded-full bg-teal-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Photo */}
            <motion.div {...fadeUp(0.12)} className="min-w-0 self-start">
              <div className="group overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[0_25px_60px_-30px_rgba(18,63,56,0.35)] backdrop-blur-sm">
                <div className="overflow-hidden">
                  <img
                    src="/medicalteam.webp"
                    alt="Équipe ASFO réunie"
                    className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-80"
                  />
                </div>
                <div className="p-7 text-center">
                  <h4 className="text-lg font-bold text-gray-900" style={poppins}>Gouvernance participative</h4>
                  <p className="mt-1.5 text-sm text-gray-600">Une structure démocratique où chaque membre a sa voix</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── Organigramme ─── */}
          <div className="mx-auto mt-20 max-w-2xl">
            <motion.h3 {...fadeUp(0)} className="text-center text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>
              L'organigramme de l'ASFO
            </motion.h3>
            <ol className="mt-10">
              {ORG_CHART.map((node, i) => (
                <li key={node.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: 0.06 + i * 0.08, ease: 'easeOut' }}
                    className="flex items-center gap-4 rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_15px_40px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                  >
                    <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl ${i === 0 ? 'bg-gradient-to-br from-[#2fb391] to-[#178066] text-white shadow-[0_10px_25px_-10px_rgba(23,128,102,0.6)]' : 'border border-teal-100 bg-teal-50 text-teal-600'}`}>
                      <node.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-gray-900" style={poppins}>{node.title}</p>
                      <p className="text-sm text-gray-600">{node.text}</p>
                    </div>
                    <span className="ml-auto text-xs font-extrabold text-teal-600/40" style={poppins}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </motion.div>
                  {i < ORG_CHART.length - 1 && (
                    <div className="flex justify-center py-1.5" aria-hidden="true">
                      <ChevronDown className="h-5 w-5 text-teal-300" />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ════════════════ COMMISSIONS ════════════════ */}
      <section className="relative overflow-hidden pb-24">
        <div className="pointer-events-none absolute -left-44 top-10 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp(0)} className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Network className="h-3.5 w-3.5" aria-hidden="true" />
              Commissions dynamiques
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl" style={poppins}>
              Les piliers de{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">l'action</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Sept commissions spécialisées qui orchestrent l'ensemble de nos activités avec
              expertise et coordination.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {COMMISSIONS.map((commission, i) => (
              <motion.div
                key={commission.title}
                {...fadeUp(0.05 + i * 0.05)}
                className="group rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_15px_40px_-22px_rgba(18,63,56,0.28)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_25px_55px_-22px_rgba(18,63,56,0.38)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_10px_25px_-10px_rgba(23,128,102,0.6)] transition-transform duration-300 group-hover:scale-110">
                  <commission.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-gray-900" style={poppins}>{commission.title}</h3>
                <div className="mt-2 h-0.5 w-8 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] opacity-60" aria-hidden="true" />
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{commission.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ SECTIONS RÉGIONALES + CARTE ════════════════ */}
      <section className="relative pb-24">
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp(0)} className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              Une association en pleine expansion
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl" style={poppins}>
              Décentralisation{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">universitaire</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Nos sections régionales, avec leur propre bureau, participent pleinement aux
              activités nationales et diffusent les valeurs de l'ASFO dans leur zone.
            </p>
          </motion.div>

          <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            {/* Carte du Sénégal */}
            <motion.div
              {...fadeUp(0.08)}
              className="self-start rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-[0_25px_60px_-30px_rgba(18,63,56,0.35)] backdrop-blur-sm sm:p-9"
            >
              <h3 className="text-lg font-bold text-gray-900" style={poppins}>Nos implantations universitaires</h3>
              <p className="mt-1.5 text-sm text-gray-600">
                Survolez un point pour découvrir chaque section.
              </p>
              <div className="mt-6">
                <svg
                  viewBox={`0 0 ${SENEGAL_MAP_WIDTH} ${SENEGAL_MAP_HEIGHT}`}
                  preserveAspectRatio="xMidYMid meet"
                  className="h-auto w-full"
                  role="img"
                  aria-label="Carte géographique du Sénégal avec les implantations de l'ASFO : Dakar, Saint-Louis et Thiès"
                >
                  <path d={SENEGAL_OUTLINE_PATH} className="fill-teal-50 stroke-teal-200" strokeWidth="2" strokeLinejoin="round" />
                  <text x="166" y="211" textAnchor="middle" className="fill-teal-700/35 text-[7px] font-bold tracking-[0.18em]" aria-hidden="true">
                    GAMBIE
                  </text>
                  {SECTION_POINTS.map((pt, i) => (
                    <g key={pt.label} className="group/pt cursor-pointer">
                      <motion.circle
                        cx={pt.x}
                        cy={pt.y}
                        r={7}
                        className="fill-[#178066]"
                        initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.4, delay: reduce ? 0 : 0.2 + i * 0.15, ease: 'easeOut' }}
                        style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                      />
                      {!reduce && (
                        <motion.circle
                          cx={pt.x}
                          cy={pt.y}
                          r={7}
                          className="fill-none stroke-teal-400"
                          strokeWidth="2"
                          animate={{ scale: [1, 2.1], opacity: [0.7, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
                          style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                        />
                      )}
                      <text
                        x={pt.x}
                        y={pt.labelPos === 'above' ? pt.y - 13 : pt.y + 22}
                        textAnchor="middle"
                        className="fill-teal-800 text-[13px] font-bold"
                        style={poppins}
                      >
                        {pt.label}
                      </text>
                      {/* infobulle au survol */}
                      <g className="pointer-events-none opacity-0 transition-opacity duration-300 group-hover/pt:opacity-100">
                        <rect
                          x={Math.min(Math.max(pt.x - 85, 18), 210)}
                          y={pt.labelPos === 'above' ? pt.y - 52 : pt.y + 32}
                          width={170}
                          height={26}
                          rx={13}
                          className="fill-[#123f38]"
                        />
                        <text
                          x={Math.min(Math.max(pt.x - 85, 18), 210) + 85}
                          y={(pt.labelPos === 'above' ? pt.y - 52 : pt.y + 32) + 17}
                          textAnchor="middle"
                          className="fill-white text-[10.5px] font-semibold"
                        >
                          {pt.info}
                        </text>
                      </g>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600">
                <span className="h-3 w-3 rounded-full bg-[#178066]" aria-hidden="true" />
                Sections et siège de l'ASFO
              </div>
            </motion.div>

            {/* Cartes sections */}
            <div className="min-w-0 space-y-6 self-start">
              {SECTIONS.map((section, i) => (
                <motion.div
                  key={section.name}
                  {...fadeUp(0.1 + i * 0.08)}
                  className="group rounded-3xl border border-white/80 bg-white/80 p-7 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white sm:p-8"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={section.image}
                      alt={`Logo — ${section.university}`}
                      className="h-14 w-14 flex-none rounded-full border-4 border-white object-cover shadow-lg ring-2 ring-teal-100"
                    />
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-gray-900" style={poppins}>{section.name}</h3>
                      <p className="text-sm font-semibold text-teal-700">{section.university}</p>
                    </div>
                    <span
                      className={`ml-auto flex-none rounded-full px-3 py-1 text-xs font-bold ${
                        section.status === 'Établie' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'
                      }`}
                      style={poppins}
                    >
                      {section.status}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-600">
                      <CalendarDays className="h-4 w-4 text-teal-600" aria-hidden="true" />
                      Année de mise en place
                    </span>
                    <span className="font-bold text-gray-900" style={poppins}>{section.year}</span>
                  </div>
                  <div className="mt-4 border-t border-teal-50 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-teal-50">
                        <motion.div
                          initial={reduce ? { width: `${section.progress}%` } : { width: 0 }}
                          whileInView={{ width: `${section.progress}%` }}
                          viewport={{ once: true, margin: '-40px' }}
                          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]"
                        />
                      </div>
                      <span className="flex-none text-xs font-semibold text-gray-600">{section.progressLabel}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.p {...fadeUp(0.26)} className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4 text-center text-[13px] italic leading-relaxed text-gray-600">
                <strong className="not-italic text-gray-800">Le siège national</strong>, à l'Université Cheikh
                Anta Diop de Dakar, coordonne l'ensemble des sections.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ VALEURS DE GOUVERNANCE ════════════════ */}
      <section className="relative overflow-hidden pb-24">
        <div className="pointer-events-none absolute -right-40 top-10 h-[400px] w-[400px] rounded-full bg-teal-100/30 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.h2 {...fadeUp(0)} className="text-center text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>
            Nos principes
          </motion.h2>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {GOV_VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                {...fadeUp(0.06 + i * 0.07)}
                className="rounded-3xl border border-white/80 bg-white/80 p-6 text-center shadow-[0_15px_40px_-22px_rgba(18,63,56,0.28)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_22px_50px_-22px_rgba(18,63,56,0.38)]"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_10px_25px_-10px_rgba(23,128,102,0.6)]">
                  <value.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-gray-900" style={poppins}>{value.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">{value.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ GALERIE ════════════════ */}
      <section className="relative pb-24">
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp(0)} className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
                <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                La vie de l'organisation
              </span>
              <h2 className="mt-5 text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>
                L'ASFO au quotidien
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 transition-colors hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              style={poppins}
            >
              Voir la médiathèque
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {GALLERY.map((photo, i) => (
              <motion.figure
                key={photo.src}
                {...fadeUp(0.05 + i * 0.07)}
                className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/80 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.35)]"
              >
                <img
                  src={photo.src}
                  alt={photo.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/70 via-transparent to-transparent" aria-hidden="true" />
                <figcaption className="absolute bottom-4 left-4 right-4 text-sm font-bold text-white" style={poppins}>
                  {photo.label}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div
            {...fadeUp(0)}
            className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/90 to-teal-50/60 p-10 text-center shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-14"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl" style={poppins}>
              Vous souhaitez rejoindre notre{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">organisation</span> ?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Ensemble, construisons l'avenir de la santé communautaire.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link
                to="/join"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Users className="h-5 w-5" aria-hidden="true" />
                Devenir bénévole
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Building2 className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Créer une section
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Mail className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OrganizationPage;
