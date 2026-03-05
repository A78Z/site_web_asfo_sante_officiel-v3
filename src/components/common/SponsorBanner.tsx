import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  description: string;
  website?: string;
  category: string;
}

const sponsors: Sponsor[] = [
  {
    id: 'ministere-sante',
    name: "Ministère de la Santé et de l'Action Sociale",
    logo: '/msascoro.jpg',
    description:
      'Partenaire institutionnel pour le développement de la santé communautaire au Sénégal',
    website: 'https://www.sante.gouv.sn',
    category: 'Institutionnel',
  },
  {
    id: 'ucad',
    name: 'Université Cheikh Anta Diop de Dakar',
    logo: '/Logo_ucad_2.png',
    description:
      "Formation médicale d'excellence et recherche en santé publique",
    website: 'https://www.ucad.sn',
    category: 'Éducation',
  },
  {
    id: 'ugb',
    name: 'Université Gaston Berger de Saint-Louis',
    logo: '/logo-ugb.jpg',
    description:
      'Partenaire académique pour la formation des professionnels de santé',
    website: 'https://www.ugb.sn',
    category: 'Éducation',
  },
  {
    id: 'croix-rouge',
    name: 'Croix-Rouge Sénégalaise',
    logo: '/logo-croix-rouge.jpg',
    description:
      "Collaboration humanitaire et actions d'urgence sanitaire",
    website: 'https://www.croixrouge.sn',
    category: 'Humanitaire',
  },
  {
    id: 'fmpos',
    name: 'Faculté de Médecine, Pharmacie et Odontologie',
    logo: '/logo-medecine.jpg',
    description:
      'Formation médicale spécialisée et recherche clinique',
    category: 'Éducation',
  },
  {
    id: 'aecds',
    name: 'Association des Chirurgiens Dentistes du Sénégal',
    logo: '/AECDS.jpg',
    description:
      'Partenaire pour les soins dentaires et la formation odontologique',
    category: 'Professionnel',
  },
];

const SponsorBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % sponsors.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? sponsors.length - 1 : i - 1));
  const next = () =>
    setCurrentIndex((i) => (i + 1) % sponsors.length);

  const sponsor = sponsors[currentIndex];

  return (
    <div
      className="relative z-[60] w-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 border-b border-orange-400/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Label */}
        <div className="flex shrink-0 items-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            Sponsorisé
          </span>
        </div>

        {/* Sponsor content */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-3">
          <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white p-0.5 shadow-sm sm:flex">
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="h-full w-full rounded-[3px] object-contain"
            />
          </div>

          <span className="truncate text-sm font-semibold text-white">
            {sponsor.name}
          </span>

          {sponsor.website && (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden shrink-0 items-center gap-1 rounded-md bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30 sm:inline-flex"
            >
              Visiter
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Controls */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={prev}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={next}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            aria-label="Suivant"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          {/* Dots — desktop only */}
          <div className="ml-1 hidden items-center gap-1 md:flex">
            {sponsors.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Sponsor ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'h-1.5 w-4 bg-white'
                    : 'h-1.5 w-1.5 bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Counter — large screens */}
          <span className="ml-1.5 hidden text-[11px] font-medium text-white/80 lg:inline">
            {currentIndex + 1}/{sponsors.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/10">
        <div
          className="h-full bg-white/60 transition-all duration-500 ease-linear"
          style={{ width: `${((currentIndex + 1) / sponsors.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default SponsorBanner;
