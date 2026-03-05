import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';

const CandidatureSection: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 py-20 sm:py-28">
    <div className="absolute inset-0 opacity-10">
      <img src="/slide-3.webp" alt="" className="h-full w-full object-cover" />
    </div>

    <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
          <FileText className="h-7 w-7 text-white" />
        </div>

        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Accueillir une caravane médicale
        </h2>
        <p className="mt-4 text-base leading-relaxed text-teal-100 sm:text-lg">
          Les amicales d'étudiants et les collectivités locales peuvent soumettre une candidature pour accueillir une caravane médicale dans leur village.
          L'ASFO étudie chaque demande pour planifier ses prochaines interventions.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/candidature"
            className="group relative inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-teal-700 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-teal-50 animate-[softPulse_2.5s_ease-in-out_infinite]"
          >
            Déposer une candidature
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Nous contacter
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CandidatureSection;
