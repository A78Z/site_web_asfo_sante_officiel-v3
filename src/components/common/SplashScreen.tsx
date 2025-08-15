import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const fullTitle = "26e Édition de la Grande Caravane Médicale";

  useEffect(() => {
    const timeline = async () => {
      // 1. Afficher le logo avec fondu (500ms)
      setTimeout(() => setShowLogo(true), 300);

      // 2. Commencer l'effet machine à écrire après 1.2s
      setTimeout(() => {
        setShowTitle(true);
        let currentIndex = 0;
        
        const typeWriter = () => {
          if (currentIndex < fullTitle.length) {
            setTitleText(fullTitle.slice(0, currentIndex + 1));
            currentIndex++;
            setTimeout(typeWriter, 80); // Vitesse de frappe
          } else {
            // 3. Afficher le sous-titre après la fin de la frappe
            setTimeout(() => setShowSubtitle(true), 500);
            
            // 4. Commencer la sortie après 1.5s supplémentaires
            setTimeout(() => {
              setIsExiting(true);
              // 5. Appeler onComplete après l'animation de sortie
              setTimeout(onComplete, 800);
            }, 1500);
          }
        };
        
        typeWriter();
      }, 1200);
    };

    timeline();
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-800 ${
      isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
    }`}>
      {/* Background avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        {/* Pattern subtil */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>
        
        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400/30 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
          <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-teal-300/20 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
          <div className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 bg-teal-200/25 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-teal-400/20 rounded-full animate-ping" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        
        {/* Logo ASFO avec animation de fondu */}
        <div className={`mb-12 transition-all duration-1000 transform ${
          showLogo ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}>
          <div className="relative inline-block">
            {/* Effet de glow autour du logo */}
            <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-2xl scale-150 animate-pulse"></div>
            
            {/* Logo */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto bg-white rounded-full shadow-2xl p-4 border-4 border-teal-100">
              <img 
                src="/logo.png" 
                alt="ASFO Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Titre avec effet machine à écrire */}
        <div className={`mb-8 transition-all duration-500 ${
          showTitle ? 'opacity-100' : 'opacity-0'
        }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400 bg-clip-text text-transparent">
              {titleText}
            </span>
            {/* Curseur clignotant */}
            {showTitle && titleText.length < fullTitle.length && (
              <span className="inline-block w-1 h-8 md:h-10 lg:h-12 bg-teal-400 ml-1 animate-pulse"></span>
            )}
          </h1>
        </div>

        {/* Sous-titre avec fondu vers le haut */}
        <div className={`transition-all duration-800 transform ${
          showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <div className="relative">
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 animate-shimmer"></div>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light">
              <span className="bg-gradient-to-r from-white via-teal-100 to-white bg-clip-text text-transparent">
                Région de Matam
              </span>
            </p>
          </div>
          
          {/* Ligne décorative */}
          <div className="flex items-center justify-center mt-6">
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full mx-4 animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
          </div>
        </div>

        {/* Indicateur de chargement subtil */}
        <div className={`mt-12 transition-all duration-500 ${
          showSubtitle ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-teal-400/60 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-teal-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-teal-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;