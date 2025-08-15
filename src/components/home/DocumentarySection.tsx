import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Play, ExternalLink, Film, Sparkles, TrendingUp } from 'lucide-react';

const DocumentarySection: React.FC = () => {
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [videoRef, videoInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/20 relative overflow-hidden">
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
            <Film className="text-teal-600 mr-3 animate-pulse" size={20} />
            <span className="text-teal-700 font-semibold">Notre Histoire en Images</span>
          </div>

          {/* Main Title with Gradient */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6 leading-tight">
            Documentaire ASFO
          </h2>
          
          {/* Subtitle with Enhanced Typography */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Découvrez notre mission humanitaire à travers ce documentaire qui retrace notre engagement pour la santé communautaire au Sénégal
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
            <div className="w-3 h-3 bg-teal-400 rounded-full mx-4 animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
          </div>
        </div>
        
        {/* Video Container */}
        <div 
          ref={videoRef}
          className={`max-w-5xl mx-auto transition-all duration-1000 transform ${
            videoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Video wrapper */}
            <div className="relative bg-white rounded-2xl p-4 shadow-xl border border-gray-100 overflow-hidden">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/TjVqSYDwYcg?rel=0" 
                  title="Documentaire ASFO" 
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
              
              {/* Video caption */}
              <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl">
                <p className="text-gray-700 text-center">
                  <span className="font-medium">ASFO, Au Service du FOUTA</span> - Suivez notre équipe médicale lors de nos missions humanitaires au Fouta
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom decorative element */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="text-gray-800 font-semibold text-lg">
                  Notre histoire en images
                </p>
                <p className="text-gray-600 text-sm">
                  Découvrez l'impact de nos actions sur le terrain
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentarySection;