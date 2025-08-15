import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { ChevronRight, Heart, Archive, ChevronDown, Users, Stethoscope } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttons: {
    primary: { text: string; to: string; icon: React.ReactNode };
    secondary?: { text: string; to: string; icon: React.ReactNode };
  };
  theme: 'teal' | 'teal-light' | 'teal-dark';
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Soigner avec le cœur,",
    subtitle: "Former pour demain",
    description: "Depuis 2000, l'Action Sanitaire pour le Fouta (ASFO) mobilise des professionnels de santé et des bénévoles pour offrir des soins gratuits, des consultations spécialisées et des actions de sensibilisation au bénéfice des populations les plus vulnérables du Fouta.",
    image: "/slide1.webp",
    buttons: {
      primary: { text: "Nos Rapports", to: "/services", icon: <Archive size={20} /> },
      secondary: { text: "Faire un don", to: "/donate", icon: <Heart size={20} /> },
    },
    theme: 'teal'
  },
  {
    id: 2,
    title: "Votre satisfaction,",
    subtitle: "Notre crédo",
    description: "Depuis sa création, l'ASFO a permis à des milliers de patients d'accéder à des soins gratuits dans les zones les plus reculées du Fouta. À travers ses campagnes médicales et actions de sensibilisation, elle incarne une jeunesse engagée qui soigne, forme et transforme durablement des vies.",
    image: "/slide-2.webp",
    buttons: {
      primary: { text: "Voir les archives", to: "/archives", icon: <Archive size={20} /> },
      secondary: { text: "Notre équipe", to: "/notre-equipe-medicale", icon: <Stethoscope size={20} /> },
    },
    theme: 'teal-light'
  },
  {
    id: 3,
    title: "Ensemble, pour un avenir",
    subtitle: "Plus sain et plus solidaire",
    description: "Votre engagement peut réellement changer des vies. Rejoignez notre mission humanitaire en vous impliquant comme membre, partenaire ou volontaire. Chaque geste compte. Chaque soutien fait la différence.",
    image: "/slide-3.webp",
    buttons: {
      primary: { text: "S'engager", to: "/join", icon: <Users size={20} /> },
      secondary: { text: "Nous contacter", to: "/contact", icon: <ChevronRight size={20} /> },
    },
    theme: 'teal-dark'
  },
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 800);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 800);
  };

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'teal':
        return {
          gradient: 'from-teal-900/90 via-teal-800/80 to-teal-700/70',
          accent: 'text-teal-200',
          primary: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
          secondary: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
        };
      case 'teal-light':
        return {
          gradient: 'from-teal-800/85 via-teal-700/75 to-teal-600/65',
          accent: 'text-teal-100',
          primary: 'from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600',
          secondary: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
        };
      case 'teal-dark':
        return {
          gradient: 'from-teal-950/95 via-teal-900/85 to-teal-800/75',
          accent: 'text-teal-300',
          primary: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
          secondary: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
        };
      default:
        return {
          gradient: 'from-teal-900/90 via-teal-800/80 to-teal-700/70',
          accent: 'text-teal-200',
          primary: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
          secondary: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
        };
    }
  };

  const currentTheme = getThemeColors(slides[currentSlide].theme);

  return (
    <div 
      className="relative min-h-screen flex items-center overflow-hidden -mt-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images avec affichage optimisé */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 z-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {/* Container d'image optimisé */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={`ASFO slide ${slide.id}`}
              className="w-full h-full object-cover transition-transform duration-[12s] ease-out"
              style={{
                objectFit: 'cover',
                objectPosition: 'center 40%', // Ajustement pour éviter le recadrage excessif
                minHeight: '100vh',
                transform: 'scale(1.05)' // Léger zoom pour éviter les bords blancs
              }}
            />
          </div>
          
          {/* Dégradé thématique selon la charte ASFO */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} transition-all duration-1000`}></div>
          
          {/* Pattern subtil aux couleurs ASFO */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.3'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
          </div>
          
          {/* Particules flottantes aux couleurs ASFO */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-teal-300/40 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
            <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-red-300/30 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
            <div className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 bg-teal-200/35 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-teal-400/25 rounded-full animate-ping" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
          </div>
        </div>
      ))}

      {/* Container de contenu avec espacement optimisé */}
      <div className="container mx-auto px-8 lg:px-12 z-10 pt-16 md:pt-20 lg:pt-24">
        <div className="max-w-5xl">
          
          {/* Badge amélioré aux couleurs ASFO */}
          <div className={`inline-flex items-center px-8 py-4 bg-white/15 backdrop-blur-lg rounded-full text-white text-base font-medium mb-10 border border-white/25 shadow-2xl transition-all duration-1000 transform hover:scale-105 hover:bg-white/25 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
          }`}>
            
          
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          </div>

          {/* Contenu avec transitions fluides */}
          <div className={`transition-all duration-800 ease-in-out transform ${
            isTransitioning ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'
          }`}>
            
            {/* Hiérarchie typographique claire */}
            <div className="mb-12">
              <h1 className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-6 transition-all duration-1000 transform ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                {slides[currentSlide].title}
                <br />
                <span className={`${currentTheme.accent} bg-gradient-to-r from-current via-white to-current bg-clip-text text-transparent`}>
                  {slides[currentSlide].subtitle}
                </span>
              </h1>
            </div>

            {/* Description avec espacement généreux */}
            <div className={`mb-16 transition-all duration-1000 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '400ms' }}>
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl max-w-4xl">
                <p className="text-xl md:text-2xl lg:text-3xl text-white/95 leading-relaxed font-light">
                  {slides[currentSlide].description}
                </p>
              </div>
            </div>

            {/* Boutons modernisés avec espacement optimal */}
            <div className={`flex flex-col sm:flex-row gap-8 transition-all duration-1000 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '600ms' }}>
              
              {/* Bouton principal */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/30 to-white/40 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <Button
                  variant="primary"
                  size="large"
                  to={slides[currentSlide].buttons.primary.to}
                  className={`relative bg-gradient-to-r ${currentTheme.primary} text-white font-bold py-5 px-10 rounded-3xl shadow-2xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-400 border-0 min-w-[220px] justify-center text-lg`}
                  icon={slides[currentSlide].buttons.primary.icon}
                >
                  {slides[currentSlide].buttons.primary.text}
                </Button>
              </div>

              {/* Bouton secondaire */}
              {slides[currentSlide].buttons.secondary && (
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="large"
                    to={slides[currentSlide].buttons.secondary.to}
                    className={`bg-white/15 backdrop-blur-lg text-white border-3 border-white/40 hover:bg-white/25 hover:border-white/60 rounded-3xl py-5 px-10 font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-400 min-w-[220px] justify-center text-lg`}
                    icon={slides[currentSlide].buttons.secondary.icon}
                  >
                    {slides[currentSlide].buttons.secondary.text}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll amélioré */}
      <div className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>
        <div 
          className="relative group cursor-pointer" 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          {/* Ligne animée */}
          <div className="h-24 w-1 bg-gradient-to-b from-white/70 via-white/50 to-transparent mb-6 relative overflow-hidden rounded-full">
            <div className="absolute top-0 left-0 w-full h-8 bg-white/90 animate-pulse rounded-full"></div>
          </div>
          
          {/* Texte et flèche */}
          <div className="flex flex-col items-center group-hover:scale-110 transition-all duration-300">
            <span className="text-base font-semibold mb-4 group-hover:text-teal-200 transition-colors duration-300 tracking-wide">
              Découvrir
            </span>
            <div className="relative">
              <ChevronDown size={28} className="animate-bounce group-hover:text-teal-200 transition-colors duration-300" />
              <div className="absolute inset-0 rounded-full bg-white/30 scale-0 group-hover:scale-150 transition-transform duration-500 blur-md"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicateurs de slides modernisés */}
      <div className="absolute bottom-16 right-10 flex flex-col space-y-3 z-20">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative group transition-all duration-500 ${
              index === currentSlide 
                ? 'w-3 h-10 bg-white shadow-xl scale-110' 
                : 'w-2 h-6 bg-white/60 hover:bg-white/80 hover:scale-105'
            } rounded-full`}
            aria-label={`Aller au slide ${index + 1}`}
          >
            {/* Indicateur actif avec glow */}
            {index === currentSlide && (
              <div className="absolute inset-0 rounded-full bg-teal-400/40 blur-md animate-pulse"></div>
            )}
            
            {/* Numéro de slide au hover */}
            <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                Slide {index + 1}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Barre de progression aux couleurs ASFO */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30 z-20">
        <div 
          className="h-full bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-300 ease-linear shadow-lg"
          style={{
            width: isPaused ? '100%' : `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>

    </div>
  );
};

export default Hero;