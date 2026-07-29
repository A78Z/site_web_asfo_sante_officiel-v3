import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Search,
  Archive,
  TrendingUp,
  CalendarDays,
  MapPin,
  Stethoscope,
  ArrowRight,
  LayoutGrid,
  History,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Landmark,
  Heart,
  Ambulance,
  Users,
} from 'lucide-react';
import { archives, ArchiveMission } from '../data/archives';
import { geolocatedMissions } from '../data/territorialInterventions';
import {
  SENEGAL_MAP_HEIGHT,
  SENEGAL_MAP_WIDTH,
  SENEGAL_OUTLINE_PATH,
  projectSenegalCoordinate,
} from '../data/senegalMap';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const StatCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
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

const MISSION_MAP_POINTS = geolocatedMissions.map((record) => ({
  record,
  ...projectSenegalCoordinate([
    record.geography.longitude,
    record.geography.latitude,
  ]),
}));

/* ------------------------------------------------------------------ */
/* Carte mission                                                        */
/* ------------------------------------------------------------------ */

const MissionCard: React.FC<{ mission: ArchiveMission; featured?: boolean }> = ({ mission, featured = false }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className={`group flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)] ${
      featured ? 'sm:col-span-2' : ''
    }`}
  >
    <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
      <img
        src={mission.imageUrl}
        alt={`Mission médicale — ${mission.title} (${mission.year})`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/70 via-transparent to-transparent" aria-hidden="true" />
      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-teal-800 shadow-sm backdrop-blur-sm" style={poppins}>
        {mission.year}
      </span>
      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#123f38]/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm" style={poppins}>
        <Stethoscope className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
        {mission.consultations.toLocaleString('fr-FR')} consultations
      </span>
    </div>
    <div className="flex flex-1 flex-col p-5">
      <h3 className={`font-bold leading-snug text-gray-900 ${featured ? 'text-xl' : 'text-base'}`} style={poppins}>
        {mission.title}
      </h3>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
        <MapPin className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
        {mission.location}
        <span aria-hidden="true">·</span>
        <CalendarDays className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
        {mission.date}
      </p>
      <p className={`mt-2.5 flex-1 text-[13px] leading-relaxed text-gray-600 ${featured ? 'line-clamp-4' : 'line-clamp-3'}`}>
        {mission.summary}
      </p>
      <Link
        to={`/archives/${mission.id}`}
        className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
        style={poppins}
      >
        {featured ? 'Découvrir la mission' : 'Voir les détails'}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  </motion.article>
);

/* ------------------------------------------------------------------ */
/* Section par année                                                    */
/* ------------------------------------------------------------------ */

const YearBlock: React.FC<{ year: string; missions: ArchiveMission[] }> = ({ year, missions }) => {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? missions : missions.slice(0, 3);
  const totalYear = missions.reduce((s, m) => s + m.consultations, 0);

  return (
    <section id={`annee-${year}`} className="relative scroll-mt-32 border-l-2 border-teal-100 pb-14 pl-6 last:pb-0 sm:pl-10">
      <span className="absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-md" aria-hidden="true" />
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}>{year}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {missions.length} mission{missions.length > 1 ? 's' : ''} ·{' '}
            <strong className="text-teal-700">{totalYear.toLocaleString('fr-FR')}</strong> consultations
          </p>
        </div>
        {missions.length > 3 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/80 bg-white/80 px-4 py-2 text-sm font-bold text-teal-800 shadow-sm transition-all duration-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            style={poppins}
          >
            {expanded ? 'Réduire' : `Afficher plus (${missions.length - 3})`}
            {expanded ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((mission, i) => (
          <MissionCard key={mission.id} mission={mission} featured={i === 0} />
        ))}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

type SortMode = 'recent' | 'ancien' | 'consultations';
type ViewMode = 'grille' | 'chrono';

const ArchivesPage: React.FC = () => {
  const reduce = useReducedMotion();
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<SortMode>('recent');
  const [view, setView] = useState<ViewMode>('grille');

  useEffect(() => {
    document.title = 'Archives | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const years = useMemo(
    () => [...new Set(archives.map((a) => a.year))].sort((a, b) => parseInt(b) - parseInt(a)),
    [],
  );
  const totalConsultations = useMemo(() => archives.reduce((s, a) => s + a.consultations, 0), []);
  const uniqueVillages = useMemo(() => new Set(archives.map((a) => a.location)).size, []);
  const missionsPerYear = useMemo(() => {
    const acc: Record<string, number> = {};
    archives.forEach((a) => { acc[a.year] = (acc[a.year] ?? 0) + 1; });
    return acc;
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(searchTerm.trim());
    const list = archives.filter((a) => {
      if (selectedYear && a.year !== selectedYear) return false;
      if (q && !normalize(`${a.title} ${a.location} ${a.summary}`).includes(q)) return false;
      return true;
    });
    if (sort === 'consultations') return [...list].sort((a, b) => b.consultations - a.consultations);
    return list;
  }, [selectedYear, searchTerm, sort]);

  const byYear = useMemo(() => {
    const acc: Record<string, ArchiveMission[]> = {};
    filtered.forEach((a) => {
      (acc[a.year] ??= []).push(a);
    });
    return acc;
  }, [filtered]);

  const orderedYears = useMemo(() => {
    const ys = Object.keys(byYear).sort((a, b) => (sort === 'ancien' ? parseInt(a) - parseInt(b) : parseInt(b) - parseInt(a)));
    return ys;
  }, [byYear, sort]);

  const reset = () => {
    setSelectedYear('');
    setSearchTerm('');
    setSort('recent');
  };

  const goToYear = (year: string) => {
    setSelectedYear((cur) => (cur === year ? '' : year));
    document.getElementById('resultats')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0" aria-hidden="true">
          <img src="/barre.webp" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e4a3d]/95 via-[#136353]/92 to-[#178066]/90" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.span
              {...fadeUp(0)}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-100 backdrop-blur-sm"
              style={poppins}
            >
              <Archive className="h-3.5 w-3.5" aria-hidden="true" />
              Nos missions humanitaires
            </motion.span>
            <motion.h1
              {...fadeUp(0.08)}
              className="mt-6 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
              style={poppins}
            >
              Archives des{' '}
              <span className="bg-gradient-to-r from-[#3fc9a4] to-[#8ff0d4] bg-clip-text text-transparent">Missions</span>
            </motion.h1>
            <motion.p {...fadeUp(0.16)} className="mx-auto mt-6 max-w-[680px] text-base leading-relaxed text-teal-50/90 sm:text-lg sm:leading-8">
              Explorez l'historique complet des missions médicales d'ASFO, témoins de notre
              engagement constant auprès des communautés du Fouta depuis plus de deux décennies.
            </motion.p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Ambulance, value: archives.length, suffix: '+', label: 'Missions réalisées' },
              { icon: CalendarDays, value: years.length, suffix: '', label: "Années d'activité" },
              { icon: TrendingUp, value: totalConsultations, suffix: '+', label: 'Consultations totales' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fadeUp(0.2 + i * 0.08)}
                className="rounded-2xl border border-white/15 bg-white/10 px-5 py-6 text-center shadow-[0_18px_45px_-25px_rgba(0,0,0,0.5)] backdrop-blur-md"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                  <stat.icon className="h-5 w-5 text-teal-200" aria-hidden="true" />
                </span>
                <p className="mt-3 text-3xl font-extrabold text-white" style={poppins}>
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm text-teal-100/85">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ INTRODUCTION ════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h2 {...fadeUp(0)} className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
            Explorez plus de deux décennies{' '}
            <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
              d'engagement médical
            </span>
          </motion.h2>
          <motion.p {...fadeUp(0.08)} className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Chaque mission est documentée : classée par année et par village, avec son impact
            détaillé, consultation par consultation.
          </motion.p>
          <motion.div {...fadeUp(0.16)} className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-5 py-2.5 text-sm font-bold text-teal-800 shadow-sm" style={poppins}>
              <BookOpen className="h-4 w-4 text-teal-600" aria-hidden="true" />
              {archives.length} missions documentées
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-5 py-2.5 text-sm font-bold text-teal-800 shadow-sm" style={poppins}>
              <Landmark className="h-4 w-4 text-teal-600" aria-hidden="true" />
              Mémoire humanitaire de l'ASFO
            </span>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ PANNEAU DE NAVIGATION ════════════════ */}
      <section id="resultats" className="relative scroll-mt-24 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp(0)}
            className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_12px_35px_-20px_rgba(18,63,56,0.3)] backdrop-blur-sm xl:flex-row xl:items-center xl:justify-between"
          >
            <div className="relative w-full xl:max-w-xs">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600" aria-hidden="true" />
              <label htmlFor="archives-search" className="sr-only">Rechercher une mission ou un lieu</label>
              <input
                id="archives-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une mission, un lieu…"
                className="w-full rounded-full border border-teal-100 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedYear('')}
                aria-pressed={selectedYear === ''}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                  selectedYear === ''
                    ? 'bg-gradient-to-r from-[#2fb391] to-[#178066] text-white shadow-[0_10px_25px_-12px_rgba(23,128,102,0.7)]'
                    : 'border border-teal-100 bg-white text-gray-600 hover:bg-teal-50'
                }`}
                style={poppins}
              >
                Toutes les années
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(selectedYear === year ? '' : year)}
                  aria-pressed={selectedYear === year}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                    selectedYear === year
                      ? 'bg-gradient-to-r from-[#2fb391] to-[#178066] text-white shadow-[0_10px_25px_-12px_rgba(23,128,102,0.7)]'
                      : 'border border-teal-100 bg-white text-gray-600 hover:bg-teal-50'
                  }`}
                  style={poppins}
                >
                  {year}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="archives-sort" className="sr-only">Trier les missions</label>
              <select
                id="archives-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50"
              >
                <option value="recent">Plus récentes</option>
                <option value="ancien">Plus anciennes</option>
                <option value="consultations">Consultations élevées</option>
              </select>
              {([['grille', LayoutGrid], ['chrono', History]] as [ViewMode, React.ElementType][]).map(([key, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setView(key)}
                  aria-pressed={view === key}
                  aria-label={key === 'grille' ? 'Vue grille' : 'Vue chronologie'}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                    view === key ? 'bg-[#123f38] text-white shadow-md' : 'border border-teal-100 bg-white text-gray-600 hover:bg-teal-50'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              ))}
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-bold text-gray-600 transition-all duration-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                style={poppins}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Réinitialiser
              </button>
            </div>
          </motion.div>

          {/* Timeline horizontale des années */}
          <motion.nav
            {...fadeUp(0.08)}
            aria-label="Navigation chronologique"
            className="mt-6 overflow-x-auto pb-2"
          >
            <ol className="flex min-w-max items-center gap-0">
              {years.map((year, i) => (
                <li key={year} className="flex items-center">
                  {i > 0 && <span className="h-px w-8 bg-teal-200 sm:w-14" aria-hidden="true" />}
                  <button
                    type="button"
                    onClick={() => goToYear(year)}
                    aria-pressed={selectedYear === year}
                    className={`group flex flex-col items-center gap-1.5 px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        selectedYear === year
                          ? 'border-[#178066] bg-[#178066] shadow-[0_0_0_5px_rgba(47,179,145,0.2)]'
                          : 'border-teal-300 bg-white group-hover:border-[#178066]'
                      }`}
                      aria-hidden="true"
                    />
                    <span className={`text-sm font-bold ${selectedYear === year ? 'text-teal-700' : 'text-gray-500 group-hover:text-teal-700'}`} style={poppins}>
                      {year}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400">{missionsPerYear[year]} missions</span>
                  </button>
                </li>
              ))}
            </ol>
          </motion.nav>
        </div>
      </section>

      {/* ════════════════ ARCHIVES ════════════════ */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-teal-100 bg-teal-50">
                <Search className="h-8 w-8 text-teal-400" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-2xl font-bold text-gray-900" style={poppins}>Aucune mission trouvée</h3>
              <p className="mx-auto mt-3 max-w-md text-gray-600">
                Aucune mission ne correspond à vos critères. Essayez d'autres filtres ou termes de recherche.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Réinitialiser les filtres
              </button>
            </div>
          ) : view === 'grille' ? (
            <div className="mt-4">
              {orderedYears.map((year) => (
                <YearBlock key={year} year={year} missions={byYear[year]} />
              ))}
            </div>
          ) : (
            /* Vue chronologie */
            <ol className="relative mt-4 border-l-2 border-teal-100 pl-0">
              {orderedYears.map((year) => (
                <li key={year} className="relative pb-10 pl-6 last:pb-0 sm:pl-10">
                  <span className="absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-md" aria-hidden="true" />
                  <h3 className="text-2xl font-extrabold text-gray-900" style={poppins}>{year}</h3>
                  <ul className="mt-4 space-y-3">
                    {byYear[year].map((mission, i) => (
                      <motion.li
                        key={mission.id}
                        initial={{ opacity: 0, x: -18 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3), ease: 'easeOut' }}
                      >
                        <Link
                          to={`/archives/${mission.id}`}
                          className="group flex items-center gap-4 rounded-2xl border border-white/80 bg-white/80 p-3.5 shadow-[0_12px_35px_-22px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                        >
                          <img
                            src={mission.imageUrl}
                            alt=""
                            loading="lazy"
                            className="h-14 w-20 flex-none rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[15px] font-bold text-gray-900" style={poppins}>{mission.title}</p>
                            <p className="flex items-center gap-1.5 text-xs text-gray-500">
                              <MapPin className="h-3 w-3 text-teal-600" aria-hidden="true" />
                              {mission.location}
                            </p>
                          </div>
                          <span className="hidden flex-none rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 sm:block" style={poppins}>
                            {mission.consultations.toLocaleString('fr-FR')} consultations
                          </span>
                          <ArrowRight className="h-4 w-4 flex-none text-teal-600 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* ════════════════ TERRITOIRES PARCOURUS ════════════════ */}
      <section className="relative overflow-hidden pb-20">
        <div className="pointer-events-none absolute -left-44 top-10 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Les territoires{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">parcourus</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
              Nos missions se concentrent dans la vallée du fleuve Sénégal, au Fouta.
              Cliquez sur une année pour filtrer les archives.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="mx-auto max-w-3xl rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-[0_25px_60px_-30px_rgba(18,63,56,0.35)] backdrop-blur-sm sm:p-9">
            <svg
              viewBox={`0 0 ${SENEGAL_MAP_WIDTH} ${SENEGAL_MAP_HEIGHT}`}
              preserveAspectRatio="xMidYMid meet"
              className="h-auto w-full"
              role="img"
              aria-label="Carte géographique du Sénégal — missions disposant de coordonnées validées"
            >
              <path d={SENEGAL_OUTLINE_PATH} className="fill-teal-50 stroke-teal-200" strokeWidth="2" strokeLinejoin="round" />
              <text x="166" y="211" textAnchor="middle" className="fill-teal-700/35 text-[7px] font-bold tracking-[0.18em]" aria-hidden="true">
                GAMBIE
              </text>
              {MISSION_MAP_POINTS.map(({ record, x, y }) => {
                const active = selectedYear === record.mission.year;
                const dimmed = selectedYear !== null && !active;
                return (
                  <g
                    key={record.mission.id}
                    className="cursor-pointer"
                    onClick={() => goToYear(record.mission.year)}
                    role="button"
                    aria-label={`${record.mission.title}, mission ${record.mission.year} — filtrer cette année`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        goToYear(record.mission.year);
                      }
                    }}
                    opacity={dimmed ? 0.3 : 1}
                  >
                    <title>{`${record.mission.title} · ${record.mission.year} · ${record.mission.consultations.toLocaleString('fr-FR')} consultations`}</title>
                    {active && <circle cx={x} cy={y} r={10} className="fill-teal-300/35" />}
                    <circle cx={x} cy={y} r={active ? 5.5 : 3.8} className={active ? 'fill-[#178066]' : 'fill-teal-400 transition-all hover:fill-[#178066]'} />
                  </g>
                );
              })}
            </svg>
            <p className="mt-3 text-center text-xs italic text-gray-500">
              Seules les missions disposant de coordonnées géographiques validées sont représentées.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ RÉSUMÉ D'IMPACT ════════════════ */}
      <section className="relative pb-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-4 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: Ambulance, value: archives.length, suffix: '+', label: 'Missions réalisées' },
            { icon: Stethoscope, value: totalConsultations, suffix: '+', label: 'Consultations' },
            { icon: MapPin, value: uniqueVillages, suffix: '', label: 'Localités visitées' },
            { icon: CalendarDays, value: years.length, suffix: '', label: "Années d'engagement" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              {...fadeUp(0.05 + i * 0.07)}
              className="rounded-2xl border border-white/80 bg-white/80 px-5 py-6 text-center shadow-[0_15px_40px_-20px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
                <stat.icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
              </span>
              <p className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>
                <StatCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp(0)}
            className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/90 to-teal-50/60 p-10 text-center shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-14"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl" style={poppins}>
              Chaque mission laisse une trace durable dans les{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">communautés</span>.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Découvrez nos prochaines campagnes, soutenez nos actions ou proposez une localité
              pour accueillir une mission médicale.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link
                to="/missions/prochaine-campagne"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Ambulance className="h-5 w-5" aria-hidden="true" />
                Voir la prochaine mission
              </Link>
              <Link
                to="/candidature"
                className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Users className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Accueillir une caravane
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

export default ArchivesPage;
