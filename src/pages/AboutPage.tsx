import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Target,
  Heart,
  MapPin,
  Award,
  Users,
  CalendarDays,
  Activity,
  Stethoscope,
  Building2,
  Star,
  Pill,
  GraduationCap,
  HandHeart,
  Apple,
  UserCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Trophy,
  Medal,
  Landmark,
  Sprout,
  Globe,
  Scale,
  HeartHandshake,
  ScrollText,
  Flag,
} from 'lucide-react';
import {
  mauritaniaIntervention,
  priorityAboutInterventionZones,
  validatedAboutInterventionZones,
} from '../data/aboutInterventionZones';
import { senegalOutline, type GeoCoordinate } from '../data/podorIntervention';

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
/* Données (contenu institutionnel existant, inchangé)                  */
/* ------------------------------------------------------------------ */

const STATS = [
  { icon: Users, value: 250, suffix: 'K+', label: 'Patients consultés' },
  { icon: CalendarDays, value: 25, suffix: '+', label: "Années d'expérience" },
  { icon: Award, value: 600, suffix: '+', label: 'Acteurs mobilisés' },
  { icon: Activity, value: 192, suffix: '+', label: 'Localités sillonnées' },
];

const TIMELINE = [
  {
    icon: Sprout,
    year: '2000',
    title: 'Création à l’UCAD',
    text: 'Naissance de l’ASFO sous l’initiative de jeunes engagés pour l’amélioration de la situation sanitaire du Fouta.',
  },
  {
    icon: ScrollText,
    year: '2001',
    title: 'Reconnaissance universitaire',
    text: 'Reconnue par le COUD sous le numéro 01/2210 le 03 mai 2001 — première structure médico-sociale de la FMPO.',
  },
  {
    icon: Trophy,
    year: '2005',
    title: 'Meilleure association du Sénégal',
    text: 'Distinction de la DJVA remise à Diamniadio en présence du Président Abdoulaye Wade.',
  },
  {
    icon: Landmark,
    year: '2006',
    title: 'Reconnaissance nationale',
    text: 'Enregistrée par le Ministère de l’Intérieur sous le numéro 12473 le 02 mai 2006.',
  },
  {
    icon: Flag,
    year: 'Depuis',
    title: 'Extension des interventions',
    text: 'Missions dans 15 régions du Sénégal et jusqu’en Mauritanie avec l’AVOMM.',
  },
];

const GENERAL_OBJECTIVES = [
  {
    icon: Heart,
    num: '01',
    title: 'Santé pour tous',
    description:
      "Améliorer l'accès aux soins des populations d'une manière générale, en particulier celle de la couche la plus vulnérable en accentuant les efforts dans les villages les plus reculés et les plus enclavés.",
  },
  {
    icon: Users,
    num: '02',
    title: 'Participation communautaire',
    description:
      'Renforcer les connaissances des populations sur la prévention des maladies et sur les autres problèmes de santé par le biais de la sensibilisation.',
  },
  {
    icon: GraduationCap,
    num: '03',
    title: 'Formation continue',
    description:
      'Renforcer la compétence des membres et sympathisants de la structure par le biais de la formation théorique et la pratique.',
  },
];

const SPECIFIC_OBJECTIVES = [
  { icon: Stethoscope, title: 'Organiser des consultations médicales gratuites dans les zones reculées' },
  { icon: Users, title: 'Mener des campagnes de sensibilisation sur les enjeux de santé publique' },
  { icon: GraduationCap, title: 'Former le personnel de santé local aux nouvelles techniques médicales' },
  { icon: Pill, title: 'Distribuer des médicaments essentiels aux populations dans le besoin' },
  { icon: HandHeart, title: 'Créer des partenariats durables avec les structures de santé locales' },
  { icon: Apple, title: 'Former les femmes à la nutrition et promouvoir une alimentation saine basée sur les produits locaux' },
  { icon: UserCheck, title: 'Assister les personnes démunies dans leur parcours thérapeutique' },
];

const PRIMARY_REGIONS = [
  'Région de Dakar',
  'Région de Thiès',
  'Région de Louga',
  'Région de Kafrine',
  'Région de Sedhiou',
  'Région de Kolda',
  'Région de Ziguinchor',
  'Région de Tambacounda',
];

const SECONDARY_REGIONS = [
  'Région de Diourbel',
  'Région de Fatique',
  'Région de Kaolack',
  'Région de Kédougou',
  'Région de Mauritanie',
];

const VALUES_ICONS: Record<string, React.ElementType> = {
  Engagement: HeartHandshake,
  Excellence: Award,
  Équité: Scale,
  Solidarité: Users,
};

const MISSION_CARDS = [
  {
    image: '/mission.webp',
    icon: Target,
    title: 'Notre Mission',
    description:
      "ASFO s'engage à améliorer durablement les conditions de vie des populations du Fouta, en mettant un accent particulier sur la santé communautaire. Notre mission est de promouvoir l'accès équitable aux soins de qualité, de renforcer la prévention, et de soutenir les initiatives locales en matière de bien-être. À travers l'accompagnement, la sensibilisation et la mobilisation des acteurs locaux, nous œuvrons pour une société plus saine, solidaire et résiliente.",
  },
  {
    image: '/valeur.webp',
    icon: Heart,
    title: 'Nos Valeurs',
    values: [
      { label: 'Engagement', desc: 'Dévouement total envers la santé communautaire' },
      { label: 'Excellence', desc: 'Qualité des soins et formation continue' },
      { label: 'Équité', desc: 'Accès aux soins pour tous sans discrimination' },
      { label: 'Solidarité', desc: 'Entraide et soutien mutuel' },
    ],
  },
  {
    image: '/impact.webp',
    icon: Activity,
    title: 'Notre Impact',
    items: [
      'Plus de 10,000 consultations gratuites par an',
      'Formation continue de nos membres et sympatisants',
      'Présence dans 15 régions du Sénégal + Mauritanie',
      '25+ grandes campagnes de consultations et de sensibilisations gratuites',
      '50+ extra-campagnes de sensibilisation réalisées',
    ],
  },
];

const IDENTITY_PILLARS = [
  { icon: Globe, title: 'Organisation humanitaire', text: 'Une association de développement née à l’UCAD en 2000.' },
  { icon: Stethoscope, title: 'Engagement médical bénévole', text: 'Des professionnels de santé mobilisés gratuitement sur le terrain.' },
  { icon: Users, title: 'Ancrage communautaire', text: 'Des actions construites avec les populations du Fouta.' },
  { icon: Building2, title: 'Collaboration institutionnelle', text: 'Reconnue par l’UCAD, le COUD et le Ministère de l’Intérieur.' },
];

const INTERVENTION_MAP = {
  width: 680,
  height: 420,
  padding: 24,
  bounds: {
    left: -17.9,
    right: -10.15,
    top: 18,
    bottom: 11.9,
  },
} as const;

const projectInterventionCoordinate = ([longitude, latitude]: GeoCoordinate) => ({
  x:
    INTERVENTION_MAP.padding +
    ((longitude - INTERVENTION_MAP.bounds.left) /
      (INTERVENTION_MAP.bounds.right - INTERVENTION_MAP.bounds.left)) *
      (INTERVENTION_MAP.width - INTERVENTION_MAP.padding * 2),
  y:
    INTERVENTION_MAP.padding +
    ((INTERVENTION_MAP.bounds.top - latitude) /
      (INTERVENTION_MAP.bounds.top - INTERVENTION_MAP.bounds.bottom)) *
      (INTERVENTION_MAP.height - INTERVENTION_MAP.padding * 2),
});

const toInterventionSvgPath = (coordinates: GeoCoordinate[]) =>
  `${coordinates
    .map((coordinate, index) => {
      const point = projectInterventionCoordinate(coordinate);
      return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    })
    .join(' ')} Z`;

const SENEGAL_PATH = toInterventionSvgPath(senegalOutline);
const GAMBIA_LABEL_POINT = projectInterventionCoordinate([-15.35, 13.45]);
const MAURITANIA_CONNECTOR_POINT = projectInterventionCoordinate([-12.72, 16.32]);
const PROJECTED_INTERVENTION_ZONES = validatedAboutInterventionZones.map((zone) => ({
  ...zone,
  point: projectInterventionCoordinate(zone.coordinate),
}));

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const AboutPage: React.FC = () => {
  const [isRegionsExpanded, setIsRegionsExpanded] = useState(false);
  const [activeMapZoneId, setActiveMapZoneId] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const mapRef = useRef<SVGSVGElement>(null);
  const mapInView = useInView(mapRef, { once: true, margin: '-80px' });
  const activeMapZone = priorityAboutInterventionZones.find(
    (zone) => zone.id === activeMapZoneId,
  );

  useEffect(() => {
    document.title = 'À propos | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const sectionBg = 'relative overflow-hidden';

  return (
    <div className="bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* ════════════════ HERO ════════════════ */}
      <section className={`${sectionBg} pb-20 pt-14 sm:pt-20 lg:pb-28`}>
        <div className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-44 top-64 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[45%] top-10 hidden h-28 w-28 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10">
          {/* Colonne texte */}
          <div>
            <motion.span
              {...fadeUp(0)}
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm"
              style={poppins}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
              À propos de l’ASFO
            </motion.span>

            <motion.h1
              {...fadeUp(0.08)}
              className="mt-6 text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl xl:text-6xl"
              style={poppins}
            >
              ASFO, au service de la{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">santé</span>{' '}
              et de l’humanité
            </motion.h1>

            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8">
              Découvrez l'histoire inspirante de notre association humanitaire médicale, née de
              l'engagement de jeunes étudiants passionnés. Apprenez-en plus sur notre mission,
              nos valeurs fondamentales et nos objectifs concrets sur le terrain.
            </motion.p>

            <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <a
                href="#histoire"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                Découvrir notre histoire
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                to="/archives"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                Voir nos missions
              </Link>
            </motion.div>

            <motion.p {...fadeUp(0.3)} className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-500">
              <CalendarDays className="h-4 w-4 text-teal-600" aria-hidden="true" />
              Depuis 2000 au service des communautés
            </motion.p>
          </div>

          {/* Colonne visuelle */}
          <motion.div {...fadeUp(0.15)} className="relative">
            <div className="grid grid-cols-3 grid-rows-3 gap-3.5">
              <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl border border-white/80 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.45)]">
                <img
                  src="/images/mission-hero.webp"
                  alt="Équipe médicale de l'ASFO en mission"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="row-span-2 overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img
                  src="/images/formation-hero.webp"
                  alt="Formation des équipes de santé"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img
                  src="/images/engagement-hero.webp"
                  alt="Engagement auprès des communautés"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Carte flottante */}
            <motion.div
              animate={reduce ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-4 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-[0_20px_50px_-20px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:-left-8"
            >
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-xl font-extrabold text-teal-700" style={poppins}>25+</p>
                  <p className="text-[11px] font-semibold text-gray-500">années d’engagement</p>
                </div>
                <div className="h-9 w-px bg-teal-100" aria-hidden="true" />
                <div>
                  <p className="text-xl font-extrabold text-teal-700" style={poppins}>192+</p>
                  <p className="text-[11px] font-semibold text-gray-500">localités sillonnées</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ CITATION + STATS ════════════════ */}
      <section className={`${sectionBg} pb-20`}>
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.blockquote {...fadeUp(0)} className="mx-auto max-w-3xl text-center">
            <p className="text-xl font-bold leading-relaxed text-gray-800 sm:text-2xl" style={poppins}>
              «&nbsp;Depuis 2000, l'ASFO œuvre pour la santé et le bien-être des populations du
              Fouta et au-delà.&nbsp;»
            </p>
            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
          </motion.blockquote>

          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fadeUp(0.06 + i * 0.07)}
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
          </div>
        </div>
      </section>

      {/* ════════════════ HISTOIRE ════════════════ */}
      <section id="histoire" className={`${sectionBg} scroll-mt-28 pb-24`}>
        <div className="pointer-events-none absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-teal-100/30 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp(0)} className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
              Notre histoire
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl" style={poppins}>
              Une organisation née de{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
                l’engagement étudiant
              </span>
            </h2>
          </motion.div>

          <div className="grid items-start gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            {/* Texte éditorial */}
            <motion.div {...fadeUp(0.08)} className="min-w-0 space-y-6 self-start text-base leading-8 text-gray-700 sm:text-lg sm:leading-9">
              <p>
                L'<strong className="text-gray-900">Action Sanitaire pour le Fouta (ASFO)</strong> est une
                association humanitaire, de développement qui a vu le jour à
                l'<strong className="text-gray-900">Université Cheikh Anta Diop de Dakar (UCAD)</strong>,
                regroupant essentiellement des professionnels de la santé mais aussi des personnes
                issues d'autres secteurs, animés par la volonté d'apporter leur soutien à la
                politique de développement sanitaire de notre pays.
              </p>
              <p>
                Créée en <strong className="text-gray-900">l'an deux mille (2000)</strong> sous l'initiative
                de jeunes engagés pour l'amélioration de la situation sanitaire de leur localité
                (le Fouta), elle est reconnue par les autorités de l'UCAD dont celle du{' '}
                <strong className="text-gray-900">Centre des Œuvres Universitaire de Dakar (COUD)</strong> sous
                le <strong className="text-gray-900">numéro 01/2210 le 03 Mai 2001</strong> et par le{' '}
                <strong className="text-gray-900">Ministère de l'Intérieur de la République du Sénégal</strong>{' '}
                sous le <strong className="text-teal-700">numéro 12473 le 02 Mai 2006</strong>.
              </p>

              {/* Distinction historique */}
              <div className="rounded-2xl border border-teal-100 bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm sm:p-7">
                <p className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-teal-700" style={poppins}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50">
                    <Trophy className="h-4 w-4 text-teal-600" aria-hidden="true" />
                  </span>
                  Distinction historique
                </p>
                <p className="mt-3 text-[15px] leading-7 sm:text-base sm:leading-8">
                  L'ASFO est par ailleurs la <strong className="text-gray-900">première structure médico-sociale</strong> à
                  avoir vu le jour dans la noble <strong className="text-gray-900">faculté de Médecine, de Pharmacie
                  et d'Odontologie (FMPO)</strong> de l'Université Cheikh Anta Diop de Dakar (UCAD).
                </p>
              </div>

              <p>
                Conscients de leur devoir envers la population sénégalaise en général et celle du
                Fouta en particulier, les membres de l'ASFO n'ont jamais cessé de mener des
                activités d'ordre social, pédagogiques et surtout sanitaire à travers son
                programme d'activités.
              </p>

              {/* Reconnaissance nationale */}
              <div className="rounded-2xl border border-amber-100 bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(120,80,10,0.25)] backdrop-blur-sm sm:p-7">
                <p className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-amber-700" style={poppins}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                    <Medal className="h-4 w-4 text-amber-600" aria-hidden="true" />
                  </span>
                  Reconnaissance nationale
                </p>
                <p className="mt-3 text-[15px] leading-7 sm:text-base sm:leading-8">
                  L'ASFO a été élue <strong className="text-gray-900">meilleure association du Sénégal en 2005</strong> par
                  la <strong className="text-gray-900">Direction de la Jeunesse et de la Vie Associative (DJVA)</strong>,
                  et reste à ce jour la seule association récompensée par le Ministère de la
                  Jeunesse pour services rendus à la Nation, distinction remise à{' '}
                  <strong className="text-gray-900">Diamniadio en présence du Président Abdoulaye Wade</strong>.
                </p>
              </div>

              <p>
                Elle a également mené une <strong className="text-gray-900">campagne médicale en Mauritanie</strong> en
                collaboration avec l'<strong className="text-gray-900">Association d'Aide aux Veuves et Orphelins de
                Mauritanie (AVOMM)</strong> démontrant ainsi sa capacité à agir au-delà des frontières
                pour soutenir les plus vulnérables.
              </p>
            </motion.div>

            {/* Frise chronologique */}
            <div className="min-w-0 self-start">
              <motion.h3 {...fadeUp(0)} className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
                Les grandes étapes
              </motion.h3>
              <ol className="relative mt-6 space-y-2 border-l-2 border-teal-100 pl-0">
                {TIMELINE.map((step, i) => (
                  <motion.li
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: 0.08 + i * 0.09, ease: 'easeOut' }}
                    className="group relative -ml-px flex gap-4 rounded-2xl border border-transparent p-4 transition-colors duration-300 hover:border-teal-100 hover:bg-white/80"
                  >
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-teal-100 bg-white shadow-sm transition-colors duration-300 group-hover:bg-teal-50">
                      <step.icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600" style={poppins}>{step.year}</p>
                      <p className="text-[15px] font-bold text-gray-900" style={poppins}>{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">{step.text}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ OBJECTIFS GÉNÉRAUX ════════════════ */}
      <section className={`${sectionBg} pb-24`}>
        <div className="pointer-events-none absolute -left-44 top-10 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp(0)} className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Target className="h-3.5 w-3.5" aria-hidden="true" />
              Nos objectifs
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl" style={poppins}>
              Objectifs{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">généraux</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Trois piliers fondamentaux qui guident notre action humanitaire et notre engagement
              pour un accès équitable aux soins de santé.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {GENERAL_OBJECTIVES.map((obj, i) => (
              <motion.div
                key={obj.title}
                {...fadeUp(0.08 + i * 0.09)}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-b from-white/90 to-teal-50/40 p-8 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)]"
              >
                <span className="absolute right-6 top-5 text-5xl font-extrabold text-teal-600/10 transition-colors duration-300 group-hover:text-teal-600/20" style={poppins} aria-hidden="true">
                  {obj.num}
                </span>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_12px_30px_-10px_rgba(23,128,102,0.6)] transition-transform duration-300 group-hover:scale-110">
                  <obj.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-gray-900" style={poppins}>{obj.title}</h3>
                <div className="mt-2.5 h-1 w-10 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
                <p className="mt-4 flex-1 text-[15px] leading-7 text-gray-600">{obj.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ ACTIONS CONCRÈTES ════════════════ */}
      <section className={`${sectionBg} pb-24`}>
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp(0)} className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
              Objectifs spécifiques
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl" style={poppins}>
              Nos Actions{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">Concrètes</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Sept axes d'intervention prioritaires qui guident notre engagement quotidien sur le terrain.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SPECIFIC_OBJECTIVES.map((obj, i) => (
              <motion.div
                key={obj.title}
                {...fadeUp(0.05 + i * 0.06)}
                className="group relative flex gap-5 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_15px_40px_-22px_rgba(18,63,56,0.28)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_50px_-22px_rgba(18,63,56,0.38)]"
              >
                <div className="flex flex-none flex-col items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 transition-colors duration-300 group-hover:bg-teal-100">
                    <obj.icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-extrabold text-teal-600/60" style={poppins}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="self-center text-[15px] font-medium leading-7 text-gray-700">{obj.title}</p>
                {/* fil conducteur discret */}
                <span className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-teal-200/0 via-teal-300/50 to-teal-200/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ ZONES D'INTERVENTION ════════════════ */}
      <section className={`${sectionBg} pb-24`}>
        <div className="pointer-events-none absolute -right-40 top-32 h-[420px] w-[420px] rounded-full bg-teal-100/30 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp(0)} className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Zones d'intervention
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl" style={poppins}>
              Notre présence sur le{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">territoire</span>
            </h2>
          </motion.div>

          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
            {/* Carte du Sénégal */}
            <motion.div
              {...fadeUp(0.08)}
              className="self-start rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-[0_25px_60px_-30px_rgba(18,63,56,0.35)] backdrop-blur-sm sm:p-9"
            >
              <h3 className="text-lg font-bold text-gray-900" style={poppins}>15 régions du Sénégal + Mauritanie</h3>
              <p className="mt-1.5 text-sm text-gray-600">
                Les points illuminés marquent les régions couvertes — le Fouta (Podor, Matam) et
                Saint-Louis en priorité.
              </p>
              <div className="mt-6">
                <svg
                  ref={mapRef}
                  viewBox={`0 0 ${INTERVENTION_MAP.width} ${INTERVENTION_MAP.height}`}
                  preserveAspectRatio="xMidYMid meet"
                  className="h-auto w-full"
                  role="img"
                  aria-labelledby="about-senegal-map-title about-senegal-map-description"
                >
                  <title id="about-senegal-map-title">
                    Carte géographique du Sénégal et zones d'intervention de l'ASFO
                  </title>
                  <desc id="about-senegal-map-description">
                    Le Sénégal est représenté avec son contour réel et l'enclave de la Gambie.
                    Saint-Louis, Podor et Matam sont les zones prioritaires. Les autres régions
                    couvertes sont indiquées par des points turquoise. La Mauritanie apparaît
                    dans un repère externe.
                  </desc>
                  <defs>
                    <filter id="about-senegal-map-shadow" x="-15%" y="-15%" width="130%" height="130%">
                      <feDropShadow
                        dx="0"
                        dy="5"
                        stdDeviation="6"
                        floodColor="#123f38"
                        floodOpacity="0.12"
                      />
                    </filter>
                  </defs>

                  <path
                    d={SENEGAL_PATH}
                    fill="#e7f8f4"
                    stroke="#78ddcb"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                    filter="url(#about-senegal-map-shadow)"
                  />

                  <text
                    x={GAMBIA_LABEL_POINT.x}
                    y={GAMBIA_LABEL_POINT.y}
                    textAnchor="middle"
                    className="fill-gray-400 text-[10px] font-bold tracking-[0.14em]"
                    style={poppins}
                  >
                    GAMBIE
                  </text>

                  {mauritaniaIntervention.documented && (
                    <g
                      className="hidden sm:block"
                      aria-label="Intervention internationale en Mauritanie"
                    >
                      <line
                        x1={MAURITANIA_CONNECTOR_POINT.x}
                        y1={MAURITANIA_CONNECTOR_POINT.y}
                        x2="520"
                        y2="68"
                        stroke="#4abfa5"
                        strokeWidth="1.6"
                        strokeDasharray="5 5"
                        opacity="0.65"
                      />
                      <circle cx="515" cy="68" r="8" fill="#178066" />
                      <circle cx="515" cy="68" r="13" fill="none" stroke="#7dd9c7" strokeWidth="2" />
                      <rect
                        x="528"
                        y="31"
                        width="140"
                        height="70"
                        rx="16"
                        fill="white"
                        stroke="#b8eadf"
                        strokeWidth="1.5"
                      />
                      <text
                        x="542"
                        y="56"
                        className="fill-teal-900 text-[13px] font-bold"
                        style={poppins}
                      >
                        {mauritaniaIntervention.name}
                      </text>
                      <rect x="542" y="67" width="112" height="20" rx="10" fill="#e5f7f2" />
                      <text
                        x="598"
                        y="81"
                        textAnchor="middle"
                        className="fill-teal-700 text-[8.5px] font-bold"
                        style={poppins}
                      >
                        {mauritaniaIntervention.label}
                      </text>
                    </g>
                  )}

                  {PROJECTED_INTERVENTION_ZONES.map((zone, index) => {
                    const isPriority = zone.status === 'priority';
                    const isActive = activeMapZoneId === zone.id;
                    const tooltipX = Math.min(
                      Math.max(zone.point.x - 87, 10),
                      INTERVENTION_MAP.width - 184,
                    );
                    const tooltipY =
                      zone.point.y < 140 ? zone.point.y + 25 : zone.point.y - 105;

                    return (
                      <g
                        key={zone.id}
                        role={isPriority ? 'button' : undefined}
                        tabIndex={isPriority ? 0 : undefined}
                        aria-label={
                          isPriority
                            ? `${zone.name}, zone d'intervention prioritaire`
                            : `${zone.name}, région couverte`
                        }
                        className={isPriority ? 'cursor-pointer outline-none' : undefined}
                        onMouseEnter={
                          isPriority ? () => setActiveMapZoneId(zone.id) : undefined
                        }
                        onMouseLeave={
                          isPriority ? () => setActiveMapZoneId(null) : undefined
                        }
                        onFocus={
                          isPriority ? () => setActiveMapZoneId(zone.id) : undefined
                        }
                        onClick={
                          isPriority
                            ? () =>
                                setActiveMapZoneId((current) =>
                                  current === zone.id ? null : zone.id,
                                )
                            : undefined
                        }
                        onKeyDown={
                          isPriority
                            ? (event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  setActiveMapZoneId((current) =>
                                    current === zone.id ? null : zone.id,
                                  );
                                }
                                if (event.key === 'Escape') setActiveMapZoneId(null);
                              }
                            : undefined
                        }
                      >
                        <title>
                          {zone.name} — {isPriority ? 'zone prioritaire' : 'région couverte'}
                        </title>

                        {isPriority && (
                          <motion.circle
                            cx={zone.point.x}
                            cy={zone.point.y}
                            fill="#5eead4"
                            initial={{ r: 13, opacity: 0 }}
                            animate={
                              reduce
                                ? { r: isActive ? 20 : 15, opacity: isActive ? 0.32 : 0.18 }
                                : isActive
                                  ? { r: 22, opacity: 0.35 }
                                  : { r: [14, 18, 14], opacity: [0.24, 0.08, 0.24] }
                            }
                            transition={{
                              duration: reduce ? 0 : isActive ? 0.25 : 2.2,
                              repeat: reduce || isActive ? 0 : Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                        )}

                        {isPriority && (
                          <circle
                            cx={zone.point.x}
                            cy={zone.point.y}
                            r="42"
                            fill="transparent"
                            aria-hidden="true"
                          />
                        )}

                        <motion.circle
                          cx={zone.point.x}
                          cy={zone.point.y}
                          r={isPriority ? (isActive ? 10 : 8) : 4.8}
                          fill={isPriority ? '#178066' : '#2ec8b1'}
                          stroke={isPriority ? 'white' : '#e7f8f4'}
                          strokeWidth={isPriority ? 3 : 1.5}
                          initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                          animate={mapInView ? { opacity: 1, scale: 1 } : undefined}
                          transition={{
                            duration: reduce ? 0 : 0.42,
                            delay: reduce ? 0 : 0.12 + index * 0.045,
                            ease: 'easeOut',
                          }}
                          style={{
                            transformOrigin: `${zone.point.x}px ${zone.point.y}px`,
                          }}
                        />

                        {isPriority && (
                          <>
                            <line
                              x1={zone.point.x}
                              y1={zone.point.y - 10}
                              x2={zone.point.x}
                              y2={zone.point.y - 23}
                              className="hidden stroke-teal-700/60 sm:block"
                              strokeWidth="1.2"
                            />
                            <text
                              x={zone.point.x}
                              y={zone.point.y - 29}
                              textAnchor="middle"
                              className="hidden fill-teal-800 text-[13px] font-bold sm:block"
                              style={poppins}
                            >
                              {zone.name}
                            </text>
                          </>
                        )}

                        {isPriority && isActive && (
                          <motion.g
                            className="hidden sm:block"
                            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reduce ? 0 : 0.2 }}
                          >
                            <rect
                              x={tooltipX}
                              y={tooltipY}
                              width="174"
                              height="88"
                              rx="15"
                              fill="#123f38"
                              stroke="#5eead4"
                              strokeWidth="1"
                            />
                            <text
                              x={tooltipX + 14}
                              y={tooltipY + 24}
                              className="fill-white text-[13px] font-bold"
                              style={poppins}
                            >
                              {zone.name}
                            </text>
                            <text
                              x={tooltipX + 14}
                              y={tooltipY + 43}
                              className="fill-teal-100 text-[10px] font-semibold"
                              style={poppins}
                            >
                              Zone d'intervention prioritaire
                            </text>
                            {zone.route && (
                              <a href={zone.route} aria-label={`Voir les missions de ${zone.name}`}>
                                <rect
                                  x={tooltipX + 12}
                                  y={tooltipY + 55}
                                  width="150"
                                  height="23"
                                  rx="11.5"
                                  fill="#2fb391"
                                />
                                <text
                                  x={tooltipX + 87}
                                  y={tooltipY + 70.5}
                                  textAnchor="middle"
                                  className="fill-white text-[9px] font-bold"
                                  style={poppins}
                                >
                                  Voir les missions →
                                </text>
                              </a>
                            )}
                          </motion.g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:hidden">
                {priorityAboutInterventionZones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() =>
                      setActiveMapZoneId((current) => (current === zone.id ? null : zone.id))
                    }
                    className={`rounded-xl border px-2 py-2 text-xs font-bold transition-colors ${
                      activeMapZoneId === zone.id
                        ? 'border-teal-500 bg-teal-50 text-teal-800'
                        : 'border-teal-100 bg-white text-gray-700'
                    }`}
                  >
                    {zone.name}
                  </button>
                ))}
              </div>
              {activeMapZone && (
                <div className="mt-3 rounded-xl border border-teal-200 bg-teal-50/80 p-3 sm:hidden">
                  <p className="text-sm font-bold text-teal-900">{activeMapZone.name}</p>
                  <p className="mt-0.5 text-xs font-medium text-teal-700">
                    Zone d'intervention prioritaire
                  </p>
                  {activeMapZone.route && (
                    <Link
                      to={activeMapZone.route}
                      className="mt-2 inline-flex text-xs font-bold text-teal-700 underline-offset-2 hover:underline"
                    >
                      Voir les missions →
                    </Link>
                  )}
                </div>
              )}
              {mauritaniaIntervention.documented && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-teal-100 bg-white p-3 sm:hidden">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-teal-900">
                    <span className="h-3 w-3 rounded-full border-2 border-teal-300 bg-[#178066]" aria-hidden="true" />
                    {mauritaniaIntervention.name}
                  </span>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700">
                    {mauritaniaIntervention.label}
                  </span>
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex h-4 w-4 items-center justify-center" aria-hidden="true">
                    <span className="absolute h-4 w-4 rounded-full bg-teal-200/70" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-[#178066]" />
                  </span>
                  Zones prioritaires
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-400" aria-hidden="true" /> Régions couvertes
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-teal-300 bg-[#178066]" aria-hidden="true" />
                  Intervention en Mauritanie
                </span>
              </div>
              <Link
                to="/missions/carte"
                className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                Découvrir nos zones d'intervention
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>

            {/* Fouta + zones couvertes */}
            <div className="min-w-0 space-y-6 self-start">
              {/* Le Fouta */}
              <motion.div
                {...fadeUp(0.12)}
                className="rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-[0_25px_60px_-30px_rgba(18,63,56,0.35)] backdrop-blur-sm sm:p-8"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_10px_25px_-10px_rgba(23,128,102,0.6)]">
                    <Stethoscope className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900" style={poppins}>Le Fouta</h3>
                    <p className="text-sm font-semibold text-teal-700">Zone d'intervention prioritaire</p>
                  </div>
                </div>

                <p className="mt-5 text-[15px] leading-7 text-gray-700">
                  L'<strong className="text-gray-900">Action Sanitaire pour le Fouta</strong> œuvre dans le domaine
                  médico-social depuis plus de <strong className="text-gray-900">25 ans</strong>. Elle a couvert
                  plusieurs régions du Sénégal et même la Mauritanie. Cependant, la majeure partie
                  de nos activités se concentrent au <strong className="text-gray-900">Fouta</strong> qui regroupe
                  le département de <strong className="text-gray-900">Podor</strong> et la région de{' '}
                  <strong className="text-gray-900">Matam</strong>.
                </p>

                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
                  <Users className="mt-0.5 h-5 w-5 flex-none text-teal-600" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-gray-700">
                    Chaque année, pendant une semaine, l'ASFO déploie une{' '}
                    <strong className="text-gray-900">équipe médicale de plus de 80 personnes</strong> au Fouta
                    dans le cadre de la grande campagne médicale.
                  </p>
                </div>

                <div className="group relative mt-4 h-44 overflow-hidden rounded-2xl">
                  <img
                    src="/nord-senegal.webp"
                    alt="Carte du Fouta — Nord du Sénégal"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/70 via-transparent to-transparent" aria-hidden="true" />
                  <p className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-teal-800 backdrop-blur-sm" style={poppins}>
                    <MapPin className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                    Nord du Sénégal — Région du Fouta
                  </p>
                </div>

                <p className="mt-4 text-[15px] leading-7 text-gray-700">
                  Le <strong className="text-gray-900">Fouta</strong> est un ancien royaume et un terroir historique
                  dans le nord du Sénégal, bordant la rive gauche du fleuve Sénégal entre Dagana et
                  Bakel. C'est une zone où la santé est difficile d'accès en raison du{' '}
                  <strong className="text-gray-900">manque de structures sanitaires</strong>, du{' '}
                  <strong className="text-gray-900">manque de spécialistes</strong> et du{' '}
                  <strong className="text-gray-900">niveau économique précaire</strong> de la population.
                </p>
              </motion.div>

              {/* Zones couvertes */}
              <motion.div
                {...fadeUp(0.16)}
                className="rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-[0_25px_60px_-30px_rgba(18,63,56,0.35)] backdrop-blur-sm sm:p-8"
              >
                <h3 className="flex items-center gap-2.5 text-lg font-bold text-gray-900" style={poppins}>
                  <Star className="h-5 w-5 text-amber-500" aria-hidden="true" />
                  Zones prioritaires
                </h3>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {['Région de Matam', 'Région de Saint-Louis'].map((region) => (
                    <span
                      key={region}
                      className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_25px_-12px_rgba(23,128,102,0.6)]"
                      style={poppins}
                    >
                      <Star className="h-4 w-4 fill-amber-300 text-amber-300" aria-hidden="true" />
                      {region}
                    </span>
                  ))}
                </div>

                <h4 className="mt-6 flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-teal-700" style={poppins}>
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Autres régions couvertes
                </h4>
                <div className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {PRIMARY_REGIONS.map((region) => (
                    <span key={region} className="inline-flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-300 hover:bg-teal-50">
                      <span className="h-2 w-2 flex-none rounded-full bg-teal-400" aria-hidden="true" />
                      {region}
                    </span>
                  ))}
                  {isRegionsExpanded &&
                    SECONDARY_REGIONS.map((region) => (
                      <span key={region} className="inline-flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-300 hover:bg-teal-50">
                        <span className="h-2 w-2 flex-none rounded-full bg-teal-400" aria-hidden="true" />
                        {region}
                      </span>
                    ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIsRegionsExpanded((v) => !v)}
                  aria-expanded={isRegionsExpanded}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 transition-colors hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  style={poppins}
                >
                  {isRegionsExpanded ? 'Voir moins' : 'Voir plus'}
                  {isRegionsExpanded ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                </button>

                <p className="mt-5 rounded-2xl border border-teal-100 bg-teal-50/60 p-4 text-center text-[13px] italic leading-relaxed text-gray-600">
                  <strong className="not-italic text-gray-800">💡 Notre approche :</strong> nos interventions
                  s'adaptent aux besoins sanitaires identifiés sur le terrain, en collaboration
                  étroite avec les structures locales et les communautés.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ MISSION / VALEURS / IMPACT ════════════════ */}
      <section className={`${sectionBg} pb-24`}>
        <div className="pointer-events-none absolute -left-44 top-24 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp(0)} className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              Nos principes
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl" style={poppins}>
              Notre Mission et{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">Nos Valeurs</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Les principes qui guident chacune de nos actions.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {MISSION_CARDS.map((card, i) => (
              <motion.article
                key={card.title}
                {...fadeUp(0.08 + i * 0.09)}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_65px_-25px_rgba(18,63,56,0.45)]"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={card.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/60 via-transparent to-transparent" aria-hidden="true" />
                  <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 shadow-lg backdrop-blur-sm">
                    <card.icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-xl font-bold text-gray-900" style={poppins}>{card.title}</h3>
                  <div className="mt-2.5 h-1 w-10 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
                  {card.description && (
                    <p className="mt-4 text-sm leading-7 text-gray-600">{card.description}</p>
                  )}
                  {card.values && (
                    <ul className="mt-4 space-y-3.5">
                      {card.values.map((v) => {
                        const ValueIcon = VALUES_ICONS[v.label] ?? Heart;
                        return (
                          <li key={v.label} className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-teal-100 bg-teal-50">
                              <ValueIcon className="h-4 w-4 text-teal-600" aria-hidden="true" />
                            </span>
                            <p className="text-sm leading-relaxed text-gray-600">
                              <strong className="text-gray-900">{v.label}</strong> — {v.desc}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {card.items && (
                    <ul className="mt-4 space-y-2.5">
                      {card.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-600">
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-teal-500" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ NOTRE IDENTITÉ ════════════════ */}
      <section className={`${sectionBg} pb-24`}>
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.h2 {...fadeUp(0)} className="text-center text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>
            Notre identité
          </motion.h2>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {IDENTITY_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                {...fadeUp(0.06 + i * 0.07)}
                className="rounded-3xl border border-white/80 bg-white/80 p-6 text-center shadow-[0_15px_40px_-22px_rgba(18,63,56,0.28)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
                  <pillar.icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
                </span>
                <h3 className="mt-3.5 text-[15px] font-bold text-gray-900" style={poppins}>{pillar.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">{pillar.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className={`${sectionBg} pb-24`}>
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div
            {...fadeUp(0)}
            className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/90 to-teal-50/60 p-10 text-center shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-14"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl" style={poppins}>
              Ensemble, poursuivons cette histoire au service des{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">communautés</span>.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Rejoignez l'ASFO comme bénévole, partenaire ou soutien de nos prochaines missions médicales.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link
                to="/join"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Users className="h-5 w-5" aria-hidden="true" />
                Rejoindre l'ASFO
              </Link>
              <Link
                to="/about/partenaires"
                className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <HandHeart className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Devenir partenaire
              </Link>
              <Link
                to="/donate"
                className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Heart className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Faire un don
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
