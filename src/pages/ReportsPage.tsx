import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  FileText,
  Download,
  Search,
  X,
  RotateCcw,
  LayoutGrid,
  List,
  Clock,
  Eye,
  ArrowRight,
  CalendarDays,
  ScrollText,
  BarChart3,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ShieldCheck,
  Heart,
  Handshake,
  Sparkles,
} from 'lucide-react';
import {
  REPORTS,
  TOTAL_REPORTS,
  AVAILABLE_REPORTS,
  LATEST_AVAILABLE,
  FIRST_YEAR,
  LAST_YEAR,
  getReport,
  type Report,
} from '../data/reports';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* ------------------------------------------------------------------ */
/* Constantes de filtrage (dérivées de la source unique)              */
/* ------------------------------------------------------------------ */

const PERIODS = [
  { id: 'tous', label: 'Toutes les périodes', min: FIRST_YEAR, max: LAST_YEAR },
  { id: '2020', label: '2020 – 2025', min: 2020, max: 2025 },
  { id: '2010', label: '2010 – 2019', min: 2010, max: 2019 },
  { id: '2000', label: '2000 – 2009', min: 2000, max: 2009 },
] as const;

const DECADES = [
  {
    id: 'periode-2020',
    label: '2020 – 2025',
    min: 2020,
    max: 2025,
    note: 'La reprise post-pandémie et la modernisation des campagnes médicales.',
  },
  {
    id: 'periode-2010',
    label: '2010 – 2019',
    min: 2010,
    max: 2019,
    note: "Une décennie d'expansion des missions à travers le Fouta.",
  },
  {
    id: 'periode-2000',
    label: '2000 – 2009',
    min: 2000,
    max: 2009,
    note: "Les premières campagnes sanitaires et la construction du réseau ASFO.",
  },
] as const;

const RECENT_YEARS = ['2025', '2024', '2023'];

/* ------------------------------------------------------------------ */
/* Sous-composants                                                    */
/* ------------------------------------------------------------------ */

const StatusBadge: React.FC<{ available: boolean; className?: string }> = ({
  available,
  className = '',
}) =>
  available ? (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold text-teal-700 ${className}`}
      style={poppins}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
      Disponible
    </span>
  ) : (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700 ${className}`}
      style={poppins}
    >
      <Clock className="h-3 w-3" aria-hidden="true" />
      Bientôt disponible
    </span>
  );

const DownloadButton: React.FC<{ report: Report; compact?: boolean }> = ({
  report,
  compact = false,
}) => {
  if (report.isAvailable && report.downloadUrl) {
    return (
      <a
        href={report.downloadUrl}
        download={`Rapport-ASFO-${report.year}.pdf`}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] font-bold text-white shadow-[0_12px_30px_-12px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 ${
          compact ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-sm'
        }`}
        style={poppins}
      >
        <Download className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
        Télécharger
      </a>
    );
  }
  return (
    <span
      className={`inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 font-semibold text-gray-400 ${
        compact ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-sm'
      }`}
      aria-disabled="true"
      title="Le document sera publié après validation."
      style={poppins}
    >
      <Clock className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
      Bientôt disponible
    </span>
  );
};

const PreviewButton: React.FC<{ report: Report; onPreview: (r: Report) => void }> = ({
  report,
  onPreview,
}) => {
  if (!report.isAvailable) return null;
  return (
    <button
      type="button"
      onClick={() => onPreview(report)}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200 bg-white px-5 py-2.5 text-sm font-bold text-teal-700 transition-all duration-300 hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60"
      style={poppins}
    >
      <Eye className="h-4 w-4" aria-hidden="true" />
      Prévisualiser
    </button>
  );
};

/* Carte (vue grille) --------------------------------------------------- */
const ReportCard: React.FC<{ report: Report; onPreview: (r: Report) => void }> = ({
  report,
  onPreview,
}) => (
  <motion.article
    {...fadeUp()}
    className={`group flex h-full flex-col rounded-2xl border bg-white/85 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
      report.isAvailable
        ? 'border-teal-100 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] hover:shadow-[0_24px_55px_-25px_rgba(18,63,56,0.4)]'
        : 'border-gray-100 shadow-[0_14px_40px_-28px_rgba(18,63,56,0.25)]'
    }`}
  >
    <div className="mb-4 flex items-start justify-between gap-3">
      <div
        className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl ${
          report.isAvailable ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-400'
        }`}
      >
        <FileText className="h-6 w-6" aria-hidden="true" />
      </div>
      <StatusBadge available={report.isAvailable} />
    </div>

    <span
      className="text-3xl font-extrabold leading-none text-[#123f38]"
      style={poppins}
    >
      {report.year}
    </span>
    <h3 className="mt-2 text-base font-bold text-gray-800" style={poppins}>
      {report.title}
    </h3>
    <p className="mt-2 flex-grow text-sm leading-relaxed text-gray-600">
      {report.description}
    </p>

    <div className="mt-5 flex flex-wrap items-center gap-2.5">
      <DownloadButton report={report} compact />
      {report.isAvailable && (
        <button
          type="button"
          onClick={() => onPreview(report)}
          className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-bold text-teal-700 transition-all hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          style={poppins}
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          Prévisualiser
        </button>
      )}
    </div>
    {!report.isAvailable && (
      <p className="mt-3 text-xs text-gray-400">
        Le document sera publié après validation.
      </p>
    )}
  </motion.article>
);

/* Ligne (vue liste) --------------------------------------------------- */
const ReportRow: React.FC<{ report: Report; onPreview: (r: Report) => void }> = ({
  report,
  onPreview,
}) => (
  <motion.div
    {...fadeUp()}
    className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white/85 p-4 backdrop-blur-sm transition-all duration-300 hover:border-teal-100 hover:shadow-[0_18px_45px_-30px_rgba(18,63,56,0.35)] sm:flex-row sm:items-center sm:gap-5 sm:p-5"
  >
    <div
      className={`flex h-14 w-14 flex-none items-center justify-center rounded-xl ${
        report.isAvailable ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-400'
      }`}
    >
      <FileText className="h-6 w-6" aria-hidden="true" />
    </div>
    <div className="min-w-0 flex-grow">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xl font-extrabold text-[#123f38]" style={poppins}>
          {report.year}
        </span>
        <StatusBadge available={report.isAvailable} />
      </div>
      <p className="mt-1 truncate text-sm text-gray-600">{report.title}</p>
    </div>
    <div className="flex flex-none flex-wrap items-center gap-2.5">
      {report.isAvailable && (
        <button
          type="button"
          onClick={() => onPreview(report)}
          className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-bold text-teal-700 transition-all hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          style={poppins}
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          Aperçu
        </button>
      )}
      <DownloadButton report={report} compact />
    </div>
  </motion.div>
);

/* Modal de prévisualisation ------------------------------------------- */
const PreviewModal: React.FC<{ report: Report; onClose: () => void }> = ({
  report,
  onClose,
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0b2a26]/70 p-3 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Prévisualisation du ${report.title}`}
    >
      <motion.div
        className="flex h-full max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-[#123f38]" style={poppins}>
                {report.year}
              </span>
              <StatusBadge available={report.isAvailable} />
            </div>
            <p className="truncate text-sm text-gray-500">{report.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            aria-label="Fermer la prévisualisation"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative flex-grow bg-gray-100">
          {report.downloadUrl && (
            <iframe
              src={report.downloadUrl}
              title={`Aperçu — ${report.title}`}
              className="h-full w-full"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4">
          <p className="text-xs text-gray-500">
            Document officiel de l'ASFO — {report.title}.
          </p>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              style={poppins}
            >
              Fermer
            </button>
            <DownloadButton report={report} compact />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* Carte à la une (dernier rapport disponible) ------------------------- */
const FeaturedCard: React.FC<{ report: Report; onPreview: (r: Report) => void }> = ({
  report,
  onPreview,
}) => (
  <motion.article
    {...fadeUp()}
    className="relative overflow-hidden rounded-3xl border border-teal-100 bg-white/90 p-1 shadow-[0_30px_70px_-40px_rgba(18,63,56,0.5)] backdrop-blur-sm"
  >
    <div className="grid gap-6 rounded-[22px] bg-gradient-to-br from-white to-[#f2fbf8] p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
      <div className="flex items-center justify-center">
        <div className="relative flex h-40 w-32 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#137a61] text-white shadow-[0_20px_45px_-20px_rgba(23,128,102,0.8)]">
          <FileText className="h-14 w-14 opacity-90" aria-hidden="true" />
          <span
            className="absolute bottom-3 text-lg font-extrabold tracking-wide"
            style={poppins}
          >
            {report.year}
          </span>
        </div>
      </div>
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
            style={poppins}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Dernier rapport disponible
          </span>
          <StatusBadge available={report.isAvailable} />
        </div>
        <h3 className="text-2xl font-extrabold text-[#123f38]" style={poppins}>
          {report.title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
          {report.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <DownloadButton report={report} />
          <PreviewButton report={report} onPreview={onPreview} />
        </div>
      </div>
    </div>
  </motion.article>
);

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const ReportsPage: React.FC = () => {
  const reduce = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [period, setPeriod] = useState(() => searchParams.get('periode') ?? 'tous');
  const [availability, setAvailability] = useState(
    () => searchParams.get('dispo') ?? 'tous',
  );
  const [sort, setSort] = useState<'recent' | 'ancien'>(
    () => (searchParams.get('tri') === 'ancien' ? 'ancien' : 'recent'),
  );
  const [view, setView] = useState<'grille' | 'liste'>(() => {
    if (typeof window === 'undefined') return 'grille';
    return (localStorage.getItem('asfo-reports-view') as 'grille' | 'liste') || 'grille';
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [preview, setPreview] = useState<Report | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const libraryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Rapports d'activité | ASFO - Action Sanitaire pour le Fouta";
  }, []);

  useEffect(() => {
    localStorage.setItem('asfo-reports-view', view);
  }, [view]);

  // Synchronisation de l'URL
  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set('q', query.trim());
    if (period !== 'tous') next.set('periode', period);
    if (availability !== 'tous') next.set('dispo', availability);
    if (sort !== 'recent') next.set('tri', sort);
    setSearchParams(next, { replace: true });
  }, [query, period, availability, sort, setSearchParams]);

  const filtersActive =
    query.trim() !== '' || period !== 'tous' || availability !== 'tous';

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    const periodDef = PERIODS.find((p) => p.id === period)!;
    let list = REPORTS.filter((r) => {
      if (r.yearNumber < periodDef.min || r.yearNumber > periodDef.max) return false;
      if (availability === 'dispo' && !r.isAvailable) return false;
      if (availability === 'bientot' && r.isAvailable) return false;
      if (q && !normalize(`${r.year} ${r.title} ${r.description}`).includes(q))
        return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sort === 'recent' ? b.yearNumber - a.yearNumber : a.yearNumber - b.yearNumber,
    );
    return list;
  }, [query, period, availability, sort]);

  const recentReports = useMemo(
    () => RECENT_YEARS.map((y) => getReport(y)).filter(Boolean) as Report[],
    [],
  );

  const resetFilters = () => {
    setQuery('');
    setPeriod('tous');
    setAvailability('tous');
    setSort('recent');
  };

  const scrollToLibrary = () => {
    libraryRef.current?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const toggleDecade = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const availableCount = AVAILABLE_REPORTS.length;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* Halos décoratifs discrets */}
      <div
        className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full bg-teal-100/40 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-[60rem] h-80 w-80 rounded-full bg-teal-100/30 blur-[130px]"
        aria-hidden="true"
      />

      {/* ---------------------------------------------------------- */}
      {/* HERO                                                       */}
      {/* ---------------------------------------------------------- */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-teal-700 backdrop-blur-sm"
              style={poppins}
            >
              <ScrollText className="h-4 w-4" aria-hidden="true" />
              Documentation institutionnelle
            </span>
            <h1
              className="mt-6 text-4xl font-extrabold leading-[1.1] text-[#123f38] sm:text-5xl"
              style={poppins}
            >
              Rapports d'activité{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
                de l'ASFO
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Cette bibliothèque retrace les actions, les résultats et les engagements
              de l'ASFO depuis {FIRST_YEAR}. Chaque rapport documente le bilan annuel de
              nos campagnes sanitaires, nos chiffres clés et nos actions sur le terrain.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToLibrary}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Explorer les rapports
              </button>
              <Link
                to="/archives"
                className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60"
                style={poppins}
              >
                Découvrir nos missions
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          {/* Composition visuelle — documents empilés (aucune image fictive) */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="relative mx-auto flex h-[22rem] max-w-md items-center justify-center">
              <div
                className="absolute inset-x-8 bottom-6 top-10 rotate-[-6deg] rounded-2xl border border-teal-100 bg-white/60 shadow-lg backdrop-blur-sm"
                aria-hidden="true"
              />
              <div
                className="absolute inset-x-6 bottom-4 top-6 rotate-[3deg] rounded-2xl border border-teal-100 bg-white/75 shadow-xl backdrop-blur-sm"
                aria-hidden="true"
              />
              <div className="relative w-full max-w-xs rounded-2xl border border-teal-100 bg-white p-6 shadow-[0_30px_60px_-30px_rgba(18,63,56,0.55)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2fb391] to-[#137a61] text-white">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  {LATEST_AVAILABLE && (
                    <StatusBadge available />
                  )}
                </div>
                <p
                  className="mt-5 text-3xl font-extrabold text-[#123f38]"
                  style={poppins}
                >
                  {FIRST_YEAR} — {LAST_YEAR}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {TOTAL_REPORTS} rapports d'activité référencés
                </p>
                <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Rapports référencés</span>
                    <span className="font-bold text-[#123f38]">{TOTAL_REPORTS}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Téléchargeables</span>
                    <span className="font-bold text-teal-700">{availableCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Dernier disponible</span>
                    <span className="font-bold text-[#123f38]">
                      {LATEST_AVAILABLE ? LATEST_AVAILABLE.year : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Dernier rapport disponible (spotlight)                     */}
      {/* ---------------------------------------------------------- */}
      {LATEST_AVAILABLE && !filtersActive && (
        <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <FeaturedCard report={LATEST_AVAILABLE} onPreview={setPreview} />
        </section>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Bibliothèque : recherche, filtres, résultats               */}
      {/* ---------------------------------------------------------- */}
      <section ref={libraryRef} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
            La bibliothèque des rapports
          </h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Recherchez, filtrez par période ou par disponibilité, et téléchargez les
            documents publiés.
          </p>
        </motion.div>

        {/* Bouton filtres (mobile) */}
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-700"
            aria-expanded={mobileFiltersOpen}
            style={poppins}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filtres
            {filtersActive && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1.5 text-[11px] font-bold text-white">
                !
              </span>
            )}
          </button>
          <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setView('grille')}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                view === 'grille' ? 'bg-teal-600 text-white' : 'text-gray-500'
              }`}
              aria-label="Vue grille"
              aria-pressed={view === 'grille'}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setView('liste')}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                view === 'liste' ? 'bg-teal-600 text-white' : 'text-gray-500'
              }`}
              aria-label="Vue liste"
              aria-pressed={view === 'liste'}
            >
              <List className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Panneau de filtres */}
        <div
          className={`${
            mobileFiltersOpen ? 'block' : 'hidden'
          } mb-8 rounded-2xl border border-teal-100 bg-white/85 p-5 shadow-[0_18px_45px_-30px_rgba(18,63,56,0.35)] backdrop-blur-sm lg:block`}
        >
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
            {/* Recherche */}
            <div>
              <label
                htmlFor="report-search"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500"
                style={poppins}
              >
                Rechercher
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="report-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un rapport par année..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Effacer la recherche"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Période */}
            <div>
              <label
                htmlFor="report-period"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500"
                style={poppins}
              >
                Période
              </label>
              <select
                id="report-period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              >
                {PERIODS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Disponibilité */}
            <div>
              <label
                htmlFor="report-availability"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500"
                style={poppins}
              >
                Disponibilité
              </label>
              <select
                id="report-availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              >
                <option value="tous">Tous les rapports</option>
                <option value="dispo">Disponibles</option>
                <option value="bientot">Bientôt disponibles</option>
              </select>
            </div>

            {/* Tri */}
            <div>
              <label
                htmlFor="report-sort"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500"
                style={poppins}
              >
                Trier
              </label>
              <select
                id="report-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as 'recent' | 'ancien')}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              >
                <option value="recent">Plus récents</option>
                <option value="ancien">Plus anciens</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetFilters}
                disabled={!filtersActive}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                style={poppins}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Réinitialiser
              </button>
              {/* Bascule grille/liste (desktop) */}
              <div className="hidden items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 lg:flex">
                <button
                  type="button"
                  onClick={() => setView('grille')}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    view === 'grille' ? 'bg-teal-600 text-white' : 'text-gray-500'
                  }`}
                  aria-label="Vue grille"
                  aria-pressed={view === 'grille'}
                >
                  <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setView('liste')}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    view === 'liste' ? 'bg-teal-600 text-white' : 'text-gray-500'
                  }`}
                  aria-label="Vue liste"
                  aria-pressed={view === 'liste'}
                >
                  <List className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ------- Résultats ------- */}
        {filtersActive ? (
          <>
            <p className="mb-6 text-sm text-gray-600" aria-live="polite">
              <strong className="text-[#123f38]">{filtered.length}</strong> rapport
              {filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
            </p>
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <Search className="h-7 w-7" aria-hidden="true" />
                </div>
                <p className="text-lg font-bold text-[#123f38]" style={poppins}>
                  Aucun rapport ne correspond à votre recherche
                </p>
                <p className="mt-2 text-gray-500">
                  Essayez une autre année ou réinitialisez les filtres.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white"
                  style={poppins}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Réinitialiser les filtres
                </button>
              </div>
            ) : view === 'grille' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((r) => (
                  <ReportCard key={r.year} report={r} onPreview={setPreview} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((r) => (
                  <ReportRow key={r.year} report={r} onPreview={setPreview} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Rapports récents */}
            <div className="mb-14">
              <div className="mb-6 flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-teal-600" aria-hidden="true" />
                <h3 className="text-xl font-extrabold text-[#123f38]" style={poppins}>
                  Rapports récents
                </h3>
              </div>
              {view === 'grille' ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recentReports.map((r) => (
                    <ReportCard key={r.year} report={r} onPreview={setPreview} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports.map((r) => (
                    <ReportRow key={r.year} report={r} onPreview={setPreview} />
                  ))}
                </div>
              )}
            </div>

            {/* Organisation par périodes */}
            {DECADES.map((decade, di) => {
              const items = REPORTS.filter(
                (r) => r.yearNumber >= decade.min && r.yearNumber <= decade.max,
              ).sort((a, b) =>
                sort === 'recent'
                  ? b.yearNumber - a.yearNumber
                  : a.yearNumber - b.yearNumber,
              );
              if (items.length === 0) return null;
              const isOpen = expanded[decade.id] ?? di === 0; // 1re période ouverte par défaut
              const visible = isOpen ? items : items.slice(0, 3);
              const availableInDecade = items.filter((r) => r.isAvailable).length;

              return (
                <div key={decade.id} className="mb-14">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3
                        className="flex items-center gap-3 text-xl font-extrabold text-[#123f38]"
                        style={poppins}
                      >
                        <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-[#2fb391] to-[#137a61]" />
                        {decade.label}
                      </h3>
                      <p className="mt-1.5 text-sm text-gray-500">
                        {items.length} rapport{items.length > 1 ? 's' : ''}
                        {availableInDecade > 0 && (
                          <>
                            {' · '}
                            <span className="font-semibold text-teal-700">
                              {availableInDecade} téléchargeable
                              {availableInDecade > 1 ? 's' : ''}
                            </span>
                          </>
                        )}{' '}
                        — {decade.note}
                      </p>
                    </div>
                    {items.length > 3 && (
                      <button
                        type="button"
                        onClick={() => toggleDecade(decade.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                        style={poppins}
                        aria-expanded={isOpen}
                      >
                        {isOpen ? (
                          <>
                            Réduire <ChevronUp className="h-4 w-4" aria-hidden="true" />
                          </>
                        ) : (
                          <>
                            Afficher les {items.length}{' '}
                            <ChevronDown className="h-4 w-4" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {view === 'grille' ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {visible.map((r) => (
                        <ReportCard key={r.year} report={r} onPreview={setPreview} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {visible.map((r) => (
                        <ReportRow key={r.year} report={r} onPreview={setPreview} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Transparence et redevabilité                               */}
      {/* ---------------------------------------------------------- */}
      <section className="relative overflow-hidden py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mx-auto max-w-2xl text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-teal-700"
              style={poppins}
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Notre engagement
            </span>
            <h2
              className="mt-5 text-2xl font-extrabold text-[#123f38] sm:text-3xl"
              style={poppins}
            >
              Transparence et redevabilité
            </h2>
            <p className="mt-4 text-gray-600">
              Chaque rapport documente les réalisations, les résultats, les
              enseignements et les défis rencontrés par l'ASFO dans la mise en œuvre de
              ses actions.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: ScrollText,
                title: 'Rendre compte',
                text: "Nous rendons compte à nos bénéficiaires, partenaires et donateurs de l'usage des ressources qui nous sont confiées.",
              },
              {
                icon: BarChart3,
                title: "Mesurer l'impact",
                text: 'Chaque campagne est évaluée : consultations réalisées, populations touchées et effets durables sur le terrain.',
              },
              {
                icon: Lightbulb,
                title: 'Partager les enseignements',
                text: 'Nous documentons nos réussites comme nos difficultés pour améliorer continuellement nos missions.',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                {...fadeUp(i * 0.1)}
                className="rounded-2xl border border-teal-50 bg-[#f2fbf8] p-6 text-center shadow-[0_18px_45px_-30px_rgba(18,63,56,0.3)]"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm">
                  <card.icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-[#123f38]" style={poppins}>
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* CTA final                                                  */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp()}
          className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-white via-[#eefaf6] to-[#e3f5ee] px-6 py-12 text-center shadow-[0_30px_70px_-40px_rgba(18,63,56,0.5)] sm:px-12"
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-200/40 blur-[90px]"
            aria-hidden="true"
          />
          <h2
            className="relative mx-auto max-w-2xl text-2xl font-extrabold text-[#123f38] sm:text-3xl"
            style={poppins}
          >
            Plus de vingt-cinq années d'engagement documentées.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-gray-600">
            Parcourez nos rapports, découvrez les missions réalisées et soutenez les
            prochaines actions de l'ASFO.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/archives"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
              style={poppins}
            >
              Voir les missions
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 rounded-full bg-[#e5533d] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(229,83,61,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
              style={poppins}
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              Faire un don
            </Link>
            <Link
              to="/about/partenaires"
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60"
              style={poppins}
            >
              <Handshake className="h-4 w-4" aria-hidden="true" />
              Devenir partenaire
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Modal de prévisualisation */}
      <AnimatePresence>
        {preview && (
          <PreviewModal report={preview} onClose={() => setPreview(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsPage;
