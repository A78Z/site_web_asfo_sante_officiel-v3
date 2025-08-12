import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import SectionTitle from '../common/SectionTitle';
import { Calendar, MapPin, Users, TrendingUp, Sparkles, Eye } from 'lucide-react';

interface ActivityCardProps {
  image: string;
  title: string;
  description: string;
  year: string;
  category: string;
  stats?: {
    value: number;
    label: string;
  };
  index: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  image, 
  title, 
  description, 
  year,
  category,
  stats,
  index
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      ref={ref}
      className={`group relative overflow-hidden rounded-3xl transition-all duration-700 transform hover:scale-105 hover:rotate-1 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ 
        animationDelay: `${index * 150}ms`,
        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)'
      }}
    >
      {/* Image Container with Advanced Hover Effects */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Loading Shimmer Effect */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="px-4 py-2 bg-white/90 backdrop-blur-sm text-teal-600 text-sm font-bold rounded-full shadow-lg border border-teal-100 transform group-hover:scale-110 transition-transform duration-300">
            <Calendar size={14} className="inline mr-2" />
            {year}
          </div>
          <div className="px-4 py-2 bg-teal-500/90 backdrop-blur-sm text-white text-sm font-medium rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            {category}
          </div>
        </div>

        {/* Hover Content Overlay */}
        <div className="absolute inset-0 flex items-end p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="w-full">
            {/* Title with Animation */}
            <h3 className="text-2xl font-bold text-white mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
              {title}
            </h3>
            
            {/* Description with Stagger Animation */}
            <p className="text-white/90 text-sm leading-relaxed mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200 line-clamp-3">
              {description}
            </p>
            
            {/* Stats Card */}
            {stats && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white flex items-center">
                      <TrendingUp size={24} className="mr-2 text-teal-300" />
                      {stats.value.toLocaleString()}+
                    </div>
                    <div className="text-white/80 text-sm font-medium">{stats.label}</div>
                  </div>
                  <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
                    <Eye size={20} className="text-teal-300" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
          <Sparkles size={24} className="text-white/60 animate-pulse" />
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

// Counter Component for Stats
const StatCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = "+" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    
    let start = 0;
    const end = value;
    const duration = 2000;
    const incrementTime = duration / end;

    const timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {inView ? count.toLocaleString() : 0}{suffix}
    </span>
  );
};

const Activities: React.FC = () => {
  const activities = [
    {
      image: "/bilan.webp",
      title: "Consultations médicales",
      description: "Consultations générales et spécialisées pour les populations défavorisées du Sénégal, offrant un accès gratuit aux soins de santé dans les zones les plus reculées.",
      year: "2024",
      category: "Consultation",
      stats: {
        value: 9083,
        label: "personnes consultées"
      }
    },
    {
      image: "/slide2.webp",
      title: "Formation aux premiers secours",
      description: "Formation continue pour les professionnels de santé locaux et les enseignants, renforçant les capacités d'intervention d'urgence dans les communautés.",
      year: "2024",
      category: "Formation",
      stats: {
        value: 500,
        label: "personnes formées"
      }
    },
    {
      image: "/slide3.webp",
      title: "Sensibilisation santé publique",
      description: "Campagnes d'éducation et de prévention sur des problèmes de santé publique importants, touchant directement les communautés locales.",
      year: "2024",
      category: "Sensibilisation",
      stats: {
        value: 2000,
        label: "personnes sensibilisées"
      }
    },
    {
      image: "/slide-4.webp",
      title: "Distribution de médicaments",
      description: "Distribution gratuite de médicaments essentiels aux populations vulnérables des localités d'Oréfondé, Ndiafane, Diorbiwol, Agnam, Asndéballa et Doumga Ouro Alpha.",
      year: "2024",
      category: "Distribution",
      stats: {
        value: 6000000,
        label: "Valeur des Médicaments (FCFA)"
      }
    }
  ];

  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Section Title */}
        <div 
          ref={titleRef}
          className={`text-center mb-20 transition-all duration-1000 transform ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Floating Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-8 transform hover:scale-105 transition-transform duration-300">
            <Sparkles className="text-teal-600 mr-3 animate-pulse" size={20} />
            <span className="text-teal-700 font-semibold">Nos Actions Humanitaires</span>
          </div>

          {/* Main Title with Gradient */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-8 leading-tight">
            Nos Activités en Images
          </h2>
          
          {/* Subtitle with Enhanced Typography */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Revivez en images nos plus belles actions solidaires depuis 2000, témoignant de notre engagement constant auprès des populations.
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center mt-10">
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
            <div className="w-3 h-3 bg-teal-400 rounded-full mx-4 animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
          </div>
        </div>
        
        {/* Activities Grid with Stagger Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {activities.map((activity, index) => (
            <ActivityCard
              key={index}
              {...activity}
              index={index}
            />
          ))}
        </div>

        {/* Enhanced Stats Section */}
        <div 
          ref={statsRef}
          className={`text-center transition-all duration-1000 transform ${
            statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative inline-block">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-blue-400/20 blur-xl rounded-full"></div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;