import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  FileText,
  CalendarDays,
  Download,
  Search,
  X,
  RotateCcw,
  LayoutGrid,
  List,
  Clock,
  Eye,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Users,
  Heart,
  Handshake,
  ScrollText,
  BarChart3,
  Lightbulb,
} from 'lucide-react';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* ------------------------------------------------------------------ */
/* Source unique des rapports (dérivée, aucune année codée à la main)   */
/* ------------------------------------------------------------------ */

interface Report {
  year: string;
  title: string;
  description: string;
  downloadUrl: string;
  isAvailable: boolean;
}

/* PDF réellement présents dans public/ */
const AVAILABLE_YEARS = ['2021', '2022', '2023', '2024'];

const REPORTS: Report[] = Array.from({ length: 26 }, (_, i) => 2025 - i)
  .filter((y) => y !== 2020) // aucun rapport en 2020 (COVID-19)
  .map((y) => {
    const year = y.toString();
    return {
      year,
      title: `Rapport ${year}`,
      description: `Bilan complet des activités de l'ASFO pour l'année ${year} : campagnes médicales, consultations réalisées, actions communautaires, formations dispensées et impact sur les populations bénéficiaires.`,
      downloadUrl: `/rapport${year}.pdf`,
      isAvailable: AVAILABLE_YEARS.includes(year),
    };
  });

const LATEST_AVAILABLE = REPORTS.find((r) => r.isAvailable); // 2024

const DECADES = [
  { id: 'decennie-2020', label: '2020 – 2022', min: 2020, max: 2022, note: 'La reprise post-pandémie et la modernisation des campagnes.' },
  { id: 'decennie-2010', label: '2010 – 2019', min: 2010, max: 2019, note: "Une décennie d'expansion des missions médicales." },
  { id: 'decennie-2000', label: '2000 – 2009', min: 2000, max: 2009, note: "Les années fondatrices de l'engagement de l'ASFO." },
];

const RECENT_YEARS = ['2025', '2024', '2023'];

type Periode = 'all' | 'p2020' | 'p2010' | 'p2000';
type Dispo = 'all' | 'dispo' | 'bientot';
type Sort = 'recent' | 'ancien';
type View = 'grille' | 'liste';

const PERIODES: { key: Periode; label: string; min: number; max: number }[] = [
  { key: 'all', label: 'Toutes les périodes', min: 2000, max: 2025 },
  { key: 'p2020', label: '2020 – 2025', min: 2020, max: 2025 },
  { key: 'p2010', label: '2010 – 2019', min: 2010, max: 2019 },
  { key: 'p2000', label: '2000 – 2009', min: 2000, max: 2009 },
];

/* ------------------------------------------------------------------ */
/* Compteur                                                             */
/* ------------------------------------------------------------------ */

const StatCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setDisplay(value); return; }
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
  const formatted = value >= 1000 ? `${Math.round(display / 1000)}K` : display.toLocaleString('fr-FR');
  return <span ref={ref}>{formatted}{suffix}</span>;
};

/* ------------------------------------------------------------------ */
/* Couverture stylisée d'un rapport (élément d'UI, pas un faux scan)    */
/* ------------------------------------------------------------------ */

const ReportCover: React.FC<{ year: string; className?: string }> = ({ year, className = '' }) => (
  <div className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#0e4a3d] via-[#136353] to-[#178066] p-5 text-white ${className}`}>
    <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
    <div className="flex items-center justify-between">
      <img src="/logo.png" alt="" className="h-8 w-8 rounded-full bg-white object-contain" />
      <FileText className="h-5 w-5 text-teal-200" aria-hidden="true" />
    </div>
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-200">Rapport d'activité</p>
      <p className="text-3xl font-extrabold" style={poppins}>{year}</p>
      <p className="mt-1 text-[11px] text-teal-100/80">ASFO — Action Sanitaire pour le Fouta</p>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Carte rapport                                                        */
/* ------------------------------------------------------------------ */

const ReportGridCard: React.FC<{ report: Report; onPreview: (r: Report) => void; featured?: boolean }> = ({ report, onPreview, featured = false }) => (
  <motion.article
    {...fadeUp(0)}
    className={`group flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)] ${featured ? 'sm:col-span-2' : ''}`}
  >
    <div className={`flex gap-5 p-6 ${featured ? 'sm:p-8' : ''}`}>
      <ReportCover year={report.year} className={featured ? 'h-40 w-32 flex-none sm:h-48 sm:w-36' : 'h-28 w-24 flex-none'} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className={`font-bold text-gray-900 ${featured ? 'text-2xl' : 'text-lg'}`} style={poppins}>{report.title}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-teal-700">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Année {report.year}
            </p>
          </div>
          <span className={`flex-none rounded-full px-3 py-1 text-[11px] font-bold ${report.isAvailable ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`} style={poppins}>
            {report.isAvailable ? 'Disponible' : 'Bientôt'}
          </span>
        </div>
        <p className={`mt-3 flex-1 text-gray-600 ${featured ? 'text-sm leading-7' : 'line-clamp-3 text-[13px] leading-relaxed'}`}>
          {report.description}
        </p>
      </div>
    </div>
    <div className="mt-auto flex flex-col gap-2.5 border-t border-teal-50 p-5 sm:flex-row">
      {report.isAvailable ? (
        <>
          <a
            href={report.downloadUrl}
            download={`rapport${report.year}.pdf`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Télécharger
          </a>
          <button
            type="button"
            onClick={() => onPreview(report)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200/80 bg-white px-5 py-2.5 text-sm font-semibold text-teal-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            style={poppins}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Prévisualiser
          </button>
        </>
      ) : (
        <div className="flex-1">
          <span
            className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-400"
            aria-disabled="true"
            style={poppins}
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            Bientôt disponible
          </span>
          <p className="mt-1.5 text-center text-[11px] text-gray-400">Le document sera publié après validation.</p>
        </div>
      )}
    </div>
  </motion.article>
);

/* ------------------------------------------------------------------ */
/* Modal de prévisualisation                                            */
/* ------------------------------------------------------------------ */

const PreviewModal: React.FC<{ report: Report; onClose: () => void }> = ({ report, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-[#02120e]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Prévisualisation du ${report.title}`} onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()} className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-teal-50 p-5">
          <div className="flex items-center gap-3">
            <ReportCover year={report.year} className="h-14 w-11 flex-none" />
            <div>
              <h3 className="text-lg font-bold text-gray-900" style={poppins}>{report.title}</h3>
              <p className="text-xs text-gray-500">Année {report.year} · Format PDF</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <div className="min-h-0 flex-1 bg-gray-100">
          <iframe src={`${report.downloadUrl}#view=FitH`} title={`Aperçu du ${report.title}`} className="h-[60vh] w-full border-0" />
        </div>
        <div className="flex flex-col gap-3 border-t border-teal-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">{report.description}</p>
          <a href={report.downloadUrl} download={`rapport${report.year}.pdf`} className="inline-flex flex-none items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Télécharger le rapport
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Section décennie (grille repliable)                                  */
/* ------------------------------------------------------------------ */

const DecadeSection: React.FC<{ decade: typeof DECADES[number]; reports: Report[]; onPreview: (r: Report) => void }> = ({ decade, reports, onPreview }) => {
  const [expanded, setExpanded] = useState(false);
  if (reports.length === 0) return null;
  const shown = expanded ? reports : reports.slice(0, 6);
  const availableCount = reports.filter((r) => r.isAvailable).length;
  return (
    <section id={decade.id} className="scroll-mt-32">
      <motion.div {...fadeUp(0)} className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>{decade.label}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {reports.length} rapport{reports.length > 1 ? 's' : ''}
            {availableCount > 0 && <> · <strong className="text-teal-700">{availableCount} téléchargeable{availableCount > 1 ? 's' : ''}</strong></>}
            {' · '}{decade.note}
          </p>
        </div>
        {reports.length > 6 && (
          <button type="button" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded} className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/80 bg-white/80 px-4 py-2 text-sm font-bold text-teal-800 shadow-sm transition-all duration-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}>
            {expanded ? 'Réduire' : `Afficher plus (${reports.length - 6})`}
            {expanded ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
          </button>
        )}
      </motion.div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {shown.map((r) => <ReportGridCard key={r.year} report={r} onPreview={onPreview} />)}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const ServicesPage: React.FC = () => {
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [periode, setPeriode] = useState<Periode>((params.get('p') as Periode) || 'all');
  const [dispo, setDispo] = useState<Dispo>('all');
  const [sort, setSort] = useState<Sort>('recent');
  const [view, setView] = useState<View>(() => (typeof localStorage !== 'undefined' && localStorage.getItem('asfo-reports-view') === 'liste' ? 'liste' : 'grille'));
  const [preview, setPreview] = useState<Report | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = 'Rapports d\'activité | ASFO - Action Sanitaire pour le Fouta'; }, []);
  useEffect(() => { localStorage.setItem('asfo-reports-view', view); }, [view]);

  useEffect(() => {
    const p = new URLSearchParams(params);
    if (periode === 'all') p.delete('p'); else p.set('p', periode);
    if (!query) p.delete('q'); else p.set('q', query);
    setParams(p, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periode, query]);

  const availableTotal = REPORTS.filter((r) => r.isAvailable).length;

  const filtersActive = query.trim() !== '' || periode !== 'all' || dispo !== 'all';

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    const per = PERIODES.find((p) => p.key === periode)!;
    let list = REPORTS.filter((r) => {
      const y = parseInt(r.year);
      if (y < per.min || y > per.max) return false;
      if (dispo === 'dispo' && !r.isAvailable) return false;
      if (dispo === 'bientot' && r.isAvailable) return false;
      if (q && !normalize(`${r.title} ${r.year} ${r.description}`).includes(q)) return false;
      return true;
    });
    list = [...list].sort((a, b) => (sort === 'recent' ? parseInt(b.year) - parseInt(a.year) : parseInt(a.year) - parseInt(b.year)));
    return list;
  }, [query, periode, dispo, sort]);

  const recentReports = RECENT_YEARS.map((y) => REPORTS.find((r) => r.year === y)!).filter(Boolean);
  const reportsInDecade = (d: typeof DECADES[number]) =>
    REPORTS.filter((r) => { const y = parseInt(r.year); return y >= d.min && y <= d.max; })
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));

  const reset = () => { setQuery(''); setPeriode('all'); setDispo('all'); setSort('recent'); };

  const scrollToList = () => listRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  const selectCls = 'rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50';

  return (
    <div className="bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-44 top-64 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[44%] top-8 hidden h-28 w-28 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8">
          <div>
            <motion.span {...fadeUp(0)} className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Documentation institutionnelle
            </motion.span>
            <motion.h1 {...fadeUp(0.08)} className="mt-6 text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl xl:text-6xl" style={poppins}>
              Rapports d'activité de{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">l'ASFO</span>
            </motion.h1>
            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8">
              Plus de 25 années d'actions, de missions médicales et d'engagement communautaire,
              documentées avec transparence.
            </motion.p>
            <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <button type="button" onClick={scrollToList} className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Explorer les rapports
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link to="/archives" className="inline-flex items-center justify-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Voir nos missions
              </Link>
            </motion.div>
          </div>

          {/* Composition documents */}
          <motion.div {...fadeUp(0.15)} className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative">
              <div className="absolute -right-3 top-6 hidden rotate-6 sm:block"><ReportCover year="2022" className="h-56 w-44 opacity-70 shadow-[0_25px_60px_-30px_rgba(18,63,56,0.5)]" /></div>
              <div className="absolute -right-1 top-3 hidden rotate-3 sm:block"><ReportCover year="2023" className="h-60 w-46 opacity-85 shadow-[0_25px_60px_-30px_rgba(18,63,56,0.55)]" /></div>
              <div className="relative"><ReportCover year="2024" className="h-64 w-full shadow-[0_35px_80px_-30px_rgba(18,63,56,0.6)] sm:w-52" /></div>
            </div>
            <motion.div animate={reduce ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-6 left-0 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-[0_20px_50px_-20px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:-left-6">
              <div className="flex items-center gap-4">
                {[
                  { value: '25', label: 'rapports' },
                  { value: '25+', label: 'années' },
                  { value: '250K+', label: 'bénéficiaires' },
                ].map((s, i) => (
                  <React.Fragment key={s.label}>
                    {i > 0 && <div className="h-9 w-px bg-teal-100" aria-hidden="true" />}
                    <div>
                      <p className="text-lg font-extrabold text-teal-700" style={poppins}>{s.value}</p>
                      <p className="text-[11px] font-semibold text-gray-500">{s.label}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ INTRODUCTION ════════════════ */}
      <section className="relative overflow-hidden pb-16">
        <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:gap-14 lg:px-8">
          <motion.div {...fadeUp(0)} className="min-w-0 self-start">
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Une mémoire institutionnelle au service de la{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">transparence</span>
            </h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
            <p className="mt-6 text-[15px] leading-8 text-gray-700 sm:text-base sm:leading-9">
              Plongez au cœur des actions menées par <strong className="text-teal-700">ASFO</strong> sur le terrain, à travers
              un aperçu détaillé de ses <strong className="text-teal-700">campagnes médicales</strong>, bilans chiffrés et
              engagements en faveur de la santé publique au Fouta. Chaque rapport documente une année
              d'engagement, avec ses <strong className="text-gray-900">réalisations, ses défis et son impact mesurable</strong>.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.12)} className="self-start rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-7 shadow-[0_20px_50px_-28px_rgba(18,63,56,0.35)] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700" style={poppins}>En synthèse</p>
            <dl className="mt-5 space-y-3.5">
              {[
                { label: 'Période couverte', value: '2000 – 2025' },
                { label: 'Rapports référencés', value: `${REPORTS.length}` },
                { label: 'Téléchargeables', value: `${availableTotal}` },
                { label: 'Dernier disponible', value: LATEST_AVAILABLE ? `Rapport ${LATEST_AVAILABLE.year}` : '—' },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between border-b border-teal-50 pb-2.5 last:border-0 last:pb-0">
                  <dt className="text-sm text-gray-500">{r.label}</dt>
                  <dd className="text-sm font-bold text-gray-900" style={poppins}>{r.value}</dd>
                </div>
              ))}
            </dl>
            {LATEST_AVAILABLE && (
              <a href={LATEST_AVAILABLE.downloadUrl} download={`rapport${LATEST_AVAILABLE.year}.pdf`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Télécharger le rapport le plus récent
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ NOTE 2020 ════════════════ */}
      <section className="relative pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} role="note" className="flex items-start gap-4 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-5 sm:p-6">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-amber-100"><Info className="h-5 w-5 text-amber-600" aria-hidden="true" /></span>
            <div>
              <h3 className="text-sm font-bold text-amber-800" style={poppins}>Information sur l'année 2020</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-amber-800/90">
                <strong>Aucun rapport n'a été produit pour l'année 2020</strong> en raison de la pandémie de COVID-19 qui
                a suspendu nos activités habituelles. Nos équipes ont repris leurs missions dès 2021 avec des
                protocoles sanitaires renforcés.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ PANNEAU DE CONTRÔLE ════════════════ */}
      <section ref={listRef} id="rapports" className="relative scroll-mt-24 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_12px_35px_-20px_rgba(18,63,56,0.3)] backdrop-blur-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xs">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600" aria-hidden="true" />
                <label htmlFor="report-search" className="sr-only">Rechercher un rapport</label>
                <input id="report-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un rapport…" className="w-full rounded-full border border-teal-100 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="f-periode" className="sr-only">Période</label>
                <select id="f-periode" value={periode} onChange={(e) => setPeriode(e.target.value as Periode)} className={selectCls}>
                  {PERIODES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select>
                <label htmlFor="f-dispo" className="sr-only">Disponibilité</label>
                <select id="f-dispo" value={dispo} onChange={(e) => setDispo(e.target.value as Dispo)} className={selectCls}>
                  <option value="all">Toutes disponibilités</option>
                  <option value="dispo">Téléchargeables</option>
                  <option value="bientot">Bientôt disponibles</option>
                </select>
                <label htmlFor="f-sort" className="sr-only">Trier</label>
                <select id="f-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectCls}>
                  <option value="recent">Plus récents</option>
                  <option value="ancien">Plus anciens</option>
                </select>
                <div className="flex items-center gap-1 rounded-full border border-teal-100 bg-white p-1 shadow-sm" role="group" aria-label="Mode d'affichage">
                  {([['grille', LayoutGrid, 'Vue grille'], ['liste', List, 'Vue liste']] as [View, React.ElementType, string][]).map(([key, Icon, lbl]) => (
                    <button key={key} type="button" onClick={() => setView(key)} aria-pressed={view === key} aria-label={lbl} className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${view === key ? 'bg-[#123f38] text-white' : 'text-gray-500 hover:bg-teal-50'}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-sm transition-all duration-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}>
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Réinitialiser
                </button>
              </div>
            </div>
          </motion.div>

          {/* Timeline décennies */}
          <motion.nav {...fadeUp(0.06)} aria-label="Navigation par décennie" className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {[
              { label: '2020 – 2025', target: 'recents' },
              ...DECADES.slice(1).map((d) => ({ label: d.label, target: d.id })),
            ].map((d) => (
              <button key={d.target} type="button" onClick={() => scrollTo(d.target)} className="flex-none rounded-full border border-teal-100 bg-white px-5 py-2 text-sm font-bold text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}>
                {d.label}
              </button>
            ))}
          </motion.nav>
        </div>
      </section>

      {/* ════════════════ RAPPORTS ════════════════ */}
      <section className="relative pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {view === 'liste' ? (
            /* ── Vue liste ── */
            <div className="overflow-x-auto rounded-2xl border border-white/80 bg-white/85 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-teal-100 text-[12px] uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-3.5 font-bold" style={poppins}>Année</th>
                    <th className="px-5 py-3.5 font-bold" style={poppins}>Rapport</th>
                    <th className="px-5 py-3.5 font-bold" style={poppins}>Statut</th>
                    <th className="px-5 py-3.5 text-right font-bold" style={poppins}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.year} className="border-b border-teal-50 transition-colors last:border-0 hover:bg-teal-50/40">
                      <td className="px-5 py-3.5 font-extrabold text-gray-900" style={poppins}>{r.year}</td>
                      <td className="px-5 py-3.5 text-gray-700">{r.title}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${r.isAvailable ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`} style={poppins}>{r.isAvailable ? 'Disponible' : 'Bientôt'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {r.isAvailable ? (
                          <div className="inline-flex items-center gap-2">
                            <button type="button" onClick={() => setPreview(r)} className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-white px-3 py-1.5 text-xs font-bold text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}><Eye className="h-3.5 w-3.5" aria-hidden="true" />Aperçu</button>
                            <a href={r.downloadUrl} download={`rapport${r.year}.pdf`} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-3 py-1.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}><Download className="h-3.5 w-3.5" aria-hidden="true" />PDF</a>
                          </div>
                        ) : (
                          <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-400" aria-disabled="true"><Clock className="h-3.5 w-3.5" aria-hidden="true" />Bientôt</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="p-10 text-center text-gray-500">Aucun rapport ne correspond à votre recherche.</p>}
            </div>
          ) : filtersActive ? (
            /* ── Grille filtrée à plat ── */
            filtered.length === 0 ? (
              <div className="py-16 text-center">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-teal-100 bg-teal-50"><Search className="h-8 w-8 text-teal-400" aria-hidden="true" /></span>
                <h3 className="mt-6 text-2xl font-bold text-gray-900" style={poppins}>Aucun rapport trouvé</h3>
                <p className="mx-auto mt-3 max-w-md text-gray-600">Aucun rapport ne correspond à vos critères. Réinitialisez la recherche pour tout afficher.</p>
                <button type="button" onClick={reset} className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}><RotateCcw className="h-4 w-4" aria-hidden="true" />Réinitialiser les filtres</button>
              </div>
            ) : (
              <>
                <p className="mb-6 text-sm text-gray-500"><strong className="text-gray-800">{filtered.length}</strong> rapport{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((r) => <ReportGridCard key={r.year} report={r} onPreview={setPreview} />)}
                </div>
              </>
            )
          ) : (
            /* ── Vue riche par défaut ── */
            <div className="space-y-16">
              {/* Rapports récents */}
              <section id="recents" className="scroll-mt-32">
                <motion.h3 {...fadeUp(0)} className="mb-7 text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>Rapports récents</motion.h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {recentReports.map((r, i) => <ReportGridCard key={r.year} report={r} onPreview={setPreview} featured={i === 0} />)}
                </div>
              </section>
              {/* Décennies */}
              {DECADES.map((d) => <DecadeSection key={d.id} decade={d} reports={reportsInDecade(d)} onPreview={setPreview} />)}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════ RAPPORT EN CHIFFRES ════════════════ */}
      <section className="relative pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-8 shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] sm:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm" style={poppins}>
                <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
                Le rapport en chiffres
              </span>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}>Plus de deux décennies documentées</h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                { icon: FileText, value: 25, suffix: '', label: 'Rapports référencés' },
                { icon: CalendarDays, value: 25, suffix: '+', label: "Années d'activité" },
                { icon: Users, value: 250000, suffix: '+', label: 'Bénéficiaires' },
              ].map((s, i) => (
                <motion.div key={s.label} {...fadeUp(0.06 + i * 0.08)} className="rounded-2xl border border-white/80 bg-white px-6 py-8 text-center shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] transition-all duration-300 hover:-translate-y-1">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_12px_30px_-10px_rgba(23,128,102,0.6)]"><s.icon className="h-6 w-6 text-white" aria-hidden="true" /></span>
                  <p className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl" style={poppins}><StatCounter value={s.value} suffix={s.suffix} /></p>
                  <p className="mt-1.5 text-sm font-medium text-gray-600">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ TRANSPARENCE ════════════════ */}
      <section className="relative overflow-hidden pb-16">
        <div className="pointer-events-none absolute -left-44 top-10 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <ScrollText className="h-3.5 w-3.5" aria-hidden="true" />
              Notre engagement
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Transparence et{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">redevabilité</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Chaque rapport d'activité témoigne de notre engagement envers la transparence. Vous y trouverez
              nos réalisations, nos défis, nos apprentissages et notre impact mesurable sur les communautés que
              nous servons.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              { icon: FileText, title: 'Rendre compte', text: 'Documenter chaque année nos actions et nos résultats.' },
              { icon: BarChart3, title: "Mesurer l'impact", text: 'Suivre des indicateurs concrets au service des communautés.' },
              { icon: Lightbulb, title: 'Partager les enseignements', text: 'Tirer les leçons de nos missions pour progresser.' },
            ].map((c, i) => (
              <motion.div key={c.title} {...fadeUp(0.06 + i * 0.08)} className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_12px_30px_-10px_rgba(23,128,102,0.6)]"><c.icon className="h-6 w-6 text-white" aria-hidden="true" /></span>
                <h3 className="mt-4 text-lg font-bold text-gray-900" style={poppins}>{c.title}</h3>
                <p className="mt-2 text-[14px] leading-7 text-gray-600">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/90 to-teal-50/60 p-10 text-center shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl" style={poppins}>
              Découvrez l'impact de l'ASFO au fil des{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">années</span>.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Consultez nos rapports, explorez les missions réalisées et soutenez nos prochaines actions.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link to="/archives" className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <FileText className="h-5 w-5" aria-hidden="true" />
                Voir les missions
              </Link>
              <Link to="/donate" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Heart className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Faire un don
              </Link>
              <Link to="/about/partenaires" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Handshake className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Devenir partenaire
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ MODAL PRÉVISUALISATION ════════════════ */}
      <AnimatePresence>
        {preview && <PreviewModal report={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default ServicesPage;
