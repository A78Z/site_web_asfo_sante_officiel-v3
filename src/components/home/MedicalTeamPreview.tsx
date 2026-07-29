import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Stethoscope,
  Award,
  CalendarCheck,
  Crown,
  Calendar,
  BadgeCheck,
  Users,
  Quote,
} from 'lucide-react';
import { presidents } from '../about/MedicalTeam';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

// Anciens présidents les plus récents (le président actuel a sa propre carte)
const formerPresidents = [...presidents].reverse().slice(0, 4);

const highlights = [
  { icon: Users, value: 50, suffix: '+', label: 'Professionnels bénévoles' },
  { icon: Award, value: 12, suffix: '', label: 'Spécialités médicales' },
  { icon: CalendarCheck, value: 15, suffix: '', label: 'Missions chaque année' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

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
    const DURATION = 1500;
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
      {n}
      {suffix}
    </span>
  );
};

const MedicalTeamPreview: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-[#f6fbf9] to-white py-24 sm:py-32">
      {/* ─── Fond : halos, cercle, trame de points ─── */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-36 bottom-24 h-[380px] w-[380px] rounded-full bg-teal-50/70 blur-[100px]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[6%] bottom-32 hidden h-32 w-32 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />
      <svg className="pointer-events-none absolute right-[5%] top-28 hidden h-32 w-32 text-teal-300/20 lg:block" aria-hidden="true">
        <defs>
          <pattern id="asfo-dots-team" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.7" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#asfo-dots-team)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* ─── En-tête ─── */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp(0)} className="inline-block">
            <motion.span
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/70 bg-white/70 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-[0_10px_25px_-10px_rgba(18,63,56,0.3)] backdrop-blur-md"
            >
              <Stethoscope className="h-4 w-4" aria-hidden="true" />
              Équipe médicale
            </motion.span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.08)}
            style={poppins}
            className="mt-7 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          >
            Notre équipe{' '}
            <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
              médicale
            </span>
          </motion.h2>

          <motion.div {...fadeUp(0.14)} className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-teal-500 to-teal-300" aria-hidden="true" />

          <motion.p
            {...fadeUp(0.18)}
            className="mx-auto mt-7 max-w-[700px] text-lg leading-loose text-gray-600"
          >
            Des professionnels de santé bénévoles, issus de multiples spécialités, unis par un même
            engagement&nbsp;: soigner les populations du Fouta.
          </motion.p>
        </div>

        {/* ─── Statistiques ─── */}
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <motion.div
                key={h.label}
                {...fadeUp(i * 0.1)}
                className="group rounded-2xl border border-white/80 bg-white/80 p-6 text-center shadow-[0_12px_32px_-14px_rgba(18,63,56,0.2)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_45px_-14px_rgba(18,63,56,0.3)]"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 ring-1 ring-teal-100 transition-all duration-300 group-hover:scale-110 group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p
                  style={poppins}
                  className="mt-4 bg-gradient-to-br from-teal-600 to-[#178066] bg-clip-text text-4xl font-extrabold text-transparent"
                >
                  <StatCounter value={h.value} suffix={h.suffix} />
                </p>
                <p className="mt-1.5 text-sm font-semibold text-gray-600">{h.label}</p>
                <div className="mx-auto mt-4 h-[3px] w-10 rounded-full bg-gradient-to-r from-teal-400 to-teal-200 transition-all duration-300 group-hover:w-16" aria-hidden="true" />
              </motion.div>
            );
          })}
        </div>

        {/* ─── Notre Leadership ─── */}
        <motion.h3
          {...fadeUp(0)}
          style={poppins}
          className="mt-20 text-center text-xl font-bold text-gray-900 sm:text-2xl"
        >
          Notre Leadership
        </motion.h3>

        {/* Carte Président */}
        <motion.div {...fadeUp(0.1)} className="mx-auto mt-8 max-w-3xl">
          <div className="group relative overflow-hidden rounded-[28px] border-2 border-teal-200/70 bg-white/85 p-6 shadow-[0_25px_55px_-20px_rgba(18,63,56,0.35)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_70px_-20px_rgba(18,63,56,0.45)] sm:p-8">
            {/* Halo au survol */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-200/30 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

            <div className="relative flex flex-col items-center gap-7 sm:flex-row sm:items-stretch">
              {/* Photo */}
              <div className="w-48 shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-teal-900/10 sm:w-52">
                <img
                  src="/images/president-asfo.jpg"
                  alt="Dr Abdaramani Ndiaye — 21e Président de l'ASFO"
                  className="aspect-[4/5] h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>

              {/* Infos */}
              <div className="flex flex-1 flex-col justify-center text-center sm:text-left">
                <span className="inline-flex w-fit items-center gap-1.5 self-center rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-md sm:self-start">
                  <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                  Président actuel
                </span>

                <p style={poppins} className="mt-4 flex items-center justify-center gap-2 text-2xl font-extrabold text-gray-900 sm:justify-start sm:text-3xl">
                  Dr Abdaramani Ndiaye
                  <BadgeCheck className="h-6 w-6 shrink-0 text-teal-500" aria-hidden="true" />
                </p>
                <p className="mt-1 text-base font-semibold text-teal-700">21e Président de l'ASFO</p>

                <div className="mx-auto mt-4 h-[3px] w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-200 sm:mx-0" aria-hidden="true" />

                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  Il conduit la 21e présidence de l'ASFO et porte l'engagement de l'association pour
                  une santé plus juste, plus humaine et accessible à tous au Fouta.
                </p>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 sm:justify-start">
                  <Stethoscope className="h-4 w-4 text-teal-500" aria-hidden="true" />
                  Mandat 2025 — aujourd'hui
                  <span className="mx-1 text-gray-300" aria-hidden="true">·</span>
                  <Link to="/president-message" className="font-semibold text-teal-600 underline-offset-2 hover:underline">
                    Lire son message
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Anciens présidents ─── */}
        <motion.p
          {...fadeUp(0)}
          className="mt-16 text-center text-xs font-bold uppercase tracking-[0.18em] text-teal-700/80"
        >
          Ils ont porté l'ASFO
        </motion.p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {formerPresidents.map((member, i) => (
            <motion.div key={member.name} {...fadeUp(i * 0.08)} className="group">
              <div className="relative h-full overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-4 shadow-[0_12px_32px_-16px_rgba(18,63,56,0.2)] transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_25px_50px_-16px_rgba(18,63,56,0.3)]">
                {/* Halo au survol */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-100/50 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

                {/* Photo */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    style={{ objectPosition: 'center top' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/photo-avatar-profil.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                  {/* Badge ancien président */}
                  <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-700 shadow-sm backdrop-blur-sm">
                    <Award className="h-3 w-3" aria-hidden="true" />
                    Ancien Président
                  </span>
                </div>

                {/* Infos */}
                <div className="relative mt-4 px-1 pb-1 text-center">
                  <h4 style={poppins} className="text-base font-bold text-gray-900 line-clamp-1" title={member.name}>
                    {member.name}
                  </h4>
                  <div className="mx-auto mt-2 h-[2px] w-8 rounded-full bg-gradient-to-r from-teal-400 to-teal-200 transition-all duration-300 group-hover:w-14" aria-hidden="true" />
                  <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500">
                    <Calendar className="h-3.5 w-3.5 text-teal-500" aria-hidden="true" />
                    {member.years}
                  </p>
                  <p className="mt-2 flex items-start justify-center gap-1.5 text-xs leading-relaxed text-gray-500">
                    <Stethoscope className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-500" aria-hidden="true" />
                    <span className="line-clamp-2" title={member.specialty}>
                      {member.specialty}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── Citation ─── */}
        <motion.figure
          {...fadeUp(0.1)}
          className="relative mx-auto mt-20 max-w-3xl overflow-hidden rounded-3xl border border-teal-100/80 bg-gradient-to-br from-[#e8f3ef]/70 to-white px-8 py-10 text-center shadow-[0_18px_45px_-20px_rgba(18,63,56,0.25)] sm:px-14"
        >
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-teal-200/25 blur-2xl" aria-hidden="true" />
          <Quote className="mx-auto h-12 w-12 -scale-x-100 text-teal-300/70" aria-hidden="true" />
          <blockquote
            style={poppins}
            className="mt-4 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-relaxed"
          >
            «&nbsp;Notre plus grande richesse est l'engagement des femmes et des hommes qui
            consacrent leur expertise à la santé des communautés.&nbsp;»
          </blockquote>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-300" aria-hidden="true" />
        </motion.figure>

        {/* ─── CTA ─── */}
        <motion.div {...fadeUp(0.15)} className="mt-16 flex justify-center">
          <Link
            to="/notre-equipe-medicale"
            className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-8px_rgba(23,128,102,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-8px_rgba(23,128,102,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98]"
          >
            Voir toute l'équipe
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MedicalTeamPreview;
