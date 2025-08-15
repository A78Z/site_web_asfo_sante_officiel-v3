import React from 'react';
import SectionTitle from '../components/common/SectionTitle';
import { useInView } from 'react-intersection-observer';
import { BookOpen, Award, Users, Target, Sparkles, GraduationCap, Brain, Stethoscope, Clock, Heart } from 'lucide-react';

const TrainingPage: React.FC = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'Formations et renforcement des capacités | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [cardsRef, cardsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [objectivesRef, objectivesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [impactRef, impactInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const trainingInitiatives = [
    {
      title: "Enseignements Post-Universitaires (EPU)",
      description: "Des sessions d'enseignement théorique adaptées à tous les professionnels et étudiants pour approfondir des thématiques clés en santé.",
      image: "/eup.jpg",
      icon: <BookOpen size={24} />,
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500"
    },
    {
      title: "Ateliers de Formation Pratique",
      description: "Des ateliers pratiques réguliers, comme le secourisme ou la technique de suture, pour développer des compétences directement applicables.",
      image: "/ateliers-formation-pratique.jpg",
      icon: <Stethoscope size={24} />,
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-500"
    },
    {
      title: "Renforcement des capacités des Acteurs Communautaires",
      description: "Accompagnement des agents communautaires lors des campagnes médicales avec des modules de sensibilisation et d'éducation sanitaire.",
      image: "/renforcement-capacites.jpg",
      icon: <Users size={24} />,
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500"
    },
    {
      title: "Sessions de sensibilisation et de formation en campagne",
      description: "Briefings techniques destinés aux bénévoles sur la chaîne de soins, la logistique, l'éthique humanitaire et la communication.",
      image: "/sessions-sensibilisation.jpg",
      icon: <Target size={24} />,
      color: "from-red-500 to-red-600",
      iconBg: "bg-red-500"
    },
    {
      title: "Mentorat et encadrement sur le terrain",
      description: "Accompagnement personnalisé par des médecins et pharmaciens expérimentés pour guider les jeunes volontaires en milieu rural.",
      image: "/mentorat-encadrement.jpg",
      icon: <Brain size={24} />,
      color: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-500"
    },
    {
      title: "Journées scientifiques de l'ASFO",
      description: "Événements favorisant l'échange entre étudiants, professionnels et experts, et stimulant la recherche et l'innovation en santé.",
      image: "/journee-scientifique.png",
      icon: <Award size={24} />,
      color: "from-teal-500 to-teal-600",
      iconBg: "bg-teal-500"
    },
    {
      title: "Projets en collaboration avec des partenaires internationaux",
      description: "Développement de partenariats pour offrir des bourses et des spécialisations médicales aux jeunes professionnels.",
      image: "/projets-collaboration.jpg",
      icon: <Clock size={24} />,
      color: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-500"
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="/barre-formation.webp" 
            alt="Formation médicale ASFO" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/60"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 transform hover:scale-105 transition-transform duration-300">
              <GraduationCap className="mr-2 text-white/80" size={16} />
              <span>Développer les compétences locales</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Formations et renforcement des capacités
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Développer l'expertise locale pour un impact durable sur la santé communautaire.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-24 bg-gradient-to-br from-white via-teal-50/20 to-blue-50/10 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div 
            ref={titleRef}
            className={`max-w-4xl mx-auto transition-all duration-1000 transform ${
              titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="prose prose-lg max-w-none mb-16 text-center">
              <p className="text-xl text-gray-700 leading-relaxed">
                L'<strong className="text-teal-600">ASFO</strong> accorde une importance particulière à la 
                <strong className="text-teal-600"> formation continue et au renforcement des capacités</strong> des jeunes professionnels de santé. 
                Nous croyons qu'un personnel médical bien formé est la clé d\'un système de santé performant, durable et équitable, 
                en particulier dans les zones rurales.
              </p>
            </div>

            {/* Training Initiatives Grid */}
            <div 
              ref={cardsRef}
              className={`mt-20 transition-all duration-1000 transform ${
                cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <SectionTitle 
                title="Nous avons mis en place plusieurs initiatives" 
                subtitle="Des programmes de formation adaptés aux besoins spécifiques des communautés" 
                center
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mt-12">
                {trainingInitiatives.map((training, index) => (
                  <div 
                    key={index}
                    className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 min-h-[400px] flex flex-col"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${training.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                    
                    {/* Enhanced Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={training.image}
                        alt={training.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                      
                      {/* Icon overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                        <div className={`w-16 h-16 ${training.iconBg} rounded-full flex items-center justify-center text-white shadow-lg`}>
                          {training.icon}
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Content */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                        {training.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed flex-1">
                        {training.description}
                      </p>
                    </div>
                    
                    {/* Bottom glow effect */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Objectives Section */}
            <div 
              ref={objectivesRef}
              className={`mt-24 transition-all duration-1000 transform ${
                objectivesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6">
                  <Target className="text-teal-600 mr-3" size={24} />
                  <span className="text-teal-700 font-semibold text-lg">Objectifs et Impact</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6">
                  Objectifs et Impact
                </h2>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-teal-100 mb-8">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Ces formations et actions de renforcement des capacités visent à <strong className="text-teal-600">autonomiser les acteurs de santé de première ligne</strong> et à améliorer la qualité des soins au sein des communautés rurales.
                  </p>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    En outillant les étudiants et les agents communautaires (ASC, matrones, Badjénou Gokh) sur des techniques simples mais vitales, l'ASFO contribue à :
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/70 p-6 rounded-xl shadow-sm border border-teal-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                        <Heart className="text-teal-600" size={20} />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Résilience locale</h4>
                      <p className="text-gray-600 text-sm">Renforcer la résilience locale face aux urgences sanitaires</p>
                    </div>
                    
                    <div className="bg-white/70 p-6 rounded-xl shadow-sm border border-teal-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Stethoscope className="text-blue-600" size={20} />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Meilleure prise en charge</h4>
                      <p className="text-gray-600 text-sm">Favoriser une meilleure prise en charge des patients en zone enclavée</p>
                    </div>
                    
                    <div className="bg-white/70 p-6 rounded-xl shadow-sm border border-teal-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="text-purple-600" size={20} />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Culture de prévention</h4>
                      <p className="text-gray-600 text-sm">Ancrer durablement une culture de prévention, d'hygiène et de service communautaire</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl text-center">
                    <p className="text-lg font-semibold">
                      C'est un <strong>levier essentiel</strong> de notre impact social sur le terrain.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Section */}
            <div 
              ref={impactRef}
              className={`mt-24 transition-all duration-1000 transform ${
                impactInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6">
                  <Award className="text-teal-600 mr-3" size={24} />
                  <span className="text-teal-700 font-semibold text-lg">Notre Impact</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6">
                  Des résultats concrets
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    value: "500+",
                    label: "Professionnels formés",
                    icon: <Users size={28} />,
                    color: "from-teal-500 to-teal-600",
                    description: "Médecins, infirmiers et agents de santé communautaire ayant bénéficié de nos programmes"
                  },
                  {
                    value: "50+",
                    label: "Sessions organisées",
                    icon: <BookOpen size={28} />,
                    color: "from-blue-500 to-blue-600",
                    description: "Formations théoriques et pratiques dispensées dans différentes localités"
                  },
                  {
                    value: "20+",
                    label: "Localités couvertes",
                    icon: <GraduationCap size={28} />,
                    color: "from-purple-500 to-purple-600",
                    description: "Zones rurales et urbaines touchées par nos programmes de formation"
                  }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="group relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 text-center overflow-hidden"
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                    
                    {/* Icon */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                        {stat.value}
                      </div>
                      <div className="text-xl font-semibold text-gray-800 mb-4">
                        {stat.label}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {stat.description}
                      </p>
                    </div>
                    
                    {/* Bottom glow effect */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bottom decorative element */}
            <div className="mt-20 text-center">
              <div className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                    <GraduationCap className="text-white" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-800 font-semibold text-lg">
                      Former pour un impact durable
                    </p>
                    <p className="text-gray-600 text-sm">
                      Le transfert de compétences au cœur de notre mission
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingPage;