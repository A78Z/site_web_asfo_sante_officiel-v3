import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  Stethoscope,
  GraduationCap,
  Handshake,
  HeartPulse,
  MapPin,
  Users,
  Building2,
  Lightbulb,
  Quote,
} from 'lucide-react';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const stats = [
  { value: '37+', label: 'Missions réalisées', icon: HeartPulse },
  { value: '25 000+', label: 'Patients soignés', icon: Users },
  { value: '7', label: 'Régions couvertes', icon: MapPin },
  { value: '20+', label: 'Partenaires', icon: Building2 },
];

const pillars = [
  {
    icon: Stethoscope,
    title: 'Soins gratuits',
    text: 'Consultations médicales pluridisciplinaires dans les zones les plus reculées et vulnérables du Fouta.',
  },
  {
    icon: GraduationCap,
    title: 'Formation',
    text: "Renforcement des compétences du personnel de santé local pour un impact durable et autonome.",
  },
  {
    icon: Heart,
    title: 'Sensibilisation',
    text: "Campagnes de prévention, d'éducation sanitaire et de promotion de la santé communautaire.",
  },
  {
    icon: Handshake,
    title: 'Partenariats',
    text: "Collaborations stratégiques avec les institutions publiques, universités et organisations internationales.",
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    text: "Approches innovantes et solutions numériques pour améliorer durablement l'accès aux soins et l'efficacité des interventions sur le terrain.",
  },
];

const timeline = [
  { year: '2000', label: "Création de l'ASFO" },
  { year: '2001', label: 'Premières missions médicales' },
  { year: '2010', label: 'Développement des partenariats' },
  { year: '2018', label: 'Expansion régionale' },
  { year: "Aujourd'hui", label: '21e Présidence' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Compteur animé au scroll : 0 → valeur quand la carte entre dans le
 * viewport. Conserve le suffixe (+) et le format fr (25 000).
 * prefers-reduced-motion : valeur finale directe.
 */
const StatCounter: React.FC<{ value: string }> = ({ value }) => {
  const match = value.replace(/\s/g, '').match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : '';
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const DURATION = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION);
      setN(Math.round(easeOutCubic(p) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {n.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
};

const AboutPreview: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f7fbf9] to-teal-50/60 py-24 sm:py-32">
    {/* ─── Fond premium : halos, cercle, trame de points ─── */}
    <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-teal-100/40 blur-[120px]" />
    <div className="pointer-events-none absolute -left-48 bottom-40 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" />
    <div className="pointer-events-none absolute left-[6%] top-24 hidden h-36 w-36 rounded-full border border-teal-200/50 lg:block" />
    <svg className="pointer-events-none absolute right-[5%] bottom-24 hidden h-36 w-36 text-teal-300/20 lg:block" aria-hidden="true">
      <defs>
        <pattern id="asfo-dots-about" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.7" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#asfo-dots-about)" />
    </svg>

    <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
      {/* ─── En-tête institutionnel ─── */}
      <motion.div {...fadeUp(0)} className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-gradient-to-r from-teal-50 to-[#eef6f2] px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          À propos
        </span>

        <h2
          style={poppins}
          className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
        >
          Qui sommes-nous&nbsp;?
        </h2>

        <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-teal-500 to-teal-300" />

        <p className="mx-auto mt-7 max-w-[700px] text-lg leading-loose text-gray-600">
          L'Action Sanitaire pour le Fouta (ASFO) est une organisation engagée dans l'amélioration
          de l'accès aux soins de santé pour les populations rurales et vulnérables du Sénégal.
          Depuis plus de 20 ans, elle mobilise professionnels de santé et bénévoles au service des
          communautés du Fouta.
        </p>
      </motion.div>

      {/* ─── Statistiques premium ─── */}
      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              {...fadeUp(i * 0.1)}
              className="group rounded-2xl border border-white/70 bg-white/80 p-6 text-center shadow-[0_10px_30px_-12px_rgba(18,63,56,0.18)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(18,63,56,0.28)] sm:p-7"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 ring-1 ring-teal-100 transition-all duration-300 group-hover:scale-110 group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <p
                style={poppins}
                className="mt-4 bg-gradient-to-br from-teal-600 to-[#178066] bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl"
              >
                <StatCounter value={s.value} />
              </p>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:text-[13px]">
                {s.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Cartes des valeurs ─── */}
      <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.title}
              {...fadeUp(i * 0.08)}
              className={`group rounded-2xl border border-gray-200/80 bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_22px_45px_-15px_rgba(18,63,56,0.25)] lg:col-span-2 ${
                i === 3 ? 'lg:col-start-2' : ''
              }`}
            >
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 ring-1 ring-teal-100 transition-all duration-300 group-hover:scale-110 group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 style={poppins} className="mt-5 text-lg font-bold text-gray-900">
                {p.title}
              </h3>
              <div className="mt-2 h-[3px] w-10 rounded-full bg-gradient-to-r from-teal-400 to-teal-200 transition-all duration-300 group-hover:w-16" />
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{p.text}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Timeline ─── */}
      <motion.div {...fadeUp(0.1)} className="mx-auto mt-24 max-w-5xl">
        <h3 style={poppins} className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
          Plus de deux décennies d'engagement
        </h3>
        <div className="relative mt-12">
          {/* Ligne horizontale (desktop) */}
          <div className="absolute left-[10%] right-[10%] top-[7px] hidden h-[2px] bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200 md:block" />
          {/* Ligne verticale (mobile) */}
          <div className="absolute bottom-2 left-[7px] top-2 w-[2px] bg-gradient-to-b from-teal-200 via-teal-400 to-teal-200 md:hidden" />

          <div className="flex flex-col gap-8 md:grid md:grid-cols-5 md:gap-4">
            {timeline.map((t, i) => (
              <motion.div
                key={t.year}
                {...fadeUp(0.15 + i * 0.1)}
                className="relative flex items-start gap-4 md:flex-col md:items-center md:gap-0 md:text-center"
              >
                <span
                  className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-[3px] border-white shadow-[0_0_0_2px_rgba(47,179,145,0.6)] md:mt-0 ${
                    i === timeline.length - 1 ? 'bg-gradient-to-br from-[#2fb391] to-[#178066]' : 'bg-teal-400'
                  }`}
                />
                <div className="md:mt-4">
                  <p style={poppins} className="text-base font-extrabold text-teal-700">
                    {t.year}
                  </p>
                  <p className="mt-1 text-sm leading-snug text-gray-600">{t.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Citation ─── */}
      <motion.figure {...fadeUp(0.1)} className="relative mx-auto mt-24 max-w-3xl text-center">
        <Quote
          className="mx-auto h-14 w-14 -scale-x-100 text-teal-200"
          aria-hidden="true"
        />
        <blockquote
          style={poppins}
          className="mt-4 text-xl font-semibold leading-relaxed text-gray-800 sm:text-2xl sm:leading-relaxed"
        >
          «&nbsp;Chaque mission est une promesse de santé, d'espoir et de solidarité envers les
          populations les plus vulnérables.&nbsp;»
        </blockquote>
        <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-300" />
      </motion.figure>

      {/* ─── Call to action ─── */}
      <motion.div
        {...fadeUp(0.15)}
        className="relative mt-24 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-[#178066] px-8 py-14 text-center shadow-[0_30px_60px_-20px_rgba(18,63,56,0.5)] sm:px-14"
      >
        {/* Décor interne */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-40 w-40 -translate-x-1/2 rounded-full border border-white/10 sm:block" />

        <h3 style={poppins} className="relative text-2xl font-extrabold text-white sm:text-3xl">
          Rejoignez notre engagement
        </h3>
        <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-teal-50/90">
          Chaque contribution permet d'améliorer durablement la santé des communautés du Fouta.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/about"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-teal-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] sm:w-auto"
          >
            Découvrir l'ASFO
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/donate"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] sm:w-auto"
          >
            <Heart className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            Faire un don
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default AboutPreview;
