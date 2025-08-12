import React from 'react';
import { useInView } from 'react-intersection-observer';
import { 
  Users, 
  Target, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Heart, 
  TrendingUp, 
  Award,
  Building2,
  Network,
  Zap,
  Globe
} from 'lucide-react';

const OrganizationPage: React.FC = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'Notre organisation | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [governanceRef, governanceInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [commissionsRef, commissionsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [expansionRef, expansionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const commissions = [
    {
      icon: <Target size={28} />,
      title: "Plan & logistique",
      description: "Organisation des campagnes et extra-campagnes",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500"
    },
    {
      icon: <Award size={28} />,
      title: "Commission scientifique",
      description: "Formations, ateliers, journées scientifiques, panels",
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500"
    },
    {
      icon: <Heart size={28} />,
      title: "Médico-sociale",
      description: "Actions sociales, solidarité, dons, suivi des patients",
      gradient: "from-red-500 to-red-600",
      iconBg: "bg-red-500"
    },
    {
      icon: <Briefcase size={28} />,
      title: "Finances",
      description: "Gestion budgétaire, cotisations, dépenses",
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-500"
    },
    {
      icon: <Network size={28} />,
      title: "Presse & Information",
      description: "Communication interne/externe, visuels, réseaux sociaux",
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-500"
    },
    {
      icon: <Globe size={28} />,
      title: "Relations extérieures",
      description: "Partenariats et collaborations",
      gradient: "from-teal-500 to-teal-600",
      iconBg: "bg-teal-500"
    },
    {
      icon: <Zap size={28} />,
      title: "Organisation",
      description: "Transversale, active sur tous les fronts",
      gradient: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-500"
    }
  ];

  const sections = [
    {
      name: "ASFO/Saint-Louis",
      university: "Université Gaston Berger",
      duration: "2021",
      status: "Établie",
      image: "/logo-ugb.jpg",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "ASFO/Thiès",
      university: "UFR Santé de Thiès",
      duration: "2025",
      status: "Prometteuse",
      image: "/logo-thies.jpg",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative py-20 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div 
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Building2 className="mr-2 text-white" size={16} />
              <span>🔷 Notre organisation</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Découvrez l'équipe qui pilote l'ASFO
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              Une association structurée, portée par une équipe de jeunes professionnels et d'étudiants engagés, 
              tous animés par une même ambition : <em>servir les populations rurales du Sénégal à travers la santé, 
              la solidarité et l'action de terrain.</em>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Users className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-2xl font-bold text-white mb-2">600+</h3>
                <p className="text-white/80">Membres actifs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <MapPin className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-2xl font-bold text-white mb-2">3</h3>
                <p className="text-white/80">Sections régionales</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Calendar className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-2xl font-bold text-white mb-2">25+</h3>
                <p className="text-white/80">Années d'expérience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Governance Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div 
            ref={governanceRef}
            className={`max-w-4xl mx-auto transition-all duration-1000 transform ${
              governanceInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 bg-teal-50 text-teal-700 rounded-full mb-6">
                <Target className="mr-2" size={20} />
                <span className="font-semibold">🧭 Gouvernance et fonctionnement</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Une structure démocratique et transparente
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 border border-teal-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mr-4">
                      <Calendar className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Assemblée Générale Ordinaire</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Chaque année, l'ASFO tient une <strong>Assemblée Générale Ordinaire</strong> : 
                    bilan annuel, définition des priorités, et élection du Bureau Exécutif chargé 
                    de mettre en œuvre la feuille de route.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <Briefcase className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Bureau Exécutif</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>Le Bureau Exécutif</strong> est composé de membres élus pour :
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Coordonner les actions
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Superviser les activités
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Représenter l'association
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Appliquer les décisions de l'AG
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <img 
                    src="/medicalteam.webp" 
                    alt="Équipe ASFO" 
                    className="w-full h-64 object-cover rounded-2xl mb-6"
                  />
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      Gouvernance participative
                    </h4>
                    <p className="text-gray-600">
                      Une structure démocratique où chaque membre a sa voix
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commissions Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-teal-50/30 to-gray-50">
        <div className="container mx-auto px-4">
          <div 
            ref={commissionsRef}
            className={`transition-all duration-1000 transform ${
              commissionsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6">
                <Network className="text-teal-600 mr-3" size={24} />
                <span className="text-teal-700 font-semibold text-lg">🧩 Commissions dynamiques</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6">
                Les piliers de l'action
              </h2>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Sept commissions spécialisées qui orchestrent l'ensemble de nos activités avec expertise et coordination
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {commissions.map((commission, index) => (
                <div 
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${commission.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 ${commission.iconBg} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {commission.icon}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                      {commission.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {commission.description}
                    </p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Expansion Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div 
            ref={expansionRef}
            className={`transition-all duration-1000 transform ${
              expansionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 bg-teal-50 text-teal-700 rounded-full mb-6">
                <TrendingUp className="mr-2" size={20} />
                <span className="font-semibold">🌍 Une association en pleine expansion</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Décentralisation universitaire
              </h2>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Nos sections régionales, avec leur propre bureau, participent pleinement aux activités nationales 
                et diffusent les valeurs de l'ASFO dans leur zone.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {sections.map((section, index) => (
                <div 
                  key={index}
                  className="group relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg mr-4 border-4 border-white">
                        <img 
                          src={section.image} 
                          alt={section.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                          {section.name}
                        </h3>
                        <p className="text-teal-600 font-medium">
                          {section.university}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Année de mise en place</span>
                        <span className="font-semibold text-gray-800">{section.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Statut :</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          section.status === 'Établie' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {section.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className={`bg-gradient-to-r ${section.color} h-2 rounded-full transition-all duration-1000`}
                            style={{ width: section.status === 'Établie' ? '100%' : '75%' }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {section.status === 'Établie' ? 'Pleinement opérationnelle' : 'En développement'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl shadow-xl border border-teal-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                    <Heart className="text-white" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-800 font-semibold text-lg">
                      Rejoignez notre organisation dynamique
                    </p>
                    <p className="text-gray-600 text-sm">
                      Ensemble, construisons l'avenir de la santé communautaire
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

export default OrganizationPage;