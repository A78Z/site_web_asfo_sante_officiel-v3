import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Heart,
  Users,
  HeartHandshake,
  Handshake,
  Ambulance,
  Globe,
  UserPlus,
  GraduationCap,
  Stethoscope,
  Sparkles,
  CreditCard,
  MapPin,
  ArrowRight,
} from 'lucide-react';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

/* ------------------------------------------------------------------ */
/* Données                                                              */
/* ------------------------------------------------------------------ */

const ENGAGEMENTS = [
  { icon: HeartHandshake, title: 'Devenir bénévole', text: 'Participer aux missions médicales.', to: '/join' },
  { icon: Heart, title: 'Faire un don', text: 'Soutenir nos actions sur le terrain.', to: '/donate' },
  { icon: Ambulance, title: 'Proposer une mission', text: 'Inviter l’ASFO dans votre localité.', to: '/candidature' },
  { icon: Globe, title: 'Devenir partenaire', text: 'Construisons ensemble des projets.', to: '/about/partenaires' },
];

const JOURNEY = [
  { icon: UserPlus, label: 'Je rejoins l’ASFO' },
  { icon: GraduationCap, label: 'Je suis accompagné' },
  { icon: Stethoscope, label: 'Je participe à une mission' },
  { icon: Users, label: 'J’aide des communautés' },
  { icon: Sparkles, label: 'Je deviens acteur du changement' },
];

/* Chiffres réels du site */
const STATS = [
  { icon: Stethoscope, value: 600, suffix: '+', label: 'Bénévoles' },
  { icon: Heart, value: 25000, suffix: '+', label: 'Patients' },
  { icon: Ambulance, value: 37, suffix: '+', label: 'Campagnes' },
  { icon: Handshake, value: 10, suffix: '+', label: 'Partenaires' },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
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
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1600, 1);
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
/* Section                                                              */
/* ------------------------------------------------------------------ */

const JoinCTA: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#f2faf7] to-teal-50/70 py-24 sm:py-32"
      aria-labelledby="join-title"
    >
      {/* ─── Fond premium lumineux : halos, glow, formes organiques, particules ─── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[62rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(47,179,145,0.1),transparent_65%)]" />
        <div className="absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" />
        <div className="absolute -left-44 bottom-32 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-sky-100/40 blur-[100px]" />
        <div className="absolute left-[6%] top-24 hidden h-32 w-32 rounded-full border border-teal-200/50 lg:block" />
        <svg className="absolute right-[5%] top-28 hidden h-32 w-32 text-teal-300/20 lg:block">
          <defs>
            <pattern id="asfo-dots-join" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.7" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#asfo-dots-join)" />
        </svg>
        {/* croix médicales très transparentes */}
        <div className="absolute right-[10%] bottom-[14%] text-teal-700/5 text-6xl font-light select-none" style={poppins}>+</div>
        <div className="absolute left-[8%] top-[38%] text-teal-700/5 text-5xl font-light select-none" style={poppins}>+</div>
        {/* particules lumineuses */}
        {!reduce &&
          [
            { left: '14%', top: '20%', delay: 0 },
            { left: '84%', top: '16%', delay: 1.1 },
            { left: '22%', top: '72%', delay: 0.5 },
            { left: '72%', top: '80%', delay: 1.7 },
            { left: '55%', top: '8%', delay: 0.3 },
          ].map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-teal-400/30"
              style={{ left: p.left, top: p.top }}
              animate={{ y: [0, -16, 0], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 6, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* ─── En-tête ─── */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp(0)}>
            <motion.span
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-6 py-2.5 shadow-[0_10px_30px_-15px_rgba(18,63,56,0.3)] backdrop-blur-sm"
            >
              <Heart className="h-4 w-4 text-teal-600" aria-hidden="true" />
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
                Rejoignez notre mouvement humanitaire
              </span>
            </motion.span>
          </motion.div>

          <motion.h2
            id="join-title"
            {...fadeUp(0.1)}
            className="mt-7 text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl lg:text-6xl"
            style={poppins}
          >
            Ensemble, construisons un avenir où chacun peut{' '}
            <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
              accéder aux soins
            </span>
            .
          </motion.h2>

          <motion.p
            {...fadeUp(0.18)}
            className="mx-auto mt-6 max-w-[700px] text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8"
          >
            Chaque mission de l’ASFO est rendue possible grâce à l’engagement de bénévoles,
            de partenaires et de donateurs. Rejoignez une communauté qui agit concrètement
            pour améliorer la santé des populations les plus vulnérables.
          </motion.p>
        </div>

        {/* ─── Cartes des engagements ─── */}
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {ENGAGEMENTS.map((card, i) => (
            <motion.div key={card.title} {...fadeUp(0.06 + i * 0.08)}>
              <Link
                to={card.to}
                className="group flex h-full flex-col rounded-3xl border border-white/80 bg-white/80 p-6 text-center shadow-[0_15px_40px_-20px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_25px_55px_-20px_rgba(18,63,56,0.35)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_10px_25px_-10px_rgba(23,128,102,0.6)] transition-transform duration-300 group-hover:scale-110">
                  <card.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-gray-900" style={poppins}>{card.title}</h3>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-gray-600">{card.text}</p>
                <span className="mt-3 inline-flex items-center justify-center gap-1 text-[12.5px] font-bold text-teal-700 transition-colors group-hover:text-teal-500" style={poppins}>
                  Découvrir
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ─── Parcours du bénévole ─── */}
        <div className="mx-auto mt-20 max-w-5xl">
          <motion.h3 {...fadeUp(0)} className="text-center text-xl font-bold text-gray-900 sm:text-2xl" style={poppins}>
            Votre parcours avec l’ASFO
          </motion.h3>
          <ol className="relative mt-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
            <div className="absolute left-5 top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-teal-200 via-teal-300 to-teal-200 sm:left-[10%] sm:right-[10%] sm:top-5 sm:h-px sm:w-[80%] sm:bg-gradient-to-r" aria-hidden="true" />
            {JOURNEY.map((step, i) => (
              <motion.li
                key={step.label}
                {...fadeUp(0.08 + i * 0.09)}
                className="relative flex items-center gap-4 sm:w-1/5 sm:flex-col sm:gap-3 sm:text-center"
              >
                <span
                  className={`z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border shadow-sm ${
                    i === JOURNEY.length - 1
                      ? 'border-teal-500 bg-gradient-to-br from-[#2fb391] to-[#178066] text-white'
                      : 'border-teal-200 bg-white text-teal-600'
                  }`}
                >
                  <step.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="sm:px-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600/80" style={poppins}>
                    Étape {i + 1}
                  </p>
                  <p className="text-sm font-semibold text-gray-800" style={poppins}>{step.label}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* ─── Chiffres ─── */}
        <motion.div {...fadeUp(0)} className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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

        {/* ─── Citation ─── */}
        <motion.figure
          {...fadeUp(0.1)}
          className="mx-auto mt-14 max-w-3xl rounded-3xl border border-white/80 bg-white/80 p-8 text-center shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm sm:p-10"
        >
          <span className="text-5xl font-extrabold leading-none text-teal-500/60 sm:text-6xl" style={poppins} aria-hidden="true">
            «&nbsp;»
          </span>
          <blockquote className="mt-3 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-8" style={poppins}>
            Le plus beau don que nous puissions offrir est notre temps, notre savoir
            et notre solidarité.
          </blockquote>
          <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
        </motion.figure>

        {/* ─── Boutons ─── */}
        <motion.div {...fadeUp(0.15)} className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <Link
            to="/join"
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-9 py-4 text-base font-bold text-white shadow-[0_20px_45px_-18px_rgba(23,128,102,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_55px_-18px_rgba(23,128,102,0.8)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            <Users className="h-5 w-5" aria-hidden="true" />
            Devenir bénévole
          </Link>
          <Link
            to="/donate"
            className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-4 text-base font-semibold text-teal-800 shadow-[0_12px_30px_-18px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            <CreditCard className="h-5 w-5 text-teal-600" aria-hidden="true" />
            Faire un don
          </Link>
          <Link
            to="/about/partenaires"
            className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-4 text-base font-semibold text-teal-800 shadow-[0_12px_30px_-18px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            <Handshake className="h-5 w-5 text-teal-600" aria-hidden="true" />
            Devenir partenaire
          </Link>
          <Link
            to="/candidature"
            className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-4 text-base font-semibold text-teal-800 shadow-[0_12px_30px_-18px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            <MapPin className="h-5 w-5 text-teal-600" aria-hidden="true" />
            Organiser une mission
          </Link>
        </motion.div>

        <motion.p {...fadeUp(0.2)} className="mt-10 text-center text-sm text-gray-500">
          Rejoignez plus de <strong className="font-bold text-teal-700">600 bénévoles</strong> qui
          transforment des vies chaque jour.
        </motion.p>
      </div>
    </section>
  );
};

export default JoinCTA;
