import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Stethoscope, Award, CalendarCheck } from 'lucide-react';
import { presidents } from '../about/MedicalTeam';

// Récupération des 6 médecins (présidents) les plus récents
const latestTeam = [...presidents].reverse().slice(0, 6);

const highlights = [
  { icon: Stethoscope, value: '50+', label: 'Médecins bénévoles' },
  { icon: Award, value: '12', label: 'Spécialités médicales' },
  { icon: CalendarCheck, value: '15', label: 'Missions par an' },
];

const cardFade = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

const MedicalTeamPreview: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 to-white py-24 sm:py-32">
    {/* Decorative blur */}
    <div className="pointer-events-none absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" />

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
          Équipe médicale
        </span>

        <h2 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Notre équipe médicale
        </h2>

        <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-teal-500" />

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
          Des professionnels de santé bénévoles, issus de multiples spécialités, unis par un même engagement&nbsp;: soigner les populations du Fouta.
        </p>
      </motion.div>

      {/* ─── Highlights strip ─── */}
      <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-sm">
        {highlights.map((h, i) => {
          const Icon = h.icon;
          return (
            <motion.div
              key={h.label}
              custom={i}
              variants={cardFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center px-4 py-5 sm:px-6 sm:py-6"
            >
              <Icon className="h-5 w-5 text-teal-500" />
              <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">{h.value}</p>
              <p className="mt-0.5 text-xs font-medium text-gray-500 sm:text-sm">{h.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Team grid ─── */}
      <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
        {latestTeam.map((member, i) => (
          <motion.div
            key={member.name}
            custom={i}
            variants={cardFade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="group"
          >
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-4">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: 'center top' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/photo-avatar-profil.png';
                  }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-xl bg-teal-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {/* Info */}
              <div className="mt-3 text-center sm:mt-4">
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base line-clamp-1" title={member.name}>{member.name}</h3>
                <p className="mt-0.5 text-xs text-teal-600 font-medium">{member.role}</p>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2" title={member.specialty}>{member.specialty}</p>
              </div>
            </div>
          </motion.div>
        ))}
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
          to="/notre-equipe-medicale"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-teal-700 hover:shadow-lg active:scale-[0.98]"
        >
          Voir toute l'équipe
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default MedicalTeamPreview;
