import React from 'react';
import Button from '../common/Button';
import { Heart, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const JoinCTA: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 md:py-24 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative circles */}
        <div className="absolute w-96 h-96 bg-teal-400/20 rounded-full -top-48 -left-48 opacity-60 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-teal-300/15 rounded-full bottom-0 right-0 translate-x-1/2 translate-y-1/2 opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-64 h-64 bg-white/10 rounded-full top-1/2 right-1/4 opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/15 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        
        {/* Floating sparkles */}
        <div className="absolute top-1/4 left-1/3 opacity-30">
          <Sparkles size={24} className="text-white animate-pulse" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 opacity-20">
          <Sparkles size={32} className="text-white animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={ref}
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Enhanced floating badge */}
          <div 
            className={`inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8 border border-white/30 shadow-lg transition-all duration-1000 transform hover:scale-105 hover:bg-white/30 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{ animationDelay: '200ms' }}
          >
            <Heart className="mr-2 text-red-300 animate-pulse" size={16} />
            <span>💝 Rejoignez notre mouvement humanitaire</span>
          </div>
          
          {/* Enhanced main title */}
          <h2 
            className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight transition-all duration-1000 transform ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ animationDelay: '400ms' }}
          >
            Vous souhaitez faire une différence dans la vie des personnes vulnérables?
          </h2>
          
          {/* Enhanced subtitle */}
          <p 
            className={`text-lg md:text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto transition-all duration-1000 transform ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ animationDelay: '600ms' }}
          >
            ASFO recrute constamment des bénévoles passionnés pour nos missions humanitaires. 
            Que vous soyez professionnel de santé ou simplement motivé à aider, vous avez votre place parmi nous.
          </p>
          
          {/* Enhanced buttons */}
          <div 
            className={`flex flex-col sm:flex-row justify-center gap-6 transition-all duration-1000 transform ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ animationDelay: '800ms' }}
          >
            {/* Primary button with enhanced effects */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <Button 
                variant="accent" 
                size="large" 
                to="/join" 
                className="relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-0"
                icon={<Users size={20} className="transition-transform duration-300 group-hover:rotate-12" />}
              >
                Devenir bénévole
              </Button>
            </div>
            
            {/* Secondary button with enhanced effects */}
            <div className="relative group">
              <Button 
                variant="outline" 
                size="large" 
                to="/donate"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 rounded-2xl py-4 px-8 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                icon={<Heart size={20} className="transition-transform duration-300 group-hover:scale-110" />}
              >
                Faire un don
                <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={18} />
              </Button>
            </div>
          </div>

          {/* Additional engagement text */}
          <div 
            className={`mt-12 transition-all duration-1000 transform ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ animationDelay: '1000ms' }}
          >
            <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
              ✨ Rejoignez plus de <strong className="text-white">600 bénévoles</strong> qui transforment des vies chaque jour
            </p>
          </div>

          {/* Floating action indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 opacity-60">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinCTA;