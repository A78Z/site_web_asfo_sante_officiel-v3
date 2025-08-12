import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/common/SectionTitle';
import { Search, Calendar, ArrowRight, Tag, Filter, ChevronRight } from 'lucide-react';

// Sample news data
const newsItems = [
  {
    id: "26e-caravane-medicale-matam",
    title: "🚨 26e Édition de la Grande Caravane Médicale – Région de Matam",
    excerpt: "L'ASFO revient sur le terrain pour la 26e édition de la Grande Caravane Médicale, du 11 au 17 septembre 2025, dans la région de Matam. Cette année, 8 villages bénéficieront de dépistages, soins et sensibilisations sur le thème des cancers urogénitaux.",
    content: "🚨 ACTION SANITAIRE POUR LE FOUTA\n\nL'ASFO revient une fois de plus sur le terrain, fidèle à sa mission : prévenir, soigner, soulager et servir le Fouta.\n\n🕺 C'est parti pour la 26e ÉDITION DE LA GRANDE CARAVANE MÉDICALE : qui aura lieu du 11 au 17 septembre 2025 dans la région de Matam.\n\n🎗 Thème : « Les cancers urogénitaux : ampleur, facteurs de risque, conséquences, prévention »\n🔵 Homonyme : Dr Ibrahima Dème\n\nCette année 8 villages bénéficieront de la caravane :\n✅ Taïba Ngueyenne\n✅ Ganguel Soulé\n✅ Sylla-Diongto-Sinthiou\n✅ Padalal\n✅ Goudoudé Diobé\n✅ Ndouloumadji Dembé\n✅ Doumga Rindiaw\n✅ Loumbal Baladji\n\nEnsemble, mobilisons-nous pour faire encore plus.\nASFO – Au service du Fouta\n\n#Campagne_Médicale\n#ASFO_Matam2025\n#CPI_ASFO",
    date: "11-17 septembre 2025",
    author: "ASFO Santé",
    category: "À la Une",
    imageUrl: "/matam.png",
    tags: ["Campagne_Médicale", "ASFO_Matam2025", "CPI_ASFO", "Matam"]
  },
  {
    id: "formation-premiers-secours",
    title: "Mamadou Thioye élu Président de l’Action Sanitaire pour le Fouta : Une Nouvelle Génération aux Commandes",
    excerpt: "Un vent de renouveau souffle sur la santé communautaire au Fouta",
    content: "✨ Un vent de renouveau souffle sur la santé communautaire au Fouta\n C’est désormais officiel : Mamadou THIOYE, Doctorat 3 Médecine, vient d'être élu 20e président de l'ASFO. Un choix qui incarne à la fois la relève, la compétence et l’engagement au service des populations.\nSa nomination n’est pas passée inaperçue. À la croisée entre jeunesse ambitieuse et rigueur professionnelle, Mamadou Thioye suscite un véritable engouement au sein des acteurs sanitaires et des citoyens. “Félicitations et bon vent à lui !”, peut-on lire dans les premières réactions chaleureuses qui saluent son élection. Une nouvelle dynamique semble se dessiner pour cette organisation phare, pilier de la santé communautaire dans la région du Fouta.\n💡 Une vision tournée vers l’avenir\nLe parcours de Mamadou Thioye, à la fois académique et engagé sur le terrain, fait naître de nombreux espoirs. Son profil de jeune médecin en devenir est perçu comme un atout pour moderniser les approches, renforcer les campagnes de sensibilisation, et innover dans l'accès aux soins.\nAccompagné d’une nouvelle équipe pleine d'énergie et de compétences variées, le nouveau président se fixe pour ambition de poursuivre les projets initiés tout en lançant de nouveaux programmes adaptés aux réalités locales, notamment en matière de prévention, de couverture médicale et d’éducation sanitaire.\n🙏 Un hommage appuyé au président sortant : Dr Lamine Diallo\nCe passage de témoin est également l’occasion de saluer le travail remarquable du président sortant, Dr Lamine Diallo, et de toute son équipe. Leur mandat a été marqué par un engagement sans faille et des résultats concrets qui ont contribué à améliorer l’état de santé des populations locales.\n🔍 Et maintenant ?\nAvec cette nouvelle présidence, les attentes sont grandes. Quels seront les premiers chantiers ? Comment mobiliser les jeunes professionnels de santé ? Quel rôle pour les partenariats locaux et internationaux ? Autant de questions qui trouveront réponse dans les mois à venir.`\nCe qui est certain, c’est que l’Action Sanitaire pour le Fouta entre dans une nouvelle phase de son histoire, avec une gouvernance rajeunie, ancrée dans les valeurs de solidarité, d’excellence et d’innovation.\n🗣️ “Nous croyons en cette jeunesse compétente, ambitieuse et solidaire. Mamadou Thioye incarne cette promesse. Que son mandat soit marqué par des avancées majeures pour la santé au Fouta.”",
    date: "27 Avril 2025",
    author: "Dr. Moussa Sow",
    category: "Président Asfo",
    imageUrl: "/thioye.webp",
    tags: ["president", "asfo", "santé", "fouta"]
  },
  {
    id: "campagne-sensibilisation-covid",
    title: "MATAM SE PRÉPARE POUR LA 26e CAMPAGNE MÉDICALE DE L’ASFO",
    excerpt: "Dépôt de candidatures ouvert du 17 mars au 17 avril 2025",
    content: "L’Action Sanitaire pour le Fouta (ASFO) informe avec enthousiasme l’ensemble des populations de la région de Matam du lancement officiel des dépôts de dossiers en vue de l’organisation de sa 26e grande campagne médicale. Cet événement annuel, profondément ancré dans la vie sociale de la région, vise à rapprocher les soins de santé des populations, surtout celles vivant dans les zones rurales ou à accès difficile.\n🎯 Un rendez-vous de solidarité et de santé\nDepuis sa création, ASFO s’est engagée à offrir des prestations médicales de qualité, gratuites et accessibles à tous. La campagne réunit chaque année médecins, spécialistes, infirmiers, pharmaciens et bénévoles autour d’un même objectif : soulager, soigner et sensibiliser.\nLes bénéficiaires ont accès à des consultations médicales générales et spécialisées, à la délivrance gratuite de médicaments, ainsi qu’à des séances d’éducation sanitaire. Certaines éditions ont même permis la réalisation de petites interventions chirurgicales, selon les besoins recensés sur le terrain.\n📤 Modalités de participation\nToutes les collectivités locales, associations communautaires, centres de santé, daara, groupements de femmes ou de jeunes peuvent soumettre un dossier de candidature pour accueillir l’équipe médicale. Ce dossier doit démontrer les besoins de la localité, les capacités d’accueil, ainsi que la motivation de la communauté à participer activement à l’événement.\n🎯 Nouveauté cette année : vous pouvez désormais soumettre votre candidature directement via le site web de l’ASFO, en cliquant sur le bouton « Candidature » prévu à cet effet.\n📥 Pour ceux qui préfèrent, les dossiers peuvent toujours être envoyés par e-mail à : \n👉 asfosante@gmail.com\n🗓 Dates à retenir :\n➡️ Du 17 mars au 17 avril 2025\n📞 Contacts utiles pour toute information complémentaire :\n📱 77 393 15 72 / 77 481 89 50\n🤝 Engagez votre communauté\nLes responsables d’ASFO encouragent toutes les structures à se mobiliser dès maintenant pour saisir cette chance unique de renforcer l’accès aux soins pour tous. La santé est un droit, et cette campagne en est une belle démonstration.\nASFO, au service d’un Fouta en bonne santé.",
    date: "14 mars 2025",
    author: "Aminata Diallo",
    category: "Lancement officiel des dépôts de dossiers",
    imageUrl: "/asfo-matam.jpeg",
    tags: ["Info", "santé", "dépôts-dossiers", "Matam"]
  },
  {
    id: "partenariat-oms",
    title: "Fierté et reconnaissance : le Dr Lamine Diallo couronné d'excellence !",
    excerpt: "Fierté et reconnaissance : le Dr Lamine Diallo couronné d'excellence !",
    content: "C’est avec une immense joie et une grande fierté que nous adressons nos chaleureuses félicitations au Dr Lamine Diallo, président en exercice de l’ASFO (Action Sanitaire pour le Fouta), qui vient de soutenir avec brio sa thèse de doctorat d’État en médecine. Une soutenance marquée par la rigueur scientifique et la clarté de ses travaux, couronnée par la mention Très Honorable, l’une des plus prestigieuses distinctions dans le domaine.\n🎓 Ce parcours remarquable témoigne non seulement de ses compétences académiques, mais aussi de son dévouement profond pour la santé communautaire, particulièrement au Fouta, où il s’est illustré ces dernières années par une action de terrain constante et un leadership inspirant.\nSous sa présidence, l’ASFO a franchi un cap décisif dans la mise en œuvre de projets de prévention, de sensibilisation et d’accès aux soins pour les populations rurales. Son engagement, sa vision et sa proximité avec les communautés locales ont permis d’enregistrer des avancées concrètes dans plusieurs zones souvent délaissées.\n🙏 En plus de son excellence académique, Dr Diallo est reconnu pour ses qualités humaines : disponibilité, écoute, sens de la responsabilité et esprit de service. Il a su fédérer autour de lui une équipe dynamique et engagée, à laquelle nous rendons également hommage.\nAujourd’hui, alors qu’il franchit une étape majeure dans sa carrière, nous lui souhaitons un avenir professionnel riche en opportunités, en réussites et en impact positif. Son parcours est un exemple inspirant pour la jeunesse du Fouta et bien au-delà.\n👏 Merci, Dr Lamine Diallo, pour votre engagement sans relâche au service des autres. L’Action Sanitaire pour le Fouta vous renouvelle toute sa reconnaissance et vous accompagne de ses meilleurs vœux pour la suite.",
    date: "14 mars 2025",
    author: "Dr. Ibrahima Diop",
    category: "Fierté et reconnaissance",
    imageUrl: "/dr-lamine-diallo.jpg",
    tags: ["FiertéDuFouta", "DrLamineDiallo", "SantéCommunautaire", "ASFOSanté"]
  },
  {
    id: "mission-medicale-kedougou",
    title: "Fierté Foutanké : L’Action Sanitaire pour le Fouta Félicite Ses Lauréats au Concours des Internes des Hôpitaux du Sénégal",
    excerpt: "C’est avec une immense fierté que l’Action Sanitaire pour le Fouta adresse ses plus vives félicitations à ses membres brillamment admis au concours de recrutement des internes des hôpitaux du Sénégal.",
    content: "C’est avec une immense fierté que l’Action Sanitaire pour le Fouta adresse ses plus vives félicitations à ses membres brillamment admis au concours de recrutement des internes des hôpitaux du Sénégal.",
    date: "20 décembre 2023",
    author: "Dr. Fatou Ndiaye",
    category: "Concours des Internes des Hôpitaux du Sénégal",
    imageUrl: "/thiam.jpg",
    tags:  ["Félicitations ", "ActionSanitaireFouta", "MédecineSénégal", "SantéCommunautaire"]
  },
  {
    id: "collecte-fonds-2023",
    title: "Félicitations à Dr Dalahata Ba : Une Réussite Exemplaire et une Carrière Prometteuse !",
    excerpt: "Nous tenons à adresser nos plus sincères félicitations à Dr Dalahata Ba pour la soutenance de sa thèse de doctorat d’État en médecine couronnée de la plus haute mention.",
    content: "Nous tenons à adresser nos plus sincères félicitations à Dr Dalahata Ba pour la soutenance de sa thèse de doctorat d’État en médecine couronnée de la plus haute mention.",
    date: "13 décembre 2024",
    author: "Mme Fatou Ndiaye",
    category: "Félicitations à Dr Dalahata Ba",
    imageUrl: "/dr-dalahata-ba.jpg",
    tags: ["FélicitationsDrDalahataBa", "ExcellenceAcadémique", "ActionSanitairePourLeFouta", "SantéEtEngagement"]
  },
  {
    id: "formation-sage-femmes",
    title: "Félicitations au Pr Oumar BASSOUM : Un Major qui fait rayonner la Médecine et l’Action Sanitaire pour le Fouta",
    excerpt: "L’Action Sanitaire pour le Fouta (ASFO) tient à féliciter chaleureusement le Pr Oumar BASSOUM, qui a brillamment réussi au concours d’agrégation de Médecine, décrochant ainsi le titre de Major.",
    content: "L’Action Sanitaire pour le Fouta (ASFO) tient à féliciter chaleureusement le Pr Oumar BASSOUM, qui a brillamment réussi au concours d’agrégation de Médecine, décrochant ainsi le titre de Major.",
    date: "11 novembre 2024",
    author: "Dr. Aminata Diallo",
    category: "Félicitations au Pr Oumar BASSOUM",
    imageUrl: "/pr-oumar-bassoum.jpg",
    tags: ["PrOumarBASSOUM", "AgrégationMédecine", "FiertéFouta", "ActionSanitaire"]
  }
];

const NewsPage: React.FC = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'Actualités | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  // Get unique categories
  const categories = Array.from(new Set(newsItems.map(item => item.category))).sort();
  
  // Filter news based on search term and selected category
  const filteredNews = newsItems.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="/asfo-news-barre.jpg" 
            alt="ASFO news" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/60"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 transform hover:scale-105 transition-transform duration-300">
              <Calendar className="mr-2 text-white/80" size={16} />
              <span>Restez informé de nos actions</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Actualités
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Restez informé des dernières activités, événements et réalisations d'ASFO au Sénégal.
            </p>
          </div>
        </div>
      </div>

      {/* News Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6 transform hover:scale-105 transition-transform duration-300">
              <Calendar className="text-teal-600 mr-3 animate-pulse" size={20} />
              <span className="text-teal-700 font-semibold">Nos Dernières Actualités</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6 leading-tight">
              Découvrez nos actualités
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Suivez les dernières nouvelles et activités d'ASFO au Sénégal
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-12 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-grow group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500" size={20} />
              <input
                type="text"
                placeholder="Rechercher dans les actualités..."
                className="relative w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="md:w-64 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500">
                <Filter size={20} />
              </div>
              <select
                className="relative w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-300 appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* News Grid */}
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {filteredNews.map((item) => (
                <div 
                  key={item.id} 
                  className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] border border-gray-100"
                >
                  <Link to={`/news/${item.id}`} className="block">
                    <div className="relative h-52 md:h-56 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-bold rounded-full shadow-lg border border-teal-400 transform group-hover:scale-110 transition-transform duration-300">
                        {item.category}
                      </div>
                      
                      {/* Date badge */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex items-center text-teal-600">
                            <Calendar size={16} className="mr-2" />
                            <span className="font-medium text-sm">{item.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="p-5 md:p-6">
                    <Link to={`/news/${item.id}`} className="block">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors duration-300 leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-5 leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                      {item.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {item.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium hover:bg-teal-50 hover:text-teal-700 transition-colors duration-300"
                        >
                          <Tag size={12} className="inline mr-1" /> {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/news/${item.id}`}
                      className="group/btn inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-all duration-300 transform hover:translate-x-1"
                    >
                      Lire plus
                      <ChevronRight size={18} className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                  
                  {/* Bottom glow effect */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Aucune actualité trouvée</h3>
              <p className="text-lg text-gray-600 mb-6">
                Aucune actualité ne correspond à votre recherche.<br />
                Essayez avec d'autres termes ou filtres.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSearchTerm("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
          
          {/* Bottom decorative element */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
                <div className="text-left">
                  <p className="text-gray-800 font-semibold text-lg">
                    Restez informé de nos actions
                  </p>
                  <p className="text-gray-600 text-sm">
                    Suivez l'actualité de l'ASFO en temps réel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;