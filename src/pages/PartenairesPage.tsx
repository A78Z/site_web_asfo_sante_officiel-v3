import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface Partner {
  name: string;
  logo: string;
  description: string;
  category: string;
  website?: string;
}

const partners: Partner[] = [
  {
    name: "Ministère de la Santé et de l'Action Sociale",
    logo: '/msascoro.jpg',
    description:
      'Partenaire institutionnel principal pour le développement de la santé communautaire au Sénégal.',
    category: 'Institutionnel',
    website: 'https://www.sante.gouv.sn',
  },
  {
    name: 'Université Cheikh Anta Diop de Dakar',
    logo: '/Logo_ucad_2.png',
    description:
      "Formation médicale d'excellence et recherche en santé publique.",
    category: 'Éducation',
    website: 'https://www.ucad.sn',
  },
  {
    name: 'Université Gaston Berger de Saint-Louis',
    logo: '/logo-ugb.jpg',
    description:
      'Partenaire académique pour la formation des professionnels de santé du Nord.',
    category: 'Éducation',
    website: 'https://www.ugb.sn',
  },
  {
    name: 'Croix-Rouge Sénégalaise',
    logo: '/logo-croix-rouge.jpg',
    description:
      "Collaboration humanitaire et actions d'urgence sanitaire.",
    category: 'Humanitaire',
    website: 'https://www.croixrouge.sn',
  },
  {
    name: 'Faculté de Médecine, Pharmacie et Odontologie',
    logo: '/logo-medecine.jpg',
    description:
      'Formation médicale spécialisée et recherche clinique.',
    category: 'Éducation',
  },
  {
    name: 'Association des Chirurgiens Dentistes du Sénégal',
    logo: '/AECDS.jpg',
    description:
      'Partenaire pour les soins dentaires et la formation odontologique.',
    category: 'Professionnel',
  },
];

const categories = Array.from(new Set(partners.map((p) => p.category)));

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08 },
  }),
};

const PartenairesPage: React.FC = () => {
  React.useEffect(() => {
    document.title = "Nos partenaires | ASFO — Action Sanitaire pour le Fouta";
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10">
          <img src="/slide-3.webp" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 text-center sm:px-8 lg:px-10">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-100 backdrop-blur-sm">
            Réseau de partenaires
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Nos partenaires
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-teal-100">
            L'ASFO s'appuie sur un réseau solide d'institutions, d'universités et d'organisations pour mener à bien sa mission sanitaire.
          </p>
        </div>
      </section>

      {/* Partners grid by category */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          {categories.map((cat) => (
            <div key={cat} className="mb-16 last:mb-0">
              <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-teal-600">
                {cat}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {partners
                  .filter((p) => p.category === cat)
                  .map((partner, i) => (
                    <motion.div
                      key={partner.name}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-40px' }}
                      className="group rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
                    >
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-50 p-2">
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{partner.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        {partner.description}
                      </p>
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 transition hover:text-teal-700"
                        >
                          Visiter le site
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Devenir partenaire
          </h2>
          <p className="mt-4 text-base text-gray-600">
            Vous représentez une institution, une entreprise ou une ONG ? Rejoignez notre réseau de partenaires et contribuez à améliorer la santé des populations du Fouta.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Nous contacter
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

export default PartenairesPage;
