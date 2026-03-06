import React from 'react';

const SponsorBanner: React.FC = () => {
  return (
    <div className="relative z-[60] w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white py-2 overflow-hidden border-b border-orange-400/60">
      <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
        <span className="flex items-center font-bold text-[11px] uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
          📢 ANNONCE OFFICIELLE
        </span>

        <span className="font-bold text-sm md:text-base tracking-wide">
          APPEL À CANDIDATURE – GRANDE CAMPAGNE MÉDICALE ASFO 2026
        </span>

        <span className="text-sm md:text-base font-medium opacity-90">
          Dans le cadre de l’organisation de la 27ᵉ édition de la Grande Campagne Médicale de l’ASFO, les villages du département de Podor sont invités à soumettre leur candidature afin d’accueillir cette mission médicale et humanitaire.
        </span>
      </div>
    </div>
  );
};

export default SponsorBanner;
