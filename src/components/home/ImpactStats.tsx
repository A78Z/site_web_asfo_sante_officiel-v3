import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Users, Calendar, Heart, MapPin, TrendingUp } from 'lucide-react';

interface StatProps {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
  icon: React.ReactNode;
}

const StatCounter: React.FC<StatProps> = ({ 
  value, 
  label, 
  suffix = "", 
  duration = 2000,
  icon
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    
    if (!inView) return;
    
    // Get animation duration based on value size
    const totalDuration = duration;
    const incrementTime = totalDuration / end;

    const timer = setInterval(() => {
      start += Math.ceil(end / 100);
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, incrementTime);

    return () => {
      clearInterval(timer);
    };
  }, [inView, value, duration]);

  return (
    <div 
      ref={ref} 
      className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 text-center relative group"
    >
      {/* Background gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
      
      {/* Decorative corner element */}
      <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-teal-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Icon with animation */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center text-teal-600 shadow-md group-hover:scale-110 transition-transform duration-500 relative">
        <div className="absolute inset-0 rounded-full bg-teal-200/20 scale-0 group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100"></div>
        {icon}
      </div>
      
      {/* Counter with larger text */}
      <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent mb-3 flex items-center justify-center">
        <span className="tabular-nums">{inView ? count : 0}</span>
        <span>{suffix}</span>
      </div>
      
      {/* Label with improved typography */}
      <div className="text-gray-700 font-semibold text-lg">{label}</div>
      
      {/* Animated progress bar */}
      <div className="w-full bg-gray-100 h-1 mt-4 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-1000 ease-out"
          style={{ width: inView ? '100%' : '0%' }}
        ></div>
      </div>
    </div>
  );
};

const ImpactStats: React.FC = () => {
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-24 bg-gradient-to-br from-white via-teal-50/20 to-blue-50/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`max-w-4xl mx-auto text-center mb-20 transition-all duration-1000 transform ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Floating Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6 transform hover:scale-105 transition-transform duration-300">
            <TrendingUp className="text-teal-600 mr-3 animate-pulse" size={20} />
            <span className="text-teal-700 font-semibold">Notre Impact</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6 leading-tight">
            Notre Impact au Sénégal
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Depuis notre création, ASFO a touché la vie de milliers de personnes à travers le Sénégal 
            grâce aux efforts de nos bénévoles dévoués.
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
            <div className="w-3 h-3 bg-teal-400 rounded-full mx-4 animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <StatCounter 
            value={250}
            label="Patients consultés" 
            suffix="+" 
            icon={<Heart size={32} />}
          />
          <StatCounter 
            value={25} 
            label="Années d'expérience" 
            icon={<Calendar size={32} />}
          />
          <StatCounter 
            value={600} 
            label="Acteurs" 
            suffix="+" 
            icon={<Users size={32} />}
          />
          <StatCounter 
            value={192} 
            label="Localités Sillonnées"
             suffix="+" 
            icon={<MapPin size={32} />}
          />
        </div>
        
        {/* Bottom decorative element */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                <Heart className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="text-gray-800 font-semibold text-lg">
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

export default ImpactStats;