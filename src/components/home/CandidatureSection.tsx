import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  FileText,
  Search,
  CheckCircle2,
  CalendarDays,
  Ambulance,
  Heart,
  Users,
  Stethoscope,
  Handshake,
  Phone,
  HeartPulse,
  MapPin,
  Quote,
  BadgeCheck,
} from 'lucide-react';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const benefits = [
  { icon: Heart, title: 'Consultations médicales', text: 'Accès à des soins spécialisés.' },
  { icon: Users, title: 'Équipe multidisciplinaire', text: 'Médecins, infirmiers et spécialistes.' },
  { icon: Stethoscope, title: 'Dépistages gratuits', text: 'Prévention et sensibilisation.' },
  { icon: Handshake, title: 'Accompagnement', text: 'Organisation avec les acteurs locaux.' },
];

const steps = [
  { icon: FileText, label: 'Votre demande' },
  { icon: Search, label: 'Étude du dossier' },
  { icon: CheckCircle2, label: 'Validation' },
  { icon: CalendarDays, label: 'Planification' },
  { icon: Ambulance, label: 'Mission médicale' },
];

/* Chiffres déjà affirmés ailleurs sur le site (hero, impact) */
const stats = [
  { icon: HeartPulse, value: 37, suffix: '+', label: 'Campagnes réalisées' },
  { icon: MapPin, value: 192, suffix: '+', label: 'Localités desservies' },
  { icon: Users, value: 600, suffix: '+', label: 'Professionnels mobilisés' },
  { icon: Heart, value: 25000, suffix: '+', label: 'Patients accompagnés' },
];

const eligibles = [
  'Amicales',
  'Collectivités',
  'Associations',
  'Centres de santé',
  'Organisations communautaires',
  'ONG partenaires',
];

/* Particules discrètes du fond */
const particles = [
  { left: '12%', top: '22%', size: 6, delay: 0 },
  { left: '85%', top: '18%', size: 8, delay: 1.2 },
  { left: '70%', top: '65%', size: 5, delay: 0.6 },
  { left: '20%', top: '75%', size: 7, delay: 1.8 },
  { left: '48%', top: '12%', size: 5, delay: 2.4 },
];

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
    const DURATION = 1700;
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

const CandidatureSection: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* ─── Fond immersif : photo caravane + overlay + décor ─── */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/9.webp"
          alt=""
          className="h-full w-full scale-105 object-cover blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b2824]/95 via-teal-900/90 to-[#123f38]/92" />
        <div className="absolute -left-32 top-16 h-[400px] w-[400px] rounded-full bg-teal-500/15 blur-[110px]" />
        <div className="absolute -right-28 bottom-20 h-[360px] w-[360px] rounded-full bg-[#2fb391]/15 blur-[100px]" />
        <div className="absolute right-[10%] top-24 hidden h-32 w-32 rounded-full border border-white/10 lg:block" />
        <svg className="absolute left-[5%] bottom-24 hidden h-36 w-36 text-teal-300/15 lg:block">
          <defs>
            <pattern id="asfo-dots-cta" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.7" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#asfo-dots-cta)" />
        </svg>
        {/* Particules animées */}
        {!reduce &&
          particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-teal-200/30"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ y: [0, -18, 0], opacity: [0.25, 0.6, 0.25] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
            />
          ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* ─── En-tête ─── */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp(0)} className="inline-block">
            <motion.span
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-teal-100 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.4)] backdrop-blur-md"
            >
              <Ambulance className="h-4 w-4" aria-hidden="true" />
              Campagnes médicales
            </motion.span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.08)}
            style={poppins}
            className="mt-7 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Accueillez une{' '}
            <span className="whitespace-nowrap bg-gradient-to-r from-[#3fc9a4] to-[#8ff0d4] bg-clip-text text-transparent">
              caravane médicale
            </span>{' '}
            dans votre communauté
          </motion.h2>

          <motion.p
            {...fadeUp(0.16)}
            className="mx-auto mt-7 max-w-[680px] text-lg leading-loose text-teal-50/90"
          >
            Vous représentez une association, une amicale d'étudiants, une collectivité locale ou
            une organisation communautaire&nbsp;? Soumettez votre candidature et permettez à votre
            village de bénéficier d'une mission médicale multidisciplinaire organisée par l'ASFO.
          </motion.p>
        </div>

        {/* ─── Bénéfices ─── */}
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                {...fadeUp(i * 0.08)}
                className="group rounded-2xl border border-white/15 bg-white/10 p-6 text-center shadow-[0_15px_35px_-15px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-white/30 hover:bg-white/15"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2fb391] to-[#178066] text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 style={poppins} className="mt-4 text-base font-bold text-white">
                  {b.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-teal-100/80">{b.text}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Boutons ─── */}
        <motion.div
          {...fadeUp(0.2)}
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            to="/candidature"
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-9 py-4 text-base font-bold text-teal-800 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] sm:w-auto"
          >
            <Ambulance className="h-5 w-5" aria-hidden="true" />
            Déposer une candidature
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] sm:w-auto"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Contacter l'ASFO
          </Link>
        </motion.div>

        {/* ─── Timeline du processus ─── */}
        <motion.div {...fadeUp(0.1)} className="mx-auto mt-20 max-w-5xl">
          <h3 style={poppins} className="text-center text-xl font-bold text-white sm:text-2xl">
            De votre demande à la mission
          </h3>
          <div className="relative mt-12">
            <div className="absolute left-[10%] right-[10%] top-[22px] hidden h-[2px] bg-gradient-to-r from-teal-400/30 via-[#3fc9a4] to-teal-400/30 md:block" aria-hidden="true" />
            <div className="absolute bottom-4 left-[22px] top-4 w-[2px] bg-gradient-to-b from-teal-400/30 via-[#3fc9a4] to-teal-400/30 md:hidden" aria-hidden="true" />

            <ol className="flex flex-col gap-8 md:grid md:grid-cols-5 md:gap-4">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.li
                    key={s.label}
                    {...fadeUp(0.15 + i * 0.1)}
                    className="relative flex items-center gap-4 md:flex-col md:items-center md:gap-0 md:text-center"
                  >
                    <span
                      className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 shadow-lg backdrop-blur-sm ${
                        i === steps.length - 1
                          ? 'border-white/60 bg-gradient-to-br from-[#2fb391] to-[#178066] text-white'
                          : 'border-white/30 bg-white/15 text-teal-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-teal-50 md:mt-4">{s.label}</p>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </motion.div>

        {/* ─── Statistiques ─── */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                {...fadeUp(i * 0.08)}
                className="group rounded-2xl border border-white/15 bg-white/10 p-5 text-center shadow-[0_15px_35px_-15px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-white/30 hover:bg-white/15"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-teal-100 ring-1 ring-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p
                  style={poppins}
                  className="mt-3 bg-gradient-to-b from-white to-[#8ff0d4] bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl"
                >
                  <StatCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs font-semibold text-teal-100/80 sm:text-sm">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Citation ─── */}
        <motion.figure
          {...fadeUp(0.1)}
          className="relative mx-auto mt-20 max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-white/10 px-8 py-10 text-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-14"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-300/15 blur-2xl" aria-hidden="true" />
          <Quote className="mx-auto h-11 w-11 -scale-x-100 text-teal-200/60" aria-hidden="true" />
          <blockquote
            style={poppins}
            className="mt-3 text-lg font-semibold leading-relaxed text-white sm:text-xl sm:leading-relaxed"
          >
            «&nbsp;Chaque demande reçue représente une opportunité d'apporter des soins, de
            l'espoir et de renforcer la solidarité avec les communautés du Sénégal.&nbsp;»
          </blockquote>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-[#3fc9a4] to-[#8ff0d4]" aria-hidden="true" />
        </motion.figure>

        {/* ─── Qui peut candidater ─── */}
        <motion.div {...fadeUp(0.12)} className="mx-auto mt-16 max-w-3xl text-center">
          <h3 style={poppins} className="text-lg font-bold text-white sm:text-xl">
            Qui peut déposer une candidature&nbsp;?
          </h3>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {eligibles.map((e, i) => (
              <motion.span
                key={e}
                {...fadeUp(0.15 + i * 0.05)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-teal-50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15"
              >
                <BadgeCheck className="h-4 w-4 text-[#3fc9a4]" aria-hidden="true" />
                {e}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CandidatureSection;
