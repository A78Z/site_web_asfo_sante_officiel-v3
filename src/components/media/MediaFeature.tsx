import React, { useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Tv } from 'lucide-react';
import { videoEmbedUrl, type MediaFeatureContent } from '../../data/media';

interface MediaFeatureProps {
  media: MediaFeatureContent;
  sectionLabel?: string;
}

interface YouTubeFacadeProps {
  media: MediaFeatureContent;
  playing: boolean;
  onPlay: () => void;
}

const YouTubeFacade: React.FC<YouTubeFacadeProps> = ({ media, playing, onPlay }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="group/player relative w-full max-w-full rounded-[1.4rem] border border-white/15 bg-[#020d0b] p-1.5 shadow-[0_34px_90px_-32px_rgba(45,212,191,0.55)] sm:rounded-[1.8rem] sm:p-2">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-teal-400/15 blur-3xl" aria-hidden="true" />
      {!reduceMotion && (
        <motion.span
          className="pointer-events-none absolute inset-y-2 z-20 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm"
          initial={{ left: '-35%' }}
          animate={{ left: '115%' }}
          transition={{ duration: 5.5, delay: 2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      )}

      <div className="relative aspect-video w-full overflow-hidden rounded-[1.05rem] bg-black sm:rounded-[1.35rem]">
        {playing ? (
          <iframe
            src={videoEmbedUrl(media.youtubeId)}
            title={`${media.title} — ${media.network}`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={`https://i.ytimg.com/vi/${media.youtubeId}/maxresdefault.jpg`}
              onError={(event) => {
                const image = event.currentTarget;
                if (!image.src.includes('hqdefault')) {
                  image.src = `https://i.ytimg.com/vi/${media.youtubeId}/hqdefault.jpg`;
                }
              }}
              alt={`Interview de l’ASFO dans l’émission ${media.program} sur ${media.network}`}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="h-full w-full object-cover transition-transform duration-700 group-hover/player:scale-[1.025] motion-reduce:transition-none"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#020d0b]/90 via-black/20 to-black/35" aria-hidden="true" />

            <button
              type="button"
              onClick={onPlay}
              aria-label={`Regarder l’interview ${media.program} sur ${media.network}`}
              className="group/play absolute left-1/2 top-1/2 z-10 grid h-[4.75rem] w-[4.75rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-white/15 text-white shadow-[0_0_0_10px_rgba(255,255,255,0.06),0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white/25 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 motion-reduce:transition-none sm:h-24 sm:w-24"
            >
              {!reduceMotion && (
                <motion.span
                  className="absolute inset-0 rounded-full border border-teal-200/60"
                  animate={{ scale: [1, 1.22, 1], opacity: [0.65, 0, 0.65] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                />
              )}
              <Play className="ml-1 h-8 w-8 fill-current sm:h-10 sm:w-10" aria-hidden="true" />
            </button>

            <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/65 px-3 py-1.5 text-xs font-extrabold tracking-[0.12em] text-white backdrop-blur-md sm:left-5 sm:top-5">
              {media.network}
            </span>
            <span className="absolute right-3 top-3 rounded-full border border-teal-200/20 bg-teal-300/15 px-3 py-1.5 text-xs font-bold tracking-[0.08em] text-teal-50 backdrop-blur-md sm:right-5 sm:top-5">
              {media.program}
            </span>
            <span className="absolute inset-x-3 bottom-3 text-xs font-semibold leading-snug text-white/80 sm:inset-x-5 sm:bottom-5">
              {media.campaign}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const MediaFeature: React.FC<MediaFeatureProps> = ({ media, sectionLabel = 'ASFO DANS LES MÉDIAS' }) => {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const revealPlayer = () => {
    setPlaying(true);
    if (window.matchMedia('(max-width: 1023px)').matches) {
      window.requestAnimationFrame(() => {
        playerRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      });
    }
  };

  const reveal = (delay: number, y = 18) => ({
    initial: reduceMotion ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.65, delay, ease: 'easeOut' as const },
  });

  return (
    <section className="relative isolate overflow-hidden bg-[#06231e] py-16 text-white sm:py-20 lg:py-24" aria-labelledby={titleId}>
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-teal-400/10 blur-[100px]" />
        <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-emerald-300/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-[0.86fr_1.14fr] lg:gap-14 xl:gap-20">
        <div className="min-w-0">
          <motion.div {...reveal(0, 0)} className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-300">
              {sectionLabel}
            </span>
            <span className="h-px w-10 bg-teal-300/50" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-white/90">
              <Tv className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
              Passage TV · {media.network}
            </span>
          </motion.div>

          <motion.h2
            id={titleId}
            {...reveal(0.1, 22)}
            className="mt-6 max-w-full break-normal text-[clamp(1.75rem,8vw,2rem)] font-extrabold leading-[1.12] tracking-[-0.035em] text-white sm:text-4xl sm:leading-[1.08] lg:text-[2.7rem] xl:text-5xl"
          >
            {media.title}
          </motion.h2>

          <motion.p {...reveal(0.18, 16)} className="mt-6 max-w-xl text-[15px] leading-7 text-white/70 sm:text-base sm:leading-8">
            {media.description}
          </motion.p>

          <motion.dl {...reveal(0.24, 14)} className="mt-6 flex flex-wrap gap-x-7 gap-y-3 border-l-2 border-teal-300/55 pl-4 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">Émission</dt>
              <dd className="mt-1 font-extrabold text-white">{media.program}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">Chaîne</dt>
              <dd className="mt-1 font-extrabold text-white">{media.network}</dd>
            </div>
          </motion.dl>

          <motion.div {...reveal(0.3, 12)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={revealPlayer}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#16836a] px-6 py-3 text-sm font-extrabold text-white shadow-[0_18px_40px_-16px_rgba(45,212,191,0.55)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-14px_rgba(45,212,191,0.65)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60 motion-reduce:transition-none motion-reduce:hover:transform-none sm:w-auto"
            >
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Regarder l’interview
            </button>
          </motion.div>
        </div>

        <motion.div ref={playerRef} {...reveal(0.14, 20)} className="min-w-0 scroll-mt-28 lg:scale-[1.015]">
          <YouTubeFacade media={media} playing={playing} onPlay={revealPlayer} />
        </motion.div>
      </div>
    </section>
  );
};

export default MediaFeature;
