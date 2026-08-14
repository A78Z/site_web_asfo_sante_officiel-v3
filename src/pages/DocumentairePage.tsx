import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Play,
  Film,
  Clapperboard,
  Video,
  Camera,
  Images,
  MapPin,
  CalendarDays,
  Clock,
  Search,
  X,
  RotateCcw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Youtube,
  ExternalLink,
  Link as LinkIcon,
  Facebook,
  Linkedin,
  MessageCircle,
  Sparkles,
  BookOpen,
  Megaphone,
  Radio,
  Heart,
  Users,
  Maximize2,
  Check,
} from 'lucide-react';
import {
  VIDEOS,
  CHANNEL_URL,
  videoThumb,
  videoWatchUrl,
  videoEmbedUrl,
  type DocVideo,
} from '../data/media';
import { galleryImages } from '../data/gallery';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* Couleur de badge par catégorie (tag réel) */
const tagStyle = (tag: string) => {
  const t = normalize(tag);
  if (t.includes('film')) return 'bg-[#e5533d] text-white';
  if (t.includes('sensib')) return 'bg-sky-100 text-sky-700';
  if (t.includes('panel')) return 'bg-amber-100 text-amber-700';
  if (t.includes('bilan')) return 'bg-violet-100 text-violet-700';
  return 'bg-teal-100 text-teal-700';
};

/* ------------------------------------------------------------------ */
/* Données dérivées (aucune valeur inventée)                          */
/* ------------------------------------------------------------------ */

const FEATURED = VIDEOS[0];

const CATEGORIES = [...new Set(VIDEOS.map((v) => v.tag))];
const YEARS = [...new Set(VIDEOS.map((v) => v.year).filter(Boolean))].sort(
  (a, b) => Number(b) - Number(a),
) as string[];
const ZONES = [...new Set(VIDEOS.map((v) => v.zone).filter(Boolean))] as string[];

/* Albums photos réels, regroupés par village depuis la galerie */
interface Album {
  name: string;
  cover: string;
  count: number;
  year: string;
}
const ALBUMS: Album[] = (() => {
  const map = new Map<string, Album>();
  galleryImages.forEach((img) => {
    const existing = map.get(img.category);
    if (existing) existing.count += 1;
    else map.set(img.category, { name: img.category, cover: img.src, count: 1, year: img.year });
  });
  return [...map.values()].sort((a, b) => b.count - a.count);
})();

const PHOTO_COUNT = galleryImages.length;
const PREVIEW_PHOTOS = galleryImages.slice(0, 8);

const NAV = [
  { id: 'a-la-une', label: 'À la une', icon: Sparkles },
  { id: 'videos', label: 'Vidéos', icon: Video },
  { id: 'documentaire', label: 'Documentaire', icon: Film },
  { id: 'photos', label: 'Photos', icon: Camera },
];

/* ------------------------------------------------------------------ */
/* Partage                                                            */
/* ------------------------------------------------------------------ */

const ShareRow: React.FC<{ url: string; title: string; compact?: boolean }> = ({
  url,
  title,
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent(url);
  const encT = encodeURIComponent(title);
  const links = [
    { icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/?text=${encT}%20${enc}` },
    { icon: Facebook, label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc}` },
    { icon: Linkedin, label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}` },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };
  const size = compact ? 'h-8 w-8' : 'h-9 w-9';
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Partager">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Partager sur ${l.label}`}
          className={`flex ${size} items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400`}
        >
          <l.icon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
        </a>
      ))}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          copy();
        }}
        aria-label="Copier le lien"
        className={`flex ${size} items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400`}
      >
        {copied ? (
          <Check className={compact ? 'h-3.5 w-3.5 text-teal-600' : 'h-4 w-4 text-teal-600'} aria-hidden="true" />
        ) : (
          <LinkIcon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Carte vidéo                                                        */
/* ------------------------------------------------------------------ */

const VideoCard: React.FC<{ video: DocVideo; onPlay: () => void }> = ({ video, onPlay }) => (
  <motion.article
    {...fadeUp()}
    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-teal-100 bg-white/85 backdrop-blur-sm shadow-[0_18px_45px_-28px_rgba(18,63,56,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-25px_rgba(18,63,56,0.4)]"
  >
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Lire la vidéo : ${video.title}`}
      className="relative block aspect-video w-full overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
    >
      <img
        src={videoThumb(video.id)}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true" />
      <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-teal-700 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
          <Play className="ml-0.5 h-6 w-6 fill-current" />
        </span>
      </span>
      {video.duration && (
        <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white" aria-hidden="true">
          <Clock className="h-3 w-3" />
          {video.duration}
        </span>
      )}
      <span
        className={`absolute left-2.5 top-2.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tagStyle(video.tag)}`}
        style={poppins}
      >
        {video.tag}
      </span>
      {video.broadcaster && (
        <span className="absolute right-2.5 top-2.5 inline-flex rounded-full border border-white/25 bg-black/65 px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-white backdrop-blur-sm">
          {video.broadcaster}
        </span>
      )}
    </button>

    <div className="flex flex-grow flex-col p-5">
      <h3 className="text-base font-bold leading-snug text-[#123f38]" style={poppins}>
        {video.title}
      </h3>
      {video.note && <p className="mt-1.5 flex-grow text-sm leading-relaxed text-gray-600">{video.note}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
        {video.year && (
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {video.year}
          </span>
        )}
        {video.zone && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {video.zone}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onPlay}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-4 py-2 text-xs font-bold text-white shadow-[0_12px_30px_-14px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
          style={poppins}
        >
          <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          Regarder
        </button>
        <ShareRow url={videoWatchUrl(video.id)} title={video.title} compact />
      </div>
    </div>
  </motion.article>
);

/* ------------------------------------------------------------------ */
/* Lecteur vidéo (modal)                                              */
/* ------------------------------------------------------------------ */

const VideoPlayer: React.FC<{
  list: DocVideo[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}> = ({ list, index, onClose, onNavigate }) => {
  const video = list[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const hasPrev = index > 0;
  const hasNext = index < list.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && hasPrev) onNavigate(index - 1);
      else if (e.key === 'ArrowRight' && hasNext) onNavigate(index + 1);
      else if (e.key === 'Tab') {
        // Piège de focus simple
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, a[href], iframe, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, hasPrev, hasNext, onClose, onNavigate]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Lecteur vidéo : ${video.title}`}
        className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[#0d1f1c] shadow-2xl outline-none"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tagStyle(video.tag)}`}
            style={poppins}
          >
            {video.tag}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le lecteur"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/90 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative aspect-video w-full bg-black">
          <iframe
            key={video.id}
            src={videoEmbedUrl(video.id)}
            title={video.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {hasPrev && (
            <button
              type="button"
              onClick={() => onNavigate(index - 1)}
              aria-label="Vidéo précédente"
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              onClick={() => onNavigate(index + 1)}
              aria-label="Vidéo suivante"
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white" style={poppins}>
              {video.title}
            </h3>
            {video.note && <p className="mt-1 text-sm text-white/70">{video.note}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/60">
              {video.duration && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {video.duration}
                </span>
              )}
              {video.year && (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {video.year}
                </span>
              )}
              {video.zone && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {video.zone}
                </span>
              )}
              <span className="text-white/40">
                {index + 1} / {list.length}
              </span>
            </div>
          </div>
          <div className="flex flex-none items-center gap-2">
            <a
              href={videoWatchUrl(video.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              style={poppins}
            >
              <Youtube className="h-4 w-4" aria-hidden="true" />
              YouTube
            </a>
            <ShareRow url={videoWatchUrl(video.id)} title={video.title} compact />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Lightbox photos (aperçu)                                           */
/* ------------------------------------------------------------------ */

const PhotoLightbox: React.FC<{
  images: typeof PREVIEW_PHOTOS;
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}> = ({ images, index, onClose, onNavigate }) => {
  const img = images[index];
  const touchX = useRef<number | null>(null);
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && hasPrev) onNavigate(index - 1);
      else if (e.key === 'ArrowRight' && hasNext) onNavigate(index + 1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, hasPrev, hasNext, onClose, onNavigate]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Aperçu photo"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx > 50 && hasPrev) onNavigate(index - 1);
        else if (dx < -50 && hasNext) onNavigate(index + 1);
        touchX.current = null;
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer l’aperçu"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
      {hasPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index - 1);
          }}
          aria-label="Photo précédente"
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
      <figure onClick={(e) => e.stopPropagation()} className="max-h-[85vh] max-w-4xl">
        <img
          src={img.src}
          alt={img.alt}
          className="mx-auto max-h-[78vh] w-auto rounded-lg object-contain shadow-2xl"
        />
        <figcaption className="mt-3 text-center text-sm text-white/80">
          {img.alt} · {index + 1} / {images.length}
        </figcaption>
      </figure>
      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index + 1);
          }}
          aria-label="Photo suivante"
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const DocumentairePage: React.FC = () => {
  const reduce = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [category, setCategory] = useState(() => searchParams.get('cat') ?? 'tous');
  const [year, setYear] = useState(() => searchParams.get('an') ?? 'tous');
  const [zone, setZone] = useState(() => searchParams.get('zone') ?? 'tous');
  const [sort, setSort] = useState<'recent' | 'ancien'>(
    () => (searchParams.get('tri') === 'ancien' ? 'ancien' : 'recent'),
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('a-la-une');
  const [headerH, setHeaderH] = useState(0);

  const [player, setPlayer] = useState<{ list: DocVideo[]; index: number } | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Documentaire & vidéos | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  // Barre de navigation collée sous le header réel (hauteur variable)
  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;
    const update = () => setHeaderH(header.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // Onglet actif selon la section visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Synchronisation de l'URL
  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set('q', query.trim());
    if (category !== 'tous') next.set('cat', category);
    if (year !== 'tous') next.set('an', year);
    if (zone !== 'tous') next.set('zone', zone);
    if (sort !== 'recent') next.set('tri', sort);
    setSearchParams(next, { replace: true });
  }, [query, category, year, zone, sort, setSearchParams]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - headerH - 60;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  };

  const filtersActive =
    query.trim() !== '' || category !== 'tous' || year !== 'tous' || zone !== 'tous';

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    let list = VIDEOS.filter((v) => {
      if (category !== 'tous' && v.tag !== category) return false;
      if (year !== 'tous' && v.year !== year) return false;
      if (zone !== 'tous' && v.zone !== zone) return false;
      if (q && !normalize(`${v.title} ${v.note ?? ''} ${v.zone ?? ''} ${v.tag}`).includes(q))
        return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const ya = Number(a.year ?? 0);
      const yb = Number(b.year ?? 0);
      return sort === 'recent' ? yb - ya : ya - yb;
    });
    return list;
  }, [query, category, year, zone, sort]);

  const resetFilters = () => {
    setQuery('');
    setCategory('tous');
    setYear('tous');
    setZone('tous');
    setSort('recent');
  };

  const openPlayer = (list: DocVideo[], id: string) => {
    const index = list.findIndex((v) => v.id === id);
    setPlayer({ list, index: index < 0 ? 0 : index });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* Halos décoratifs */}
      <div className="pointer-events-none absolute -left-32 top-44 h-72 w-72 rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-[75rem] h-80 w-80 rounded-full bg-teal-100/30 blur-[130px]" aria-hidden="true" />

      {/* ------------------------- HERO ------------------------- */}
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
              <Clapperboard className="h-4 w-4" aria-hidden="true" />
              Médiathèque ASFO
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] text-[#123f38] sm:text-5xl" style={poppins}>
              Documentaires, reportages{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
                &amp; témoignages
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Découvrez en images les missions, les équipes et les communautés qui font vivre
              l’engagement de l’ASFO.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openPlayer(VIDEOS, FEATURED.id)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                Regarder la vidéo
              </button>
              <button
                type="button"
                onClick={() => scrollTo('videos')}
                className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60"
                style={poppins}
              >
                Explorer la médiathèque
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          {/* Composition audiovisuelle */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => openPlayer(VIDEOS, FEATURED.id)}
                aria-label={`Lire la vidéo : ${FEATURED.title}`}
                className="group relative block aspect-video w-full overflow-hidden rounded-2xl shadow-[0_30px_70px_-30px_rgba(18,63,56,0.6)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
              >
                <img src={videoThumb(FEATURED.id)} alt="" className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#0d3b33]/70 via-[#0d3b33]/10 to-transparent" aria-hidden="true" />
                <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-teal-700 shadow-xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7 fill-current" />
                  </span>
                </span>
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white" aria-hidden="true">
                  <Film className="h-3.5 w-3.5" />
                  {FEATURED.title}
                </span>
              </button>

              {/* miniatures secondaires */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                {VIDEOS.slice(1, 3).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => openPlayer(VIDEOS, v.id)}
                    aria-label={`Lire la vidéo : ${v.title}`}
                    className="group relative block aspect-video overflow-hidden rounded-xl shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
                  >
                    <img src={videoThumb(v.id)} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
                      <Play className="h-6 w-6 fill-white text-white" />
                    </span>
                  </button>
                ))}
              </div>

              {/* carte flottante — compteurs calculés */}
              <div className="pointer-events-none absolute -bottom-5 -right-3 hidden rounded-2xl border border-teal-100 bg-white/95 p-4 shadow-[0_20px_45px_-20px_rgba(18,63,56,0.5)] backdrop-blur-sm sm:block">
                <div className="flex items-center gap-4 text-center">
                  <div>
                    <p className="text-xl font-extrabold text-[#123f38]" style={poppins}>
                      {VIDEOS.length}
                    </p>
                    <p className="text-[11px] text-gray-500">vidéos</p>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <p className="text-xl font-extrabold text-[#123f38]" style={poppins}>
                      {PHOTO_COUNT}
                    </p>
                    <p className="text-[11px] text-gray-500">photos</p>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <p className="text-xl font-extrabold text-[#123f38]" style={poppins}>
                      {ALBUMS.length}
                    </p>
                    <p className="text-[11px] text-gray-500">albums</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------------- NAVIGATION --------------------- */}
      <nav
        aria-label="Navigation de la médiathèque"
        style={{ top: headerH }}
        className="sticky z-30 border-y border-teal-100/70 bg-white/85 backdrop-blur-md"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = activeSection === n.id;
              return (
                <li key={n.id} className="flex-none">
                  <button
                    type="button"
                    onClick={() => scrollTo(n.id)}
                    aria-current={active ? 'true' : undefined}
                    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      active ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
                    }`}
                    style={poppins}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {n.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* --------------------- À LA UNE --------------------- */}
      <section id="a-la-une" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="mb-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
              À regarder en ce moment
            </h2>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.05)}
          className="grid overflow-hidden rounded-3xl border border-teal-100 bg-white/85 shadow-[0_30px_70px_-40px_rgba(18,63,56,0.5)] backdrop-blur-sm lg:grid-cols-2"
        >
          <button
            type="button"
            onClick={() => openPlayer(VIDEOS, FEATURED.id)}
            aria-label={`Lire la vidéo : ${FEATURED.title}`}
            className="group relative block aspect-video w-full overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 lg:aspect-auto lg:h-full"
          >
            <img src={videoThumb(FEATURED.id)} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true" />
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-teal-700 shadow-xl transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-1 h-7 w-7 fill-current" />
              </span>
            </span>
          </button>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${tagStyle(FEATURED.tag)}`} style={poppins}>
                {FEATURED.tag}
              </span>
              {FEATURED.duration && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {FEATURED.duration}
                </span>
              )}
            </div>
            <h3 className="mt-4 text-2xl font-extrabold text-[#123f38]" style={poppins}>
              {FEATURED.title}
            </h3>
            {FEATURED.note && <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">{FEATURED.note}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              {FEATURED.year && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {FEATURED.year}
                </span>
              )}
              {FEATURED.zone && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {FEATURED.zone}
                </span>
              )}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openPlayer(VIDEOS, FEATURED.id)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                Regarder maintenant
              </button>
              <ShareRow url={videoWatchUrl(FEATURED.id)} title={FEATURED.title} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* --------------------- VIDÉOS (bibliothèque) --------------------- */}
      <section id="videos" className="relative scroll-mt-24 bg-[#f2fbf8]/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-8 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Video className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
                La médiathèque en vidéos
              </h2>
            </div>
            <p className="mt-3 text-gray-600">
              Reportages de mission, films de campagne, panels et sensibilisation — publiés sur la
              chaîne YouTube de l’ASFO.
            </p>
          </motion.div>

          {/* Bouton filtres (mobile) */}
          <div className="mb-4 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-700"
              aria-expanded={mobileFiltersOpen}
              style={poppins}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Rechercher &amp; filtrer
            </button>
          </div>

          {/* Panneau filtres */}
          <div
            className={`${
              mobileFiltersOpen ? 'block' : 'hidden'
            } mb-8 rounded-2xl border border-teal-100 bg-white/85 p-5 shadow-[0_18px_45px_-30px_rgba(18,63,56,0.35)] backdrop-blur-sm lg:block`}
          >
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto] lg:items-end">
              <div>
                <label htmlFor="v-search" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500" style={poppins}>
                  Rechercher
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input
                    id="v-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher une vidéo ou un reportage..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                  />
                  {query && (
                    <button type="button" onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Effacer la recherche">
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="v-cat" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500" style={poppins}>
                  Catégorie
                </label>
                <select id="v-cat" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100">
                  <option value="tous">Toutes</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="v-year" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500" style={poppins}>
                  Année
                </label>
                <select id="v-year" value={year} onChange={(e) => setYear(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100">
                  <option value="tous">Toutes</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="v-zone" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500" style={poppins}>
                  Lieu
                </label>
                <select id="v-zone" value={zone} onChange={(e) => setZone(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100">
                  <option value="tous">Tous</option>
                  {ZONES.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Trier"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as 'recent' | 'ancien')}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="recent">Plus récentes</option>
                  <option value="ancien">Plus anciennes</option>
                </select>
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={!filtersActive}
                  className="inline-flex flex-none items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  style={poppins}
                  aria-label="Réinitialiser les filtres"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <p className="mb-6 text-sm text-gray-600" aria-live="polite">
            <strong className="text-[#123f38]">{filtered.length}</strong> vidéo
            {filtered.length > 1 ? 's' : ''}
            {filtersActive ? ' correspondant à vos filtres' : ' disponibles'}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-teal-200 bg-white/70 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-500">
                <Search className="h-7 w-7" aria-hidden="true" />
              </div>
              <p className="text-lg font-bold text-[#123f38]" style={poppins}>
                Aucun contenu trouvé
              </p>
              <p className="mt-2 text-gray-500">
                Modifiez vos filtres ou explorez une autre catégorie de la médiathèque.
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
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v) => (
                <VideoCard key={v.id} video={v} onPlay={() => openPlayer(filtered, v.id)} />
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-5 py-2.5 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              style={poppins}
            >
              <Youtube className="h-4 w-4" aria-hidden="true" />
              Voir toutes les vidéos sur YouTube
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* --------------------- DOCUMENTAIRE OFFICIEL (préannonce) --------------------- */}
      <section id="documentaire" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="mb-8 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Film className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
              Le documentaire officiel
            </h2>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.05)}
          className="grid overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-white to-[#f2fbf8] lg:grid-cols-[1.1fr_1fr]"
        >
          <div className="relative flex min-h-[16rem] items-center justify-center bg-gradient-to-br from-[#123f38] to-[#0d5346] p-10">
            <div className="text-center text-white">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <Clapperboard className="h-10 w-10" aria-hidden="true" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white/90" style={poppins}>
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Contenu à venir
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <h3 className="text-xl font-extrabold text-[#123f38]" style={poppins}>
              Le documentaire officiel de l’ASFO sera prochainement disponible.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              En attendant sa sortie, retrouvez les films de campagne, reportages de mission et
              vidéos de sensibilisation déjà publiés dans la médiathèque ci-dessus et sur la chaîne
              YouTube de l’ASFO.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollTo('videos')}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_35px_-16px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Video className="h-4 w-4" aria-hidden="true" />
                Voir les vidéos disponibles
              </button>
              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-5 py-2.5 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                style={poppins}
              >
                <Youtube className="h-4 w-4" aria-hidden="true" />
                Chaîne YouTube
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --------------------- PHOTOS --------------------- */}
      <section id="photos" className="relative scroll-mt-24 bg-[#f2fbf8]/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Camera className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
                  Médiathèque photos
                </h2>
              </div>
              <p className="mt-3 text-gray-600">
                <strong className="text-teal-700">{PHOTO_COUNT} photos</strong> de nos missions,
                regroupées en {ALBUMS.length} albums par village.
              </p>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_35px_-16px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
              style={poppins}
            >
              <Images className="h-4 w-4" aria-hidden="true" />
              Consulter la galerie complète
            </Link>
          </motion.div>

          {/* Bandeau d'aperçu — miniatures cliquables (lightbox) */}
          <motion.div {...fadeUp(0.05)} className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PREVIEW_PHOTOS.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`Agrandir la photo : ${img.alt}`}
                className="group relative block aspect-square overflow-hidden rounded-xl shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
              >
                <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
                  <Maximize2 className="h-6 w-6 text-white" />
                </span>
              </button>
            ))}
          </motion.div>

          {/* Albums par mission (village) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ALBUMS.map((album, i) => (
              <motion.div key={album.name} {...fadeUp(i * 0.05)}>
                <Link
                  to={`/gallery?cat=${encodeURIComponent(album.name)}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_18px_45px_-28px_rgba(18,63,56,0.4)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
                >
                  <img src={album.cover} alt={`Album ${album.name}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden="true" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-base font-bold text-white" style={poppins}>
                      {album.name}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-teal-100/90">
                      {album.count} photos · {album.year}
                    </p>
                  </div>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-teal-700">
                    <Images className="h-3 w-3" aria-hidden="true" />
                    Ouvrir l’album
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------- IMPACT AUDIOVISUEL --------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
            Notre action racontée en images
          </h2>
          <p className="mt-4 text-gray-600">
            Chaque reportage documente les missions, valorise les équipes et préserve la mémoire
            des actions menées auprès des communautés.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { icon: BookOpen, title: 'Documenter', text: 'Garder une trace fidèle des campagnes médicales et de leurs résultats sur le terrain.' },
            { icon: Megaphone, title: 'Informer', text: 'Sensibiliser les populations et donner à voir l’engagement des équipes de l’ASFO.' },
            { icon: Radio, title: 'Transmettre', text: 'Partager l’expérience, inspirer les bénévoles et pérenniser la mémoire de l’association.' },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              {...fadeUp(i * 0.1)}
              className="rounded-2xl border border-teal-50 bg-[#f2fbf8] p-6 text-center shadow-[0_18px_45px_-30px_rgba(18,63,56,0.3)]"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm">
                <c.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#123f38]" style={poppins}>
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --------------------- CTA FINAL --------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp()}
          className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-white via-[#eefaf6] to-[#e3f5ee] px-6 py-12 text-center shadow-[0_30px_70px_-40px_rgba(18,63,56,0.5)] sm:px-12"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-200/40 blur-[90px]" aria-hidden="true" />
          <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
            Découvrez l’ASFO autrement.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-gray-600">
            Regardez nos actions sur le terrain, explorez nos missions et rejoignez celles et ceux
            qui font vivre cette aventure humaine.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/archives"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
              style={poppins}
            >
              Voir nos missions
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/join"
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60"
              style={poppins}
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              Devenir bénévole
            </Link>
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 rounded-full bg-[#e5533d] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(229,83,61,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
              style={poppins}
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              Faire un don
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Lecteur vidéo */}
      <AnimatePresence>
        {player && (
          <VideoPlayer
            list={player.list}
            index={player.index}
            onClose={() => setPlayer(null)}
            onNavigate={(i) => setPlayer((p) => (p ? { ...p, index: i } : p))}
          />
        )}
      </AnimatePresence>

      {/* Lightbox photos */}
      <AnimatePresence>
        {lightbox !== null && (
          <PhotoLightbox
            images={PREVIEW_PHOTOS}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onNavigate={(i) => setLightbox(i)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentairePage;
