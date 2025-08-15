import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Heart, Users, GraduationCap, Target, Sparkles, ArrowRight } from 'lucide-react';

interface ObjectiveCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  delay: number;
}

const ObjectiveCard: React.FC<ObjectiveCardProps> = ({ 
  icon, 
  title, 
  description, 
  gradient, 
  iconBg, 
  delay 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div 
      ref={ref}
      className={`group relative transition-all duration-700 transform ${
        inView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Background Card */}
      <div className={`relative h-full bg-gradient-to-br ${gradient} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 backdrop-blur-sm`}>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <Sparkles size={32} className="text-white" />
        </div>
        
        {/* Icon Container */}
        <div className={`relative w-20 h-20 ${iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <div className="text-white">
            {icon}
          </div>
          
          {/* Icon Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-100 transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-white/90 leading-relaxed text-lg group-hover:text-white transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <ArrowRight size={24} className="text-white/80" />
        </div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 rounded-3xl opacity-5 group-hover:opacity-10 transition-opacity duration-300"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
             }}>
        </div>
      </div>
    </div>
  );
};

const ModernObjectives: React.FC = () => {
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const objectives = [
    {
      icon: <Heart size={32} />,
      title: "Santé pour tous",
      description: "Améliorer l'accès aux soins des populations d'une manière générale, en particulier celle de la couche la plus vulnérable en accentuant les efforts dans les villages les plus reculés et les plus enclavés.",
      gradient: "from-teal-500 via-teal-600 to-teal-700",
      iconBg: "bg-gradient-to-br from-teal-600 to-teal-700",
      delay: 0
    },
    {
      icon: <Users size={32} />,
      title: "Participation communautaire", 
      description: "Renforcer les connaissances des populations sur la prévention des maladies et sur les autres problèmes de santé par le biais de la sensibilisation.",
      gradient: "from-teal-400 via-teal-500 to-teal-600",
      iconBg: "bg-gradient-to-br from-teal-500 to-teal-600",
      delay: 200
    },
    {
      icon: <GraduationCap size={32} />,
      title: "Formation continue",
      description: "Renforcer la compétence des membres et sympathisants de la structure par le biais de la formation théorique et la pratique.",
      gradient: "from-teal-600 via-teal-700 to-teal-800",
      iconBg: "bg-gradient-to-br from-teal-700 to-teal-800",
      delay: 400
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-teal-50/30 to-gray-50 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-300/10 to-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/5 to-teal-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 transform ${
            titleInView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6">
            <Target className="text-teal-600 mr-3" size={24} />
            <span className="text-teal-700 font-semibold text-lg">Nos Objectifs</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6">
            Objectifs généraux
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Trois piliers fondamentaux qui guident notre action humanitaire et notre engagement 
            pour un accès équitable aux soins de santé
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
            <div className="w-3 h-3 bg-teal-400 rounded-full mx-4"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
          </div>
        </div>

        {/* Objectives Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {objectives.map((objective, index) => (
            <ObjectiveCard
              key={index}
              {...objective}
            />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="text-gray-800 font-semibold text-lg">
                  Ensemble, construisons un avenir plus sain
                </p>
                <p className="text-gray-600 text-sm">
                  Rejoignez notre mission humanitaire
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernObjectives;