import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';

const PresidentMessage: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-teal-50/60 py-24 sm:py-32">
    {/* Decorative blurs */}
    <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-teal-100/50 blur-[120px]" />
    <div className="pointer-events-none absolute -right-32 bottom-10 h-[400px] w-[400px] rounded-full bg-teal-50/60 blur-[100px]" />

    <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
      <div className="grid items-center gap-14 md:grid-cols-2 md:gap-16 lg:gap-20">
        {/* ─── Photo column ─── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-lg md:mx-0"
        >
          {/* Background accent shape */}
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-teal-200/40 via-teal-100/30 to-transparent blur-2xl" />
          <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl bg-teal-600/10" />

          <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5 transition-transform duration-500 hover:scale-[1.02]">
            <img
              src="/thioye.webp"
              alt="MAMADOU THIOYE — Président de l'ASFO"
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>

          {/* Floating stat badge */}
          <div className="absolute -bottom-5 -right-4 rounded-xl border border-white/60 bg-white/90 px-5 py-3 shadow-lg backdrop-blur-md sm:-right-6">
            <p className="text-2xl font-bold text-teal-700">20+</p>
            <p className="text-xs font-medium text-gray-500">Années d'engagement</p>
          </div>
        </motion.div>

        {/* ─── Text column ─── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-700">
            Mot du Président
          </span>

          {/* Decorative line */}
          <div className="mt-4 h-1 w-16 rounded-full bg-teal-500" />

          {/* Title */}
          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Un engagement au service <br className="hidden sm:block" />
            <span className="text-teal-600">de la santé pour tous</span>
          </h2>

          {/* Quote icon */}
          <Quote className="mt-8 h-10 w-10 text-teal-200" />

          {/* Blockquote */}
          <blockquote className="mt-3 border-l-4 border-teal-500/30 pl-5 text-lg leading-relaxed text-gray-600 sm:text-xl">
            Depuis sa création, l'Action Sanitaire pour le Fouta œuvre pour améliorer l'accès aux soins dans les zones les plus vulnérables.
            Notre engagement repose sur la solidarité, la formation et l'action humanitaire durable.
            <span className="mt-2 block font-medium text-gray-700">
              Ensemble, nous bâtissons un système de santé plus équitable pour le Fouta.
            </span>
          </blockquote>

          {/* Signature */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-teal-100">
              <img
                src="/thioye.webp"
                alt="MAMADOU THIOYE"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">MAMADOU THIOYE</p>
              <p className="text-sm text-gray-500">Président de l'ASFO</p>
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/president-message"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-teal-700 hover:shadow-lg active:scale-[0.98]"
          >
            Lire le message complet
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

export default PresidentMessage;
