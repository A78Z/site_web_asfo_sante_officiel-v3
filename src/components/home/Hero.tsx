import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Heart, Archive, Users, BookOpen, Phone } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
  cta: { label: string; to: string; icon: React.ReactNode };
  ctaSecondary: { label: string; to: string; icon: React.ReactNode };
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Votre santé,\nnotre engagement',
    description:
      "Depuis sa création, l'ASFO facilite l'accès aux soins gratuits dans les zones les plus reculées du Fouta. Nos campagnes médicales incarnent un engagement durable envers les populations.",
    image: '/slide1.webp',
    cta: { label: 'Découvrir nos missions', to: '/services', icon: <ArrowRight className="h-4 w-4" /> },
    ctaSecondary: { label: 'Voir les archives', to: '/archives', icon: <Archive className="h-4 w-4" /> },
  },
  {
    id: 2,
    title: 'Soigner aujourd\'hui,\nformer pour demain',
    description:
      "Depuis plus de deux décennies, l'ASFO mobilise des professionnels de santé et des bénévoles pour offrir consultations, sensibilisation et espoir aux communautés vulnérables.",
    image: '/slide-2.webp',
    cta: { label: 'Nos rapports', to: '/reports', icon: <BookOpen className="h-4 w-4" /> },
    ctaSecondary: { label: 'Faire un don', to: '/donate', icon: <Heart className="h-4 w-4" /> },
  },
  {
    id: 3,
    title: 'Ensemble pour\nun avenir plus sain',
    description:
      "Votre soutien permet de transformer des vies. Rejoignez notre mission humanitaire en devenant partenaire, volontaire ou contributeur.",
    image: '/slide-3.webp',
    cta: { label: "S'engager", to: '/join', icon: <Users className="h-4 w-4" /> },
    ctaSecondary: { label: 'Nous contacter', to: '/contact', icon: <Phone className="h-4 w-4" /> },
  },
];

const stats = [
  { value: '37+', label: 'Missions réalisées' },
  { value: '25K+', label: 'Patients soignés' },
  { value: '7', label: "Années d'activité" },
];

const INTERVAL = 7000;

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length);
  }, []);

  const goTo = useCallback((i: number) => {
    if (i !== current) setCurrent(i);
  }, [current]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <section
      className="relative h-screen min-h-[600px] max-h-[1000px] overflow-hidden"
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
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* ─── Gradient overlay ─── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-teal-950/85 via-teal-900/65 to-teal-800/30" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/40 via-transparent to-black/10" />

      {/* ─── Content ─── */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {/* Title */}
                <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                  {slide.title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </h1>

                {/* Description — glassmorphism card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="mt-8 max-w-xl rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-6"
                >
                  <p className="text-base leading-relaxed text-gray-200 sm:text-lg">
                    {slide.description}
                  </p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
                >
                  <Link
                    to={slide.cta.to}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-teal-600 hover:shadow-xl active:scale-[0.98]"
                  >
                    {slide.cta.label}
                    {slide.cta.icon}
                  </Link>
                  <Link
                    to={slide.ctaSecondary.to}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/50 active:scale-[0.98]"
                  >
                    {slide.ctaSecondary.label}
                    {slide.ctaSecondary.icon}
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Slide indicators (right) ─── */}
      <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ${
              i === current
                ? 'h-10 w-2.5 bg-white shadow-lg'
                : 'h-6 w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* ─── Scroll indicator ─── */}
      <button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute bottom-24 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 transition-colors hover:text-white md:flex"
      >
        <span className="text-xs font-medium uppercase tracking-widest">Découvrir</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </button>

      {/* ─── Floating stats bar ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="mb-6 inline-flex divide-x divide-white/20 overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur-lg sm:mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="px-6 py-4 sm:px-8">
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-0.5 text-xs font-medium text-gray-300 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
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
  );
};

export default Hero;
