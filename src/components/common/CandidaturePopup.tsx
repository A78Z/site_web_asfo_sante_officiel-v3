'use client';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Ambulance,
  ArrowRight,
  Award,
  CalendarDays,
  HeartPulse,
  MapPin,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';

const STORAGE_KEY = 'asfo-campaign-popup-2026-v2';
const DISPLAY_DELAY = 700;
const HIDE_DURATION = 24 * 60 * 60 * 1000;
const FORCE_DISPLAY_PARAM = 'showCampaignPopup';

const villages = [
  'Mbiddi',
  'Ndiayènne Pendao',
  'Boguel Belly Edy',
  'Bélèl Kéllé',
  'Donaye Taredji',
  'Sassel Talbé',
  'Dioudé Diabé',
  'Doumga Lao',
] as const;

function getLastCloseTime() {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return null;

    const timestamp = Number(storedValue);
    if (!Number.isFinite(timestamp) || timestamp <= 0 || timestamp > Date.now()) {
      return null;
    }

    return timestamp;
  } catch {
    return null;
  }
}

function rememberClose() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Le popup reste utilisable lorsque le stockage privé est indisponible.
  }
}

function AnimatedNumber({
  value,
  active,
  suffix = '',
}: {
  value: number;
  active: boolean;
  suffix?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }

    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const duration = 900;

    const update = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [active, reduceMotion, value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export default function CandidaturePopup() {
  const [open, setOpen] = useState(false);
  const forcedDisplay = useRef(false);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    forcedDisplay.current = searchParams.get(FORCE_DISPLAY_PARAM) === '1';

    if (forcedDisplay.current) {
      setOpen(true);
      return;
    }

    const lastClose = getLastCloseTime();
    if (lastClose !== null && Date.now() - lastClose < HIDE_DURATION) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, DISPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) scrollContainer.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [open]);

  const dismiss = () => {
    if (!forcedDisplay.current) rememberClose();
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setOpen(true);
      return;
    }
    dismiss();
  };

  const handleCampaign = () => {
    if (!forcedDisplay.current) rememberClose();
    setOpen(false);
    navigate('/missions/prochaine-campagne');
  };

  const handleProgram = () => {
    if (!forcedDisplay.current) rememberClose();
    setOpen(false);
    navigate('/missions/prochaine-campagne#preparation-status');
  };

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: open ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
          transition: { duration: 0.45, delay, ease: 'easeOut' as const },
        };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="z-[100] max-h-[92dvh] w-[calc(100vw-24px)] max-w-[1180px] gap-0 overflow-hidden rounded-[24px] border border-white/20 bg-[#f6fbf9] p-0 shadow-[0_35px_100px_-25px_rgba(0,40,35,0.65)] sm:w-[calc(100vw-32px)] sm:rounded-[28px] [&>button]:right-[max(1rem,env(safe-area-inset-right))] [&>button]:top-[max(1rem,env(safe-area-inset-top))] [&>button]:z-40 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-white/90 [&>button]:text-teal-950 [&>button]:opacity-100 [&>button]:shadow-lg [&>button]:backdrop-blur [&>button]:hover:bg-white [&>button_svg]:h-5 [&>button_svg]:w-5"
      >
        <DialogDescription className="sr-only">
          Annonce officielle de la 27e Grande Caravane Médicale ASFO, organisée
          du 03 au 08 septembre 2026 dans le département de Podor.
        </DialogDescription>

        <div
          ref={scrollContainer}
          className="relative isolate max-h-[92dvh] overflow-x-hidden overflow-y-auto overscroll-contain bg-gradient-to-br from-[#063f3b] via-[#087f70] to-[#13a889] text-white [-webkit-overflow-scrolling:touch]"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.13]"
            aria-hidden="true"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,.8) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-28 right-[28%] h-72 w-72 rounded-full bg-emerald-200/15 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute right-[-8%] top-[-20%] h-72 w-72 rotate-12 rounded-[4rem] border border-white/10 bg-white/[0.04]" aria-hidden="true" />

          <div className="relative grid min-w-0 grid-cols-1 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)] lg:p-0">
            <div className="contents lg:block lg:min-w-0 lg:px-10 lg:pb-10 lg:pt-12">
              <motion.div {...reveal(0)} className="order-1 min-w-0">
                <span className="inline-flex max-w-[calc(100%-3rem)] items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.13em] text-teal-50 backdrop-blur sm:px-4 sm:text-xs">
                  <Ambulance className="h-4 w-4 shrink-0 text-teal-200" aria-hidden="true" />
                  Grande campagne médicale 2026
                </span>
              </motion.div>

              <motion.div {...reveal(0.05)} className="order-2 mt-4 flex min-w-0 flex-wrap items-start gap-3 pr-12 sm:mt-5 sm:pr-14 lg:pr-0">
                <DialogTitle className="max-w-full text-[clamp(1.75rem,8vw,2.25rem)] font-black leading-[1.04] tracking-[-0.035em] text-white [overflow-wrap:normal] hyphens-none sm:max-w-2xl sm:text-4xl lg:text-[2.75rem]">
                  27e Grande Caravane Médicale ASFO
                </DialogTitle>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200/50 bg-gradient-to-r from-amber-300 to-yellow-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-950 shadow-lg shadow-amber-950/15">
                  <Award className="h-3.5 w-3.5" aria-hidden="true" />
                  27e édition
                </span>
              </motion.div>

              <motion.div {...reveal(0.1)} className="order-3 mt-5 flex min-w-0 flex-wrap gap-2 text-sm font-bold text-teal-50 sm:gap-3">
                <span className="inline-flex min-h-11 min-w-0 basis-full items-center gap-2 rounded-xl border border-white/15 bg-black/10 px-3 py-2 sm:basis-auto">
                  <CalendarDays className="h-4 w-4 text-teal-200" aria-hidden="true" />
                  Du 03 au 08 septembre 2026
                </span>
                <span className="inline-flex min-h-11 min-w-0 basis-full items-center gap-2 rounded-xl border border-white/15 bg-black/10 px-3 py-2 sm:basis-auto">
                  <MapPin className="h-4 w-4 text-teal-200" aria-hidden="true" />
                  Département de Podor
                </span>
              </motion.div>

              <motion.section
                {...reveal(0.15)}
                className="order-5 mt-6 min-w-0 rounded-2xl border border-white/15 bg-white/[0.09] p-3.5 shadow-inner backdrop-blur-sm sm:p-5"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-teal-100">
                    <HeartPulse className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.13em] text-teal-200">Thème officiel</p>
                    <p className="mt-1 text-sm font-bold leading-relaxed text-white sm:text-[15px]">
                      Vieillir en bonne santé : lutte contre les maladies chroniques et dépistage
                      de la fragilité pour la prévention de la perte d’autonomie.
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.div {...reveal(0.2)} className="order-6 mt-4 flex min-w-0 items-center gap-3 rounded-2xl border border-amber-100/20 bg-amber-50/10 px-3.5 py-3 sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200/15">
                  <Award className="h-5 w-5 text-amber-200" aria-hidden="true" />
                </span>
                <p className="min-w-0 text-sm leading-snug text-teal-50">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-amber-200">
                    Homonyme de cette édition
                  </span>
                  <strong className="mt-0.5 block text-base text-white">Dr Bouna Ndiaye</strong>
                </p>
              </motion.div>

              <motion.section {...reveal(0.24)} className="order-8 mt-6 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-black text-white sm:text-xl">
                    Les 8 villages bénéficiaires
                  </h2>
                  <span className="hidden text-[10px] font-bold uppercase tracking-[0.13em] text-teal-200 sm:inline">
                    Vallée du fleuve Sénégal
                  </span>
                </div>
                <ul className="mt-3 grid min-w-0 grid-cols-1 gap-2 [@media(min-width:400px)]:grid-cols-2">
                  {villages.map((village, index) => (
                    <motion.li
                      key={village}
                      initial={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                      animate={open ? { opacity: 1, x: 0 } : undefined}
                      transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.28 + index * 0.035 }}
                      whileHover={reduceMotion ? undefined : { x: 3 }}
                      className="flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-white/15 bg-black/10 px-3 py-2 text-xs font-bold text-teal-50 transition-colors hover:bg-white/15"
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-teal-200" aria-hidden="true" />
                      <span className="min-w-0 break-words">{village}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.section>

              <motion.section
                {...reveal(0.32)}
                className="order-9 mt-6 min-w-0 rounded-2xl border border-white/15 bg-[#042f2c]/45 p-4 sm:p-5"
              >
                <div className="flex items-center gap-2 text-teal-200">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <h2 className="text-xs font-black uppercase tracking-[0.13em]">Fidèle à sa mission</h2>
                </div>
                <p className="mt-2 text-lg font-black text-white">Soigner • Soulager • Sensibiliser</p>
                <p className="mt-2 text-xs leading-relaxed text-teal-50/85 sm:text-sm">
                  Fidèle à sa mission, l&apos;Action Sanitaire pour le Fouta revient pour une
                  nouvelle édition de sa Grande Caravane Médicale afin de rapprocher les soins
                  spécialisés des populations du département de Podor.
                </p>
                <p className="mt-3 text-sm font-black text-teal-200">
                  Ensemble, mobilisons-nous pour faire encore plus.
                </p>
              </motion.section>
            </div>

            <aside className="contents lg:block lg:min-w-0 lg:border-l lg:border-white/10 lg:bg-[#032d2a]/35 lg:p-8">
              <motion.div {...reveal(0.12)} className="order-4 relative mx-auto mt-6 w-full min-w-0 max-w-md lg:mt-0">
                <div className="pointer-events-none absolute inset-12 rounded-full bg-teal-300/20 blur-3xl" aria-hidden="true" />
                <div className="relative h-[clamp(220px,65vw,300px)] min-w-0 sm:h-auto sm:min-h-[390px]">
                  <figure className="absolute inset-0 overflow-hidden rounded-[1.5rem] border-[3px] border-white/90 bg-teal-950 shadow-[0_28px_70px_-25px_rgba(0,0,0,0.7)] sm:inset-x-10 sm:inset-y-3 sm:rounded-[2rem] sm:border-4">
                    <img
                      src="/mission.webp"
                      alt="Équipe médicale de l’ASFO en mission auprès des populations"
                      className="h-full w-full object-cover object-center"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#032d2a]/55 via-transparent to-transparent" aria-hidden="true" />
                  </figure>
                  <figure className="absolute bottom-0 left-0 hidden h-32 w-44 rotate-[-4deg] overflow-hidden rounded-2xl border-4 border-white shadow-2xl sm:block">
                    <img
                      src="/gv1.webp"
                      alt="Consultation médicale lors d’une mission ASFO à Guédé Village"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </figure>
                  <figure className="absolute right-0 top-0 hidden h-28 w-40 rotate-[4deg] overflow-hidden rounded-2xl border-4 border-white shadow-2xl sm:block">
                    <img
                      src="/diatar1.webp"
                      alt="Professionnels de santé mobilisés lors d’une mission ASFO"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </figure>
                  <span className="absolute bottom-3 right-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full border border-white/20 bg-[#063f3b]/90 px-3 py-2 text-[9px] font-black uppercase tracking-[0.08em] text-white shadow-xl backdrop-blur sm:bottom-4 sm:right-6 sm:text-[10px] sm:tracking-[0.1em]">
                    <Stethoscope className="h-3.5 w-3.5 text-teal-200" aria-hidden="true" />
                    Au plus près des populations
                  </span>
                </div>
              </motion.div>

              <motion.dl {...reveal(0.2)} className="order-7 mt-6 grid min-w-0 grid-cols-1 gap-2.5 [@media(min-width:340px)]:grid-cols-2">
                {[
                  { value: 27, suffix: 'e', label: 'édition' },
                  { value: 8, label: 'villages' },
                  { value: 6, label: 'jours de mission' },
                ].map((stat) => (
                  <div key={stat.label} className="flex min-h-[88px] min-w-0 flex-col justify-center rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm">
                    <dt className="mt-1 break-words text-[10px] font-bold uppercase tracking-[0.1em] text-teal-200">{stat.label}</dt>
                    <dd className="text-2xl font-black text-white">
                      <AnimatedNumber value={stat.value} suffix={stat.suffix} active={open} />
                    </dd>
                  </div>
                ))}
                <div className="flex min-h-[88px] min-w-0 flex-col justify-center rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm">
                  <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-teal-200">département</dt>
                  <dd className="text-xl font-black text-white">Podor</dd>
                </div>
              </motion.dl>

              <motion.div {...reveal(0.28)} className="order-10 mt-6 grid min-w-0 gap-3">
                <button
                  type="button"
                  onClick={handleCampaign}
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#35d2ad] to-[#16ad8e] px-5 py-3 text-sm font-black text-[#032d2a] shadow-[0_15px_35px_-16px_rgba(53,210,173,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_-16px_rgba(53,210,173,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Découvrir la campagne
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleProgram}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Découvrir le programme
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="min-h-12 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-bold text-teal-100/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:border-transparent lg:bg-transparent"
                >
                  Plus tard
                </button>
              </motion.div>
            </aside>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
