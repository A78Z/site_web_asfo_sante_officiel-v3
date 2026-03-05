import React, { useState } from 'react';
import SectionTitle from '../components/common/SectionTitle';
import OrgChart from '../components/about/OrgChart';
import ModernObjectives from '../components/about/ModernObjectives';
import { Target, Globe, Heart, MapPin, Award, Users, Calendar, Activity, FileText, Stethoscope, Building2, Star, Pill, GraduationCap, HandHeart, Apple, UserCheck, ChevronDown, ChevronUp } from 'lucide-react';

const missionCards = [
  {
    image: "/mission.webp",
    title: "Notre Mission",
    description: "ASFO s'engage à améliorer durablement les conditions de vie des populations du Fouta, en mettant un accent particulier sur la santé communautaire. Notre mission est de promouvoir l'accès équitable aux soins de qualité, de renforcer la prévention, et de soutenir les initiatives locales en matière de bien-être. À travers l'accompagnement, la sensibilisation et la mobilisation des acteurs locaux, nous œuvrons pour une société plus saine, solidaire et résiliente."
  },
  {
    image: "/valeur.webp",
    title: "Nos Valeurs",
    content: [
      { label: "Engagement", desc: "Dévouement total envers la santé communautaire" },
      { label: "Excellence", desc: "Qualité des soins et formation continue" },
      { label: "Équité", desc: "Accès aux soins pour tous sans discrimination" },
      { label: "Solidarité", desc: "Entraide et soutien mutuel" }
    ]
  },
  {
    image: "/impact.webp",
    title: "Notre Impact",
    content: [
      "Plus de 10,000 consultations gratuites par an",
      "Formation continue de nos membres et sympatisants",
      "Présence dans 15 régions du Sénégal + Mauritanie",
      "25+ grandes campagnes de consultations et de sensibilisations gratuites",
      "50+ extra-campagnes de sensibilisation réalisées"
    ]
  }
];

const specificObjectives = [
  {
    icon: <Stethoscope size={24} />,
    title: "Organiser des consultations médicales gratuites dans les zones reculées",
    gradient: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-500"
  },
  {
    icon: <Users size={24} />,
    title: "Mener des campagnes de sensibilisation sur les enjeux de santé publique",
    gradient: "from-green-500 to-green-600",
    iconBg: "bg-green-500"
  },
  {
    icon: <GraduationCap size={24} />,
    title: "Former le personnel de santé local aux nouvelles techniques médicales",
    gradient: "from-purple-500 to-purple-600",
    iconBg: "bg-purple-500"
  },
  {
    icon: <Pill size={24} />,
    title: "Distribuer des médicaments essentiels aux populations dans le besoin",
    gradient: "from-red-500 to-red-600",
    iconBg: "bg-red-500"
  },
  {
    icon: <HandHeart size={24} />,
    title: "Créer des partenariats durables avec les structures de santé locales",
    gradient: "from-teal-500 to-teal-600",
    iconBg: "bg-teal-500"
  },
  {
    icon: <Apple size={24} />,
    title: "Former les femmes à la nutrition et promouvoir une alimentation saine basée sur les produits locaux",
    gradient: "from-orange-500 to-orange-600",
    iconBg: "bg-orange-500"
  },
  {
    icon: <UserCheck size={24} />,
    title: "Assister les personnes démunies dans leur parcours thérapeutique",
    gradient: "from-indigo-500 to-indigo-600",
    iconBg: "bg-indigo-500"
  }
];

const AboutPage: React.FC = () => {
  const [isRegionsExpanded, setIsRegionsExpanded] = useState(false);

  // Set page title
  React.useEffect(() => {
    document.title = 'À propos | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  // Régions principales (toujours visibles)
  const primaryRegions = [
    "Région de Dakar",
    "Région de Thiès", 
    "Région de Louga",
    "Région de Kafrine",
    "Région de Sedhiou",
    "Région de Kolda",
    "Région de Ziguinchor",
    "Région de Tambacounda"
  ];

  // Régions secondaires (masquées par défaut)
  const secondaryRegions = [
    "Région de Diourbel",
    "Région de Fatique",
    "Région de Kaolack",
    "Région de Kédougou",
    "Région de Mauritanie"
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative py-20 bg-teal-600">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-teal-700 opacity-80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Présentation de l'ASFO
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
            Découvrez l'histoire inspirante de notre association humanitaire médicale, née <br/>de l'engagement de jeunes étudiants passionnés. Apprenez-en plus sur notre mission, nos valeurs fondamentales et nos objectifs concrets sur le terrain.
            </p>
          </div>
        </div>
      </div>

      {/* Banner with Slogan */}
      <div className="relative bg-gradient-to-r from-teal-600 to-teal-700 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-20"></div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center leading-tight">
            ASFO – au service de l'humanité <br className="hidden md:block" />
            pour la santé et le bien-être
          </h2>
        </div>
      </div>

      {/* About ASFO Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-2xl font-bold text-gray-800 mb-4">
                "Depuis 2000, l'ASFO œuvre pour la santé et le bien-être des populations du Fouta et au-delà."
              </p>
              <div className="w-20 h-1 bg-teal-500 mx-auto"></div>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-teal-600 w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-teal-600">250K+</div>
                <div className="text-gray-600 text-sm">Patients consultés</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-teal-600 w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-teal-600">25+</div>
                <div className="text-gray-600 text-sm">Années d'expérience</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-teal-600 w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-teal-600">600+</div>
                <div className="text-gray-600 text-sm">Acteurs </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="text-teal-600 w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-teal-600">192+</div>
                <div className="text-gray-600 text-sm">Localités Sillonnées</div>
              </div>
            </div>

            {/* Presentation */}
            <div className="mb-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mr-6">
                  <FileText className="text-teal-600 w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Présentation
                </h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                <p className="text-lg">
                  L'<strong>Action Sanitaire pour le Fouta (ASFO)</strong> est une association humanitaire, de développement qui a vu le jour à l'<strong>Université Cheikh Anta Diop de Dakar (UCAD)</strong>, regroupant essentiellement des professionnels de la santé mais aussi des personnes issues d'autres secteurs, animés par la volonté d'apporter leur soutien à la politique de développement sanitaire de notre pays.
                </p>

                <p>
                  Créée en <strong>l'an deux mille (2000)</strong> sous l'initiative de jeunes engagés pour l'amélioration de la situation sanitaire de leur localité (le Fouta), elle est reconnue par les autorités de l'UCAD dont celle du <strong>Centre des Œuvres Universitaire de Dakar (COUD)</strong> sous le <strong>numéro 01/2210 le 03 Mai 2001</strong> et par le <strong>Ministère de l'Intérieur de la République du Sénégal</strong> sous le <strong className="text-teal-600">numéro 12473 le 02 Mai 2006</strong>.
                </p>

                <div className="bg-teal-50 border-l-4 border-teal-500 p-6 rounded-r-lg">
                  <p className="font-semibold text-teal-800 mb-2">
                    🏆 Distinction historique
                  </p>
                  <p>
                    L'ASFO est par ailleurs la <strong>première structure médico-sociale</strong> à voir vu le jour dans la noble <strong>faculté de Médecine, de Pharmacie et d'Odontologie (FMPO)</strong> de l'Université Cheikh Anta Diop de Dakar (UCAD).
                  </p>
                </div>

                <p>
                  Conscients de leur devoir envers la population sénégalaise en général et celle du Fouta en particulier, les membres de l'ASFO n'ont jamais cessé de mener des activités d'ordre social, pédagogiques et surtout sanitaire à travers son programme d'activités.
                </p>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                  <p className="font-semibold text-yellow-800 mb-2">
                    🥇 Reconnaissance nationale
                  </p>
                  <p>
                    L'ASFO a été élue <strong>meilleure association du Sénégal en 2005</strong> par la <strong>Direction de la Jeunesse et de la Vie Associative (DJVA)</strong>, et reste à ce jour la seule association récompensée par le Ministère de la Jeunesse pour services rendus à la Nation, distinction remise à <strong>Diamniadio en présence du Président Abdoulaye Wade</strong>.
                  </p>
                </div>

                <p>
                  Elle a également mené une <strong>campagne médicale en Mauritanie</strong> en collaboration avec l'<strong>Association d'Aide aux Veuves et Orphelins de Mauritanie (AVOMM)</strong> démontrant ainsi sa capacité à agir au-delà des frontières pour soutenir les plus vulnérables.
                </p>
              </div>
            </div>

            {/* Modern Objectives Section */}
            <ModernObjectives />

            {/* Specific Objectives - REDESIGNED */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6">
                  <Target className="text-teal-600 mr-3" size={24} />
                  <span className="text-teal-700 font-semibold text-lg">Objectifs spécifiques</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6">
                  Nos Actions Concrètes
                </h2>
                
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Sept axes d'intervention prioritaires qui guident notre engagement quotidien sur le terrain
                </p>
                
                {/* Decorative Line */}
                <div className="flex items-center justify-center mt-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
                  <div className="w-3 h-3 bg-teal-400 rounded-full mx-4"></div>
                  <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {specificObjectives.map((objective, index) => (
                  <div 
                    key={index}
                    className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${objective.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                    
                    {/* Number Badge */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg border-4 border-gray-50 flex items-center justify-center z-10">
                      <span className={`text-lg font-bold bg-gradient-to-br ${objective.gradient} bg-clip-text text-transparent`}>
                        {index + 1}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 ${objective.iconBg} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {objective.icon}
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <p className="text-gray-700 font-medium leading-relaxed text-lg group-hover:text-gray-800 transition-colors duration-300">
                        {objective.title}
                      </p>
                    </div>

                    {/* Hover Effect Border */}
                    <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-br group-hover:${objective.gradient.replace('from-', 'border-').replace('to-', 'border-')} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-16 text-center">
                <div className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Heart className="text-white" size={20} />
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

            {/* Intervention Zones - REDESIGNED */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center justify-center">
                <MapPin className="text-teal-600 mr-3 animate-bounce" />
                Zones d'intervention
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Le Fouta Section - REDESIGNED */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-50 via-blue-50/50 to-transparent rounded-3xl p-8 border border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    {/* Header with icon and title */}
                    <div className="flex items-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-6 shadow-lg">
                        <Stethoscope className="text-white w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-['Playfair_Display'] text-3xl font-bold text-blue-800">Le Fouta</h3>
                        <p className="text-blue-600 font-medium">Zone d'intervention prioritaire</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
                        <p className="text-gray-700 leading-relaxed">
                          L'<strong>Action Sanitaire pour le Fouta</strong> œuvre dans le domaine médico-social depuis plus de <strong>25 ans</strong>. Elle a couvert plusieurs régions du Sénégal et même la Mauritanie. Cependant, la majeure partie de nos activités se concentrent au <strong>Fouta</strong> qui regroupe le département de <strong>Podor</strong> et la région de <strong>Matam</strong>.
                        </p>
                      </div>
                      
                      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
                        <div className="flex items-start">
                          <Users className="text-blue-500 w-6 h-6 mr-3 mt-1 flex-shrink-0" />
                          <p className="text-gray-700">
                            Chaque année, pendant une semaine, l'ASFO déploie une <strong>équipe médicale de plus de 80 personnes</strong> au Fouta dans le cadre de la grande campagne médicale.
                          </p>
                        </div>
                      </div>
                      
                      {/* Map Image with enhanced styling */}
                      <div className="relative h-56 rounded-2xl overflow-hidden shadow-lg group">
                        <img 
                          src="/nord-senegal.webp" 
                          alt="Carte du Fouta"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                            <div className="flex items-center">
                              <MapPin className="text-blue-600 w-5 h-5 mr-2" />
                              <span className="text-blue-800 font-semibold">Nord du Sénégal - Région du Fouta</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
                        <p className="text-gray-700 leading-relaxed">
                          Le <strong>Fouta</strong> est un ancien royaume et un terroir historique dans le nord du Sénégal, bordant la rive gauche du fleuve Sénégal entre Dagana et Bakel. C'est une zone où la santé est difficile d'accès en raison du <strong>manque de structures sanitaires</strong>, du <strong>manque de spécialistes</strong> et du <strong>niveau économique précaire</strong> de la population.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regions Section - REDESIGNED */}
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
                    <div className="flex items-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mr-6 shadow-lg">
                        <Building2 className="text-white w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800">Zones Couvertes</h3>
                        <p className="text-gray-600">15 régions du Sénégal + Mauritanie</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Priority Zones */}
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                          <Star className="text-yellow-500 w-5 h-5 mr-2" />
                          Zones prioritaires
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            "Région de Matam",
                            "Région de Saint-Louis"
                          ].map((region, index) => (
                            <div
                              key={index}
                              className="group flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                            >
                              <div className="w-4 h-4 bg-yellow-400 rounded-full mr-4 group-hover:animate-pulse shadow-md"></div>
                              <span className="text-white font-semibold group-hover:text-yellow-100 transition-colors">{region}</span>
                              <Star className="text-yellow-400 w-4 h-4 ml-auto" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Other Regions */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                          <MapPin className="text-teal-500 w-5 h-5 mr-2" />
                          Autres régions couvertes
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {/* Régions principales (toujours visibles) */}
                          {primaryRegions.map((region, index) => (
                            <div
                              key={index}
                              className="group flex items-center bg-gradient-to-r from-gray-50 to-gray-100 hover:from-teal-50 hover:to-teal-100 p-4 rounded-xl transition-all duration-300 hover:shadow-md border border-gray-200 hover:border-teal-200"
                            >
                              <div className="w-3 h-3 bg-teal-400 rounded-full mr-4 group-hover:animate-pulse"></div>
                              <span className="text-gray-700 font-medium group-hover:text-teal-700 transition-colors">{region}</span>
                            </div>
                          ))}

                          {/* Bouton Voir + */}
                          <div className="flex justify-center my-4">
                            <button
                              onClick={() => setIsRegionsExpanded(!isRegionsExpanded)}
                              className="group flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                              <span className="font-medium mr-2">
                                {isRegionsExpanded ? 'Voir moins' : 'Voir plus'}
                              </span>
                              {isRegionsExpanded ? (
                                <ChevronUp size={20} className="group-hover:animate-bounce" />
                              ) : (
                                <ChevronDown size={20} className="group-hover:animate-bounce" />
                              )}
                            </button>
                          </div>

                          {/* Régions secondaires (masquées/affichées selon l'état) */}
                          <div className={`space-y-3 transition-all duration-500 ease-in-out overflow-hidden ${
                            isRegionsExpanded 
                              ? 'max-h-96 opacity-100' 
                              : 'max-h-0 opacity-0'
                          }`}>
                            {secondaryRegions.map((region, index) => (
                              <div
                                key={index}
                                className="group flex items-center bg-gradient-to-r from-gray-50 to-gray-100 hover:from-teal-50 hover:to-teal-100 p-4 rounded-xl transition-all duration-300 hover:shadow-md border border-gray-200 hover:border-teal-200"
                              >
                                <div className="w-3 h-3 bg-teal-400 rounded-full mr-4 group-hover:animate-pulse"></div>
                                <span className="text-gray-700 font-medium group-hover:text-teal-700 transition-colors">{region}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-100">
                      <p className="text-sm text-gray-600 italic text-center leading-relaxed">
                        <strong>💡 Notre approche :</strong> Nos interventions s'adaptent aux besoins sanitaires identifiés sur le terrain, en collaboration étroite avec les structures locales et les communautés.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Notre Mission et Nos Valeurs" 
            subtitle="Les principes qui guident chacune de nos actions"
            center
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {missionCards.map((card, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    {card.title}
                  </h3>
                  {card.description ? (
                    <p className="text-gray-600 text-center leading-relaxed">
                      {card.description}
                    </p>
                  ) : card.content && Array.isArray(card.content) && (
                    <ul className="space-y-3">
                      {card.content.map((item, itemIndex) => (
                        <li 
                          key={itemIndex}
                          className="flex items-start text-gray-600"
                        >
                          <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {typeof item === 'string' ? (
                            <span>{item}</span>
                          ) : (
                            <span>
                              <strong>{item.label}</strong> - {item.desc}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Chart */}
    </div>
  );
};

export default AboutPage;