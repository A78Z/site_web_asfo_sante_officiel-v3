import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Database,
  Download,
  Eye,
  FileBarChart,
  FileClock,
  FileText,
  HeartHandshake,
  HelpCircle,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
  Stethoscope,
  Target,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  annualImpact,
  archiveIndicators,
  archiveSnapshot,
  availableImpactReports,
  governanceDocuments,
  impactMissions,
  impactReports,
  institutionalIndicators,
  latestImpactReport,
  reportFileMetadata,
  type ImpactIconKey,
} from '../data/impact';
import type { ArchiveMission } from '../data/archives';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.58, delay, ease: 'easeOut' as const },
});

const indicatorIcons: Record<ImpactIconKey, React.ElementType> = {
  missions: Stethoscope,
  patients: Users,
  specialties: Activity,
  archive: Database,
  consultations: HeartHandshake,
  years: CalendarDays,
};

const periods = [
  { id: 'all', label: 'Toutes les années', from: 0, to: 9999 },
  { id: '2020-now', label: "2020–Aujourd'hui", from: 2020, to: 9999 },
  { id: '2010-2019', label: '2010–2019', from: 2010, to: 2019 },
  { id: '2000-2009', label: '2000–2009', from: 2000, to: 2009 },
] as const;

const accountabilityCommitments = [
  {
    icon: ShieldCheck,
    title: 'Transparence',
    text: 'Présenter clairement les données disponibles et leurs limites.',
  },
  {
    icon: BookOpenCheck,
    title: 'Données vérifiées',
    text: 'Relier les indicateurs aux archives et documents réellement présents.',
  },
  {
    icon: FileBarChart,
    title: 'Publication régulière',
    text: 'Enrichir les séries au rythme de la validation des missions et rapports.',
  },
  {
    icon: Target,
    title: 'Amélioration continue',
    text: 'Consolider progressivement la qualité et la traçabilité des informations.',
  },
];

const methodologySteps = [
  {
    icon: Database,
    index: '01',
    title: 'Collecte des données',
    text: 'Les informations disponibles sont rassemblées depuis les fiches de mission et rapports.',
  },
  {
    icon: CheckCircle2,
    index: '02',
    title: 'Vérification',
    text: 'Les fichiers et champs structurés sont contrôlés avant leur affichage public.',
  },
  {
    icon: BarChart3,
    index: '03',
    title: 'Consolidation',
    text: 'Les volumes sont agrégés par année, mission et spécialité sans extrapolation.',
  },
  {
    icon: FileText,
    index: '04',
    title: 'Publication',
    text: 'Seuls les documents réellement disponibles proposent une consultation ou un téléchargement.',
  },
];

const transparencyFaq = [
  {
    question: 'D’où viennent les chiffres publiés ?',
    answer:
      'Les chiffres détaillés proviennent des fiches de mission structurées et des rapports d’activité disponibles dans le projet. Les trois chiffres institutionnels repris dans le hero étaient déjà publiés sur la page Impact et les composants ASFO.',
  },
  {
    question: 'À quelle fréquence sont-ils mis à jour ?',
    answer:
      'Aucune fréquence fixe n’est indiquée dans les données actuelles. La page évolue lorsque de nouvelles missions ou de nouveaux rapports validés sont intégrés.',
  },
  {
    question: 'Comment sont comptabilisés les bénéficiaires ?',
    answer:
      'Les archives en ligne comptabilisent des consultations par mission. Elles ne permettent pas d’affirmer que chaque consultation correspond à une personne unique ; la page distingue donc consultations documentées et référence institutionnelle de patients soignés.',
  },
  {
    question: 'Où consulter les rapports annuels ?',
    answer:
      'La bibliothèque complète est accessible depuis la page Rapports. Seul le rapport 2020 est actuellement disponible au téléchargement ; les autres années restent marquées comme bientôt disponibles.',
  },
  {
    question: 'Les documents financiers sont-ils publics ?',
    answer:
      'Aucun bilan financier, statut ou document de gouvernance validé n’est actuellement présent dans les fichiers publics du projet. Aucun document fictif n’est donc proposé.',
  },
  {
    question: 'Comment signaler une erreur dans les données ?',
    answer:
      'Utilisez la page Contact pour transmettre l’indicateur concerné, sa source et la correction proposée à l’équipe ASFO.',
  },
];

const formatNumber = (value: number) => value.toLocaleString('fr-FR');

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const CountUp: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1400, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion, value, visible]);

  return (
    <span ref={ref}>
      {formatNumber(display)}
      {suffix}
    </span>
  );
};

const ReportActions: React.FC<{
  year: string;
  downloadUrl: string | null;
  isAvailable: boolean;
}> = ({ year, downloadUrl, isAvailable }) => {
  if (!isAvailable || !downloadUrl) {
    return (
      <span
        className="inline-flex min-h-10 cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-400"
        aria-disabled="true"
        title="Le document sera publié après validation."
      >
        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
        Bientôt disponible
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={downloadUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      >
        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
        Prévisualiser
      </a>
      <a
        href={downloadUrl}
        download={`Rapport-ASFO-${year}.pdf`}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        Télécharger
      </a>
    </div>
  );
};

const MissionResultCard: React.FC<{ mission: ArchiveMission }> = ({ mission }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_45px_-36px_rgba(18,63,56,0.5)] md:hidden">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">{mission.year}</p>
        <h3 className="mt-1 font-extrabold text-slate-950" style={poppins}>
          {mission.title}
        </h3>
      </div>
      <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700">
        {formatNumber(mission.consultations)} consultations
      </span>
    </div>
    <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
      <MapPin className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
      {mission.location}
    </p>
    <p className="mt-2 text-xs leading-5 text-slate-600">
      {mission.specialties.length} catégorie{mission.specialties.length > 1 ? 's' : ''} de prise en charge renseignée{mission.specialties.length > 1 ? 's' : ''}.
    </p>
    <Link
      to={`/archives/${mission.id}`}
      className="mt-4 inline-flex min-h-10 items-center gap-2 text-xs font-bold text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
    >
      Voir la mission
      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  </article>
);

const ImpactPage: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [periodId, setPeriodId] = useState('all');
  const [missionQuery, setMissionQuery] = useState('');
  const [missionYear, setMissionYear] = useState('all');
  const [missionLocation, setMissionLocation] = useState('all');
  const [visibleMissions, setVisibleMissions] = useState(8);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = 'Impact & chiffres | ASFO — Action Sanitaire pour le Fouta';
  }, []);

  const activePeriod = periods.find((period) => period.id === periodId) ?? periods[0];

  const filteredAnnualImpact = useMemo(
    () =>
      annualImpact.filter(
        (item) => item.year >= activePeriod.from && item.year <= activePeriod.to,
      ),
    [activePeriod.from, activePeriod.to],
  );

  const filteredSpecialtyImpact = useMemo(() => {
    const missions = impactMissions.filter((mission) => {
      const year = Number(mission.year);
      return year >= activePeriod.from && year <= activePeriod.to;
    });
    const totals = new Map<string, number>();
    missions.forEach((mission) => {
      mission.specialties.forEach((specialty) => {
        totals.set(specialty.name, (totals.get(specialty.name) ?? 0) + specialty.count);
      });
    });
    return [...totals.entries()]
      .map(([name, consultations]) => ({ name, consultations }))
      .sort((a, b) => b.consultations - a.consultations)
      .slice(0, 7);
  }, [activePeriod.from, activePeriod.to]);

  const availableYears = useMemo(
    () => [...new Set(impactMissions.map((mission) => mission.year))].sort((a, b) => Number(b) - Number(a)),
    [],
  );

  const availableLocations = useMemo(
    () => [...new Set(impactMissions.map((mission) => mission.location))].sort((a, b) => a.localeCompare(b, 'fr')),
    [],
  );

  const filteredMissions = useMemo(() => {
    const query = normalize(missionQuery.trim());
    return impactMissions.filter((mission) => {
      const year = Number(mission.year);
      if (year < activePeriod.from || year > activePeriod.to) return false;
      if (missionYear !== 'all' && mission.year !== missionYear) return false;
      if (missionLocation !== 'all' && mission.location !== missionLocation) return false;
      if (
        query &&
        !normalize(`${mission.title} ${mission.location} ${mission.year}`).includes(query)
      ) {
        return false;
      }
      return true;
    });
  }, [
    activePeriod.from,
    activePeriod.to,
    missionLocation,
    missionQuery,
    missionYear,
  ]);

  useEffect(() => {
    setVisibleMissions(8);
  }, [missionLocation, missionQuery, missionYear, periodId]);

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
        <div className="pointer-events-none absolute -right-40 -top-44 h-[540px] w-[540px] rounded-full bg-teal-100/50 blur-[125px]" aria-hidden="true" />
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
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Transparence &amp; redevabilité
            </span>
            <h1
              className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
              style={poppins}
            >
              Mesurer notre impact,{' '}
              <span className="bg-gradient-to-r from-teal-700 to-[#2fb391] bg-clip-text text-transparent">
                rendre compte de nos actions
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Découvrez les résultats, les rapports et les données qui permettent de suivre
              l’évolution des actions menées par l’ASFO au service des communautés.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollTo('key-indicators')}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-[0_16px_36px_-18px_rgba(15,118,110,0.85)] transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                Explorer les chiffres
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link
                to="/rapport"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                Consulter les rapports
                <FileText className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.68, delay: 0.08, ease: 'easeOut' }}
            className="relative"
          >
            <div className="rounded-[2rem] border border-white/90 bg-white/90 p-5 shadow-[0_30px_80px_-44px_rgba(18,63,56,0.5)] backdrop-blur sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Archives documentées
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Consultations par année</p>
                </div>
                <span className="rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700">
                  2016–2024
                </span>
              </div>
              <div className="mt-4 h-52 w-full" role="img" aria-label="Aperçu des consultations documentées par année de campagne">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={annualImpact} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
                    <CartesianGrid stroke="#e2f1ed" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value: number) => [`${formatNumber(value)} consultations`, 'Volume']}
                      labelFormatter={(label) => `Année ${label}`}
                      cursor={{ fill: '#f0fdfa' }}
                    />
                    <Bar dataKey="consultations" fill="#0f766e" radius={[6, 6, 0, 0]} isAnimationActive={!reduceMotion} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {institutionalIndicators.map((indicator) => {
                  const Icon = indicatorIcons[indicator.icon];
                  return (
                    <div key={indicator.id} className="rounded-2xl border border-teal-100 bg-[#f8fcfb] p-3">
                      <Icon className="h-4 w-4 text-teal-600" aria-hidden="true" />
                      <p className="mt-2 text-lg font-black text-slate-950" style={poppins}>
                        {formatNumber(indicator.value)}
                        {indicator.suffix}
                      </p>
                      <p className="mt-0.5 text-[10px] font-semibold leading-4 text-slate-500">
                        {indicator.label}
                      </p>
                    </div>
                  );
                })}
              </div>
              {latestImpactReport && (
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-800">{latestImpactReport.title}</p>
                    <p className="text-[10px] text-slate-500">PDF disponible · {reportFileMetadata[latestImpactReport.year]?.size}</p>
                  </div>
                  <a
                    href={latestImpactReport.downloadUrl ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    Ouvrir
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bande chiffres clés */}
      <section className="border-y border-teal-100 bg-white/80 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {institutionalIndicators.map((indicator, index) => {
            const Icon = indicatorIcons[indicator.icon];
            return (
              <motion.article
                key={indicator.id}
                {...fadeUp(index * 0.06)}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-[#fbfdfc] p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-3xl font-black text-slate-950" style={poppins}>
                    <CountUp value={indicator.value} suffix={indicator.suffix} />
                  </p>
                  <h2 className="mt-1 text-sm font-extrabold text-slate-800">{indicator.label}</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{indicator.period}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Rubriques */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Portail de transparence
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Données, rapports et gouvernance
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <motion.article
              {...fadeUp(0.04)}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_22px_55px_-42px_rgba(18,63,56,0.5)] transition hover:-translate-y-1 hover:border-teal-200"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <BarChart3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                {institutionalIndicators.length + archiveIndicators.length} indicateurs
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-slate-950" style={poppins}>Chiffres clés</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Références institutionnelles et agrégats exacts issus des archives de mission.
              </p>
              <button
                type="button"
                onClick={() => scrollTo('key-indicators')}
                className="mt-6 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                Voir tous les indicateurs
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.article>

            <motion.article
              {...fadeUp(0.09)}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_22px_55px_-42px_rgba(18,63,56,0.5)] transition hover:-translate-y-1 hover:border-teal-200"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                {availableImpactReports.length} document disponible
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-slate-950" style={poppins}>Rapports annuels</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Le rapport 2020 est consultable ; les autres années restent en attente de validation.
              </p>
              <Link
                to="/rapport"
                className="mt-6 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                Consulter les rapports
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.article>

            <motion.article
              {...fadeUp(0.14)}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_22px_55px_-42px_rgba(18,63,56,0.5)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 ring-1 ring-slate-100">
                <Landmark className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-100">
                <FileClock className="h-3 w-3" aria-hidden="true" />
                En préparation
              </span>
              <h3 className="mt-3 text-xl font-extrabold text-slate-950" style={poppins}>Gouvernance &amp; statuts</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Aucun statut, règlement intérieur ou bilan financier validé n’est actuellement public.
              </p>
              <span className="mt-6 inline-flex cursor-not-allowed items-center gap-2 text-sm font-bold text-slate-400" aria-disabled="true">
                Découvrir les documents
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Indicateurs */}
      <section id="key-indicators" className="scroll-mt-24 border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Chiffres clés
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Deux niveaux de lecture, une source clairement identifiée
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Les références institutionnelles sont distinguées des calculs exacts réalisés depuis
              les fiches d’archives actuellement disponibles.
            </p>
          </motion.div>

          <h3 className="mt-12 text-sm font-extrabold uppercase tracking-wider text-slate-500" style={poppins}>
            Références institutionnelles
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {institutionalIndicators.map((indicator, index) => {
              const Icon = indicatorIcons[indicator.icon];
              return (
                <motion.article
                  key={indicator.id}
                  {...fadeUp(index * 0.05)}
                  className="rounded-3xl border border-slate-200 bg-[#fbfdfc] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">
                      {indicator.period}
                    </span>
                  </div>
                  <p className="mt-5 text-4xl font-black text-slate-950" style={poppins}>
                    <CountUp value={indicator.value} suffix={indicator.suffix} />
                  </p>
                  <h4 className="mt-1 text-base font-extrabold text-slate-800">{indicator.label}</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{indicator.description}</p>
                  <p className="mt-4 border-t border-slate-100 pt-4 text-[11px] font-semibold text-slate-400">
                    Source : {indicator.source}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <h3 className="mt-12 text-sm font-extrabold uppercase tracking-wider text-slate-500" style={poppins}>
            Photographie des archives en ligne
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archiveIndicators.map((indicator, index) => {
              const Icon = indicatorIcons[indicator.icon];
              return (
                <motion.article
                  key={indicator.id}
                  {...fadeUp(index * 0.05)}
                  className="rounded-3xl border border-teal-100 bg-gradient-to-br from-white to-teal-50/60 p-6 shadow-[0_20px_52px_-42px_rgba(18,63,56,0.5)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-teal-700 ring-1 ring-teal-100">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-teal-700 ring-1 ring-teal-100">
                      {indicator.period}
                    </span>
                  </div>
                  <p className="mt-5 text-4xl font-black text-slate-950" style={poppins}>
                    <CountUp value={indicator.value} suffix={indicator.suffix} />
                  </p>
                  <h4 className="mt-1 text-base font-extrabold text-slate-800">{indicator.label}</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{indicator.description}</p>
                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-teal-100 pt-4">
                    <p className="text-[11px] font-semibold text-slate-400">Source : {indicator.source}</p>
                    {indicator.sourceHref && (
                      <Link
                        to={indicator.sourceHref}
                        className="shrink-0 text-[11px] font-bold text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      >
                        Voir la source
                      </Link>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visualisations */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
                Données structurées
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
                Évolution des missions documentées
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Les graphiques utilisent exclusivement les volumes contenus dans les archives en ligne.
              </p>
            </div>
            <div className="overflow-x-auto" aria-label="Filtrer les visualisations par période">
              <div className="flex min-w-max gap-2">
                {periods.map((period) => (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => setPeriodId(period.id)}
                    aria-pressed={periodId === period.id}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                      periodId === period.id
                        ? 'bg-teal-700 text-white'
                        : 'border border-slate-200 bg-white text-slate-500 hover:border-teal-200 hover:text-teal-700'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {filteredAnnualImpact.length > 0 ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <motion.figure
                {...fadeUp(0.05)}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_22px_60px_-44px_rgba(18,63,56,0.5)] sm:p-7"
              >
                <figcaption>
                  <p className="font-extrabold text-slate-900" style={poppins}>Consultations par année</p>
                  <p className="mt-1 text-xs text-slate-500">Somme des consultations renseignées dans chaque mission.</p>
                </figcaption>
                <div className="mt-6 h-80 w-full" role="img" aria-label="Histogramme des consultations documentées par année">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredAnnualImpact} margin={{ top: 6, right: 4, left: -12, bottom: 0 }}>
                      <CartesianGrid stroke="#e2f1ed" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value: number) => [`${formatNumber(value)} consultations`, 'Consultations']}
                        labelFormatter={(label) => `Année ${label}`}
                        cursor={{ fill: '#f0fdfa' }}
                      />
                      <Bar dataKey="consultations" fill="#0f766e" radius={[7, 7, 0, 0]} isAnimationActive={!reduceMotion} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <table className="sr-only">
                  <caption>Consultations documentées par année</caption>
                  <thead><tr><th>Année</th><th>Consultations</th></tr></thead>
                  <tbody>
                    {filteredAnnualImpact.map((item) => (
                      <tr key={item.year}><td>{item.year}</td><td>{item.consultations}</td></tr>
                    ))}
                  </tbody>
                </table>
              </motion.figure>

              <motion.figure
                {...fadeUp(0.1)}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_22px_60px_-44px_rgba(18,63,56,0.5)] sm:p-7"
              >
                <figcaption>
                  <p className="font-extrabold text-slate-900" style={poppins}>Principales prises en charge renseignées</p>
                  <p className="mt-1 text-xs text-slate-500">Sept catégories affichées, classées par volume documenté.</p>
                </figcaption>
                <div className="mt-6 h-80 w-full" role="img" aria-label="Histogramme des principales catégories de consultations documentées">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredSpecialtyImpact} layout="vertical" margin={{ top: 6, right: 10, left: 40, bottom: 0 }}>
                      <CartesianGrid stroke="#e2f1ed" strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" width={105} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value: number) => [`${formatNumber(value)} actes renseignés`, 'Volume']}
                        cursor={{ fill: '#f0fdfa' }}
                      />
                      <Bar dataKey="consultations" fill="#2fb391" radius={[0, 7, 7, 0]} isAnimationActive={!reduceMotion} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <table className="sr-only">
                  <caption>Prises en charge documentées par catégorie</caption>
                  <thead><tr><th>Catégorie</th><th>Volume</th></tr></thead>
                  <tbody>
                    {filteredSpecialtyImpact.map((item) => (
                      <tr key={item.name}><td>{item.name}</td><td>{item.consultations}</td></tr>
                    ))}
                  </tbody>
                </table>
              </motion.figure>
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Database className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
              <h3 className="mt-4 font-extrabold text-slate-700" style={poppins}>Aucune donnée structurée pour cette période</h3>
              <p className="mt-2 text-sm text-slate-500">
                Les archives en ligne commencent en {archiveSnapshot.firstYear}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Rapports */}
      <section id="reports" className="scroll-mt-24 border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <motion.div {...fadeUp()} className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
                Rapports annuels
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
                Documents disponibles et publications à venir
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Les boutons de consultation sont actifs uniquement lorsque le PDF existe et contient un document.
              </p>
            </motion.div>
            <Link to="/rapport" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
              Bibliothèque complète
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {latestImpactReport && (
            <motion.article
              {...fadeUp(0.06)}
              className="mt-10 grid overflow-hidden rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-white shadow-[0_28px_70px_-46px_rgba(18,63,56,0.5)] lg:grid-cols-[0.42fr_1fr]"
            >
              <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-teal-700 to-[#2fb391] p-8 text-white">
                <div className="text-center">
                  <FileBarChart className="mx-auto h-12 w-12 text-teal-100" aria-hidden="true" />
                  <p className="mt-5 text-5xl font-black" style={poppins}>{latestImpactReport.year}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-teal-100">Rapport disponible</p>
                </div>
              </div>
              <div className="flex flex-col items-start justify-center p-7 sm:p-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700 ring-1 ring-teal-100">
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                  Disponible
                </span>
                <h3 className="mt-4 text-2xl font-extrabold text-slate-950 sm:text-3xl" style={poppins}>
                  {latestImpactReport.title}
                </h3>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  {latestImpactReport.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="rounded-full bg-slate-50 px-3 py-1.5">{reportFileMetadata[latestImpactReport.year]?.type}</span>
                  <span className="rounded-full bg-slate-50 px-3 py-1.5">{reportFileMetadata[latestImpactReport.year]?.size}</span>
                  <span className="rounded-full bg-slate-50 px-3 py-1.5">Année d’activité {latestImpactReport.year}</span>
                </div>
                <div className="mt-7">
                  <ReportActions
                    year={latestImpactReport.year}
                    downloadUrl={latestImpactReport.downloadUrl}
                    isAvailable={latestImpactReport.isAvailable}
                  />
                </div>
              </div>
            </motion.article>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {impactReports.slice(0, 5).map((report, index) => (
              <motion.article
                key={report.year}
                {...fadeUp(index * 0.04)}
                className="rounded-2xl border border-slate-200 bg-[#fbfdfc] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-slate-200">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                    <Clock3 className="h-3 w-3" aria-hidden="true" />
                    Bientôt disponible
                  </span>
                </div>
                <h3 className="mt-5 font-extrabold text-slate-900" style={poppins}>{report.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Le document sera publié après validation.
                </p>
                <div className="mt-5">
                  <ReportActions
                    year={report.year}
                    downloadUrl={report.downloadUrl}
                    isAvailable={report.isAvailable}
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Gouvernance */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp()}
            className="grid items-center gap-8 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-teal-50/70 p-7 shadow-[0_24px_65px_-46px_rgba(18,63,56,0.5)] sm:p-10 lg:grid-cols-[auto_1fr_auto]"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
              <Landmark className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-extrabold text-slate-950 sm:text-3xl" style={poppins}>
                  Gouvernance &amp; statuts
                </h2>
                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-100">
                  Contenu à venir
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Aucun document de gouvernance validé n’est actuellement disponible dans le projet.
                Les statuts, règlements, organigrammes et bilans ne seront publiés qu’après validation.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-400" aria-disabled="true">
              {governanceDocuments.length} document public
              <FileClock className="h-4 w-4" aria-hidden="true" />
            </span>
          </motion.div>
        </div>
      </section>

      {/* Méthodologie */}
      <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Méthodologie de calcul
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Comment mesurons-nous notre impact ?
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Les chiffres publiés proviennent des données de mission, des rapports d’activité et
              des documents validés par l’ASFO.
            </p>
          </motion.div>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {methodologySteps.map((step, index) => (
              <motion.li
                key={step.title}
                {...fadeUp(index * 0.06)}
                className="relative rounded-3xl border border-slate-200 bg-[#fbfdfc] p-6"
              >
                <span className="absolute right-5 top-4 text-4xl font-black text-slate-100" style={poppins}>
                  {step.index}
                </span>
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="relative mt-5 font-extrabold text-slate-900" style={poppins}>{step.title}</h3>
                <p className="relative mt-3 text-sm leading-7 text-slate-600">{step.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Résultats par mission */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Résultats par mission
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Explorer les fiches documentées
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {archiveSnapshot.missions} missions et {formatNumber(archiveSnapshot.consultations)} consultations sont actuellement structurées dans les archives.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp(0.06)}
            className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_16px_40px_-32px_rgba(18,63,56,0.4)] lg:grid-cols-[1fr_auto_auto]"
          >
            <div className="relative">
              <label htmlFor="mission-impact-search" className="sr-only">Rechercher une mission</label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600" aria-hidden="true" />
              <input
                id="mission-impact-search"
                type="search"
                value={missionQuery}
                onChange={(event) => setMissionQuery(event.target.value)}
                placeholder="Rechercher une mission ou une localité..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdfc] pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
              />
            </div>
            <label>
              <span className="sr-only">Filtrer par année</span>
              <select
                value={missionYear}
                onChange={(event) => setMissionYear(event.target.value)}
                className="h-12 w-full min-w-44 rounded-xl border border-slate-200 bg-[#fbfdfc] px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
              >
                <option value="all">Toutes les années</option>
                {availableYears.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">Filtrer par localité</span>
              <select
                value={missionLocation}
                onChange={(event) => setMissionLocation(event.target.value)}
                className="h-12 w-full min-w-64 rounded-xl border border-slate-200 bg-[#fbfdfc] px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
              >
                <option value="all">Toutes les localités</option>
                {availableLocations.map((location) => <option key={location} value={location}>{location}</option>)}
              </select>
            </label>
          </motion.div>

          <p className="mt-4 text-sm font-semibold text-slate-500" aria-live="polite">
            {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''} trouvée{filteredMissions.length > 1 ? 's' : ''}
          </p>

          <div className="mt-6 space-y-4">
            {filteredMissions.slice(0, visibleMissions).map((mission) => (
              <MissionResultCard key={`mobile-${mission.id}`} mission={mission} />
            ))}
          </div>

          {filteredMissions.length > 0 && (
            <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_52px_-42px_rgba(18,63,56,0.5)] md:block">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Résultats des missions médicales documentées</caption>
                <thead className="bg-slate-50">
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th scope="col" className="px-5 py-4">Mission</th>
                    <th scope="col" className="px-5 py-4">Année</th>
                    <th scope="col" className="px-5 py-4">Localité</th>
                    <th scope="col" className="px-5 py-4 text-right">Consultations</th>
                    <th scope="col" className="px-5 py-4 text-center">Catégories</th>
                    <th scope="col" className="px-5 py-4"><span className="sr-only">Détail</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMissions.slice(0, visibleMissions).map((mission) => (
                    <tr key={mission.id} className="text-sm text-slate-600 transition hover:bg-teal-50/40">
                      <th scope="row" className="px-5 py-4 font-extrabold text-slate-900">{mission.title}</th>
                      <td className="px-5 py-4">{mission.year}</td>
                      <td className="px-5 py-4">{mission.location}</td>
                      <td className="px-5 py-4 text-right font-bold text-teal-700">{formatNumber(mission.consultations)}</td>
                      <td className="px-5 py-4 text-center">{mission.specialties.length}</td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/archives/${mission.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        >
                          Voir
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredMissions.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-9 text-center">
              <Search className="mx-auto h-7 w-7 text-slate-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-slate-600">Aucune mission ne correspond à ces critères.</p>
            </div>
          )}

          {visibleMissions < filteredMissions.length && (
            <div className="mt-7 text-center">
              <button
                type="button"
                onClick={() => setVisibleMissions((count) => count + 8)}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                Afficher plus de missions
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Engagement */}
      <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Engagement et redevabilité
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Documenter, publier et progresser
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              L’ASFO s’engage à documenter ses actions, publier ses résultats et améliorer en permanence ses méthodes d’intervention.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {accountabilityCommitments.map((commitment, index) => (
              <motion.article
                key={commitment.title}
                {...fadeUp(index * 0.06)}
                className="rounded-3xl border border-slate-200 bg-[#fbfdfc] p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <commitment.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-extrabold text-slate-900" style={poppins}>{commitment.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{commitment.text}</p>
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
              FAQ transparence
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Comprendre les données publiées
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Des réponses précises sur les sources, les limites et la disponibilité des documents.
            </p>
            <Link
              to="/contact"
              className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              Signaler une erreur
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>

          <div className="space-y-3">
            {transparencyFaq.map((item, index) => {
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
                      aria-controls={`transparency-answer-${index}`}
                      className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-extrabold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 sm:px-6"
                      style={poppins}
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className="h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                        {item.question}
                      </span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                  </h3>
                  {isOpen && (
                    <div id={`transparency-answer-${index}`} className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-slate-600 sm:px-6">
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
          <div className="relative mx-auto max-w-3xl">
            <ShieldCheck className="mx-auto h-8 w-8 text-teal-500" aria-hidden="true" />
            <h2 className="mt-5 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              La transparence renforce la confiance.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Consultez les rapports, découvrez les résultats des missions et suivez l’évolution des actions menées par l’ASFO.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                { to: '/rapport', label: 'Voir les rapports', primary: true },
                { to: '/archives', label: 'Découvrir les missions' },
                { to: '/contact', label: 'Contacter l’ASFO' },
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

export default ImpactPage;
