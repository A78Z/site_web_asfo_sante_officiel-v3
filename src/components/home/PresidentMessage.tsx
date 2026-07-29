import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Quote, BadgeCheck, Award } from 'lucide-react';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: 'easeOut' as const },
});

const PresidentMessage: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-teal-50/60 py-24 sm:py-32">
    {/* ─── Décor de section : halos, cercle, trame de points ─── */}
    <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-teal-100/50 blur-[120px]" />
    <div className="pointer-events-none absolute -right-32 bottom-10 h-[400px] w-[400px] rounded-full bg-teal-50/60 blur-[100px]" />
    <div className="pointer-events-none absolute right-[8%] top-16 hidden h-40 w-40 rounded-full border border-teal-200/50 lg:block" />
    <svg className="pointer-events-none absolute left-[4%] bottom-16 hidden h-40 w-40 text-teal-300/25 lg:block" aria-hidden="true">
      <defs>
        <pattern id="asfo-dots-pm" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.7" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#asfo-dots-pm)" />
    </svg>

    <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
      <div className="grid items-center gap-16 md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* ─── Colonne photo ─── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-md md:mx-0 lg:max-w-lg"
        >
          {/* Formes organiques discrètes derrière la photo */}
          <div className="absolute -inset-8 -z-10 rounded-[40%_60%_55%_45%/50%_45%_55%_50%] bg-gradient-to-br from-teal-200/40 via-teal-100/25 to-transparent blur-2xl" />
          <div className="absolute -left-6 -top-6 -z-10 h-28 w-28 rounded-full bg-teal-400/15 blur-xl" />
          <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-[28px] bg-teal-600/10" />

          {/* Photo */}
          <div className="group overflow-hidden rounded-[28px] shadow-[0_25px_60px_-15px_rgba(18,63,56,0.35)] ring-1 ring-teal-900/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_70px_-15px_rgba(18,63,56,0.4)]">
            <img
              src="/images/president-asfo.jpg"
              alt="Dr Abdaramani Ndiaye — 21e Président de l'ASFO"
              className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>

          {/* Carte d'identité du Président */}
          <motion.div
            {...fadeUp(0.25)}
            className="absolute -bottom-10 left-[7%] w-[86%] rounded-2xl border border-white/70 bg-white/95 px-5 py-4 shadow-[0_18px_40px_-12px_rgba(18,63,56,0.3)] backdrop-blur-md"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2fb391] to-[#178066] text-white shadow-md">
                <Award className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p style={poppins} className="flex items-center gap-1.5 truncate text-base font-bold text-gray-900">
                  Dr Abdaramani Ndiaye
                  <BadgeCheck className="h-4 w-4 shrink-0 text-teal-500" aria-hidden="true" />
                </p>
                <p className="text-[13px] font-medium text-teal-700">21e Président de l'ASFO</p>
              </div>
            </div>
            <div className="mt-3 h-[3px] w-full rounded-full bg-gradient-to-r from-[#2fb391] via-[#8dc3b6] to-transparent" />
          </motion.div>
        </motion.div>

        {/* ─── Colonne texte ─── */}
        <div className="mt-6 text-center md:mt-0 md:text-left">
          {/* Badge */}
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-gradient-to-r from-teal-50 to-[#eef6f2] px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm">
              <Quote className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              Mot du Président
            </span>
            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-300 md:mx-0" />
          </motion.div>

          {/* Titre */}
          <motion.h2
            {...fadeUp(0.1)}
            style={poppins}
            className="mt-7 text-3xl font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem]"
          >
            Ensemble, bâtissons une santé{' '}
            <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
              plus accessible et plus solidaire
            </span>
          </motion.h2>

          {/* Citation */}
          <motion.figure {...fadeUp(0.2)} className="relative mt-10 text-left">
            <Quote
              className="absolute -top-6 left-0 h-16 w-16 -scale-x-100 text-teal-100"
              aria-hidden="true"
            />
            <blockquote className="relative rounded-r-xl border-l-[3px] border-teal-400/60 bg-white/60 py-5 pl-6 pr-4 text-lg leading-loose text-gray-600 sm:text-xl sm:leading-loose">
              Depuis sa création, l'Action Sanitaire pour le Fouta œuvre pour améliorer l'accès aux
              soins dans les zones les plus vulnérables. Notre engagement repose sur la solidarité,
              la formation et l'action humanitaire durable.
              <span className="mt-3 block font-semibold text-gray-800">
                Ensemble, nous bâtissons un système de santé plus équitable pour le Fouta.
              </span>
            </blockquote>
          </motion.figure>

          {/* Signature */}
          <motion.div
            {...fadeUp(0.3)}
            className="mt-10 flex items-center justify-center gap-4 md:justify-start"
          >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full shadow-md ring-2 ring-teal-200">
              <img
                src="/images/president-asfo.jpg"
                alt=""
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="text-left">
              <p style={poppins} className="text-base font-bold text-gray-900">
                Dr Abdaramani Ndiaye
              </p>
              <p className="text-sm font-medium text-teal-700">21e Président de l'ASFO</p>
              <div className="mt-1.5 h-[2px] w-12 rounded-full bg-gradient-to-r from-teal-400 to-transparent" />
            </div>
          </motion.div>

          {/* CTA premium */}
          <motion.div {...fadeUp(0.4)} className="mt-10 flex justify-center md:justify-start">
            <Link
              to="/president-message"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-8px_rgba(23,128,102,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-8px_rgba(23,128,102,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98]"
            >
              Lire le message du Président
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export default PresidentMessage;
