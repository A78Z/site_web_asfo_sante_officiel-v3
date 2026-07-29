import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const TITLE_DELAY = 0.18; // départ de l'écriture du titre
const WORD_STEP = 0.11; // délai entre chaque mot

export interface FeatureSlideData {
  badge: string;
  titleStart: string;
  titleAccent: string;
  description: string;
  image: string;
  cta: { label: string; to: string; icon: React.ReactNode };
  ctaSecondary: { label: string; to: string; icon: React.ReactNode };
}

/**
 * Fond des slides « feature » (slides 1 et 3) : photo avec effet Ken Burns
 * lent, overlay directionnel (sombre à gauche → transparent à droite)
 * et fondu bas pour la barre de stats.
 */
export const FeatureSlideBackdrop: React.FC<{ image: string }> = ({ image }) => (
  <div className="relative h-full w-full overflow-hidden bg-teal-950">
    <motion.img
      src={image}
      alt=""
      className="h-full w-full object-cover object-[right_22%]"
      animate={{ scale: [1.05, 1.11] }}
      transition={{ duration: 24, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    />
    {/* Overlay directionnel : lisible à gauche, photo révélée à droite */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(105deg, rgba(8,32,28,.94) 0%, rgba(11,40,36,.80) 38%, rgba(16,54,47,.42) 66%, rgba(16,54,47,.10) 100%)',
      }}
    />
    {/* Fondu sombre en bas pour poser la barre de stats */}
    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent" />
  </div>
);

/**
 * Contenu des slides « feature » : badge verre, titre à accent dégradé,
 * carte texte affinée et double CTA. Piloté par les données de la slide.
 */
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' as const },
});

const wordIn = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: 'easeOut' as const },
});

/**
 * Titre « machine à écrire » : chaque mot apparaît en fondu + léger slide,
 * le mot accentué (dégradé bg-clip-text) se révèle d'un seul bloc, et un
 * curseur teal clignote pendant l'écriture puis disparaît.
 * Rejoué à chaque activation de la slide (le composant est remonté par
 * AnimatePresence). Si prefers-reduced-motion : texte affiché directement.
 */
const TypewriterTitle: React.FC<{ titleStart: string; titleAccent: string }> = ({
  titleStart,
  titleAccent,
}) => {
  const reduce = useReducedMotion();
  const words = titleStart.split(' ');
  const typingEnd = TITLE_DELAY + (words.length + 1) * WORD_STEP + 0.55;
  const [typed, setTyped] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setTyped(true), typingEnd * 1000);
    return () => clearTimeout(t);
  }, [reduce, typingEnd]);

  const accentClass = 'bg-gradient-to-r from-[#3fc9a4] to-[#8ff0d4] bg-clip-text text-transparent';

  if (reduce) {
    return (
      <>
        {titleStart}
        <br />
        <span className={accentClass}>{titleAccent}</span>
      </>
    );
  }

  return (
    <>
      {words.map((word, i) => (
        <motion.span key={i} {...wordIn(TITLE_DELAY + i * WORD_STEP)} className="inline-block whitespace-pre">
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
      <br />
      <motion.span
        {...wordIn(TITLE_DELAY + words.length * WORD_STEP)}
        className={`inline-block ${accentClass}`}
      >
        {titleAccent}
      </motion.span>
      {!typed && (
        <span
          aria-hidden="true"
          className="ml-2 inline-block h-[0.8em] w-[3px] translate-y-[0.1em] animate-blink rounded-sm bg-[#3fc9a4]"
        />
      )}
    </>
  );
};

const HeroFeatureSlide: React.FC<{ slide: FeatureSlideData }> = ({ slide }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.45, ease: 'easeOut' }}
    className="max-w-3xl"
  >
    {/* Badge sur-titre en pastille verre */}
    <motion.span
      {...fadeUp(0.05)}
      className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-teal-100 backdrop-blur-md sm:text-xs"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#3fc9a4] shadow-[0_0_8px_rgba(63,201,164,.9)]" />
      {slide.badge}
    </motion.span>

    {/* Titre — écriture mot par mot avec curseur */}
    <h1
      style={poppins}
      className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl h-short:mt-3 lg:h-short:text-5xl"
    >
      <TypewriterTitle titleStart={slide.titleStart} titleAccent={slide.titleAccent} />
    </h1>

    {/* Carte texte en verre affinée */}
    <motion.div
      {...fadeUp(0.34)}
      className="relative mt-8 max-w-xl overflow-hidden rounded-[18px] border border-white/[.14] bg-white/[.07] p-5 backdrop-blur-[10px] sm:p-6 h-short:mt-5 h-short:p-4 h-tiny:mt-3"
    >
      {/* Trait d'accent teal */}
      <span className="absolute left-6 top-0 h-[3px] w-14 rounded-b bg-gradient-to-r from-[#3fc9a4] to-[#8ff0d4]" />
      <p className="text-base leading-relaxed text-gray-100 sm:text-lg h-short:text-base">{slide.description}</p>
    </motion.div>

    {/* Boutons */}
    <motion.div
      {...fadeUp(0.5)}
      className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 h-short:mt-5 h-tiny:mt-4"
    >
      <Link
        to={slide.cta.to}
        className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#3fc9a4] to-[#2fb391] px-6 py-3 text-sm font-bold text-teal-950 shadow-lg shadow-teal-900/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-900/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 active:scale-[0.98]"
      >
        {slide.cta.label}
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          {slide.cta.icon}
        </span>
      </Link>
      <Link
        to={slide.ctaSecondary.to}
        className="group inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/[.06] px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
      >
        {slide.ctaSecondary.label}
        <span className="transition-transform duration-200 group-hover:scale-110">
          {slide.ctaSecondary.icon}
        </span>
      </Link>
    </motion.div>
  </motion.div>
);

export default HeroFeatureSlide;
