import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Camera,
  MapPin,
  Calendar,
  Images,
  Home,
  HeartPulse,
  Users,
  Quote,
  X,
} from 'lucide-react';
import { galleryImages, GalleryImage } from '@/data/gallery';
import { archives } from '@/data/archives';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

/* Sélection variée : les premières photos de chaque village, entrelacées */
const buildSelection = (category: string): GalleryImage[] => {
  const pool = category === 'all' ? galleryImages : galleryImages.filter((g) => g.category === category);
  if (category !== 'all') return pool.slice(0, 8);
  const byCat = new Map<string, GalleryImage[]>();
  pool.forEach((g) => {
    if (!byCat.has(g.category)) byCat.set(g.category, []);
    byCat.get(g.category)!.push(g);
  });
  const rounds: GalleryImage[] = [];
  for (let i = 0; rounds.length < 8 && i < 4; i++) {
    byCat.forEach((imgs) => {
      if (imgs[i] && rounds.length < 8) rounds.push(imgs[i]);
    });
  }
  return rounds;
};

const StatCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const DURATION = 1500;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION);
      setN(Math.round(easeOutCubic(p) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
};

const GalleryPreview: React.FC = () => {
  const reduce = useReducedMotion();
  const [category, setCategory] = useState<'all' | string>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const categories = useMemo(
    () => [...new Set(galleryImages.map((g) => g.category))].sort(),
    [],
  );
  const selection = useMemo(() => buildSelection(category), [category]);

  const stats = useMemo(
    () => [
      { icon: Camera, value: galleryImages.length, suffix: '+', label: 'Photos archivées' },
      { icon: Home, value: categories.length, suffix: '', label: 'Villages documentés' },
      { icon: HeartPulse, value: archives.length, suffix: '', label: 'Missions couvertes' },
      { icon: Users, value: 600, suffix: '+', label: 'Professionnels mobilisés' },
    ],
    [categories.length],
  );

  const prev = useCallback(
    () => setLightbox((i) => (i === null ? null : (i - 1 + selection.length) % selection.length)),
    [selection.length],
  );
  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % selection.length)),
    [selection.length],
  );

  // Navigation clavier de la visionneuse
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, prev, next]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f6fbf9] to-teal-50/40 py-24 sm:py-32">
      {/* ─── Fond ─── */}
      <div className="pointer-events-none absolute -right-40 top-20 h-[440px] w-[440px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-40 bottom-32 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[7%] top-32 hidden h-28 w-28 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />
      <svg className="pointer-events-none absolute right-[5%] bottom-24 hidden h-32 w-32 text-teal-300/20 lg:block" aria-hidden="true">
        <defs>
          <pattern id="asfo-dots-gallery" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.7" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#asfo-dots-gallery)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* ─── En-tête ─── */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp(0)} className="inline-block">
            <motion.span
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/70 bg-white/70 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-[0_10px_25px_-10px_rgba(18,63,56,0.3)] backdrop-blur-md"
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
              En images
            </motion.span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.08)}
            style={poppins}
            className="mt-7 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          >
            Galerie des{' '}
            <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
              actions humanitaires
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.16)}
            className="mx-auto mt-7 max-w-[700px] text-lg leading-loose text-gray-600"
          >
            Revivez les moments forts de nos missions médicales à travers le Fouta —{' '}
            {galleryImages.length} photos qui racontent l'engagement de nos équipes sur le
            terrain.
          </motion.p>
        </div>

        {/* ─── Filtres par village ─── */}
        <motion.div
          {...fadeUp(0.2)}
          role="tablist"
          aria-label="Filtrer les photos par village"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {['all', ...categories].map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-5 py-2 text-sm font-semibold backdrop-blur-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 ${
                category === c
                  ? 'bg-gradient-to-r from-[#2fb391] to-[#178066] text-white shadow-[0_10px_22px_-8px_rgba(23,128,102,0.6)]'
                  : 'border border-teal-100 bg-white/70 text-gray-600 shadow-sm hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700'
              }`}
            >
              {c === 'all' ? 'Toutes' : c}
            </button>
          ))}
        </motion.div>

        {/* ─── Galerie magazine ─── */}
        <div className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[170px] sm:gap-4 lg:grid-cols-4 lg:auto-rows-[190px]">
          {selection.map((img, i) => {
            const featured = i === 0 || i === 5;
            return (
              <motion.button
                key={img.id}
                {...fadeUp(Math.min(i * 0.06, 0.4))}
                onClick={() => setLightbox(i)}
                aria-label={`Agrandir la photo : ${img.alt}`}
                className={`group relative overflow-hidden rounded-2xl border border-white/70 shadow-[0_12px_32px_-16px_rgba(18,63,56,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(18,63,56,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500 ${
                  featured ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                />
                {/* Overlay + storytelling au survol */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-teal-950/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-teal-200">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {img.category}
                    <span className="text-white/40" aria-hidden="true">·</span>
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {img.year}
                  </p>
                  {featured && (
                    <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-white">
                      {img.alt}
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ─── Chiffres de la galerie ─── */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                {...fadeUp(i * 0.08)}
                className="group rounded-2xl border border-white/80 bg-white/80 p-5 text-center shadow-[0_12px_30px_-14px_rgba(18,63,56,0.2)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_-14px_rgba(18,63,56,0.3)]"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 ring-1 ring-teal-100 transition-all duration-300 group-hover:scale-110 group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p
                  style={poppins}
                  className="mt-3 bg-gradient-to-br from-teal-600 to-[#178066] bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl"
                >
                  <StatCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-600 sm:text-sm">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Citation ─── */}
        <motion.figure
          {...fadeUp(0.1)}
          className="relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-3xl border border-teal-100/80 bg-gradient-to-br from-[#e8f3ef]/70 to-white px-8 py-10 text-center shadow-[0_18px_45px_-20px_rgba(18,63,56,0.25)] sm:px-14"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-200/25 blur-2xl" aria-hidden="true" />
          <Quote className="mx-auto h-11 w-11 -scale-x-100 text-teal-300/70" aria-hidden="true" />
          <blockquote
            style={poppins}
            className="mt-3 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-relaxed"
          >
            «&nbsp;Chaque image raconte une histoire de solidarité, d'engagement et d'espoir
            auprès des communautés que nous accompagnons.&nbsp;»
          </blockquote>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-300" aria-hidden="true" />
        </motion.figure>

        {/* ─── Boutons ─── */}
        <motion.div {...fadeUp(0.15)} className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/gallery"
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-8px_rgba(23,128,102,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-8px_rgba(23,128,102,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98] sm:w-auto"
          >
            <Images className="h-4 w-4" aria-hidden="true" />
            Voir la galerie complète
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            to="/archives"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-teal-300/70 bg-white/80 px-7 py-3.5 text-sm font-semibold text-teal-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98] sm:w-auto"
          >
            Explorer les missions
          </Link>
        </motion.div>
      </div>

      {/* ─── Visionneuse plein écran ─── */}
      <AnimatePresence>
        {lightbox !== null && selection[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${lightbox + 1} sur ${selection.length} : ${selection[lightbox].alt}`}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-teal-950/95 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setLightbox(null)}
          >
            {/* Fermer */}
            <button
              onClick={() => setLightbox(null)}
              aria-label="Fermer la visionneuse"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Photo */}
            <AnimatePresence mode="wait">
              <motion.img
                key={selection[lightbox].id}
                src={selection[lightbox].src}
                alt={selection[lightbox].alt}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
                className="max-h-[72vh] max-w-full select-none rounded-2xl shadow-2xl ring-1 ring-white/20"
              />
            </AnimatePresence>

            {/* Légende + navigation */}
            <div
              className="mt-5 flex w-full max-w-2xl items-center justify-between gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={prev}
                aria-label="Photo précédente"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="min-w-0 text-center">
                <p className="truncate text-sm font-medium text-white">{selection[lightbox].alt}</p>
                <p className="mt-0.5 text-xs text-teal-200">
                  {selection[lightbox].category} · {selection[lightbox].year} — {lightbox + 1} /{' '}
                  {selection.length}
                </p>
              </div>
              <button
                onClick={next}
                aria-label="Photo suivante"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleryPreview;
