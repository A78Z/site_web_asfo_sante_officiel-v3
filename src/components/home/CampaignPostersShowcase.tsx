import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
  MapPin,
  Share2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

type Poster = {
  src: string;
  role: string;
  name: string;
  alt: string;
};

const posters: Poster[] = [
  {
    src: '/images/campagne-podor-2026/affiche-officielle.jpeg',
    role: 'Affiche officielle',
    name: '27e Grande Campagne Médicale ASFO — Podor 2026',
    alt: 'Affiche officielle de la 27e Grande Campagne Médicale ASFO à Podor en 2026',
  },
  {
    src: '/images/campagne-podor-2026/homonyme-dr-mbouna-ndiaye.jpeg',
    role: 'Homonyme',
    name: 'Dr Mbouna Ndiaye',
    alt: 'Affiche officielle de l’homonyme Dr Mbouna Ndiaye pour la campagne ASFO 2026',
  },
  {
    src: '/images/campagne-podor-2026/ambassadeur-dr-malick-diallo.jpeg',
    role: 'Ambassadeur',
    name: 'Dr Malick Diallo',
    alt: 'Affiche officielle de l’ambassadeur Dr Malick Diallo pour la campagne ASFO 2026',
  },
  {
    src: '/images/campagne-podor-2026/coordinatrice-dr-oumou-khairy-kane.jpeg',
    role: 'Coordinatrice',
    name: 'Dr Oumou Khairy Kane',
    alt: 'Affiche officielle de la coordinatrice Dr Oumou Khairy Kane pour la campagne ASFO 2026',
  },
];

const personalityPosters = posters.slice(1);

const indicators = [
  { value: '27e', label: 'édition' },
  { value: '8', label: 'villages' },
  { value: '03–09', label: 'septembre' },
  { value: 'Podor', label: 'département' },
];

const CampaignPostersShowcase: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [activePersonality, setActivePersonality] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mobileCardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    setZoomed(false);
  }, []);

  const showPrevious = useCallback(() => {
    setLightboxIndex((current) =>
      current === null ? null : (current - 1 + posters.length) % posters.length,
    );
    setZoomed(false);
  }, []);

  const showNext = useCallback(() => {
    setLightboxIndex((current) =>
      current === null ? null : (current + 1) % posters.length,
    );
    setZoomed(false);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    lastFocusedElement.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      lastFocusedElement.current?.focus();
    };
  }, [closeLightbox, lightboxIndex, showNext, showPrevious]);

  const openPoster = (index: number) => {
    setZoomed(false);
    setLightboxIndex(index);
  };

  const scrollToPersonality = (index: number) => {
    setActivePersonality(index);
    mobileCardsRef.current[index]?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  const handleCarouselScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const carouselLeft = carousel.getBoundingClientRect().left;
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    mobileCardsRef.current.forEach((card, index) => {
      if (!card) return;
      const distance = Math.abs(card.getBoundingClientRect().left - carouselLeft);
      if (distance < closestDistance) {
        closest = index;
        closestDistance = distance;
      }
    });
    setActivePersonality(closest);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/missions/prochaine-campagne`;
    const data = {
      title: '27e Grande Campagne Médicale ASFO — Podor 2026',
      text: 'Découvrez la 27e Grande Campagne Médicale ASFO à Podor, du 03 au 09 septembre 2026.',
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(url);
        setShareFeedback(true);
        window.setTimeout(() => setShareFeedback(false), 2400);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback(true);
        window.setTimeout(() => setShareFeedback(false), 2400);
      } catch {
        window.location.assign(url);
      }
    }
  };

  const activePoster = personalityPosters[activePersonality];
  const lightboxPoster = lightboxIndex === null ? null : posters[lightboxIndex];

  return (
    <section
      aria-labelledby="campaign-posters-title"
      className="relative overflow-hidden border-b border-teal-100 bg-gradient-to-b from-white via-[#f4fbfa] to-white py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute -left-32 top-48 h-80 w-80 rounded-full bg-cyan-100/45 blur-[100px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-emerald-100/45 blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-teal-700 shadow-sm sm:text-xs">
            <Images className="h-4 w-4" aria-hidden="true" />
            Campagne ASFO 2026
          </span>
          <h2 id="campaign-posters-title" className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            La 27e Grande Caravane Médicale se prépare
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Découvrez les affiches officielles, les personnalités engagées et les informations essentielles de la campagne médicale de Podor 2026.
          </p>
          <p className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-bold text-teal-800 sm:text-base">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" aria-hidden="true" />Du 03 au 09 septembre 2026</span>
            <span className="hidden h-1 w-1 rounded-full bg-red-500 sm:block" aria-hidden="true" />
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" />Département de Podor</span>
          </p>
        </motion.header>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <button
              type="button"
              onClick={() => openPoster(0)}
              className="group relative block w-full overflow-hidden rounded-[1.75rem] border border-teal-100 bg-white p-3 shadow-[0_24px_65px_-32px_rgba(15,118,110,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_72px_-30px_rgba(15,118,110,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-4 motion-reduce:transition-none motion-reduce:hover:transform-none sm:p-4"
              aria-label="Voir l’affiche officielle en grand"
            >
              <span className="absolute left-6 top-6 z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-teal-800 shadow-md backdrop-blur">
                Affiche officielle
              </span>
              <img
                src={posters[0].src}
                alt={posters[0].alt}
                className="h-auto w-full rounded-[1.2rem] object-contain"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                sizes="(min-width: 1024px) 43vw, (min-width: 768px) 72vw, 100vw"
              />
              <span className="absolute bottom-6 right-6 inline-flex min-h-10 items-center gap-2 rounded-full bg-slate-950/85 px-4 text-xs font-bold text-white opacity-100 shadow-lg backdrop-blur transition sm:opacity-0 sm:group-hover:opacity-100">
                Voir l’affiche <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </button>
          </motion.div>

          <div className="min-w-0">
            <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_118px] lg:gap-4">
              <motion.article
                key={activePoster.src}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-[0_22px_55px_-34px_rgba(15,23,42,0.5)]"
              >
                <button
                  type="button"
                  onClick={() => openPoster(activePersonality + 1)}
                  className="group block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  <div className="flex min-h-[510px] items-center justify-center overflow-hidden rounded-[1.2rem] bg-slate-50 p-2">
                    <img
                      src={activePoster.src}
                      alt={activePoster.alt}
                      className="max-h-[650px] w-full object-contain transition duration-500 group-hover:scale-[1.012]"
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 42vw, 100vw"
                    />
                  </div>
                </button>
                <div className="flex items-end justify-between gap-4 px-2 pb-2 pt-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red-600">{activePoster.role}</p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">{activePoster.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => openPoster(activePersonality + 1)}
                    className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    Voir l’affiche <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </motion.article>

              <div className="flex flex-col gap-3" aria-label="Choisir une affiche">
                {personalityPosters.map((poster, index) => (
                  <motion.button
                    key={poster.src}
                    type="button"
                    onClick={() => setActivePersonality(index)}
                    initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.42 }}
                    className={`relative flex min-h-0 flex-1 overflow-hidden rounded-2xl border-2 bg-white p-1.5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${activePersonality === index ? 'border-teal-500' : 'border-transparent'}`}
                    aria-label={`Afficher ${poster.role}, ${poster.name}`}
                    aria-pressed={activePersonality === index}
                  >
                    <img src={poster.src} alt="" className="h-full w-full rounded-xl object-contain" loading="lazy" decoding="async" />
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="lg:hidden">
              <div
                ref={carouselRef}
                onScroll={handleCarouselScroll}
                className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
                aria-label="Affiches des personnalités engagées"
              >
                {personalityPosters.map((poster, index) => (
                  <motion.div
                    key={poster.src}
                    ref={(element) => { mobileCardsRef.current[index] = element; }}
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.08, duration: 0.45 }}
                    className="w-[86vw] max-w-[430px] shrink-0 snap-center overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_18px_46px_-30px_rgba(15,23,42,0.5)] md:w-auto md:max-w-none"
                  >
                    <button
                      type="button"
                      onClick={() => openPoster(index + 1)}
                      className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    >
                      <div className="flex items-center justify-center rounded-[1rem] bg-slate-50 p-1.5">
                        <img src={poster.src} alt={poster.alt} className="h-auto w-full object-contain" loading="lazy" decoding="async" sizes="(min-width: 768px) 30vw, 86vw" />
                      </div>
                    </button>
                    <div className="px-1 pb-1 pt-4">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-red-600">{poster.role}</p>
                      <h3 className="mt-1 text-base font-extrabold text-slate-950">{poster.name}</h3>
                      <button type="button" onClick={() => openPoster(index + 1)} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                        Voir l’affiche <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center gap-2 md:hidden" aria-label="Pagination des affiches">
                {personalityPosters.map((poster, index) => (
                  <button
                    key={poster.src}
                    type="button"
                    onClick={() => scrollToPersonality(index)}
                    className={`h-2.5 rounded-full transition-all ${activePersonality === index ? 'w-7 bg-teal-600' : 'w-2.5 bg-slate-300'}`}
                    aria-label={`Aller à l’affiche ${index + 1}`}
                    aria-current={activePersonality === index ? 'true' : undefined}
                  />
                ))}
              </div>
            </div>

            <motion.aside
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="mt-7 rounded-[1.5rem] border border-teal-100 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(15,118,110,0.5)] sm:p-6"
            >
              <h3 className="text-xl font-extrabold text-slate-950">Une mobilisation autour de la campagne</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Ces affiches présentent les principales personnalités engagées dans la 27e Grande Caravane Médicale ASFO et les informations essentielles de l’édition Podor 2026.
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {indicators.map((indicator) => (
                  <div key={indicator.label} className="rounded-2xl border border-teal-100 bg-[#f3fbf9] px-3 py-3 text-center">
                    <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{indicator.label}</dt>
                    <dd className="mt-1 text-lg font-extrabold text-teal-800">{indicator.value}</dd>
                  </div>
                ))}
              </dl>
            </motion.aside>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <Link
            to="/missions/prochaine-campagne"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_34px_-18px_rgba(15,118,110,0.8)] transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            Découvrir la campagne <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            disabled
            title="Le programme officiel n’est pas encore publié."
            className="inline-flex min-h-[52px] cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 py-3.5 text-sm font-extrabold text-slate-500"
          >
            Programme bientôt disponible
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-5 py-3.5 text-sm font-extrabold text-teal-800 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            {shareFeedback ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
            {shareFeedback ? 'Lien copié' : 'Partager'}
          </button>
        </div>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {lightboxPoster && lightboxIndex !== null && (
            <motion.div
              className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/88 p-3 backdrop-blur-md sm:p-6"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeLightbox();
              }}
              role="dialog"
              aria-modal="true"
              aria-label={`Affiche ${lightboxPoster.role}, ${lightboxPoster.name}`}
            >
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative flex max-h-[94dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl sm:rounded-[1.75rem]"
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white sm:px-5">
                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-teal-300">{lightboxPoster.role}</p>
                    <p className="truncate text-sm font-bold sm:text-base">{lightboxPoster.name}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => setZoomed((current) => !current)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300" aria-label={zoomed ? 'Réduire l’affiche' : 'Agrandir l’affiche'}>
                      {zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
                    </button>
                    <button autoFocus type="button" onClick={closeLightbox} className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-900 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300" aria-label="Fermer la galerie">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="relative min-h-0 flex-1 overflow-auto overscroll-contain bg-black/25 p-3 sm:p-5">
                  <div className={`flex min-h-full items-center justify-center transition-[min-width] duration-300 ${zoomed ? 'min-w-[150%]' : 'min-w-full'}`}>
                    <img
                      key={lightboxPoster.src}
                      src={lightboxPoster.src}
                      alt={lightboxPoster.alt}
                      className={`h-auto max-h-[76dvh] object-contain transition-transform duration-300 ${zoomed ? 'scale-125 cursor-zoom-out' : 'max-w-full cursor-zoom-in'}`}
                      onClick={() => setZoomed((current) => !current)}
                      draggable={false}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-white sm:px-5">
                  <button type="button" onClick={showPrevious} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-3 text-xs font-bold transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 sm:px-4 sm:text-sm">
                    <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Précédent</span>
                  </button>
                  <span className="text-xs font-bold text-white/70">{lightboxIndex + 1} / {posters.length}</span>
                  <button type="button" onClick={showNext} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-3 text-xs font-bold transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 sm:px-4 sm:text-sm">
                    <span className="hidden sm:inline">Suivant</span> <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <button type="button" onClick={showPrevious} className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-slate-900 shadow-lg transition hover:scale-105 lg:grid" aria-label="Affiche précédente">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={showNext} className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-slate-900 shadow-lg transition hover:scale-105 lg:grid" aria-label="Affiche suivante">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
};

export default CampaignPostersShowcase;
