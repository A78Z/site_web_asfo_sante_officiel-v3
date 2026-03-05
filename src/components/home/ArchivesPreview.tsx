import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Users } from 'lucide-react';

const missions = [
  {
    id: '2024-guede-village',
    title: 'Guédé Village',
    year: '2024',
    consultations: 1122,
    image: '/guede-village.webp',
  },
  {
    id: '2024-village-tatqui',
    title: 'Village Tatqui',
    year: '2024',
    consultations: 1250,
    image: '/2024-TATQUI.jpg',
  },
  {
    id: '2024-village-diattar',
    title: 'Village Diattar',
    year: '2024',
    consultations: 1242,
    image: '/village-diattar.webp',
  },
];

const ArchivesPreview: React.FC = () => (
  <section className="border-t border-gray-100 bg-gray-50 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <span className="inline-block rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-700">
          Nos missions
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Archives des missions médicales
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
          Retrouvez les dernières campagnes médicales menées par l'ASFO dans les villages du Fouta.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {missions.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
          >
            <Link
              to={`/archives/${m.id}`}
              className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={m.image}
                  alt={m.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {m.title}
                  </span>
                  <span className="rounded bg-teal-50 px-2 py-0.5 font-semibold text-teal-700">
                    {m.year}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-gray-900">
                  Mission {m.title}
                </h3>
                <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-teal-500" />
                  <span className="font-semibold text-teal-700">{m.consultations.toLocaleString()}</span>
                  consultations
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/archives"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Voir toutes les missions
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default ArchivesPreview;
