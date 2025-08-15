import React from 'react';
import SectionTitle from '../components/common/SectionTitle';
import { useInView } from 'react-intersection-observer';
import { Heart, Users, Award, Sparkles } from 'lucide-react';

const ConsultationsPage: React.FC = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'ASFO | Action Sanitaire pour le Fouta';
  }, []);

  const specialties = [
    // Services médicaux
    { 
      title: "Médecine générale",
      description: "Consultations et soins pour tous les patients de 15 à 65 ans",
      image: "/medecin-general.webp",
      category: "medical",
      icon: <Heart size={24} />
    },
    { 
      title: "Pédiatrie",
      description: "Soins spécialisés pour enfants âgés de 0 à 15 ans",
      image: "/pediatrie.webp",
      category: "medical",
      icon: <Heart size={24} />
    },
    { 
      title: "Ophtalmologie",
      description: "Prise en charge des maladies de l'œil et des troubles de la vision",
      image: "/ophtalmologie.webp",
      category: "medical",
      icon: <Heart size={24} />
    },
    { 
      title: "Psychiatrie",
      description: "Prise en charge de la santé mentale et du bien-être psychologique",
      image: "/psychiatrie.jpg",
      category: "medical",
      icon: <Heart size={24} />
    },
    { 
      title: "Chirurgie dentaire",
      description: "Prise en charge des affections bucco-dentaires et soins dentaires",
      image: "/dentaire.webp",
      category: "medical",
      icon: <Heart size={24} />
    },
    { 
      title: "Gériatrie",
      description: "Soins adaptés aux personnes âgées et à leurs besoins spécifiques",
      image: "/geriatrie.webp",
      category: "medical",
      icon: <Heart size={24} />
    },
    { 
      title: "Gynéco-Obstétrique",
      description: "Santé maternelle, reproductive et suivi des grossesses",
      image: "/gynecologie.webp",
      category: "medical",
      icon: <Heart size={24} />
    },
    { 
      title: "Circoncisions",
      description: "Circoncision dans un cadre médical sécurisé et professionnel",
      image: "/circoncision.webp",
      category: "medical",
      icon: <Heart size={24} />
    },
    
    // Services diagnostiques
    { 
      title: "Biologie",
      description: "Aide au dépistage et diagnostic par analyses biologiques",
      image: "/biologie.webp",
      category: "diagnostic",
      icon: <Award size={24} />
    },
    { 
      title: "Imagerie",
      description: "Orientation et diagnostic par techniques d'imagerie médicale",
      image: "/imagerie.JPG",
      category: "diagnostic",
      icon: <Award size={24} />
    },
    
    // Services de sensibilisation
    { 
      title: "Santé communautaire",
      description: "Promotion de la santé nutritionnelle et des bonnes pratiques",
      image: "/sante-communautaire.webp",
      category: "awareness",
      icon: <Users size={24} />
    },
    { 
      title: "Sensibilisation publique",
      description: "Sessions interactives avec la population en langue locale",
      image: "/sensibilisation.jpg",
      category: "awareness",
      icon: <Users size={24} />
    },
    { 
      title: "Radios communautaires",
      description: "Sensibilisation via les radios locales pour une portée étendue",
      image: "/sensibilisation-radios.jpg",
      category: "awareness",
      icon: <Users size={24} />
    },
    { 
      title: "Consultations éducatives",
      description: "Sensibilisation personnalisée lors des consultations médicales",
      image: "/sensibilisation-consultation.jpg",
      category: "awareness",
      icon: <Users size={24} />
    },
    { 
      title: "Documentation santé",
      description: "Distribution de flyers et supports d'information adaptés",
      image: "/Distribution-de-flyers.jpg",
      category: "awareness",
      icon: <Users size={24} />
    }
  ];

  // Grouper les spécialités par catégorie
  const medicalServices = specialties.filter(s => s.category === 'medical');
  const diagnosticServices = specialties.filter(s => s.category === 'diagnostic');
  const awarenessServices = specialties.filter(s => s.category === 'awareness');

  // Hooks pour les animations au défilement
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [impactRef, impactInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="/barre.webp" 
            alt="Consultation médicale ASFO" 
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
              <Heart className="mr-2 text-white/80" size={16} />
              <span>Soins de qualité pour tous</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Consultations médicales
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Des soins de qualité accessibles à tous grâce à nos caravanes médicales gratuites 
              à travers les régions les plus reculées du Sénégal.
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
            <div className="prose prose-lg max-w-none mb-16">
              <p className="text-xl text-center text-gray-700 leading-relaxed">
                Depuis plus de deux décennies, <strong className="text-teal-600">ASFO</strong> organise des <strong className="text-teal-600">caravanes médicales gratuites</strong> à travers plusieurs localités du Sénégal.
                Ces actions permettent d'offrir un accès aux soins de santé à des milliers de personnes issues de zones rurales ou défavorisées, 
                contribuant ainsi à réduire les inégalités en matière de santé.
              </p>
            </div>

            {/* Specialties Grid */}
            <div className="mt-12">
              <SectionTitle 
                title="Les activités de la campagne médicale" 
                subtitle="Une équipe pluridisciplinaire offrant une gamme complète de soins adaptés aux besoins locaux" 
                center
              />
              
              {/* Services médicaux */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center justify-center">
                  <Heart className="text-red-500 mr-3" size={24} />
                  Services médicaux
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {medicalServices.map((specialty, index) => (
                    <div 
                      key={index}
                      className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] border border-gray-100"
                    >
                      {/* Image avec effet de zoom */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={specialty.image}
                          alt={specialty.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlay au survol */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-500">
                            {specialty.icon}
                          </div>
                        </div>
                      </div>
                      
                      {/* Contenu */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors duration-300">
                          {specialty.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {specialty.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Services diagnostiques */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center justify-center">
                  <Award className="text-blue-500 mr-3" size={24} />
                  Services diagnostiques
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {diagnosticServices.map((specialty, index) => (
                    <div 
                      key={index}
                      className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] border border-gray-100 flex flex-col md:flex-row"
                    >
                      {/* Image */}
                      <div className="relative h-56 md:h-auto md:w-1/2 overflow-hidden">
                        <img
                          src={specialty.image}
                          alt={specialty.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlay au survol */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                      </div>
                      
                      {/* Contenu */}
                      <div className="p-6 md:w-1/2 flex flex-col justify-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                          {specialty.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                          {specialty.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {specialty.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Services de sensibilisation */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center justify-center">
                  <Users className="text-green-500 mr-3" size={24} />
                  Sensibilisation et éducation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {awarenessServices.map((specialty, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="h-48 overflow-hidden">
                      <img
                        src={specialty.image}
                        alt={specialty.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 text-center mb-3">
                        {specialty.title}
                      </h3>
                      <p className="text-gray-600 text-center">
                        {specialty.description}
                      </p>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>

            {/* Impact Section */}
            <div 
              ref={impactRef}
              className={`mt-20 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-10 shadow-xl border border-teal-100 transition-all duration-1000 transform ${
                impactInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
                <Sparkles className="text-teal-500 mr-3" size={28} />
                Notre impact
              </h2>
              <div className="prose prose-lg max-w-none mb-10">
                <p className="text-xl text-center text-gray-700 leading-relaxed">
                  À travers ces missions, nous affirmons notre volonté de <strong className="text-teal-600">servir la nation</strong>, de renforcer la solidarité et de 
                  promouvoir l'<strong className="text-teal-600">engagement et la participation citoyens</strong>. Le soutien de nos partenaires, alliés à 
                  l'implication des structures locales, nous permet d\'agir efficacement <strong className="text-teal-600">contre les inégalités en matière de santé</strong>.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-teal-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                    <Users size={24} />
                  </div>
                  <div className="text-4xl font-bold text-teal-600 mb-3">250K+</div>
                  <div className="text-gray-700 font-medium">Patients consultés</div>
                </div>
                <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-teal-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                    <Award size={24} />
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-3">192+</div>
                  <div className="text-gray-700 font-medium">Localités sillonnées</div>
                </div>
                <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-teal-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                    <Heart size={24} />
                  </div>
                  <div className="text-4xl font-bold text-red-600 mb-3">600+</div>
                  <div className="text-gray-700 font-medium">Acteurs engagés</div>
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
                      Des soins de qualité pour tous
                    </p>
                    <p className="text-gray-600 text-sm">
                      Notre engagement pour la santé communautaire
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

export default ConsultationsPage;