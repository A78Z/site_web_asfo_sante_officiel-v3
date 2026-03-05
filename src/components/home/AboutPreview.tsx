import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  Stethoscope,
  GraduationCap,
  Handshake,
  Activity,
  MapPin,
  Users,
  Building2,
} from 'lucide-react';

const stats = [
  { value: '37+', label: 'Missions réalisées', icon: Activity },
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
];

const cardFade = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const AboutPreview: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-white to-teal-50/50 py-24 sm:py-32">
    {/* Decorative blur */}
    <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-teal-100/40 blur-[120px]" />

    <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-700">
          À propos
        </span>

        <h2 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Qui sommes-nous ?
        </h2>

        {/* Decorative line */}
        <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-teal-500" />

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
          L'Action Sanitaire pour le Fouta (ASFO) est une organisation engagée dans l'amélioration de l'accès aux soins de santé pour les populations rurales et vulnérables du Sénégal.
          Depuis plus de 20 ans, elle mobilise professionnels de santé et bénévoles au service des communautés du Fouta.
        </p>
      </motion.div>

      {/* ─── Stats row ─── */}
      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-5 sm:gap-6 md:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              custom={i}
              variants={cardFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-3xl font-bold text-teal-600 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Mission cards ─── */}
      <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.title}
              custom={i}
              variants={cardFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{p.text}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ─── CTA ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-16 flex justify-center"
      >
        <Link
          to="/about"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-teal-700 hover:shadow-lg active:scale-[0.98]"
        >
          Découvrir l'organisation
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default AboutPreview;
