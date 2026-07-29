import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };
const MotionLink = motion.create(Link);
const TITLE_PREFIX = 'Bienvenue à ';
const TITLE_ACCENT = "l'ASFO";
const TITLE_FULL = `${TITLE_PREFIX}${TITLE_ACCENT}`;
const QUOTE_TEXT =
  "«\u00a0C'est avec un profond sentiment d'honneur et de responsabilité que je prends la présidence de l'ASFO. Depuis plus de vingt ans, notre association rapproche les soins de santé des populations les plus vulnérables du Fouta. Ensemble — professionnels, bénévoles et partenaires — poursuivons cet engagement pour une santé plus juste, plus humaine et accessible à tous.\u00a0»";
const QUOTE_TOKENS = QUOTE_TEXT.split(/(\s+)/);

const PRESIDENT_ANIMATION = {
  badge: 0.05,
  typingStartMs: 450,
  characterMs: 55,
  titlePauseMs: 250,
  quote: 1.82,
  quoteWord: 0.022,
  name: 3.5,
  role: 3.72,
  button: 3.95,
  photo: 4.2,
  photoLabel: 5.5,
} as const;

/**
 * Fond décoratif de la slide « Message du Président » :
 * dégradé teal profond, formes angulaires et trame de points (halftone)
 * côté gauche. Rendu dans la couche background du carrousel.
 */
export const PresidentSlideBackdrop: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0.25 : 0.85, ease: 'easeOut' }}
      className="relative h-full w-full overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800"
    >
      {/* Formes angulaires en dégradé teal, côté gauche */}
      <motion.div
        animate={reduce ? undefined : { x: [0, 5, 0], y: [0, -3, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-32 top-0 h-full w-[60%] bg-gradient-to-br from-teal-700/50 via-teal-600/25 to-transparent [clip-path:polygon(0_0,100%_0,45%_100%,0_100%)]"
      />
      <motion.div
        animate={reduce ? undefined : { x: [0, -4, 0], y: [0, 4, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-16 bottom-0 h-3/4 w-2/5 bg-gradient-to-tr from-teal-500/25 to-transparent [clip-path:polygon(0_100%,100%_100%,0_15%)]"
      />
      <motion.div
        animate={reduce ? undefined : { x: [0, -3, 0], y: [0, 3, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-0 top-0 h-1/2 w-1/4 bg-gradient-to-bl from-teal-700/30 to-transparent [clip-path:polygon(100%_0,100%_100%,25%_0)]"
      />

      {/* Trame de points (halftone), légère et discrète */}
      <motion.svg
        animate={reduce ? undefined : { opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-8 top-1/4 hidden h-72 w-72 text-teal-300/20 sm:block"
        aria-hidden="true"
      >
        <defs>
          <pattern id="asfo-halftone" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#asfo-halftone)" />
      </motion.svg>

      {/* Halo doux derrière la zone photo */}
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2">
        <motion.div
          animate={reduce ? undefined : { x: [0, 4, 0], y: [0, -3, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="h-96 w-96 rounded-full bg-teal-400/10 blur-3xl"
        />
      </div>
    </motion.div>
  );
};

/**
 * Contenu de la slide « Message du nouveau Président » :
 * texte à gauche, portrait encadré à droite (photo au-dessus sur mobile).
 */
const HeroPresidentSlide: React.FC = () => {
  const reduce = useReducedMotion();
  const [typingStarted, setTypingStarted] = useState(Boolean(reduce));
  const [typedCharacters, setTypedCharacters] = useState(
    reduce ? TITLE_FULL.length : 0,
  );

  useEffect(() => {
    if (reduce) {
      setTypingStarted(true);
      setTypedCharacters(TITLE_FULL.length);
      return;
    }

    setTypingStarted(false);
    setTypedCharacters(0);
    const startTimer = window.setTimeout(
      () => setTypingStarted(true),
      PRESIDENT_ANIMATION.typingStartMs,
    );
    return () => window.clearTimeout(startTimer);
  }, [reduce]);

  useEffect(() => {
    if (reduce || !typingStarted || typedCharacters >= TITLE_FULL.length) return;

    const delay =
      typedCharacters === TITLE_PREFIX.length
        ? PRESIDENT_ANIMATION.titlePauseMs
        : PRESIDENT_ANIMATION.characterMs;
    const characterTimer = window.setTimeout(
      () => setTypedCharacters((current) => current + 1),
      delay,
    );
    return () => window.clearTimeout(characterTimer);
  }, [reduce, typedCharacters, typingStarted]);

  const typedText = TITLE_FULL.slice(0, typedCharacters);
  const typedPrefix = typedText.slice(0, TITLE_PREFIX.length);
  const typedAccent = typedText.slice(TITLE_PREFIX.length);
  const typingComplete = reduce || typedCharacters >= TITLE_FULL.length;
  const reveal = (delay: number, duration = 0.52) =>
    reduce
      ? {
          initial: { opacity: 1, y: 0 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: reduce ? 0 : -12 }}
      transition={{ duration: reduce ? 0.15 : 0.3, ease: 'easeOut' }}
      className="grid items-center gap-2 sm:gap-10 sm:pt-6 md:pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-16"
    >
      {/* ─── Colonne texte ─── */}
      <div className="order-last text-center lg:order-first lg:text-left">
        {/* Sur-titre (badge) */}
        <motion.span
          initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: reduce ? 0 : 0.7,
            delay: reduce ? 0 : PRESIDENT_ANIMATION.badge,
            ease: 'easeOut',
          }}
          className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-teal-200 backdrop-blur-sm sm:text-xs"
        >
          Message du nouveau Président ASFO
        </motion.span>

        {/* Titre */}
        <h1
          data-president-title
          data-typed-text={typedText}
          data-typing-complete={typingComplete}
          style={poppins}
          className="relative mt-3 text-[26px] font-extrabold leading-[1.1] tracking-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl lg:h-short:text-5xl"
        >
          <span className="invisible" aria-hidden="true">
            {TITLE_PREFIX}
            <span className="text-teal-300">{TITLE_ACCENT}</span>
          </span>
          <span className="absolute inset-0" aria-hidden="true">
            {typedPrefix}
            <span className="text-teal-300">{typedAccent}</span>
            {typingStarted && !typingComplete && (
              <motion.span
                className={
                  typedCharacters > TITLE_PREFIX.length
                    ? 'text-teal-300'
                    : 'text-white'
                }
                animate={{ opacity: [1, 0, 1] }}
                transition={{
                  duration: 0.72,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
              >
                |
              </motion.span>
            )}
          </span>
          <span className="sr-only">{TITLE_FULL}</span>
        </h1>

        {/* Citation */}
        <motion.blockquote
          data-president-quote
          {...reveal(PRESIDENT_ANIMATION.quote, 0.42)}
          className="mx-auto mt-3 max-w-xl rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md sm:mt-7 sm:p-6 lg:mx-0"
        >
          <p className="text-[13px] leading-snug text-gray-100 sm:text-base sm:leading-relaxed lg:text-lg lg:h-short:text-base">
            {QUOTE_TOKENS.map((token, index) =>
              token.trim() ? (
                <motion.span
                  key={`${token}-${index}`}
                  className="inline-block"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.38,
                    delay: reduce
                      ? 0
                      : PRESIDENT_ANIMATION.quote +
                        Math.floor(index / 2) * PRESIDENT_ANIMATION.quoteWord,
                    ease: 'easeOut',
                  }}
                >
                  {token}
                </motion.span>
              ) : (
                token
              ),
            )}
          </p>
        </motion.blockquote>

        {/* Nom + fonction */}
        <div className="mt-2 sm:mt-6">
          <motion.p
            {...reveal(PRESIDENT_ANIMATION.name)}
            style={poppins}
            className="text-base font-bold text-white sm:text-xl"
          >
            Dr Abdaramani Ndiaye
          </motion.p>
          <motion.p
            {...reveal(PRESIDENT_ANIMATION.role, 0.45)}
            className="mt-0.5 text-sm font-medium text-teal-300"
          >
            21e Président de l&apos;ASFO
          </motion.p>
        </div>

        {/* CTA */}
        <motion.div
          {...reveal(PRESIDENT_ANIMATION.button)}
          className="mt-3 flex justify-center sm:mt-8 lg:justify-start"
        >
          <MotionLink
            to="/president-message"
            whileHover={
              reduce
                ? undefined
                : {
                    y: -2,
                    boxShadow: '0 14px 30px rgba(45,212,191,0.24)',
                  }
            }
            whileTap={reduce ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
          >
            Lire le mot du Président
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none" />
          </MotionLink>
        </motion.div>
      </div>

      {/* ─── Colonne photo ─── */}
      <motion.div
        data-president-photo
        initial={{ opacity: 0, x: reduce ? 0 : 76, scale: reduce ? 1 : 1.08 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{
          duration: reduce ? 0.2 : 1.05,
          delay: reduce ? 0 : PRESIDENT_ANIMATION.photo,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="order-first flex justify-center lg:order-last lg:justify-end"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{
            duration: 5,
            delay: PRESIDENT_ANIMATION.photo + 1.05,
            repeat: reduce ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-24 sm:w-56 lg:w-full lg:max-w-sm lg:h-short:max-w-[250px]"
        >
          {/* Ombre douce / halo derrière le cadre */}
          <div
            className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-teal-400/30 to-teal-600/15 blur-xl"
            aria-hidden="true"
          />
          <img
            src="/images/president-asfo.jpg"
            alt="Dr Abdaramani Ndiaye, 21e Président de l'ASFO"
            className="relative aspect-[3/4] w-full rounded-2xl border-2 border-white/25 object-cover object-top shadow-2xl"
          />
          {/* Pastille flottante */}
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2">
            <motion.span
              initial={{
                opacity: 0,
                y: reduce ? 0 : 10,
                scale: reduce ? 1 : 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: reduce ? 1 : [0.96, 1.05, 1],
              }}
              transition={{
                opacity: {
                  duration: reduce ? 0.2 : 0.55,
                  delay: reduce ? 0 : PRESIDENT_ANIMATION.photoLabel,
                },
                y: {
                  duration: reduce ? 0.2 : 0.55,
                  delay: reduce ? 0 : PRESIDENT_ANIMATION.photoLabel,
                },
                scale: {
                  duration: reduce ? 0 : 0.62,
                  delay: reduce ? 0 : PRESIDENT_ANIMATION.photoLabel,
                  times: [0, 0.55, 1],
                },
              }}
              className="inline-block whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold text-teal-800 shadow-lg sm:text-xs"
            >
              ASFO — Au service du Fouta
            </motion.span>
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroPresidentSlide;
