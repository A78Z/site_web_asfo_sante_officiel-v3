import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  Play,
  Film,
  Clapperboard,
  CalendarDays,
  MapPin,
  Clock,
  Stethoscope,
  Heart,
  HeartHandshake,
  ClipboardList,
  Sprout,
  TrendingUp,
  Video,
  Camera,
  Youtube,
  ExternalLink,
} from 'lucide-react';
import { VIDEOS, CHANNEL_URL, type DocVideo } from '../../data/media';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const CHAPTERS = [
  {
    icon: Sprout,
    title: 'Naissance de l’ASFO',
    text: 'Des étudiants en santé du Fouta décident d’agir pour leurs communautés.',
  },
  {
    icon: ClipboardList,
    title: 'Préparation des missions',
    text: 'Repérages, logistique, mobilisation des équipes et des partenaires.',
  },
  {
    icon: Stethoscope,
    title: 'Interventions médicales',
    text: 'Consultations, dépistages et soins gratuits au plus près des villages.',
  },
  {
    icon: HeartHandshake,
    title: 'Rencontres avec les communautés',
    text: 'Témoignages des populations, échanges et confiance construite mission après mission.',
  },
  {
    icon: TrendingUp,
    title: 'Impact durable',
    text: 'Sensibilisation, formation et suivi pour une santé qui dure au-delà des campagnes.',
  },
];

/* Chiffres réels : 10 vidéos publiées sur la chaîne, 151 photos dans la
   galerie du site, 37 missions recensées dans les archives. */
const STATS = [
  { icon: Video, value: 10, suffix: '+', label: 'Vidéos publiées' },
  { icon: Camera, value: 151, suffix: '+', label: 'Photos d’archives' },
  { icon: Film, value: 37, suffix: '+', label: 'Missions documentées' },
  { icon: Stethoscope, value: 600, suffix: '+', label: 'Professionnels mobilisés' },
];

/* ------------------------------------------------------------------ */
/* Helpers d'animation                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const StatCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
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
    const duration = 1600;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
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

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

const DocumentarySection: React.FC = () => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<DocVideo>(VIDEOS[0]);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const selectVideo = (video: DocVideo, autoplay: boolean) => {
    setActive(video);
    setPlaying(autoplay);
    playerRef.current?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#f6fbf9] to-teal-50/50 py-24 lg:py-32"
      aria-labelledby="documentary-title"
    >
      {/* ---- Fond premium clair : halos, glow discret, formes organiques, trame de points ---- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* glow turquoise très discret au-dessus du lecteur */}
        <div className="absolute left-1/2 top-0 h-[36rem] w-[64rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(47,179,145,0.08),transparent_65%)]" />
        {/* halos lumineux dans les coins */}
        <div className="absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" />
        <div className="absolute -left-44 bottom-32 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-sky-100/40 blur-[100px]" />
        {/* formes organiques très transparentes */}
        <div className="absolute left-[6%] top-24 hidden h-32 w-32 rounded-full border border-teal-200/50 lg:block" />
        <svg className="absolute right-[5%] bottom-24 hidden h-32 w-32 text-teal-300/20 lg:block">
          <defs>
            <pattern id="asfo-dots-documentary" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.7" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#asfo-dots-documentary)" />
        </svg>
        {/* croix médicales très discrètes */}
        <div className="absolute right-[8%] top-[12%] text-teal-700/5 text-6xl font-light select-none" style={poppins}>+</div>
        <div className="absolute left-[6%] bottom-[18%] text-teal-700/5 text-5xl font-light select-none" style={poppins}>+</div>
        {/* particules */}
        {!reduce &&
          [
            { left: '12%', top: '22%', delay: 0 },
            { left: '85%', top: '18%', delay: 1.2 },
            { left: '25%', top: '70%', delay: 0.6 },
            { left: '70%', top: '78%', delay: 1.8 },
            { left: '50%', top: '10%', delay: 0.3 },
          ].map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-teal-400/30"
              style={{ left: p.left, top: p.top }}
              animate={{ y: [0, -18, 0], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 6, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* ---------------- Hero ---------------- */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp(0)}>
            <motion.span
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-6 py-2.5 shadow-[0_10px_30px_-15px_rgba(18,63,56,0.3)] backdrop-blur-sm"
            >
              <Clapperboard className="h-4 w-4 text-teal-600" aria-hidden="true" />
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
                Notre histoire en images
              </span>
            </motion.span>
          </motion.div>

          <motion.h2
            id="documentary-title"
            {...fadeUp(0.1)}
            className="mt-7 text-4xl font-extrabold leading-[1.08] text-gray-900 sm:text-5xl lg:text-6xl"
            style={poppins}
          >
            Documentaire{' '}
            <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
              ASFO
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.18)}
            className="mx-auto mt-6 max-w-[720px] text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8"
          >
            Découvrez notre mission humanitaire à travers les films tournés sur le terrain :
            l’engagement des équipes, la rencontre avec les communautés et l’impact durable
            de nos campagnes médicales au Fouta.
          </motion.p>
        </div>

        {/* ---------------- Lecteur cinéma ---------------- */}
        <motion.div {...fadeUp(0.15)} ref={playerRef} className="mx-auto mt-14 max-w-5xl scroll-mt-32">
          <div className="group relative">
            {/* halo premium */}
            <div className="absolute -inset-1.5 rounded-[2rem] bg-gradient-to-r from-teal-300/30 via-emerald-200/20 to-teal-300/30 opacity-50 blur-xl transition-opacity duration-500 group-hover:opacity-90" aria-hidden="true" />

            <div className="relative rounded-[1.75rem] border border-white/80 bg-white/80 p-2.5 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-3">
              <div className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-black">
                <AnimatePresence mode="wait">
                  {playing ? (
                    <motion.iframe
                      key={`player-${active.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${active.id}?rel=0&autoplay=1`}
                      title={active.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <motion.div
                      key={`poster-${active.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      {/* affiche */}
                      <img
                        key={active.id}
                        src={`https://i.ytimg.com/vi/${active.id}/maxresdefault.jpg`}
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (!img.src.includes('hqdefault')) {
                            img.src = `https://i.ytimg.com/vi/${active.id}/hqdefault.jpg`;
                          }
                        }}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      {/* overlay sombre élégant */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#03130f]/95 via-[#03130f]/40 to-[#03130f]/30" aria-hidden="true" />

                      {/* logo + chaîne */}
                      <div className="absolute left-4 top-4 flex items-center gap-2.5 rounded-full border border-white/15 bg-black/40 py-1.5 pl-1.5 pr-4 backdrop-blur-md sm:left-6 sm:top-6">
                        <img src="/logo.png" alt="" className="h-8 w-8 rounded-full bg-white object-contain" />
                        <div className="text-left leading-tight">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-white" style={poppins}>ASFO Santé</p>
                          <p className="text-[10px] text-teal-100/80">Documentaire officiel</p>
                        </div>
                      </div>

                      {/* bouton lecture central */}
                      <button
                        type="button"
                        onClick={() => setPlaying(true)}
                        aria-label={`Lancer la vidéo : ${active.title}`}
                        className="group/play absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                      >
                        <span className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                          {!reduce && (
                            <motion.span
                              className="absolute inset-0 rounded-full bg-teal-300/25"
                              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                              aria-hidden="true"
                            />
                          )}
                          <span className="relative flex h-full w-full items-center justify-center rounded-full border border-white/30 bg-white/15 shadow-[0_0_50px_rgba(63,201,164,0.45)] backdrop-blur-md transition-transform duration-300 group-hover/play:scale-110">
                            <Play className="ml-1 h-9 w-9 fill-white text-white sm:h-10 sm:w-10" aria-hidden="true" />
                          </span>
                        </span>
                      </button>

                      {/* infos bas d'affiche */}
                      <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                        <p className="text-lg font-bold leading-snug text-white sm:text-2xl" style={poppins}>
                          {active.title}
                        </p>
                        {active.note && (
                          <p className="mt-1 hidden text-sm text-teal-100/85 sm:block">{active.note}</p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {active.duration && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-teal-100 backdrop-blur-sm">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              {active.duration}
                            </span>
                          )}
                          {active.year && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-teal-100 backdrop-blur-sm">
                              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                              {active.year}
                            </span>
                          )}
                          <span className="inline-flex items-center rounded-full bg-teal-400/25 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-100 backdrop-blur-sm">
                            {active.tag}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ---------------- Fiche du documentaire ---------------- */}
          <motion.dl
            {...fadeUp(0.1)}
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          >
            {[
              { icon: Clapperboard, label: 'Format', value: active.tag },
              { icon: CalendarDays, label: 'Année', value: active.year ?? '2024–2025' },
              { icon: MapPin, label: 'Zone couverte', value: active.zone ?? 'Fouta' },
              ...(active.duration ? [{ icon: Clock, label: 'Durée', value: active.duration }] : []),
              { icon: Stethoscope, label: 'Professionnels', value: '600+' },
              { icon: Heart, label: 'Bénéficiaires', value: '25 000+' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3.5 text-center shadow-[0_12px_30px_-18px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-colors duration-300 hover:bg-white"
              >
                <item.icon className="mx-auto h-[18px] w-[18px] text-teal-600" aria-hidden="true" />
                <dt className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-teal-700/70">
                  {item.label}
                </dt>
                <dd className="mt-0.5 truncate text-sm font-bold text-gray-900" style={poppins} title={item.value}>
                  {item.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* ---------------- Synopsis + Chapitres ---------------- */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <motion.div
            {...fadeUp(0)}
            className="self-start rounded-3xl border border-white/80 bg-white/80 p-7 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm sm:p-9"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600" style={poppins}>
              Synopsis
            </span>
            <h3 className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl" style={poppins}>
              Plusieurs années d’engagement, un seul fil conducteur : soigner.
            </h3>
            <p className="mt-4 text-[15px] leading-7 text-gray-600 sm:text-base sm:leading-8">
              Ce documentaire retrace plusieurs années d’engagement de l’ASFO auprès des
              communautés du Fouta. Il met en lumière les campagnes médicales, les témoignages
              des populations, le travail des professionnels de santé et l’impact durable des
              actions humanitaires.
            </p>
            <p className="mt-4 text-sm italic text-gray-500">
              « ASFO, Au Service du Fouta » — suivez nos équipes médicales sur le terrain.
            </p>
          </motion.div>

          {/* Chapitres */}
          <motion.div {...fadeUp(0.1)}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600" style={poppins}>
              Les chapitres du récit
            </span>
            <ol className="relative mt-5 space-y-1.5 border-l border-teal-100 pl-0">
              {CHAPTERS.map((chapter, i) => (
                <motion.li
                  key={chapter.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: 'easeOut' }}
                  className="group relative -ml-px flex gap-4 rounded-2xl border border-transparent p-3.5 pl-4 transition-colors duration-300 hover:border-teal-100 hover:bg-white/80"
                >
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-teal-100 bg-teal-50 transition-colors duration-300 group-hover:bg-teal-100">
                    <chapter.icon className="h-[18px] w-[18px] text-teal-600" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600/80" style={poppins}>
                      Chapitre {i + 1}
                    </p>
                    <p className="text-sm font-bold text-gray-900" style={poppins}>{chapter.title}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-gray-600">{chapter.text}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>

        {/* ---------------- Galerie vidéo ---------------- */}
        <div className="mx-auto mt-16 max-w-5xl">
          <motion.div {...fadeUp(0)} className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600" style={poppins}>
                Galerie vidéo
              </span>
              <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl" style={poppins}>
                Toutes nos vidéos de terrain
              </h3>
            </div>
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-500 sm:inline-flex"
            >
              La chaîne ASFO Santé
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {VIDEOS.map((video, i) => {
              const isActive = video.id === active.id;
              return (
                <motion.button
                  key={video.id}
                  type="button"
                  {...fadeUp(0.05 + i * 0.06)}
                  onClick={() => selectVideo(video, true)}
                  aria-label={`Regarder : ${video.title}${video.duration ? ` (${video.duration})` : ''}`}
                  aria-pressed={isActive}
                  className={`group relative overflow-hidden rounded-2xl border text-left shadow-[0_15px_40px_-18px_rgba(18,63,56,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-18px_rgba(18,63,56,0.35)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 ${
                    isActive ? 'border-teal-400/70 ring-2 ring-teal-400/40' : 'border-white/80 hover:border-teal-200'
                  }`}
                >
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <img
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#03130f]/90 via-transparent to-transparent" aria-hidden="true" />
                    {/* play au survol */}
                    <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:scale-110">
                      <Play className="ml-0.5 h-4 w-4 fill-white text-white" aria-hidden="true" />
                    </span>
                    {video.duration && (
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                        {video.duration}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute left-2 top-2 rounded-full bg-teal-400/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#04201b]">
                        En lecture
                      </span>
                    )}
                  </div>
                  <div className="bg-white/85 p-3 backdrop-blur-sm">
                    <p className="text-[10.5px] font-bold uppercase tracking-wider text-teal-700/80" style={poppins}>
                      {video.tag}
                      {video.year ? ` · ${video.year}` : ''}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900" style={poppins}>
                      {video.title}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ---------------- Chiffres ---------------- */}
        <motion.div
          {...fadeUp(0)}
          className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/80 bg-white/80 px-5 py-6 text-center shadow-[0_15px_40px_-20px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
                <stat.icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
              </span>
              <p className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}>
                <StatCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ---------------- Citation ---------------- */}
        <motion.figure
          {...fadeUp(0.1)}
          className="mx-auto mt-14 max-w-3xl rounded-3xl border border-white/80 bg-white/80 p-8 text-center shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm sm:p-10"
        >
          <span className="text-5xl font-extrabold leading-none text-teal-500/60 sm:text-6xl" style={poppins} aria-hidden="true">
            «&nbsp;»
          </span>
          <blockquote className="mt-3 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-8" style={poppins}>
            Chaque image témoigne d’un engagement, chaque mission raconte une histoire,
            chaque sourire rappelle pourquoi l’ASFO existe.
          </blockquote>
          <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#3fc9a4] to-[#8ff0d4]" aria-hidden="true" />
        </motion.figure>

        {/* ---------------- Boutons ---------------- */}
        <motion.div {...fadeUp(0.15)} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => selectVideo(VIDEOS[0], true)}
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-4 text-base font-bold text-white shadow-[0_20px_45px_-18px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_55px_-18px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <Play className="ml-0.5 h-3.5 w-3.5 fill-white text-white" aria-hidden="true" />
            </span>
            Regarder le documentaire
          </button>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-8 py-4 text-base font-semibold text-teal-800 shadow-[0_12px_30px_-18px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            <Youtube className="h-5 w-5 text-teal-600" aria-hidden="true" />
            Voir toutes les vidéos
            <ExternalLink className="h-4 w-4 opacity-70" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default DocumentarySection;
