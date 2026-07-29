import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  Camera,
  Images,
  CalendarDays,
  MapPin,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Share2,
  Facebook,
  Linkedin,
  Link2,
  Check,
  FolderOpen,
  ArrowRight,
  Heart,
  Users,
  Ambulance,
  Layers,
  ZoomIn,
} from 'lucide-react';
import { galleryImages, GalleryImage } from '../data/gallery';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const PAGE_SIZE = 24;

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

type SortMode = 'recentes' | 'anciennes' | 'alpha';

/* ------------------------------------------------------------------ */
/* Lightbox                                                             */
/* ------------------------------------------------------------------ */

const Lightbox: React.FC<{
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}> = ({ images, index, onClose, onNavigate }) => {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const img = images[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [index, images.length, onClose, onNavigate]);

  /* Préchargement des voisines */
  useEffect(() => {
    [(index + 1) % images.length, (index - 1 + images.length) % images.length].forEach((i) => {
      const pre = new Image();
      pre.src = images[i].src;
    });
  }, [index, images]);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const u = new URL(window.location.href);
    u.searchParams.set('photo', img.id);
    return u.toString();
  }, [img.id]);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* noop */ }
  };

  const shareLinks = [
    { label: 'WhatsApp', icon: Share2, href: `https://wa.me/?text=${encodeURIComponent(`${img.alt} ${shareUrl}`)}` },
    { label: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex flex-col bg-[#02120e]/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} sur ${images.length} : ${img.alt}`}
      onClick={onClose}
    >
      {/* Barre supérieure */}
      <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6" onClick={(e) => e.stopPropagation()}>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold tabular-nums" style={poppins}>
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2">
          {shareLinks.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`Partager sur ${l.label}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20">
              <l.icon className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
          <button type="button" onClick={copyLink} aria-label="Copier le lien" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20">
            {copied ? <Check className="h-4 w-4 text-emerald-300" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
          </button>
          <button type="button" onClick={onClose} aria-label="Fermer" className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 sm:px-16" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => onNavigate((index - 1 + images.length) % images.length)} aria-label="Photo précédente" className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:left-6">
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <AnimatePresence mode="wait">
          <motion.img
            key={img.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28 }}
            src={img.src}
            alt={img.alt}
            drag={reduce ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) onNavigate((index + 1) % images.length);
              else if (info.offset.x > 70) onNavigate((index - 1 + images.length) % images.length);
            }}
            className="max-h-full max-w-full cursor-grab rounded-2xl object-contain shadow-2xl active:cursor-grabbing"
          />
        </AnimatePresence>
        <button type="button" onClick={() => onNavigate((index + 1) % images.length)} aria-label="Photo suivante" className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:right-6">
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Infos + miniatures */}
      <div className="px-4 py-4 sm:px-6" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-base font-semibold text-white" style={poppins}>{img.alt}</p>
          <p className="mt-1 flex items-center justify-center gap-3 text-sm text-teal-100/80">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{img.category}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{img.year}</span>
          </p>
        </div>
        <div className="mx-auto mt-4 hidden max-w-4xl gap-2 overflow-x-auto pb-1 lg:flex">
          {images.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onNavigate(i)}
              aria-label={`Aller à la photo ${i + 1}`}
              aria-current={i === index}
              className={`h-14 w-20 flex-none overflow-hidden rounded-lg border-2 transition-all ${i === index ? 'border-teal-400 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
            >
              <img src={t.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const GalleryPage: React.FC = () => {
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();

  const [query, setQuery] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState(params.get('cat') ?? 'all');
  const [sort, setSort] = useState<SortMode>('recentes');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = 'Galerie Photos | ASFO | Action Sanitaire pour le Fouta'; }, []);

  /* Ouverture directe d'une photo partagée via ?photo=id (une seule fois). */
  const deepLinkDone = useRef(false);

  const categories = useMemo(
    () => [...new Set(galleryImages.map((i) => i.category))].sort(),
    [],
  );
  const years = useMemo(() => [...new Set(galleryImages.map((i) => i.year))], []);

  /* Albums = regroupement par catégorie (village), à partir des données. */
  const albums = useMemo(() => {
    const map = new Map<string, GalleryImage[]>();
    galleryImages.forEach((img) => {
      const arr = map.get(img.category) ?? [];
      arr.push(img);
      map.set(img.category, arr);
    });
    return [...map.entries()]
      .map(([cat, imgs]) => ({ category: cat, cover: imgs[0], count: imgs.length, year: imgs[0].year }))
      .sort((a, b) => b.count - a.count);
  }, []);

  /* Synchronise catégorie + recherche dans l'URL (léger). */
  useEffect(() => {
    const nextp = new URLSearchParams(params);
    if (category === 'all') nextp.delete('cat'); else nextp.set('cat', category);
    if (!query) nextp.delete('q'); else nextp.set('q', query);
    setParams(nextp, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    let list = galleryImages.filter((img) => {
      if (category !== 'all' && img.category !== category) return false;
      if (q && !normalize(`${img.alt} ${img.category} ${img.year}`).includes(q)) return false;
      return true;
    });
    if (sort === 'anciennes') list = [...list].reverse();
    else if (sort === 'alpha') list = [...list].sort((a, b) => a.category.localeCompare(b.category) || a.alt.localeCompare(b.alt));
    return list;
  }, [query, category, sort]);

  useEffect(() => { setVisible(PAGE_SIZE); }, [query, category, sort]);

  useEffect(() => {
    if (deepLinkDone.current) return;
    const pid = params.get('photo');
    if (!pid) return;
    const idx = filtered.findIndex((img) => img.id === pid);
    if (idx >= 0) { setLightbox(idx); deepLinkDone.current = true; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  const shown = filtered.slice(0, visible);

  const featured = albums[0];

  const reset = () => { setQuery(''); setCategory('all'); setSort('recentes'); };

  const selectCategory = (cat: string) => {
    setCategory(cat);
    gridRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0" aria-hidden="true">
          <img src="/medicalteam.webp" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e4a3d]/95 via-[#136353]/92 to-[#178066]/90" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.span {...fadeUp(0)} className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-100 backdrop-blur-sm" style={poppins}>
              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
              Notre histoire en images
            </motion.span>
            <motion.h1 {...fadeUp(0.08)} className="mt-6 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl" style={poppins}>
              Notre{' '}
              <span className="bg-gradient-to-r from-[#3fc9a4] to-[#8ff0d4] bg-clip-text text-transparent">Médiathèque</span>
            </motion.h1>
            <motion.p {...fadeUp(0.16)} className="mx-auto mt-6 max-w-[680px] text-base leading-relaxed text-teal-50/90 sm:text-lg sm:leading-8">
              Missions médicales, campagnes, formations et actions communautaires : découvrez en
              images l'engagement de l'ASFO sur le terrain, au plus près des populations du Fouta.
            </motion.p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Images, value: galleryImages.length, suffix: '+', label: 'Photos archivées' },
              { icon: FolderOpen, value: albums.length, suffix: '', label: 'Villages documentés' },
              { icon: CalendarDays, value: parseInt(years[0]), suffix: '', label: 'Campagne (année)' },
            ].map((stat, i) => (
              <motion.div key={stat.label} {...fadeUp(0.2 + i * 0.08)} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-6 text-center shadow-[0_18px_45px_-25px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10"><stat.icon className="h-5 w-5 text-teal-200" aria-hidden="true" /></span>
                <p className="mt-3 text-3xl font-extrabold text-white" style={poppins}><StatCounter value={stat.value} suffix={stat.suffix} /></p>
                <p className="mt-1 text-sm text-teal-100/85">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ INTRO ════════════════ */}
      <section className="relative overflow-hidden pb-8 pt-16 sm:pt-20">
        <div className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.span {...fadeUp(0)} className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
            <Camera className="h-3.5 w-3.5" aria-hidden="true" />
            Nos actions en images
          </motion.span>
          <motion.h2 {...fadeUp(0.08)} className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
            Galerie de{' '}
            <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">photos</span>
          </motion.h2>
          <motion.p {...fadeUp(0.16)} className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Parcourez les moments forts des missions médicales, événements, formations et actions
            communautaires de l'ASFO.
          </motion.p>
        </div>
      </section>

      {/* ════════════════ ALBUM VEDETTE ════════════════ */}
      {featured && (
        <section className="relative pb-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp(0)} className="grid overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.4)] backdrop-blur-sm lg:grid-cols-[1.4fr_1fr]">
              <button type="button" onClick={() => selectCategory(featured.category)} className="group relative h-64 overflow-hidden lg:h-auto" aria-label={`Ouvrir l'album ${featured.category}`}>
                <img src={featured.cover.src} alt={featured.cover.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/50 to-transparent" aria-hidden="true" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-teal-800 shadow-sm backdrop-blur-sm" style={poppins}>
                  <Layers className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                  {featured.count} photos
                </span>
              </button>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700" style={poppins}>Album vedette</span>
                <h3 className="mt-4 text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>Caravane médicale — {featured.category}</h3>
                <p className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-teal-600" aria-hidden="true" />{featured.category}</span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-teal-600" aria-hidden="true" />{featured.year}</span>
                </p>
                <p className="mt-4 text-[15px] leading-7 text-gray-600">
                  {featured.count} photographies capturées lors de la caravane médicale de {featured.category},
                  au cœur des consultations et de la vie communautaire.
                </p>
                <button type="button" onClick={() => selectCategory(featured.category)} className="mt-7 inline-flex w-fit items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                  Voir l'album
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ════════════════ ALBUMS ════════════════ */}
      <section className="relative pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeUp(0)} className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl" style={poppins}>Explorer par album</motion.h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {albums.map((album, i) => (
              <motion.button
                key={album.category}
                type="button"
                {...fadeUp(0.04 + i * 0.05)}
                onClick={() => selectCategory(album.category)}
                aria-pressed={category === album.category}
                className={`group relative overflow-hidden rounded-2xl border text-left shadow-[0_15px_40px_-22px_rgba(18,63,56,0.3)] transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 ${category === album.category ? 'border-teal-400 ring-2 ring-teal-300/40' : 'border-white/80'}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={album.cover.src} alt={`Album — ${album.category}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/85 via-[#123f38]/20 to-transparent" aria-hidden="true" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="truncate text-sm font-bold text-white" style={poppins}>{album.category}</p>
                    <p className="text-[11px] font-semibold text-teal-100/85">{album.count} photos · {album.year}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ BARRE DE CONTRÔLE + GRILLE ════════════════ */}
      <section className="relative overflow-hidden pb-20">
        <div className="pointer-events-none absolute -left-44 top-20 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div ref={gridRef} className="relative mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
          {/* Contrôles */}
          <motion.div {...fadeUp(0)} className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_12px_35px_-20px_rgba(18,63,56,0.3)] backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600" aria-hidden="true" />
              <label htmlFor="gallery-search" className="sr-only">Rechercher une photo, une mission ou un village</label>
              <input
                id="gallery-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une photo, une mission ou un village…"
                className="w-full rounded-full border border-teal-100 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="gallery-sort" className="sr-only">Trier</label>
              <select id="gallery-sort" value={sort} onChange={(e) => setSort(e.target.value as SortMode)} className="rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50">
                <option value="recentes">Plus récentes</option>
                <option value="anciennes">Plus anciennes</option>
                <option value="alpha">Ordre alphabétique</option>
              </select>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-sm transition-all duration-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Réinitialiser
              </button>
            </div>
          </motion.div>

          {/* Chips catégories (scrollables mobile) */}
          <motion.div {...fadeUp(0.06)} className="mt-5 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filtrer par album">
            <button type="button" onClick={() => setCategory('all')} aria-pressed={category === 'all'} className={`flex-none rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${category === 'all' ? 'bg-gradient-to-r from-[#2fb391] to-[#178066] text-white shadow-[0_10px_25px_-12px_rgba(23,128,102,0.7)]' : 'border border-teal-100 bg-white text-gray-600 hover:bg-teal-50'}`} style={poppins}>
              Toutes
            </button>
            {categories.map((cat) => (
              <button key={cat} type="button" onClick={() => setCategory(cat)} aria-pressed={category === cat} className={`flex-none rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${category === cat ? 'bg-gradient-to-r from-[#2fb391] to-[#178066] text-white shadow-[0_10px_25px_-12px_rgba(23,128,102,0.7)]' : 'border border-teal-100 bg-white text-gray-600 hover:bg-teal-50'}`} style={poppins}>
                {cat}
              </button>
            ))}
          </motion.div>

          <p className="mt-5 text-sm text-gray-500">
            <strong className="text-gray-800">{filtered.length}</strong> photo{filtered.length > 1 ? 's' : ''}
            {category !== 'all' && <> · album <strong className="text-teal-700">{category}</strong></>}
          </p>

          {/* Grille */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-teal-100 bg-teal-50"><Search className="h-8 w-8 text-teal-400" aria-hidden="true" /></span>
              <h3 className="mt-6 text-2xl font-bold text-gray-900" style={poppins}>Aucune image trouvée</h3>
              <p className="mx-auto mt-3 max-w-md text-gray-600">Modifiez vos filtres ou réinitialisez la recherche pour découvrir d'autres actions de l'ASFO.</p>
              <button type="button" onClick={reset} className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {shown.map((img, i) => {
                  const realIndex = filtered.indexOf(img);
                  const feat = i % 6 === 0;
                  return (
                    <motion.button
                      key={img.id}
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{ duration: 0.4, delay: Math.min((i % PAGE_SIZE) * 0.02, 0.3), ease: 'easeOut' }}
                      onClick={() => setLightbox(realIndex)}
                      aria-label={`Ouvrir : ${img.alt}`}
                      className={`group relative overflow-hidden rounded-2xl border border-white/80 shadow-[0_15px_40px_-25px_rgba(18,63,56,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_55px_-25px_rgba(18,63,56,0.4)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 ${feat ? 'sm:col-span-2 sm:row-span-2' : ''}`}
                    >
                      <div className={feat ? 'aspect-square sm:aspect-auto sm:h-full' : 'aspect-square'}>
                        <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/85 via-[#123f38]/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-teal-800 shadow-sm backdrop-blur-sm" style={poppins}>{img.year}</span>
                      <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"><ZoomIn className="h-4 w-4" aria-hidden="true" /></span>
                      <div className="absolute inset-x-0 bottom-0 translate-y-1.5 p-3 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="inline-flex items-center gap-1 rounded-full bg-teal-500/90 px-2 py-0.5 text-[10px] font-bold text-white" style={poppins}><MapPin className="h-2.5 w-2.5" aria-hidden="true" />{img.category}</p>
                        <p className={`mt-1.5 font-semibold leading-snug text-white ${feat ? 'text-sm' : 'line-clamp-2 text-[12px]'}`} style={poppins}>{img.alt}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {visible < filtered.length && (
                <div className="mt-10 text-center">
                  <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white px-8 py-3.5 text-base font-bold text-teal-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                    Charger plus de photos
                    <span className="text-sm font-normal text-gray-400">({filtered.length - visible})</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/90 to-teal-50/60 p-10 text-center shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl" style={poppins}>
              Chaque image raconte une histoire d'engagement et de{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">solidarité</span>.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Découvrez les missions de l'ASFO, soutenez nos actions ou rejoignez nos équipes sur le terrain.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link to="/archives" className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Ambulance className="h-5 w-5" aria-hidden="true" />
                Voir nos missions
              </Link>
              <Link to="/join" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Users className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Devenir bénévole
              </Link>
              <Link to="/donate" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Heart className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Faire un don
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ LIGHTBOX ════════════════ */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox images={filtered} index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
