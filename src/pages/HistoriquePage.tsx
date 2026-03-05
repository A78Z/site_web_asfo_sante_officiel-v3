import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Heart, ArrowRight, Stethoscope } from 'lucide-react';

const milestones = [
  {
    year: '2000',
    title: "Création de l'ASFO",
    description:
      "Un groupe de jeunes professionnels de santé originaires du Fouta fonde l'Action Sanitaire pour le Fouta, avec la vision d'améliorer l'accès aux soins dans les zones reculées.",
    icon: Heart,
  },
  {
    year: '2002',
    title: 'Première mission médicale',
    description:
      "Organisation de la toute première campagne de consultations médicales gratuites dans le département de Matam, marquant le début d'un engagement durable.",
    icon: Stethoscope,
  },
  {
    year: '2008',
    title: 'Extension géographique',
    description:
      "L'ASFO élargit ses interventions à l'ensemble de la région du Fouta, couvrant les départements de Matam, Kanel, Ranérou et Podor.",
    icon: MapPin,
  },
  {
    year: '2012',
    title: 'Partenariats institutionnels',
    description:
      "Signature de conventions avec le Ministère de la Santé, les universités et les organisations humanitaires pour renforcer l'impact des missions.",
    icon: Users,
  },
  {
    year: '2018',
    title: 'Cap des 20 000 consultations',
    description:
      "L'ASFO franchit le cap symbolique de 20 000 consultations gratuites réalisées, témoignant de la confiance des populations et de l'engagement des bénévoles.",
    icon: Heart,
  },
  {
    year: '2024',
    title: "Modernisation et digitalisation",
    description:
      "Lancement de la plateforme numérique ASFO Santé et renforcement des outils de suivi médical pour une meilleure prise en charge des patients.",
    icon: Calendar,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const HistoriquePage: React.FC = () => {
  React.useEffect(() => {
    document.title = "Notre histoire | ASFO — Action Sanitaire pour le Fouta";
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10">
          <img src="/slide1.webp" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 text-center sm:px-8 lg:px-10">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-100 backdrop-blur-sm">
            Notre parcours
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            L'histoire de l'ASFO
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-teal-100">
            Depuis l'an 2000, l'ASFO incarne l'engagement d'une jeunesse déterminée à transformer l'accès aux soins dans le Fouta sénégalais.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 hidden h-full w-px bg-teal-200 sm:left-1/2 sm:block" />

            <div className="flex flex-col gap-16">
              {milestones.map((m, i) => {
                const Icon = m.icon;
                const isLeft = i % 2 === 0;

                return (
                  <motion.div
                    key={m.year}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    className={`relative flex flex-col sm:flex-row ${
                      isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                    } items-start gap-8`}
                  >
                    {/* Dot on the line */}
                    <div className="absolute left-6 top-2 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-teal-500 bg-white sm:left-1/2 sm:block" />

                    {/* Content card */}
                    <div className={`w-full sm:w-1/2 ${isLeft ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'}`}>
                      <span className="text-sm font-bold text-teal-600">{m.year}</span>
                      <h3 className="mt-1 text-xl font-bold text-gray-900">{m.title}</h3>
                      <p className="mt-2 text-base leading-relaxed text-gray-600">{m.description}</p>
                    </div>

                    {/* Icon — hidden on mobile, shown at center on desktop */}
                    <div className="hidden sm:absolute sm:left-1/2 sm:top-0 sm:flex sm:-translate-x-1/2 sm:translate-y-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 ring-4 ring-white">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            L'histoire continue avec vous
          </h2>
          <p className="mt-4 text-base text-gray-600">
            Rejoignez le mouvement et contribuez à écrire les prochains chapitres de cette aventure humanitaire.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/join"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Nous rejoindre
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Découvrir l'ASFO
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoriquePage;
