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
    id: "ministere-sante",
    name: "Ministère de la Santé et de l'Action Sociale",
    logo: "/msascoro.jpg",
    description: "Partenaire institutionnel pour le développement de la santé communautaire au Sénégal",
    website: "https://www.sante.gouv.sn",
    category: "Institutionnel"
  },
  {
    id: "ucad",
    name: "Université Cheikh Anta Diop de Dakar",
    logo: "/Logo_ucad_2.png",
    description: "Formation médicale d'excellence et recherche en santé publique",
    website: "https://www.ucad.sn",
    category: "Éducation"
  },
  {
    id: "ugb",
    name: "Université Gaston Berger de Saint-Louis",
    logo: "/logo-ugb.jpg",
    description: "Partenaire académique pour la formation des professionnels de santé",
    website: "https://www.ugb.sn",
    category: "Éducation"
  },
  {
    id: "croix-rouge",
    name: "Croix-Rouge Sénégalaise",
    logo: "/logo-croix-rouge.jpg",
    description: "Collaboration humanitaire et actions d'urgence sanitaire",
    website: "https://www.croixrouge.sn",
    category: "Humanitaire"
  },
  {
    id: "fmpos",
    name: "Faculté de Médecine, Pharmacie et Odontologie",
    logo: "/logo-medecine.jpg",
    description: "Formation médicale spécialisée et recherche clinique",
    category: "Éducation"
  },
  {
    id: "aecds",
    name: "Association des Chirurgiens Dentistes du Sénégal",
    logo: "/AECDS.jpg",
    description: "Partenaire pour les soins dentaires et la formation odontologique",
    category: "Professionnel"
  }
];

const SponsorBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === sponsors.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [isHovered]);

  const nextSponsor = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === sponsors.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSponsor = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sponsors.length - 1 : prevIndex - 1
    );
  };

  const currentSponsor = sponsors[currentIndex];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 shadow-lg border-b border-orange-400">
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div 
            className="flex items-center justify-between py-1 md:py-1.5"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            
            {/* Sponsor Label */}
            <div className="flex items-center flex-shrink-0">
              <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/30 shadow-lg">
                <div className="flex items-center">
                  <Sparkles className="text-white mr-1 animate-pulse" size={10} />
                  <span className="text-white font-bold text-xs md:text-sm">
                    Sponsorisé
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content - Responsive */}
            <div className="flex-1 mx-3 md:mx-6 min-w-0">
              <div className="flex items-center justify-center">
                
                {/* Logo */}
                <div className="flex-shrink-0 mr-3 md:mr-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-lg shadow-lg p-0.5 md:p-1 transition-transform duration-300 hover:scale-110">
                    <img
                      src={currentSponsor.logo}
                      alt={currentSponsor.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Desktop Layout */}
                  <div className="hidden md:block">
                    <h3 className="text-white font-bold text-xs lg:text-sm mb-0.5 truncate">
                      {currentSponsor.name}
                    </h3>
                    <p className="text-white/90 text-xs leading-tight line-clamp-1">
                      {currentSponsor.description}
                    </p>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden">
                    <h3 className="text-white font-bold text-xs line-clamp-1">
                      {currentSponsor.name}
                    </h3>
                  </div>
                </div>

                {/* Visit Button */}
                {currentSponsor.website && (
                  <div className="flex-shrink-0 ml-3">
                    <a
                      href={currentSponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl"
                    >
                      <span className="hidden md:inline font-medium mr-1 text-xs">Visiter</span>
                      <ExternalLink size={10} className="transition-transform duration-300 group-hover:scale-110" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Navigation Arrows */}
              <button
                onClick={prevSponsor}
                className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110 border border-white/30 hover:border-white/50 shadow-lg"
                aria-label="Sponsor précédent"
              >
                <ChevronLeft size={10} />
              </button>
              
              <button
                onClick={nextSponsor}
                className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110 border border-white/30 hover:border-white/50 shadow-lg"
                aria-label="Sponsor suivant"
              >
                <ChevronRight size={10} />
              </button>

              {/* Pagination Dots */}
              <div className="hidden md:flex items-center space-x-1.5 ml-3">
                {sponsors.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex 
                        ? 'w-4 h-1 bg-white shadow-lg' 
                        : 'w-1 h-1 bg-white/60 hover:bg-white/80 hover:scale-125'
                    }`}
                    aria-label={`Aller au sponsor ${index + 1}`}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="hidden lg:block ml-3">
                <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/30">
                  <span className="text-white text-xs font-medium">
                    {currentIndex + 1} / {sponsors.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div 
            className="h-full bg-white/90 transition-all duration-300 ease-linear shadow-sm"
            style={{
              width: isHovered ? '100%' : `${((currentIndex + 1) / sponsors.length) * 100}%`
            }}
          />
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default SponsorBanner;