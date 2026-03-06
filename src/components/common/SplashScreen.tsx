import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showBody, setShowBody] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timeline = async () => {
      // 1. Afficher le logo et gradient (300ms)
      setTimeout(() => setShowLogo(true), 300);

      // 2. Afficher le titre après le logo (800ms)
      setTimeout(() => setShowTitle(true), 800);

      // 3. Afficher le sous-titre après le titre (1200ms)
      setTimeout(() => setShowSubtitle(true), 1200);

      // 4. Afficher la description et le bouton (1600ms)
      setTimeout(() => setShowBody(true), 1600);

      // 5. Fermer le splash screen après 4 secondes
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 700); // Wait for fade-out animation
      }, 4000);
    };

    timeline();
  }, [onComplete]);

  return (
    <section className={`fixed inset-0 z-50 py-24 md:py-32 text-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen flex items-center justify-center transition-all duration-700 ${isExiting ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}>
      {/* Pattern subtil on background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 w-full mt-[-4rem]">

        {/* Logo ASFO avec effet lumineux */}
        <div className={`mb-10 transition-all duration-1000 transform ${showLogo ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}>
          <div className="relative inline-block">
            {/* Effet lumineux derrière le logo */}
            <div className="absolute inset-0 bg-teal-400/30 rounded-full blur-3xl scale-[1.8] animate-pulse"></div>

            <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto bg-white rounded-full shadow-2xl p-3 border-4 border-teal-100/30">
              <img
                src="/logo.png"
                alt="ASFO Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Titre Principal */}
        <h1 className={`text-4xl md:text-6xl font-bold mb-6 tracking-tight transition-all duration-700 transform ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
          APPEL À CANDIDATURE
        </h1>

        {/* Sous-titre */}
        <h2 className={`text-2xl md:text-3xl text-teal-400 font-medium mb-6 transition-all duration-700 delay-100 transform ${showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
          Grande Campagne Médicale ASFO 2026
        </h2>

        {/* Description et informations (regroupées) */}
        <div className={`transition-all duration-1000 delay-200 transform ${showBody ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
          <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed max-w-3xl mx-auto text-slate-200">
            Dans le cadre de l’organisation de la 27ᵉ édition de la Grande Campagne Médicale de l’ASFO,
            les villages du département de Podor sont invités à soumettre leur candidature afin
            d’accueillir cette mission médicale et humanitaire.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-10 text-lg font-medium text-slate-100">
            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm border border-white/5">
              📅 Dépôt des dossiers : du 05 mars au 05 avril 2026
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm border border-white/5">
              📍 Département de Podor
            </span>
          </div>

          <a
            href="/candidature"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-xl shadow-teal-900/40 hover:scale-105 hover:shadow-teal-900/60 transition-all duration-300"
          >
            <span className="text-xl">🚑</span>
            Déposer une candidature
          </a>
        </div>

      </div>
    </section>
  );
};

export default SplashScreen;