import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Activity,
  Archive,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Compass,
  Filter,
  Focus,
  Fullscreen,
  Layers3,
  List,
  Map as MapIcon,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Stethoscope,
  X,
} from 'lucide-react';
import {
  annualTerritorialImpact,
  interventionLocations,
  interventionPeriods,
  interventionSpecialties,
  interventionYears,
  latestTerritorialMissions,
  latestTerritorialReport,
  territorialMapStatus,
  territorialMissions,
  territorialSnapshot,
  type TerritorialMission,
} from '../data/territorialInterventions';

type ViewMode = 'map' | 'list';
type MapLoadState = 'loading' | 'ready' | 'error';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const InterventionsMapPage: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [activePeriod, setActivePeriod] = useState('');
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mapLoadState, setMapLoadState] = useState<MapLoadState>('loading');
  const [mapReloadKey, setMapReloadKey] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'map';
    return window.localStorage.getItem('asfo-interventions-view') === 'list' ? 'list' : 'map';
  });

  useEffect(() => {
    document.title = 'Carte des interventions | ASFO';
  }, []);

  useEffect(() => {
    window.localStorage.setItem('asfo-interventions-view', viewMode);
  }, [viewMode]);

  const filteredMissions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fr');
    const period = interventionPeriods.find(({ id }) => id === activePeriod);

    return territorialMissions.filter(({ mission }) => {
      const missionYear = Number(mission.year);
      const matchesQuery =
        !normalizedQuery ||
        mission.location.toLocaleLowerCase('fr').includes(normalizedQuery) ||
        mission.title.toLocaleLowerCase('fr').includes(normalizedQuery);
      const matchesYear = !year || mission.year === year;
      const matchesLocation = !location || mission.location === location;
      const matchesSpecialty =
        !specialty || mission.specialties.some(({ name }) => name === specialty);
      const matchesPeriod =
        !period || (missionYear >= period.start && missionYear <= period.end);

      return matchesQuery && matchesYear && matchesLocation && matchesSpecialty && matchesPeriod;
    });
  }, [activePeriod, location, query, specialty, year]);

  const filteredConsultations = useMemo(
    () =>
      filteredMissions.reduce(
        (total, { mission }) => total + mission.consultations,
        0,
      ),
    [filteredMissions],
  );

  const maxAnnualConsultations = Math.max(
    ...annualTerritorialImpact.map(({ consultations }) => consultations),
  );
  const peakYear = annualTerritorialImpact.reduce((highest, current) =>
    current.consultations > highest.consultations ? current : highest,
  );

  const hasActiveFilters = Boolean(query || year || location || specialty || activePeriod);

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-70px' },
          transition: { duration: 0.5, delay, ease: 'easeOut' as const },
        };

  const resetFilters = () => {
    setQuery('');
    setYear('');
    setLocation('');
    setSpecialty('');
    setActivePeriod('');
    setSelectedMissionId(null);
  };

  const selectPeriod = (periodId: string) => {
    setActivePeriod((current) => (current === periodId ? '' : periodId));
    setYear('');
    document.getElementById('observatoire')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const enterFullscreen = async () => {
    if (mapContainerRef.current?.requestFullscreen) {
      await mapContainerRef.current.requestFullscreen();
    }
  };

  const filterPanel = (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-700">Affiner les résultats</p>
          <h3 className="mt-1 text-lg font-black text-slate-950">Filtres</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-black text-slate-500 transition hover:bg-slate-100 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <RotateCcw size={14} aria-hidden="true" /> Réinitialiser
          </button>
        )}
      </div>

      <div>
        <label htmlFor="mission-search" className="mb-2 block text-sm font-bold text-slate-700">
          Rechercher un village
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="mission-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ex. Sadel, Guédé…"
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <div>
          <label htmlFor="mission-year" className="mb-2 block text-sm font-bold text-slate-700">
            Année
          </label>
          <select
            id="mission-year"
            value={year}
            onChange={(event) => {
              setYear(event.target.value);
              setActivePeriod('');
            }}
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
          >
            <option value="">Toutes les années</option>
            {interventionYears.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mission-location" className="mb-2 block text-sm font-bold text-slate-700">
            Village ou localité
          </label>
          <select
            id="mission-location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
          >
            <option value="">Toutes les localités</option>
            {interventionLocations.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mission-specialty" className="mb-2 block text-sm font-bold text-slate-700">
            Spécialité
          </label>
          <select
            id="mission-specialty"
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
          >
            <option value="">Toutes les spécialités</option>
            {interventionSpecialties.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mission-type" className="mb-2 block text-sm font-bold text-slate-700">
            Type d’intervention
          </label>
          <select
            id="mission-type"
            value="Campagne médicale"
            disabled
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600"
          >
            <option>Campagne médicale</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Résultats visibles</p>
        <p className="mt-1 text-2xl font-black text-slate-950">{filteredMissions.length}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {filteredConsultations.toLocaleString('fr-FR')} consultations documentées
        </p>
      </div>
    </div>
  );

  const renderMissionCard = ({ mission }: TerritorialMission, compact = false) => {
    const selected = selectedMissionId === mission.id;
    const documentedSpecialties = mission.specialties.filter(({ count }) => count > 0);

    return (
      <article
        key={mission.id}
        onMouseEnter={() => setSelectedMissionId(mission.id)}
        onFocus={() => setSelectedMissionId(mission.id)}
        className={`group overflow-hidden rounded-[24px] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
          selected ? 'border-teal-400 ring-4 ring-teal-50' : 'border-slate-200'
        }`}
      >
        <div className={`relative overflow-hidden ${compact ? 'aspect-[16/9]' : 'aspect-[5/3]'}`}>
          <img
            src={mission.imageUrl}
            alt={`Mission médicale ASFO à ${mission.location} en ${mission.year}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-teal-800 shadow-sm">
            {mission.year}
          </span>
          <p className="absolute bottom-4 left-4 right-4 text-lg font-black text-white">{mission.location}</p>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {mission.consultations > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800">
                <Activity size={13} aria-hidden="true" />
                {mission.consultations.toLocaleString('fr-FR')} consultations
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              <Stethoscope size={13} aria-hidden="true" />
              {documentedSpecialties.length} spécialités
            </span>
          </div>
          {!compact && (
            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{mission.summary}</p>
          )}
          <Link
            to={`/archives/${mission.id}`}
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-black text-teal-700 transition hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            Voir la mission <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </article>
    );
  };

  return (
    <div className="overflow-x-clip bg-[linear-gradient(180deg,#f5fbfa_0%,#ffffff_25%,#f4fbfa_100%)] text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-teal-100">
        <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 top-12 h-96 w-96 rounded-full bg-cyan-100/45 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-teal-800 shadow-sm backdrop-blur">
              <Compass size={15} aria-hidden="true" /> Missions &amp; Campagnes
            </span>
            <h1
              className="mt-6 max-w-3xl text-4xl font-black leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[60px]"
              style={poppins}
            >
              Visualisez l’impact territorial de l’ASFO
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Explorez les villages, les régions et les campagnes médicales couvertes par l’ASFO
              depuis sa création.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  document.getElementById('observatoire')?.scrollIntoView({
                    behavior: reduceMotion ? 'auto' : 'smooth',
                  })
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:text-base"
              >
                Explorer la carte <MapIcon size={18} aria-hidden="true" />
              </button>
              <Link
                to="/archives"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:text-base"
              >
                Voir les archives <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <CheckCircle2 size={17} className="text-teal-700" aria-hidden="true" />
              Données issues des missions et rapports validés de l’ASFO
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.58, delay: 0.08 }}
            className="relative mx-auto w-full max-w-[590px] pb-16 lg:mx-0"
          >
            <div className="relative overflow-hidden rounded-[30px] border-[7px] border-white bg-[#eaf5f2] shadow-[0_32px_90px_-38px_rgba(15,118,110,0.5)]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(15,118,110,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,0.08)_1px,transparent_1px)] bg-[size:38px_38px]" />
              <div className="relative grid min-h-[380px] place-items-center p-8 text-center sm:min-h-[430px]">
                <div className="max-w-sm">
                  <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-teal-200 bg-white text-teal-700 shadow-xl">
                    <MapIcon size={36} aria-hidden="true" />
                  </span>
                  <span className="mt-6 inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-amber-800 ring-1 ring-amber-200">
                    {territorialMapStatus.label}
                  </span>
                  <h2 className="mt-4 text-xl font-black text-slate-950">Cartographie des missions validées</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Aucun marqueur non vérifié n’est publié. Les archives sont déjà consultables et filtrables.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-2 left-3 rounded-2xl border border-white bg-white/95 p-4 shadow-xl backdrop-blur sm:left-8">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Archives documentées</p>
              <p className="mt-1 text-lg font-black text-slate-950">
                {territorialSnapshot.firstYear}–{territorialSnapshot.lastYear}
              </p>
            </div>
            <div className="absolute -bottom-2 right-3 rounded-2xl border border-white bg-white/95 p-4 shadow-xl backdrop-blur sm:right-8">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Résultats</p>
              <p className="mt-1 text-lg font-black text-teal-800">Mission par mission</p>
            </div>
            <div className="absolute -right-2 top-5 rounded-2xl border border-white bg-white/95 p-4 shadow-xl backdrop-blur sm:-right-5 sm:top-8">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">ASFO</p>
              <p className="mt-1 text-sm font-black text-slate-950">Missions depuis 2000</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="relative z-10 -mt-2 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 rounded-[26px] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:grid-cols-2 sm:p-5 lg:grid-cols-5">
          {[
            { icon: Archive, value: territorialSnapshot.missions, label: 'Missions documentées', source: `${territorialSnapshot.firstYear}–${territorialSnapshot.lastYear}` },
            { icon: MapPin, value: territorialSnapshot.locations, label: 'Localités distinctes', source: 'Archives en ligne' },
            { icon: Activity, value: territorialSnapshot.consultations, label: 'Consultations', source: 'Somme des fiches' },
            { icon: Stethoscope, value: territorialSnapshot.specialties, label: 'Spécialités documentées', source: 'Catégories d’archives' },
            { icon: CalendarDays, value: interventionYears.length, label: 'Années renseignées', source: 'Archives structurées' },
          ].map(({ icon: Icon, value, label, source }) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-4">
              <Icon size={19} className="text-teal-700" aria-hidden="true" />
              <p className="mt-3 text-2xl font-black text-slate-950">{value.toLocaleString('fr-FR')}</p>
              <p className="mt-1 text-sm font-black text-slate-800">{label}</p>
              <p className="mt-1 text-xs text-slate-500">{source}</p>
            </div>
          ))}
        </div>
      </section>

      <main>
        {/* Trois rubriques */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="mb-8 max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Explorer les interventions</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
              Trois portes d’entrée vers l’impact de l’ASFO
            </h2>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-3">
            <motion.article {...reveal()} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
              <div className="relative grid aspect-[16/8] place-items-center overflow-hidden bg-teal-50">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(15,118,110,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,0.08)_1px,transparent_1px)] bg-[size:30px_30px]" />
                <MapIcon size={46} className="relative text-teal-700" aria-hidden="true" />
              </div>
              <div className="p-6">
                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-800 ring-1 ring-amber-200">
                  {territorialMapStatus.label}
                </span>
                <h3 className="mt-4 text-xl font-black text-slate-950">Carte interactive</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{territorialMapStatus.description}</p>
                {!territorialMapStatus.ready && (
                  <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-black text-slate-400" aria-disabled="true">
                    Ouverture après validation des localisations
                  </span>
                )}
              </div>
            </motion.article>

            <motion.article {...reveal(0.06)} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
              <div className="grid aspect-[16/8] grid-cols-3 gap-1 overflow-hidden">
                {latestTerritorialMissions.slice(0, 3).map(({ mission }) => (
                  <img key={mission.id} src={mission.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                ))}
              </div>
              <div className="p-6">
                <span className="text-xs font-black uppercase tracking-wide text-teal-700">
                  {territorialSnapshot.firstYear}–{territorialSnapshot.lastYear}
                </span>
                <h3 className="mt-3 text-xl font-black text-slate-950">Archives des missions</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Les fiches détaillées, photographies, spécialités et résultats de chaque campagne documentée.
                </p>
                <Link to="/archives" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900">
                  Explorer les archives <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </motion.article>

            <motion.article {...reveal(0.12)} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
              <div className="flex aspect-[16/8] items-end gap-2 bg-gradient-to-br from-sky-50 to-teal-50 p-6">
                {annualTerritorialImpact.slice(-6).map((item) => (
                  <div key={item.year} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg bg-teal-600/80"
                      style={{ height: `${Math.max(16, (item.consultations / maxAnnualConsultations) * 105)}px` }}
                    />
                    <span className="text-[10px] font-bold text-slate-500">{item.year}</span>
                  </div>
                ))}
              </div>
              <div className="p-6">
                <span className="text-xs font-black uppercase tracking-wide text-teal-700">
                  {latestTerritorialReport ? `Rapport disponible : ${latestTerritorialReport.year}` : 'Rapports ASFO'}
                </span>
                <h3 className="mt-3 text-xl font-black text-slate-950">Résultats &amp; rapports</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Consultez les bilans disponibles et l’évolution annuelle des consultations documentées.
                </p>
                <Link to="/rapport" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900">
                  Consulter les résultats <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          </div>
        </section>

        {/* Timeline */}
        <section className="border-y border-slate-200 bg-white/70 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="shrink-0">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-700">Frise des interventions</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">Parcourir par période</h2>
              </div>
              <div className="flex min-w-0 gap-2 overflow-x-auto pb-2 lg:justify-end">
                {interventionPeriods.map((period) => {
                  const active = activePeriod === period.id;
                  const count = territorialMissions.filter(({ mission }) => {
                    const missionYear = Number(mission.year);
                    return missionYear >= period.start && missionYear <= period.end;
                  }).length;

                  return (
                    <button
                      key={period.id}
                      type="button"
                      onClick={() => selectPeriod(period.id)}
                      className={`min-h-12 shrink-0 rounded-xl border px-4 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                        active
                          ? 'border-teal-700 bg-teal-700 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
                      }`}
                    >
                      <span className="block text-sm font-black">{period.label}</span>
                      <span className={`mt-0.5 block text-xs ${active ? 'text-white/75' : 'text-slate-400'}`}>
                        {count} mission{count > 1 ? 's' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Observatoire principal */}
        <section id="observatoire" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Observatoire territorial</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                Rechercher une intervention
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Filtrez les archives par année, localité ou spécialité. La vue cartographique ne
                publie que les positions officiellement validées.
              </p>
            </div>

            <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm" aria-label="Mode d’affichage">
              {[
                { id: 'map' as const, label: 'Vue carte', icon: MapIcon },
                { id: 'list' as const, label: 'Vue liste', icon: List },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setViewMode(id)}
                  aria-pressed={viewMode === id}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                    viewMode === id ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} aria-hidden="true" /> {label}
                </button>
              ))}
            </div>
          </motion.div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 text-sm font-black text-teal-800 xl:hidden"
          >
            <Filter size={17} aria-hidden="true" /> Filtres · {filteredMissions.length} résultats
          </button>

          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-[70] xl:hidden" role="dialog" aria-modal="true" aria-label="Filtres des missions">
              <button
                type="button"
                aria-label="Fermer les filtres"
                onClick={() => setMobileFiltersOpen(false)}
                className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
              />
              <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-lg font-black text-slate-950">Filtrer les missions</p>
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
                    aria-label="Fermer"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
                {filterPanel}
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="mt-6 min-h-12 w-full rounded-xl bg-teal-700 px-5 text-sm font-black text-white"
                >
                  Afficher {filteredMissions.length} résultat{filteredMissions.length > 1 ? 's' : ''}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 grid items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="sticky top-24 hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm xl:block">
              {filterPanel}
            </aside>

            <div className="min-w-0">
              {viewMode === 'map' ? (
                <div>
                  <div
                    ref={mapContainerRef}
                    className="relative min-h-[480px] overflow-hidden rounded-[28px] border border-slate-200 bg-[#e8f2ef] shadow-sm sm:min-h-[560px]"
                  >
                    <iframe
                      key={mapReloadKey}
                      title="Carte OpenStreetMap du Sénégal et de la vallée du fleuve"
                      src="https://www.openstreetmap.org/export/embed.html?bbox=-17.75%2C12.0%2C-11.0%2C17.1&layer=mapnik"
                      loading="lazy"
                      onLoad={() => setMapLoadState('ready')}
                      onError={() => setMapLoadState('error')}
                      className="absolute inset-0 h-full w-full border-0"
                    />

                    {mapLoadState === 'loading' && (
                      <div className="absolute inset-0 grid place-items-center bg-[#e8f2ef] p-6 text-center">
                        <div>
                          <span className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                            <MapIcon size={26} aria-hidden="true" />
                          </span>
                          <p className="mt-4 text-sm font-black text-slate-800">Chargement du fond cartographique…</p>
                        </div>
                      </div>
                    )}

                    {mapLoadState === 'error' && (
                      <div className="absolute inset-0 grid place-items-center bg-[#edf5f3] p-6 text-center">
                        <div className="max-w-sm">
                          <MapIcon size={32} className="mx-auto text-teal-700" aria-hidden="true" />
                          <p className="mt-4 font-black text-slate-900">La carte ne peut pas être chargée</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            La vue liste et les archives restent entièrement disponibles.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/95 px-3 py-2 text-xs font-black text-amber-800 shadow-md backdrop-blur">
                        {territorialMapStatus.label}
                      </span>
                      <span className="rounded-full bg-white/95 px-3 py-2 text-xs font-black text-slate-700 shadow-md backdrop-blur">
                        {territorialSnapshot.geolocatedMissions} marqueur publié
                      </span>
                    </div>

                    <div className="absolute right-4 top-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMapLoadState('loading');
                          setMapReloadKey((key) => key + 1);
                        }}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md backdrop-blur transition hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        aria-label="Recentrer la carte"
                      >
                        <Focus size={18} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void enterFullscreen()}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md backdrop-blur transition hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        aria-label="Afficher la carte en plein écran"
                      >
                        <Fullscreen size={18} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-lg backdrop-blur sm:left-auto sm:max-w-md">
                      <p className="flex items-center gap-2 text-sm font-black text-slate-900">
                        <Layers3 size={17} className="text-teal-700" aria-hidden="true" />
                        Légende
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full border-2 border-teal-600 bg-white" />
                          Campagne médicale validée
                        </span>
                      </div>
                      {!territorialMapStatus.ready && (
                        <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
                          Aucun marqueur n’est affiché tant que les coordonnées et leur source ne sont pas validées.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-950">Missions correspondant aux filtres</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {filteredMissions.length} résultat{filteredMissions.length > 1 ? 's' : ''} dans les archives
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className="hidden min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-black text-slate-700 hover:border-teal-300 hover:text-teal-700 sm:inline-flex"
                    >
                      <List size={16} aria-hidden="true" /> Tout afficher
                    </button>
                  </div>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    {filteredMissions.slice(0, 6).map((item) => renderMissionCard(item, true))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {filteredConsultations.toLocaleString('fr-FR')} consultations documentées
                      </p>
                    </div>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-black text-slate-700 hover:border-teal-300 hover:text-teal-700"
                      >
                        <RotateCcw size={15} aria-hidden="true" /> Réinitialiser
                      </button>
                    )}
                  </div>

                  {filteredMissions.length > 0 ? (
                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      {filteredMissions.map((item) => renderMissionCard(item))}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[26px] border border-dashed border-slate-300 bg-white p-10 text-center">
                      <SlidersHorizontal size={32} className="mx-auto text-teal-700" aria-hidden="true" />
                      <h3 className="mt-4 text-lg font-black text-slate-900">Aucune mission ne correspond à ces filtres</h3>
                      <p className="mt-2 text-sm text-slate-500">Modifiez vos critères ou réinitialisez la recherche.</p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-black text-white"
                      >
                        <RotateCcw size={15} aria-hidden="true" /> Réinitialiser
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Résultats annuels */}
        <section className="border-y border-slate-200 bg-white/75 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
            <motion.div {...reveal()}>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Résultats documentés</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                Évolution annuelle des consultations
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Le graphique additionne exclusivement les consultations renseignées dans les fiches
                d’archives. L’année {peakYear.year} présente le volume documenté le plus élevé avec{' '}
                {peakYear.consultations.toLocaleString('fr-FR')} consultations.
              </p>
              <Link to="/impact" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900">
                Consulter tous les chiffres <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.div {...reveal(0.08)} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <BarChart3 size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-black text-slate-950">Consultations par année documentée</h3>
                  <p className="text-xs text-slate-500">Source : archives des missions ASFO</p>
                </div>
              </div>
              <div className="mt-8 flex h-64 items-end gap-2 sm:gap-4" aria-hidden="true">
                {annualTerritorialImpact.map((item) => (
                  <div key={item.year} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="text-[10px] font-black text-slate-500 opacity-0 transition group-hover:opacity-100">
                      {item.consultations.toLocaleString('fr-FR')}
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-teal-700 to-teal-400 transition group-hover:from-teal-800 group-hover:to-teal-500"
                      style={{ height: `${Math.max(8, (item.consultations / maxAnnualConsultations) * 205)}px` }}
                    />
                    <span className="text-[10px] font-bold text-slate-500 sm:text-xs">{item.year}</span>
                  </div>
                ))}
              </div>
              <table className="sr-only">
                <caption>Consultations documentées par année</caption>
                <thead><tr><th>Année</th><th>Missions</th><th>Consultations</th></tr></thead>
                <tbody>
                  {annualTerritorialImpact.map((item) => (
                    <tr key={item.year}>
                      <td>{item.year}</td>
                      <td>{item.missions}</td>
                      <td>{item.consultations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* Archives liées */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Archives liées</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                Retrouvez les missions dans les archives
              </h2>
            </div>
            <Link to="/archives" className="inline-flex min-h-11 items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900">
              Toutes les missions <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latestTerritorialMissions.map((item) => (
              <motion.div key={item.mission.id} {...reveal(0.04)}>
                {renderMissionCard(item, true)}
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
          <motion.div
            {...reveal()}
            className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-teal-200 bg-[linear-gradient(135deg,#ecfdf8_0%,#f0fdfa_55%,#eff6ff_100%)] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14"
          >
            <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-teal-200/35 blur-3xl" />
            <div className="relative">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                <Compass size={27} aria-hidden="true" />
              </span>
              <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                Découvrez l’impact de l’ASFO, territoire après territoire.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Explorez les missions passées, consultez leurs résultats et suivez les prochaines campagnes médicales.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                {[
                  { to: '/archives', label: 'Voir les archives', primary: true },
                  { to: '/rapport', label: 'Consulter les rapports' },
                  { to: '/missions/prochaine-campagne', label: 'Découvrir la prochaine campagne' },
                ].map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black transition hover:-translate-y-0.5 ${
                      action.primary
                        ? 'bg-teal-700 text-white shadow-lg shadow-teal-900/10 hover:bg-teal-800'
                        : 'border border-slate-300 bg-white text-slate-800 hover:border-teal-300 hover:text-teal-700'
                    }`}
                  >
                    {action.label} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default InterventionsMapPage;
