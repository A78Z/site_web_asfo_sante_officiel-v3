import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowRight, Heart, Archive, Users, BookOpen, Phone } from 'lucide-react';
import HeroPresidentSlide, { PresidentSlideBackdrop } from './HeroPresidentSlide';
import HeroFeatureSlide, { FeatureSlideBackdrop, FeatureSlideData } from './HeroFeatureSlide';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

interface PresidentSlide {
  id: number;
  type: 'president';
}

interface FeatureSlide extends FeatureSlideData {
  id: number;
  type: 'feature';
}

type Slide = PresidentSlide | FeatureSlide;

const slides: Slide[] = [
  { id: 0, type: 'president' },
  {
    id: 1,
    type: 'feature',
    badge: 'Action Sanitaire pour le Fouta',
    titleStart: 'Votre santé,',
    titleAccent: 'notre engagement',
    description:
      "Depuis sa création, l'ASFO facilite l'accès aux soins gratuits dans les zones les plus reculées du Fouta. Nos campagnes médicales incarnent un engagement durable envers les populations.",
    image: '/images/mission-hero.webp',
    cta: { label: 'Découvrir nos missions', to: '/services', icon: <ArrowRight className="h-4 w-4" /> },
    ctaSecondary: { label: 'Voir les archives', to: '/archives', icon: <Archive className="h-4 w-4" /> },
  },
  {
    id: 2,
    type: 'feature',
    badge: 'Soins & Formation',
    titleStart: "Soigner aujourd'hui,",
    titleAccent: 'former pour demain',
    description:
      "Depuis plus de deux décennies, l'ASFO mobilise des professionnels de santé et des bénévoles pour offrir consultations, sensibilisation et espoir aux communautés vulnérables.",
    image: '/images/formation-hero.webp',
    cta: { label: 'Nos rapports', to: '/reports', icon: <BookOpen className="h-4 w-4" /> },
    ctaSecondary: { label: 'Faire un don', to: '/donate', icon: <Heart className="h-4 w-4" /> },
  },
  {
    id: 3,
    type: 'feature',
    badge: 'Rejoignez-nous',
    titleStart: 'Ensemble pour',
    titleAccent: 'un avenir plus sain',
    description:
      "Votre soutien permet de transformer des vies. Rejoignez notre mission humanitaire en devenant partenaire, volontaire ou contributeur.",
    image: '/images/engagement-hero.webp',
    cta: { label: "S'engager", to: '/join', icon: <Users className="h-4 w-4" /> },
    ctaSecondary: { label: 'Nous contacter', to: '/contact', icon: <Phone className="h-4 w-4" /> },
  },
];

const stats = [
  { value: '37+', label: 'Missions réalisées' },
  { value: '25K+', label: 'Patients soignés' },
  { value: '7', label: "Années d'activité" },
  { value: '20+', label: "Années d'engagement" },
];

const INTERVAL = 9000;
const PRESIDENT_STATS_START = 5.85;
const PRESIDENT_STAT_STAGGER = 0.15;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Compteur animé : 0 → valeur en ~1,2 s (easeOutCubic), suffixe (`+`, `K+`)
 * préservé. Démarre en même temps que l'entrée de la barre de stats.
 * prefers-reduced-motion : valeur finale affichée directement.
 */
interface CountUpProps {
  value: string;
  active: boolean;
  runKey: number;
  startDelay?: number;
}

const CountUp: React.FC<CountUpProps> = ({
  value,
  active,
  runKey,
  startDelay = 0,
}) => {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (
      !active ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setN(target);
      return;
    }

    setN(0);
    let raf = 0;
    const DURATION = 1200;
    const timer = setTimeout(() => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / DURATION);
        setN(Math.round(easeOutCubic(p) * target));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, startDelay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [active, runKey, startDelay, target]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
};

const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [presidentRun, setPresidentRun] = useState(1);
  const [paused, setPaused] = useState(false);
  // Hauteur réelle du bloc sticky bandeau + menu, pour que le hero
  // (et la barre de stats en bas) tienne exactement dans le viewport.
  const [headerH, setHeaderH] = useState(116);

  useEffect(() => {
    const el = document.getElementById('site-header');
    if (!el) return;
    const update = () => setHeaderH(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const next = useCallback(() => {
    const target = (current + 1) % slides.length;
    if (target === 0) setPresidentRun((run) => run + 1);
    setCurrent(target);
  }, [current]);

  const goTo = useCallback((i: number) => {
    if (i !== current) {
      if (i === 0) setPresidentRun((run) => run + 1);
      setCurrent(i);
    }
  }, [current]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide = slides[current];
  const presidentStatsActive = current === 0;

  return (
    <MotionConfig reducedMotion="user">
    <section
      className="relative min-h-[560px] overflow-hidden"
      style={{ height: `calc(100vh - ${headerH}px)` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ─── Background images ─── */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          {slide.type === 'president' ? (
            <PresidentSlideBackdrop />
          ) : (
            <FeatureSlideBackdrop image={slide.image} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ─── Content ─── */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 pb-40 sm:px-8 md:pb-0 lg:px-10">
          <AnimatePresence mode="popLayout">
            {slide.type === 'president' ? (
              <HeroPresidentSlide key="president-slide" />
            ) : (
              <HeroFeatureSlide key={`feature-${slide.id}`} slide={slide} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Slide indicators (right) ─── */}
      <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            animate={
              i === current && !reduce
                ? {
                    scale: [1, 1.055, 1],
                    boxShadow: [
                      '0 0 10px rgba(63,201,164,.55)',
                      '0 0 17px rgba(63,201,164,.82)',
                      '0 0 10px rgba(63,201,164,.55)',
                    ],
                  }
                : { scale: 1 }
            }
            transition={
              i === current && !reduce
                ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.35, ease: 'easeOut' }
            }
            className={`rounded-full transition-all duration-500 ${
              i === current
                ? 'h-11 w-2.5 bg-[#3fc9a4] shadow-[0_0_14px_rgba(63,201,164,.75)]'
                : 'h-6 w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* ─── Floating stats bar ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.66, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-grid grid-cols-2 overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur-lg sm:mb-8 md:grid-cols-4 h-short:mb-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={`${i}-${presidentStatsActive ? presidentRun : 'idle'}`}
                data-president-stat={i}
                initial={
                  presidentStatsActive && !reduce
                    ? { opacity: 0, y: 14 }
                    : { opacity: 1, y: 0 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0.2 : 0.5,
                  delay:
                    presidentStatsActive && !reduce
                      ? PRESIDENT_STATS_START +
                        i * PRESIDENT_STAT_STAGGER
                      : 0,
                  ease: 'easeOut',
                }}
                whileHover={
                  reduce
                    ? undefined
                    : {
                        y: -2,
                        boxShadow: 'inset 0 0 0 1px rgba(153,246,228,0.2)',
                      }
                }
                className={`px-5 py-3.5 sm:px-8 sm:py-4 h-short:py-3 h-tiny:py-2 ${
                  i % 2 === 1 ? 'border-l border-white/15' : ''
                } ${i >= 2 ? 'border-t border-white/15 md:border-t-0 md:border-l' : ''}`}
              >
                <p
                  style={poppins}
                  className="bg-gradient-to-b from-white to-[#d6f2ea] bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl h-short:text-2xl"
                >
                  <CountUp
                    value={stat.value}
                    active={presidentStatsActive}
                    runKey={presidentRun}
                    startDelay={
                      reduce
                        ? 0
                        : (PRESIDENT_STATS_START +
                            i * PRESIDENT_STAT_STAGGER) *
                          1000
                    }
                  />
                </p>
                <p className="mt-0.5 text-xs font-medium text-gray-300 sm:text-sm h-short:text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-white/10">
          <motion.div
            key={current}
            initial={{ width: '0%' }}
            animate={{ width: paused ? '100%' : '100%' }}
            transition={{
              duration: paused ? 0.3 : INTERVAL / 1000,
              ease: 'linear',
            }}
            className="h-full bg-gradient-to-r from-teal-400 to-teal-300"
          />
        </div>
      </div>
    </section>
    </MotionConfig>
  );
};

export default Hero;
