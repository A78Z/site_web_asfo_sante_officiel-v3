import React from 'react';
import SectionTitle from '../common/SectionTitle';
import Button from '../common/Button';
import { ChevronRight, Calendar, MapPin, Activity, Stethoscope, Baby, Heart, TrendingUp, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

// Counter Component for animated statistics
const StatCounter: React.FC<{ value: number; suffix?: string; label: string; color: string }> = ({ 
  value, 
  suffix = "", 
  label, 
  color 
}) => {
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
    <div 
      ref={ref}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
    >
      {/* Animated counter */}
      <div className={`text-3xl font-bold ${color} mb-1 tabular-nums`}>
        {inView ? count.toLocaleString() : 0}{suffix}
      </div>
      <p className="text-gray-600 text-sm font-medium mb-3">
        {label}
      </p>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <div 
          className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-2000 ease-out`}
          style={{ 
            width: inView ? '100%' : '0%',
            transitionDelay: '500ms'
          }}
        ></div>
      </div>
    </div>
  );
};

const LatestMission: React.FC = () => {
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [imageRef, imageInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-white via-teal-50/30 to-blue-50/20 relative overflow-hidden">
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
          className={`text-center mb-12 md:mb-16 transition-all duration-1000 transform ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Floating Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6 transform hover:scale-105 transition-transform duration-300">
            <Activity className="text-teal-600 mr-3 animate-pulse" size={20} />
            <span className="text-teal-700 font-semibold text-sm">Mission Récente</span>
          </div>

          {/* Main Title with Gradient */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6 leading-tight">
            Notre Dernière Mission
          </h2>
          
          {/* Subtitle with Enhanced Typography */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Découvrez notre mission la plus récente et son impact dans les communautés locales
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center mt-6">
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
            <div className="w-3 h-3 bg-teal-400 rounded-full mx-4 animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column - Image and Stats */}
          <div 
            ref={imageRef}
            className={`transition-all duration-1000 transform ${
              imageInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {/* Image Section */}
            <div className="relative group mb-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="/last-mission.webp" 
                  alt="Bénévoles médicaux au Sénégal" 
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                
                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                        <Heart className="text-white" size={16} />
                      </div>
                      <div>
                        <div className="text-teal-600 font-bold text-base">ASFO 2024</div>
                        <div className="text-gray-600 text-xs">Mission Humanitaire</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <Sparkles size={24} className="text-white/60 animate-pulse" />
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-400/20 to-blue-400/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Statistics Grid - Left Side */}
            <div className="grid grid-cols-2 gap-4">
              <StatCounter 
                value={419} 
                label="Circoncisions" 
                color="text-green-600"
              />
              <StatCounter 
                value={5} 
                label="Accouchements" 
                color="text-pink-600"
              />
            </div>

            {/* CTA Button - Left Side */}
            <div className="mt-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <Button 
                  variant="primary" 
                  to="/archives"
                  className="relative bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl shadow-xl hover:shadow-teal-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-0 w-full justify-center"
                  icon={<ChevronRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />}
                >
                  Voir plus de détails
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Content and Main Stats */}
          <div 
            ref={contentRef}
            className={`transition-all duration-1000 transform ${
              contentInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {/* Mission title */}
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              Mission menée dans six villages du département de Podor - Septembre 2024
            </h3>

            {/* Mission details with enhanced icons */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                  <Calendar size={18} className="text-blue-600" />
                </div>
                <span className="text-lg text-gray-700 font-medium">Du 5 au 11 septembre 2024</span>
              </div>
              
              <div className="flex items-start group">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-200 transition-colors duration-300">
                  <MapPin size={18} className="text-green-600" />
                </div>
                <span className="text-lg text-gray-700 font-medium leading-relaxed">
                  Guédé Village - Village Diattar - Village Tatqui - Village Madina Ndiathbé - Village Diaba - Village Bodé Lao
                </span>
              </div>
            </div>

            {/* Enhanced description */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 mb-6 border border-teal-100">
              <p className="text-lg text-gray-700 leading-relaxed">
                Du 5 au 11 septembre 2024, l'ASFO a mené une campagne médicale dans 6 villages du département de Podor sur le thème : 
                <strong className="text-teal-700"> « Santé mentale : état des lieux, défis et perspectives »</strong>. 
                105 professionnels mobilisés, 9083 consultations, 419 circoncisions, 5 accouchements, soins dentaires, échographies, ECG, formations, dépistages, et unités mobiles (PNT, MSAS, SAMU) ont permis une prise en charge multidisciplinaire et communautaire.
              </p>
            </div>

            {/* Main Statistics Grid - Right Side */}
            <div className="grid grid-cols-2 gap-4">
              <StatCounter 
                value={9083} 
                label="Consultations" 
                color="text-teal-600"
              />
              <StatCounter 
                value={105} 
                label="Professionnels" 
                color="text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-teal-100">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                <TrendingUp className="text-white" size={18} />
              </div>
              <div className="text-left">
                <p className="text-gray-800 font-semibold">
                  Impact mesurable et durable
                </p>
                <p className="text-gray-600 text-sm">
                  Chaque mission transforme des vies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestMission;