import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Users,
  Calendar,
  Heart,
  MapPin,
  TrendingUp,
  Stethoscope,
  HeartPulse,
  ShieldPlus,
  GraduationCap,
  Handshake,
  Sprout,
  Quote,
} from 'lucide-react';
import {
  SENEGAL_LOCATIONS,
  SENEGAL_OUTLINE_PATH,
  projectSenegalCoordinate,
} from '../../data/senegalMap';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

/* ─── Données ─── */

const stats = [
  {
    value: 250,
    suffix: '+',
    label: 'Patients consultés',
    text: 'Des milliers de vies améliorées grâce à nos missions médicales.',
    icon: Heart,
  },
  {
    value: 25,
    suffix: '',
    label: "Années d'engagement",
    text: "Deux décennies d'actions humanitaires au service du Fouta.",
    icon: Calendar,
  },
  {
    value: 600,
    suffix: '+',
    label: 'Professionnels mobilisés',
    text: 'Médecins, infirmiers et bénévoles engagés sur le terrain.',
    icon: Users,
  },
  {
    value: 192,
    suffix: '+',
    label: 'Localités desservies',
    text: 'Une présence dans plusieurs régions du Sénégal.',
    icon: MapPin,
  },
];

const terrain = [
  { icon: Stethoscope, label: 'Missions médicales' },
  { icon: HeartPulse, label: 'Consultations' },
  { icon: ShieldPlus, label: 'Prévention' },
  { icon: GraduationCap, label: 'Formation' },
  { icon: Handshake, label: 'Partenariats' },
];

const durable = [
  {
    icon: Sprout,
    title: 'Prévention',
    text: 'Nous privilégions des actions qui améliorent durablement la santé des communautés.',
  },
  {
    icon: GraduationCap,
    title: 'Renforcement des compétences',
    text: 'Nous formons les professionnels locaux afin d’assurer un impact pérenne.',
  },
  {
    icon: Handshake,
    title: 'Partenariats',
    text: 'Nous travaillons avec les autorités, les collectivités et les organisations partenaires.',
  },
];

/* Zones d'intervention projetées depuis des coordonnées géographiques. */
const mapPoints = [
  SENEGAL_LOCATIONS.saintLouis,
  SENEGAL_LOCATIONS.podor,
  SENEGAL_LOCATIONS.matam,
  SENEGAL_LOCATIONS.kanel,
  SENEGAL_LOCATIONS.bakel,
  SENEGAL_LOCATIONS.dakar,
].map(projectSenegalCoordinate);

/* ─── Compteur animé (0 → valeur, easeOutCubic) ─── */
const StatCounter: React.FC<{ value: number; suffix: string; started: boolean }> = ({
  value,
  suffix,
  started,
}) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const DURATION = 1800;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION);
      setN(Math.round(easeOutCubic(p) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value]);

  return (
    <span className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
};

const ImpactStats: React.FC = () => {
  const reduce = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-80px' });

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f5faf8] to-teal-50/50 py-24 sm:py-32">
      {/* ─── Fond premium ─── */}
      <div className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-44 bottom-32 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[7%] top-32 hidden h-32 w-32 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />
      <svg className="pointer-events-none absolute left-[5%] top-24 hidden h-32 w-32 text-teal-300/20 lg:block" aria-hidden="true">
        <defs>
          <pattern id="asfo-dots-impact" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.7" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#asfo-dots-impact)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* ─── En-tête ─── */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            {...fadeUp(0)}
            className="inline-block"
          >
            <motion.span
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/70 bg-white/70 px-6 py-2.5 text-sm font-bold text-teal-700 shadow-[0_10px_25px_-10px_rgba(18,63,56,0.3)] backdrop-blur-md"
            >
              <TrendingUp className="h-4 w-4 text-teal-600" aria-hidden="true" />
              Notre Impact
            </motion.span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.08)}
            style={poppins}
            className="mt-7 text-4xl font-extrabold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-7xl"
          >
            Notre Impact{' '}
            <span className="whitespace-nowrap bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
              au&nbsp;Sénégal
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.16)}
            className="mx-auto mt-7 max-w-[750px] text-lg leading-loose text-gray-600 sm:text-xl sm:leading-loose"
          >
            Depuis notre création, ASFO a touché la vie de milliers de personnes à travers le
            Sénégal grâce aux efforts de nos bénévoles dévoués.
          </motion.p>

          <motion.div {...fadeUp(0.22)} className="mt-8 flex items-center justify-center" aria-hidden="true">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
            <div className="mx-4 h-2.5 w-2.5 rounded-full bg-teal-400" />
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
          </motion.div>
        </div>

        {/* ─── Statistiques sur silhouette du Sénégal ─── */}
        <div ref={gridRef} className="relative mt-20">
          {/* Silhouette du Sénégal, discrète et floue, avec points lumineux */}
          <svg
            viewBox="0 0 400 300"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[560px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70 blur-[1.5px] sm:h-[520px] sm:w-[700px]"
            aria-hidden="true"
          >
            <path
              d={SENEGAL_OUTLINE_PATH}
              className="fill-teal-100/50"
            />
            {mapPoints.map((p, i) => (
              <motion.g key={i}>
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r="10"
                  className="fill-teal-400/25"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={reduce ? { opacity: 1, scale: 1 } : { opacity: [0, 1, 0.5, 1], scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.4 + i * 0.18 }}
                />
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  className="fill-[#2fb391]"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.18 }}
                />
              </motion.g>
            ))}
          </svg>

          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  {...fadeUp(i * 0.1)}
                  className="group rounded-3xl border border-white/80 bg-white/75 p-8 text-center shadow-[0_15px_40px_-15px_rgba(18,63,56,0.22)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:rotate-[0.4deg] hover:shadow-[0_28px_55px_-15px_rgba(18,63,56,0.32)]"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 ring-1 ring-teal-100 transition-all duration-300 group-hover:scale-110 group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                    <Icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <p
                    style={poppins}
                    className="mt-5 bg-gradient-to-br from-teal-600 to-[#178066] bg-clip-text text-5xl font-extrabold text-transparent"
                  >
                    <StatCounter value={s.value} suffix={s.suffix} started={gridInView} />
                  </p>
                  <p style={poppins} className="mt-2 text-base font-bold text-gray-800">
                    {s.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.text}</p>
                  <div className="mx-auto mt-5 h-[3px] w-12 rounded-full bg-gradient-to-r from-teal-400 to-teal-200 transition-all duration-300 group-hover:w-20" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ─── Notre présence sur le terrain ─── */}
        <motion.div {...fadeUp(0.1)} className="mx-auto mt-20 max-w-5xl">
          <h3 style={poppins} className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Notre présence sur le terrain
          </h3>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {terrain.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.span
                  key={t.label}
                  {...fadeUp(0.15 + i * 0.08)}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-teal-100 bg-white/80 px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 transition-all duration-300 group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {t.label}
                </motion.span>
              );
            })}
          </div>
        </motion.div>

        {/* ─── Citation ─── */}
        <motion.figure
          {...fadeUp(0.1)}
          className="relative mx-auto mt-20 max-w-3xl overflow-hidden rounded-3xl border border-teal-100/80 bg-gradient-to-br from-[#e8f3ef]/80 to-white px-8 py-10 text-center shadow-[0_18px_45px_-20px_rgba(18,63,56,0.25)] sm:px-14"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-200/25 blur-2xl" aria-hidden="true" />
          <Quote className="mx-auto h-12 w-12 -scale-x-100 text-teal-300/70" aria-hidden="true" />
          <blockquote
            style={poppins}
            className="mt-4 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-relaxed"
          >
            «&nbsp;Chaque chiffre représente une vie touchée, une famille accompagnée et une
            communauté renforcée grâce à l'engagement de l'ASFO.&nbsp;»
          </blockquote>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-300" aria-hidden="true" />
        </motion.figure>

        {/* ─── Pourquoi notre impact est durable ─── */}
        <div className="mx-auto mt-20 max-w-5xl">
          <motion.h3
            {...fadeUp(0)}
            style={poppins}
            className="text-center text-xl font-bold text-gray-900 sm:text-2xl"
          >
            Pourquoi notre impact est durable&nbsp;?
          </motion.h3>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {durable.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div
                  key={d.title}
                  {...fadeUp(0.1 + i * 0.1)}
                  className="group rounded-2xl border border-gray-200/80 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:-rotate-[0.4deg] hover:border-teal-200 hover:shadow-[0_22px_45px_-15px_rgba(18,63,56,0.25)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 ring-1 ring-teal-100 transition-all duration-300 group-hover:scale-110 group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h4 style={poppins} className="mt-4 text-base font-bold text-gray-900">
                    {d.title}
                  </h4>
                  <div className="mt-2 h-[3px] w-9 rounded-full bg-gradient-to-r from-teal-400 to-teal-200 transition-all duration-300 group-hover:w-14" aria-hidden="true" />
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">{d.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ─── Bandeau de conclusion ─── */}
        <motion.div {...fadeUp(0.1)} className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-teal-100 bg-white/90 px-8 py-4 shadow-[0_15px_35px_-15px_rgba(18,63,56,0.3)] backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2fb391] to-[#178066]">
              <Heart className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="text-left">
              <p style={poppins} className="text-base font-bold text-gray-800 sm:text-lg">
                Impact mesurable et durable
              </p>
              <p className="text-sm text-gray-600">Chaque mission transforme des vies</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStats;
