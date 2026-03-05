import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const images = [
  '/1.webp',
  '/2.webp',
  '/3.webp',
  '/4.webp',
  '/5.webp',
  '/6.webp',
];

const GalleryPreview: React.FC = () => (
  <section className="py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <span className="inline-block rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-700">
          En images
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Galerie des actions humanitaires
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
          Revivez les moments forts de nos missions médicales à travers le Fouta.
        </p>
      </motion.div>

      <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="group aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"
          >
            <img
              src={src}
              alt={`Action humanitaire ASFO ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          Voir la galerie complète
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default GalleryPreview;
