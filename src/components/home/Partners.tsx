import React, { useState } from 'react';
import SectionTitle from '../common/SectionTitle';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Building2 } from 'lucide-react';

const partners = [
  {
    name: "Université Cheikh Anta Diop de Dakar",
    logo: "/Logo_ucad_2.png",
    category: "UCAD"
  },
  {
    name: "Ministère de la Santé et de l'Action Sociale",
    logo: "/msascoro.jpg",
    category: "MSAS"
  },
  {
    name: "Université Gaston Berger de Saint-Louis",
    logo: "/logo-ugb.jpg",
    category: "UGB"
  },
  {
    name: "FMPOS - Faculté de médecine, de pharmacie et d'odontologie",
    logo: "/logo-medecine.jpg",
    category: "FMPOS"
  },
  {
    name: "sen-pharmacie nationale d'approvisionnement du senegal",
    logo: "/SENPNA.jpeg",
    category: "SEN PNA"
  },
  {
    name: "Ligue sénégalaise contre le cancer",
    logo: "/ligue_senegalaise.jpeg",
    category: "LISCA"
  },
  {
    name: "SENE ASSO",
    logo: "/sene-asso.jpg",
    category: "SENE ASSO"
  },
  {
    name: "Université Iba Der Thiam de Thiès",
    logo: "/logo-thies.jpg",
    category: "THIES"
  },
  {
    name: "Axiomtext.com",
    logo: "/axiomlogo.webp",
    category: "AXIOMTEXT"
  },
  {
    name: "FIDE",
    logo: "/Logo-fide.jpg",
    category: "FIDE"
  }
];

const Partners: React.FC = () => {
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [partnersRef, partnersInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });


  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Section Title */}
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 transform ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Floating Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6 transform hover:scale-105 transition-transform duration-300">
            <Building2 className="text-teal-600 mr-3 animate-pulse" size={20} />
            <span className="text-teal-700 font-semibold">Nos Collaborations</span>
          </div>

          {/* Main Title with Gradient */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6 leading-tight">
            Nos Partenaires & Réseaux
          </h2>
          
          {/* Subtitle with Enhanced Typography */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Depuis sa création, ASFO collabore avec de nombreux partenaires engagés dans la promotion de la santé, l'action humanitaire et l'encadrement étudiant.
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
            <div className="w-3 h-3 bg-teal-400 rounded-full mx-4 animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
          </div>
        </div>
        
        {/* Partners Grid - Optimized */}
        <div 
          ref={partnersRef}
          className={`relative overflow-hidden mb-16 transition-all duration-1000 transform ${
            partnersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Gradient overlays for infinite scroll effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 via-teal-50/30 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 via-teal-50/30 to-transparent z-10"></div>

          {/* Enhanced Partners Grid */}
          <div className="flex space-x-6 animate-[scroll_35s_linear_infinite] hover:pause">
            {[...partners, ...partners].map((partner, index) => (
              <div 
                key={index}
                className="flex-none w-56 h-56 relative group"
              >
                <div className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:-translate-y-2">
                  {/* Background with subtle gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Logo container with better sizing */}
                  <div className="relative h-full flex items-center justify-center p-6">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-105 filter group-hover:brightness-110"
                      style={{ 
                        width: 'auto', 
                        height: 'auto',
                        maxWidth: '140px',
                        maxHeight: '140px'
                      }}
                    />
                  </div>
                  
                  {/* Hover overlay with partner info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                          {partner.name}
                        </h3>
                        <span className="inline-block bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full font-medium">
                          {partner.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative corner sparkle */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    <Sparkles size={16} className="text-teal-500 animate-pulse" />
                  </div>

                  {/* Bottom glow effect */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default Partners;