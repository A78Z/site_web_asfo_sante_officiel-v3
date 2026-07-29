import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Quote,
  Star,
  TrendingUp,
  MapPin,
  CalendarDays,
  Activity,
  Stethoscope,
  ArrowLeft,
  ArrowRight,
  Share2,
  Facebook,
  Linkedin,
  Link2,
  Check,
  X,
  ChevronDown,
  Heart,
  Ambulance,
  Users,
  BadgeCheck,
  Home,
} from 'lucide-react';
import { missionDetails, MissionDetail } from '../data/missionDetails';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

/* Icônes médicales par spécialité — toutes rendues en teal (une seule teinte). */
const SPECIALTY_ICON = (name: string): React.ElementType => {
  const n = name.toLowerCase();
  if (n.includes('pédiatrie')) return Users;
  if (n.includes('gynéco')) return Heart;
  if (n.includes('ophtalmo')) return Eye;
  if (n.includes('dentaire')) return BadgeCheck;
  if (n.includes('chirurgie')) return Activity;
  return Stethoscope;
};

const SECTIONS = [
  { id: 'resume', label: 'Résumé' },
  { id: 'histoire', label: 'Histoire' },
  { id: 'specialites', label: 'Spécialités' },
  { id: 'points-forts', label: 'Points forts' },
  { id: 'temoignages', label: 'Témoignages' },
  { id: 'impact', label: 'Impact' },
] as const;

const StatCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
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
      const p = Math.min((now - start) / 1400, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return <span ref={ref}>{display.toLocaleString('fr-FR')}{suffix}</span>;
};

/* Galerie avec lightbox — masque les images introuvables. */
const MissionGallery: React.FC<{ images: string[]; title: string }> = ({ images, title }) => {
  const reduce = useReducedMotion();
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<number | null>(null);
  const valid = images.filter((src) => !broken.has(src));

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? null : (i + 1) % valid.length));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? null : (i - 1 + valid.length) % valid.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, valid.length]);

  const markBroken = (src: string) => setBroken((s) => new Set(s).add(src));

  // Précharge silencieuse pour filtrer les images cassées avant l'affichage
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.onerror = () => markBroken(src);
      img.src = src;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (valid.length === 0) return null;

  return (
    <div id="galerie" className="scroll-mt-28">
      <h2 className="text-2xl font-bold text-gray-900" style={poppins}>Galerie de la mission</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {valid.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Agrandir la photo ${i + 1} de ${title}`}
            className={`group relative overflow-hidden rounded-2xl border border-white/80 shadow-[0_15px_40px_-22px_rgba(18,63,56,0.3)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 ${
              i === 0 ? 'col-span-2 row-span-2 aspect-square lg:aspect-auto' : 'aspect-square'
            }`}
          >
            <img
              src={src}
              alt={`${title} — photo ${i + 1}`}
              loading="lazy"
              onError={() => markBroken(src)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#123f38]/0 transition-colors duration-300 group-hover:bg-[#123f38]/15" aria-hidden="true" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#02120e]/90 p-4 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${open + 1} sur ${valid.length}`}
          >
            <button type="button" onClick={() => setOpen(null)} aria-label="Fermer" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + valid.length) % valid.length); }} aria-label="Photo précédente" className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:left-8">
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <motion.img
              key={valid[open]}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={valid[open]}
              alt={`${title} — photo ${open + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
            />
            <button type="button" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % valid.length); }} aria-label="Photo suivante" className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:right-8">
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Sélecteur de village groupé par année. */
const VillageSelector: React.FC<{ currentId: string; onNavigate: (id: string) => void }> = ({ currentId, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const grouped = useMemo(() => {
    const acc: Record<string, MissionDetail[]> = {};
    missionDetails.forEach((m) => { (acc[m.year] ??= []).push(m); });
    return Object.entries(acc).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-teal-100 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        style={poppins}
      >
        Explorer une autre mission
        <ChevronDown className={`h-4 w-4 text-teal-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-teal-100 bg-white p-2 shadow-[0_25px_60px_-25px_rgba(18,63,56,0.4)]"
            role="listbox"
          >
            {grouped.map(([year, missions]) => (
              <div key={year} className="mb-1 last:mb-0">
                <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-600" style={poppins}>{year}</p>
                {missions.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="option"
                    aria-selected={m.id === currentId}
                    onClick={() => { setOpen(false); onNavigate(m.id); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      m.id === currentId ? 'bg-teal-50 font-bold text-teal-700' : 'text-gray-700 hover:bg-teal-50'
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5 flex-none text-teal-500" aria-hidden="true" />
                    <span className="truncate">{m.title}</span>
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Boutons de partage. */
const ShareMenu: React.FC<{ title: string }> = ({ title }) => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const text = `${title} — Archives des missions de l'ASFO`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard indisponible */ }
  };

  const links = [
    { label: 'WhatsApp', icon: Share2, href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { label: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800" style={poppins}>
        <Share2 className="h-4 w-4 text-teal-600" aria-hidden="true" />
        Partager cette mission
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Partager sur ${l.label}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-100 bg-white text-teal-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            <l.icon className="h-4 w-4" aria-hidden="true" />
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          aria-label="Copier le lien"
          className="flex h-10 items-center gap-1.5 rounded-xl border border-teal-100 bg-white px-3 text-sm font-semibold text-teal-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const SingleArchivePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  /* Hauteur du header sticky (#site-header) pour caler la barre de navigation dessous. */
  const [headerH, setHeaderH] = useState(0);
  useEffect(() => {
    const el = document.getElementById('site-header');
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const index = useMemo(() => missionDetails.findIndex((m) => m.id === id), [id]);
  const mission = index >= 0 ? missionDetails[index] : undefined;
  const prev = index > 0 ? missionDetails[index - 1] : undefined;
  const next = index >= 0 && index < missionDetails.length - 1 ? missionDetails[index + 1] : undefined;

  useEffect(() => {
    document.title = mission
      ? `${mission.title} | ASFO - Archives des Missions`
      : 'Mission introuvable | ASFO';
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [mission]);

  const scrollToSection = (sectionId: string) =>
    document.getElementById(sectionId)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  if (!mission) {
    return (
      <div className="bg-gradient-to-b from-white via-[#f6fbf9] to-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-teal-100 bg-teal-50">
            <MapPin className="h-7 w-7 text-teal-400" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900" style={poppins}>Mission introuvable</h1>
          <p className="mt-3 text-gray-600">La mission que vous recherchez n'existe pas ou a été déplacée.</p>
          <Link
            to="/archives"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Retour aux archives
          </Link>
        </div>
      </div>
    );
  }

  const totalConsult = mission.specialties.reduce((s, sp) => s + sp.count, 0) || mission.consultations;
  const maxCount = Math.max(...mission.specialties.map((s) => s.count), 1);
  const related = [prev, next, missionDetails.find((m) => m.year === mission.year && m.id !== mission.id && m.id !== prev?.id && m.id !== next?.id)]
    .filter((m): m is MissionDetail => Boolean(m))
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* ════════════════ HERO IMMERSIF ════════════════ */}
      <section className="relative h-[440px] overflow-hidden sm:h-[500px]">
        <img src={mission.imageUrl} alt={`Mission médicale à ${mission.title}`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02120e]/92 via-[#02120e]/45 to-[#02120e]/25" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
            {/* fil d'ariane */}
            <nav aria-label="Fil d'ariane" className="mb-4 flex items-center gap-2 text-sm text-teal-50/80">
              <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-white"><Home className="h-3.5 w-3.5" aria-hidden="true" /></Link>
              <span aria-hidden="true">/</span>
              <Link to="/archives" className="transition-colors hover:text-white">Archives</Link>
              <span aria-hidden="true">/</span>
              <span className="text-teal-100">{mission.year}</span>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-white">{mission.title}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/archives" className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Retour aux archives
              </Link>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white" style={poppins}>
                <Ambulance className="h-3.5 w-3.5" aria-hidden="true" />
                Mission ASFO
              </span>
            </div>

            <motion.h1
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mt-4 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl"
              style={poppins}
            >
              {mission.title}
            </motion.h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-teal-50/90">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-teal-300" aria-hidden="true" />{mission.location}</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-teal-300" aria-hidden="true" />{mission.date}</span>
              <span className="inline-flex items-center gap-1.5"><Stethoscope className="h-4 w-4 text-teal-300" aria-hidden="true" />{mission.consultations.toLocaleString('fr-FR')} consultations</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ NAVIGATION PRÉC/SUIV + SÉLECTEUR ════════════════ */}
      <div className="sticky z-40 border-b border-teal-100/70 bg-white/85 backdrop-blur-md" style={{ top: headerH }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            {prev ? (
              <Link to={`/archives/${prev.id}`} className="group inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
                <ArrowLeft className="h-4 w-4 text-teal-600 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                <span className="max-w-[38vw] truncate sm:max-w-[200px]">{prev.title}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link to={`/archives/${next.id}`} className="group inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
                <span className="max-w-[38vw] truncate sm:max-w-[200px]">{next.title}</span>
                <ArrowRight className="h-4 w-4 text-teal-600 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            )}
          </div>

          {/* Sous-navigation par section (desktop) */}
          <nav aria-label="Sections de la mission" className="hidden items-center gap-1 xl:flex">
            {SECTIONS.map((s) => (
              <button key={s.id} type="button" onClick={() => scrollToSection(s.id)} className="rounded-full px-3 py-1.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}>
                {s.label}
              </button>
            ))}
          </nav>

          <div className="w-full lg:hidden">
            <VillageSelector currentId={mission.id} onNavigate={(id2) => navigate(`/archives/${id2}`)} />
          </div>
        </div>
      </div>

      {/* ════════════════ CONTENU ════════════════ */}
      <section className="relative overflow-hidden pb-8 pt-12">
        <div className="pointer-events-none absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-teal-100/30 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1.7fr_1fr] lg:gap-12 lg:px-8">
          {/* ── Colonne principale ── */}
          <div className="min-w-0 space-y-14">
            {/* Résumé */}
            <motion.div id="resume" {...fadeUp(0)} className="scroll-mt-28 rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-7 shadow-[0_18px_45px_-28px_rgba(18,63,56,0.3)] sm:p-9">
              <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-teal-700" style={poppins}>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm"><Eye className="h-4 w-4 text-teal-600" aria-hidden="true" /></span>
                Résumé de la mission
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-700">{mission.summary}</p>
              <div className="mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
            </motion.div>

            {/* Bande de stats */}
            <motion.div {...fadeUp(0.05)} className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: Stethoscope, value: mission.consultations, label: 'Consultations' },
                { icon: Activity, value: mission.specialties.length, label: 'Spécialités mobilisées' },
                { icon: CalendarDays, value: parseInt(mission.year), label: 'Année' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/80 bg-white/80 px-4 py-5 text-center shadow-[0_15px_40px_-22px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                  <stat.icon className="mx-auto h-5 w-5 text-teal-600" aria-hidden="true" />
                  <p className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>
                    <StatCounter value={stat.value} />
                  </p>
                  <p className="mt-0.5 text-[12px] leading-tight text-gray-600">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Histoire */}
            <motion.div id="histoire" {...fadeUp(0)} className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl" style={poppins}>Histoire de la mission</h2>
              <div className="mt-5 max-w-2xl space-y-5 text-[15px] leading-8 text-gray-700 sm:text-base sm:leading-9">
                {mission.story.split('\n\n').map((paragraph, i) => (
                  <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:font-extrabold first-letter:text-5xl first-letter:leading-[0.8] first-letter:text-teal-600' : ''} style={i === 0 ? poppins : undefined}>
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Spécialités */}
            <motion.div id="specialites" {...fadeUp(0)} className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl" style={poppins}>Répartition par spécialité</h2>
              <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {mission.specialties.map((sp, i) => {
                  const Icon = SPECIALTY_ICON(sp.name);
                  const pct = Math.round((sp.count / totalConsult) * 100);
                  return (
                    <motion.div
                      key={sp.name}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.35), ease: 'easeOut' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2.5 text-[15px] font-semibold text-gray-800" style={poppins}>
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-teal-100 bg-teal-50"><Icon className="h-4 w-4 text-teal-600" aria-hidden="true" /></span>
                          {sp.name}
                        </span>
                        <span className="text-sm font-bold text-teal-700" style={poppins}>
                          {sp.count.toLocaleString('fr-FR')} <span className="text-xs font-medium text-gray-400">· {pct}%</span>
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-teal-50">
                        <motion.div
                          initial={reduce ? { width: `${(sp.count / maxCount) * 100}%` } : { width: 0 }}
                          whileInView={{ width: `${(sp.count / maxCount) * 100}%` }}
                          viewport={{ once: true, margin: '-30px' }}
                          transition={{ duration: 0.9, delay: 0.15 + Math.min(i * 0.05, 0.35), ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Points forts */}
            <motion.div id="points-forts" {...fadeUp(0)} className="scroll-mt-28">
              <h2 className="flex items-center gap-2.5 text-2xl font-bold text-gray-900 sm:text-3xl" style={poppins}>
                <Star className="h-6 w-6 fill-amber-400 text-amber-400" aria-hidden="true" />
                Points forts de la mission
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {mission.highlights.map((h, i) => (
                  <motion.div
                    key={h}
                    {...fadeUp(0.04 + i * 0.05)}
                    className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-[0_12px_35px_-25px_rgba(120,80,10,0.3)]"
                  >
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-500"><Star className="h-3.5 w-3.5 fill-white text-white" aria-hidden="true" /></span>
                    <span className="text-[15px] font-medium leading-relaxed text-gray-700">{h}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Témoignages */}
            <motion.div id="temoignages" {...fadeUp(0)} className="scroll-mt-28">
              <h2 className="flex items-center gap-2.5 text-2xl font-bold text-gray-900 sm:text-3xl" style={poppins}>
                <Quote className="h-6 w-6 text-teal-500" aria-hidden="true" />
                Témoignages
              </h2>
              <div className={`mt-6 grid gap-5 ${mission.testimonials.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {mission.testimonials.map((t) => (
                  <figure key={t.name} className="relative rounded-3xl border border-white/80 bg-white/85 p-7 shadow-[0_18px_45px_-28px_rgba(18,63,56,0.3)] backdrop-blur-sm">
                    <Quote className="absolute right-6 top-6 h-10 w-10 -scale-x-100 text-teal-100" aria-hidden="true" />
                    <blockquote className="relative text-[15px] italic leading-relaxed text-gray-700">« {t.quote} »</blockquote>
                    <figcaption className="mt-5 flex items-center gap-3">
                      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-[#2fb391] to-[#178066] text-sm font-bold text-white" style={poppins} aria-hidden="true">
                        {t.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('')}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-gray-900" style={poppins}>{t.name}</span>
                        <span className="block text-xs font-semibold text-teal-700">{t.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </motion.div>

            {/* Galerie */}
            <motion.div {...fadeUp(0)}>
              <MissionGallery images={mission.gallery} title={mission.title} />
            </motion.div>

            {/* Impact */}
            <motion.div id="impact" {...fadeUp(0)} className="scroll-mt-28">
              <h2 className="flex items-center gap-2.5 text-2xl font-bold text-gray-900 sm:text-3xl" style={poppins}>
                <TrendingUp className="h-6 w-6 text-teal-600" aria-hidden="true" />
                Un impact qui se poursuit après la mission
              </h2>
              <div className="mt-6 rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/70 to-white p-7 shadow-[0_18px_45px_-28px_rgba(18,63,56,0.3)] sm:p-9">
                <div className="mb-4 h-1 w-14 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
                <p className="text-[15px] leading-8 text-gray-700 sm:text-base">{mission.impact}</p>
              </div>
            </motion.div>
          </div>

          {/* ── Sidebar sticky ── */}
          <aside className="min-w-0 self-start lg:sticky lg:top-28">
            <div className="space-y-5 rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_25px_60px_-30px_rgba(18,63,56,0.35)] backdrop-blur-sm sm:p-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700" style={poppins}>Fiche mission</p>
                <dl className="mt-4 space-y-3.5">
                  {[
                    { icon: CalendarDays, label: 'Année', value: mission.year },
                    { icon: MapPin, label: 'Localité', value: mission.location },
                    { icon: Stethoscope, label: 'Consultations', value: mission.consultations.toLocaleString('fr-FR') },
                    { icon: Activity, label: 'Spécialités mobilisées', value: String(mission.specialties.length) },
                    { icon: BadgeCheck, label: 'Statut', value: 'Mission terminée' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-teal-100 bg-teal-50"><row.icon className="h-4 w-4 text-teal-600" aria-hidden="true" /></span>
                      <dt className="text-sm text-gray-500">{row.label}</dt>
                      <dd className="ml-auto text-right text-sm font-bold text-gray-900" style={poppins}>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="border-t border-teal-50 pt-5">
                <VillageSelector currentId={mission.id} onNavigate={(id2) => navigate(`/archives/${id2}`)} />
                <Link
                  to="/archives"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                  style={poppins}
                >
                  Voir les autres villages
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="border-t border-teal-50 pt-5">
                <ShareMenu title={mission.title} />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ════════════════ MISSIONS LIÉES ════════════════ */}
      {related.length > 0 && (
        <section className="relative pb-20 pt-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2 {...fadeUp(0)} className="text-2xl font-bold text-gray-900 sm:text-3xl" style={poppins}>Découvrir d'autres missions</motion.h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((m, i) => (
                <motion.article key={m.id} {...fadeUp(0.06 + i * 0.08)} className="group flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)]">
                  <div className="relative h-44 overflow-hidden">
                    <img src={m.imageUrl} alt={`Mission — ${m.title}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/70 via-transparent to-transparent" aria-hidden="true" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-teal-800 shadow-sm backdrop-blur-sm" style={poppins}>{m.year}</span>
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#123f38]/85 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm" style={poppins}>
                      <Stethoscope className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />{m.consultations.toLocaleString('fr-FR')} consultations
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-gray-900" style={poppins}>{m.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500"><MapPin className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />{m.location}</p>
                    <Link to={`/archives/${m.id}`} className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                      Découvrir
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/90 to-teal-50/60 p-10 text-center shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl" style={poppins}>
              Cette mission vous{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">inspire</span> ?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Soutenez les prochaines campagnes de l'ASFO ou proposez une localité pour accueillir une mission médicale.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link to="/donate" className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Heart className="h-5 w-5" aria-hidden="true" />
                Faire un don
              </Link>
              <Link to="/candidature" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Users className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Accueillir une caravane
              </Link>
              <Link to="/archives" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Ambulance className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Voir toutes les missions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SingleArchivePage;
