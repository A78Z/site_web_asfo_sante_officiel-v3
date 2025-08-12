import React from 'react';
import SectionTitle from '../components/common/SectionTitle';
import { useInView } from 'react-intersection-observer';
import { Info, Heart, BookOpen, Users, Sparkles, Activity, Target, Award } from 'lucide-react';

const AwarenessPage: React.FC = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'Sensibilisation | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const interventionMethods = [
    {
      icon: <Users size={24} />,
      title: "Causeries éducatives",
      description: "Sessions interactives et participatives avec les communautés locales pour favoriser l'échange de connaissances et l'adoption de bonnes pratiques",
      image: "/causeries.jpg",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500"
    },
    {
      icon: <BookOpen size={24} />,
      title: "Supports pédagogiques",
      description: "Projections vidéos, distribution de brochures et utilisation d'outils visuels adaptés aux contextes locaux pour faciliter la compréhension",
      image: "/supports-pedagogiques.jpg",
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-500"
    },
    {
      icon: <Activity size={24} />,
      title: "Relais communautaires",
      description: "Formation et accompagnement des acteurs locaux pour assurer la continuité des messages de sensibilisation et renforcer l'autonomie des communautés",
      image: "/relais-communautaires.jpg",
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500"
    }
  ];

  const topics = [
    {
      icon: <Info size={24} />,
      title: "Hygiène et lutte contre les pathologies infectieuses",
      description: "éducation sur les mesures d'hygiène individuelle et collective pour prévenir et limiter la propagation des maladies infectieuses telles que: les parasitoses, les IST/VIH et les MTN",
      image: "/hygiene-prevention-maladie.jpg",
      color: "from-teal-500 to-teal-600",
      iconBg: "bg-teal-500"
    },
    {
      icon: <Target size={24} />,
      title: "Prévenir / Vivre avec une maladie chronique : diabète, HTA...",
      description: " Étude des moyens de prévention, d’adaptation et de suivi au quotidien pour améliorer la qualité de vie des personnes atteintes de maladies chroniques telles que le diabète ou l’hypertension artérielle.",
      image: "/sante-maternelle-infantile.jpg",
      color: "from-red-500 to-red-600",
      iconBg: "bg-red-500"
    },
    {
      icon: <Heart size={24} />,
      title: "Santé maternelle et infantile",
      description: " Évaluation des facteurs influençant la santé de la mère et de l’enfant, de la grossesse au développement postnatal, ainsi que des interventions pour améliorer leur bien-être.",
      image: "/sante-mentale-bien-etre.jpg",
      color: "from-pink-500 to-pink-600",
      iconBg: "bg-pink-500"
    },
    {
      icon: <Award size={24} />,
      title: "Santé mentale et bien-être",
      description: "Exploration des déterminants de la santé mentale et des approches communautaires ou médicales visant à promouvoir le bien-être psychologique des individues",
      image: "/prevention-sida.jpg",
      color: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-500"
    },
    {
      icon: <Sparkles size={24} />,
      title: "Nutrition et hygiène alimentaire",
      description: "Recommandations pour une alimentation saine et équilibrée afin de prévenir ou de vivre avec une maladie chronique : diabète, hypertension artérielle (HTA), etc.",
      image: "/Nutrition-hygiene-alimentaire.jpg",
      color: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-500"
    }
  ];

  const [methodsRef, methodsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [topicsRef, topicsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="/31.webp" 
            alt="Sensibilisation ASFO" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/60"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 transform hover:scale-105 transition-transform duration-300">
              <Info className="mr-2 text-white/80" size={16} />
              <span>Informer pour mieux prévenir</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Campagnes de sensibilisation
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Éduquer, prévenir et sauver des vies à travers nos campagnes de sensibilisation.
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
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-center text-gray-700 leading-relaxed mb-12">
                ASFO mène régulièrement des campagnes de sensibilisation sur les pathologies les plus fréquentes en zones rurales 
                en insistant sur les mesures préventives. Notre approche participative et adaptée au contexte local 
                permet d'atteindre efficacement les populations et de favoriser l'adoption de comportements favorables à la santé.
              </p>
            </div>

            {/* Methods Section */}
            <div 
              ref={methodsRef}
              className={`mt-20 transition-all duration-1000 transform ${
                methodsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <SectionTitle 
                title="Nos méthodes d'intervention" 
                subtitle="Des approches adaptées pour un impact maximal"
                center
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mt-12">
                {interventionMethods.map((method, index) => (
                  <div 
                    key={index}
                    className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                    
                    {/* Enhanced Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={method.image}
                        alt={method.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                      
                      {/* Icon overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                        <div className={`w-16 h-16 ${method.iconBg} rounded-full flex items-center justify-center text-white shadow-lg`}>
                          {method.icon}
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Content */}
                    <div className="p-6 md:p-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {method.description}
                      </p>
                    </div>
                    
                    {/* Bottom glow effect */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topics Grid */}
            <div 
              ref={topicsRef}
              className={`mt-32 transition-all duration-1000 transform ${
                topicsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <SectionTitle 
                title="Thématiques abordées" 
                subtitle="Nos campagnes couvrent les principaux enjeux de santé publique" 
                center
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mt-16">
                {topics.map((topic, index) => (
                  <div 
                    key={index}
                    className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                    
                    {/* Enhanced Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={topic.image}
                        alt={topic.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                      
                      {/* Icon overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                        <div className={`w-16 h-16 ${topic.iconBg} rounded-full flex items-center justify-center text-white shadow-lg`}>
                          {topic.icon}
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Content */}
                    <div className="p-6 md:p-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                        {topic.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                    
                    {/* Bottom glow effect */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Section */}
            <div className="mt-32 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-10 shadow-xl border border-teal-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Notre impact</h2>
              <div className="prose prose-lg max-w-none mb-10">
                <p className="text-xl text-center text-gray-700 leading-relaxed">
                  Ces actions permettent d'<strong className="text-teal-600">éduquer, prévenir et sauver des vies</strong>, tout en renforçant la
                  <strong className="text-teal-600"> responsabilisation communautaire</strong> face aux enjeux sanitaires.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-teal-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                    <Users size={24} />
                  </div>
                  <div className="text-4xl font-bold text-teal-600 mb-3">5,000+</div>
                  <div className="text-gray-700 font-medium">Personnes sensibilisées</div>
                </div>
                <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-teal-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                    <Activity size={24} />
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-3">30+</div>
                  <div className="text-gray-700 font-medium">Campagnes réalisées</div>
                </div>
                <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-teal-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                    <Award size={24} />
                  </div>
                  <div className="text-4xl font-bold text-purple-600 mb-3">100+</div>
                  <div className="text-gray-700 font-medium">Relais formés</div>
                </div>
              </div>
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
                      Sensibiliser pour mieux prévenir
                    </p>
                    <p className="text-gray-600 text-sm">
                      L'éducation sanitaire au cœur de notre mission
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

export default AwarenessPage;