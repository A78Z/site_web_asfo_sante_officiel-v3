import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, MessageCircle, Bookmark, Heart } from 'lucide-react';
import Button from '../components/common/Button';

// Sample news data - using the same data from NewsPage
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
    content: "✨ Un vent de renouveau souffle sur la santé communautaire au Fouta\n C’est désormais officiel : Mamadou Thioye, doctorant en troisième année de médecine, vient d’être élu 20e président de l’Action Sanitaire pour le Fouta (ASF0). Un choix qui incarne à la fois la relève, la compétence et l’engagement au service des populations.\nSa nomination n’est pas passée inaperçue. À la croisée entre jeunesse ambitieuse et rigueur professionnelle, Mamadou Thioye suscite un véritable engouement au sein des acteurs sanitaires et des citoyens. “Félicitations et bon vent à lui !”, peut-on lire dans les premières réactions chaleureuses qui saluent son élection. Une nouvelle dynamique semble se dessiner pour cette organisation phare, pilier de la santé communautaire dans la région du Fouta.\n💡 Une vision tournée vers l’avenir\nLe parcours de Mamadou Thioye, à la fois académique et engagé sur le terrain, fait naître de nombreux espoirs. Son profil de jeune médecin en devenir est perçu comme un atout pour moderniser les approches, renforcer les campagnes de sensibilisation, et innover dans l'accès aux soins.\nAccompagné d’une nouvelle équipe pleine d'énergie et de compétences variées, le nouveau président se fixe pour ambition de poursuivre les projets initiés tout en lançant de nouveaux programmes adaptés aux réalités locales, notamment en matière de prévention, de couverture médicale et d’éducation sanitaire.\n🙏 Un hommage appuyé au président sortant : Dr Lamine Diallo\nCe passage de témoin est également l’occasion de saluer le travail remarquable du président sortant, Dr Lamine Diallo, et de toute son équipe. Leur mandat a été marqué par un engagement sans faille et des résultats concrets qui ont contribué à améliorer l’état de santé des populations locales.\nDes campagnes de vaccination réussies, la distribution de matériel médical, ou encore les actions de terrain en période de crise ont permis à l’ASF de renforcer sa crédibilité et son ancrage dans la communauté. “Nous tenons à remercier chaleureusement Dr Diallo pour sa vision, son leadership et son dévouement”, peut-on lire dans la déclaration officielle.\n🔍 Et maintenant ?\nAvec cette nouvelle présidence, les attentes sont grandes. Quels seront les premiers chantiers ? Comment mobiliser les jeunes professionnels de santé ? Quel rôle pour les partenariats locaux et internationaux ? Autant de questions qui trouveront réponse dans les mois à venir.`\nCe qui est certain, c’est que l’Action Sanitaire pour le Fouta entre dans une nouvelle phase de son histoire, avec une gouvernance rajeunie, ancrée dans les valeurs de solidarité, d’excellence et d’innovation.\n🗣️ “Nous croyons en cette jeunesse compétente, ambitieuse et solidaire. Mamadou Thioye incarne cette promesse. Que son mandat soit marqué par des avancées majeures pour la santé au Fouta.”",
    date: "27 Avril 2025",
    author: "Dr. Moussa Sow",
    category: "Président Asfo",
    imageUrl: "/thioye.webp",
    tags: ["president", "asfo", "santé", "fouta"]
  },
  {
    id: "campagne-sensibilisation-covid",
    title: "MATAM SE PRÉPARE POUR LA 26e CAMPAGNE MÉDICALE DE L’ASFO SANTÉ",
    excerpt: "Dépôt de candidatures ouvert du 17 mars au 17 avril 2025",
    content: "L’Action Sanitaire pour le Fouta (ASFO Santé) informe avec enthousiasme l’ensemble des populations de la région de Matam du lancement officiel des dépôts de dossiers en vue de l’organisation de sa 26e grande campagne médicale. Cet événement annuel, profondément ancré dans la vie sociale de la région, vise à rapprocher les soins de santé des populations, surtout celles vivant dans les zones rurales ou à accès difficile.\n🎯 Un rendez-vous de solidarité et de santé\nDepuis sa création, ASFO Santé s’est engagée à offrir des prestations médicales de qualité, gratuites et accessibles à tous. La campagne réunit chaque année médecins, spécialistes, infirmiers, pharmaciens et bénévoles autour d’un même objectif : soulager, soigner et sensibiliser.\nLes bénéficiaires ont accès à des consultations médicales générales et spécialisées, à la délivrance gratuite de médicaments, ainsi qu’à des séances d’éducation sanitaire. Certaines éditions ont même permis la réalisation de petites interventions chirurgicales, selon les besoins recensés sur le terrain.\n📤 Modalités de participation\nToutes les collectivités locales, associations communautaires, centres de santé, daara, groupements de femmes ou de jeunes peuvent soumettre un dossier de candidature pour accueillir l’équipe médicale. Ce dossier doit démontrer les besoins de la localité, les capacités d’accueil, ainsi que la motivation de la communauté à participer activement à l’événement.\n🎯 Nouveauté cette année : vous pouvez désormais soumettre votre candidature directement via le site web de l’ASFO Santé, en cliquant sur le bouton « Candidature » prévu à cet effet.\n📥 Pour ceux qui préfèrent, les dossiers peuvent toujours être envoyés par e-mail à : \n👉 asfosante@gmail.com\n🗓 Dates à retenir :\n➡️ Du 17 mars au 17 avril 2025\n📞 Contacts utiles pour toute information complémentaire :\n📱 77 393 15 72 / 77 481 89 50\n🤝 Engagez votre communauté\nLes responsables d’ASFO Santé encouragent toutes les structures à se mobiliser dès maintenant pour saisir cette chance unique de renforcer l’accès aux soins pour tous. La santé est un droit, et cette campagne en est une belle démonstration.\nASFO Santé, au service d’un Fouta en bonne santé.",
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
    content: "C’est avec une immense joie et une grande fierté que nous adressons nos chaleureuses félicitations au Dr Lamine Diallo, président en exercice de l’ASFO Santé (Action Sanitaire pour le Fouta), qui vient de soutenir avec brio sa thèse de doctorat d’État en médecine. Une soutenance marquée par la rigueur scientifique et la clarté de ses travaux, couronnée par la mention Très Honorable, l’une des plus prestigieuses distinctions dans le domaine.\n🎓 Ce parcours remarquable témoigne non seulement de ses compétences académiques, mais aussi de son dévouement profond pour la santé communautaire, particulièrement au Fouta, où il s’est illustré ces dernières années par une action de terrain constante et un leadership inspirant.\nSous sa présidence, l’ASFO Santé a franchi un cap décisif dans la mise en œuvre de projets de prévention, de sensibilisation et d’accès aux soins pour les populations rurales. Son engagement, sa vision et sa proximité avec les communautés locales ont permis d’enregistrer des avancées concrètes dans plusieurs zones souvent délaissées.\n🙏 En plus de son excellence académique, Dr Diallo est reconnu pour ses qualités humaines : disponibilité, écoute, sens de la responsabilité et esprit de service. Il a su fédérer autour de lui une équipe dynamique et engagée, à laquelle nous rendons également hommage.\nAujourd’hui, alors qu’il franchit une étape majeure dans sa carrière, nous lui souhaitons un avenir professionnel riche en opportunités, en réussites et en impact positif. Son parcours est un exemple inspirant pour la jeunesse du Fouta et bien au-delà.\n👏 Merci, Dr Lamine Diallo, pour votre engagement sans relâche au service des autres. L’Action Sanitaire pour le Fouta vous renouvelle toute sa reconnaissance et vous accompagne de ses meilleurs vœux pour la suite.",
    date: "14 mars 2025",
    author: "Dr. Ibrahima Diop",
    category: "Fierté et reconnaissance",
    imageUrl: "/dr-lamine-diallo.jpg",
    tags: ["FiertéDuFouta", "DrLamineDiallo", "SantéCommunautaire", "ASFOSanté"]
  },
  {
    id: "mission-medicale-kedougou",
    title: "Fierté Foutanienne : L’Action Sanitaire pour le Fouta Félicite Ses Lauréats au Concours des Internes des Hôpitaux du Sénégal",
    excerpt: "Fierté Foutanienne : L’Action Sanitaire pour le Fouta Félicite Ses Lauréats au Concours des Internes des Hôpitaux du Sénégal",
    content: "C’est avec une immense fierté que l’Action Sanitaire pour le Fouta adresse ses plus vives félicitations à ses membres brillamment admis au concours de recrutement des internes des hôpitaux du Sénégal. Ces jeunes professionnels de santé incarnent l’excellence, la persévérance et l’engagement au service du bien-être des populations.\nÀ travers leur réussite, c’est tout le Fouta qui rayonne. Ces lauréats ne sont pas seulement des étudiants ou des praticiens : ils sont les ambassadeurs d’une jeunesse foutanienne compétente, engagée et tournée vers l’avenir. Leur succès confirme, une fois de plus, que l’investissement dans la formation et la rigueur porte toujours ses fruits.\nNous savons les efforts et les sacrifices que ce parcours exige. Passer le concours d’internat dans un système aussi exigeant n’est pas un simple exploit académique : c’est une preuve de détermination, de discipline et d’amour pour la médecine.\nL’Action Sanitaire pour le Fouta salue donc cette performance collective et renouvelle son soutien indéfectible à tous ses membres dans leurs trajectoires professionnelles. Nous les encourageons à continuer de porter haut les valeurs de solidarité, de compétence et de service qui fondent notre vision commune.\nNous tenons également à rappeler que ces réussites individuelles doivent nourrir une dynamique collective : former une élite sanitaire capable de répondre aux défis de santé publique de nos communautés rurales et urbaines.\nEncore bravo à toutes et à tous. Le Fouta est fier de vous. Le Sénégal a besoin de vous. Et l’histoire retiendra que vous avez répondu présent.",
    date: "29 décembre 2024",
    author: "Dr. Fatou Ndiaye",
    category: "Concours des Internes des Hôpitaux du Sénégal",
    imageUrl: "/ly.jpg",
    tags: ["Félicitations ", "ActionSanitaireFouta", "MédecineSénégal", "SantéCommunautaire"]
  },
  {
    id: "collecte-fonds-2023",
    title: "Félicitations à Dr Dalahata Ba : Une Réussite Exemplaire et une Carrière Prometteuse !",
    excerpt: "Félicitations à Dr Dalahata Ba : Une Réussite Exemplaire et une Carrière Prometteuse !",
    content: "Nous tenons à adresser nos plus sincères félicitations à Dr Dalahata Ba pour la soutenance de sa thèse de doctorat d’État en médecine, couronnée de la plus haute mention. Cet accomplissement marquant est le fruit de plusieurs années de travail acharné, de persévérance et de dévouement à la médecine.\nDr Dalahata Ba n’est pas seulement un médecin émérite, mais également un membre clé de l’Action Sanitaire pour le Fouta (ASFO). Depuis son adhésion, il s’est toujours distingué par son engagement sans faille pour la réussite des activités de l’association. Il a été l'un des moteurs principaux qui ont permis à ASFO de mener à bien de nombreuses initiatives de santé publique, touchant directement la vie des populations.\n💡 Un Engagement Constant au Service de la Communauté\nTout au long de son parcours, Dr Ba a su allier excellence académique et action concrète sur le terrain. Ses actions et sa vision en matière de santé ont fortement contribué à améliorer les services de santé dans la région, notamment à travers des campagnes de sensibilisation, des formations continues pour les professionnels de la santé et des initiatives de prévention des maladies. Son engagement ne se limite pas seulement aux mots, mais se traduit par des actes tangibles, visant à offrir un avenir plus sain aux communautés du Fouta.\n👏 Un Modèle de Détermination et de Succès\nSa soutenance de thèse, marquée par l’obtention de la plus haute mention, est la consécration d’années de sacrifices et d'efforts. Mais au-delà de cette réussite académique, c’est son humilité et son sens du service qui font de lui un modèle pour ses collègues et pour les jeunes générations d’étudiants en médecine.\nDr Dalahata Ba incarne les valeurs d’excellence, de passion et de service public. Il représente un exemple vivant de ce que peut accomplir la combinaison de talent, d’ambition et de dévouement.\n🛤 Des Perspectives Radieuses pour l'Avenir\nNous ne doutons pas que cette réussite académique ouvrira de nouvelles portes à Dr Ba, tant dans sa carrière professionnelle que dans ses projets à venir au sein de l'ASFO. Il est évident que son expertise et son leadership seront essentiels pour réaliser de nouvelles initiatives et continuer à faire progresser les projets qui lui tiennent à cœur.\nNous lui souhaitons une carrière brillante et pleine de succès, dans tous les aspects de sa vie professionnelle et personnelle. Que cette nouvelle étape dans sa vie soit l'occasion de multiplier les accomplissements et d'atteindre des sommets encore plus élevés.\n🙏 Merci pour ton Engagement et Ton Travail !\nEnfin, nous remercions Dr Dalahata Ba pour son engagement constant au sein de l’ASFO et pour les inestimables contributions qu’il a apportées à l’organisation. Il fait partie intégrante de notre équipe, et nous sommes tous impatients de continuer à collaborer avec lui pour faire avancer nos missions et projets.\nNous lui adressons nos meilleurs vœux pour la suite de son parcours et espérons qu’il continuera à inspirer et à guider les jeunes talents de demain, tout en contribuant activement à l’évolution de notre système de santé.",
    date: "13 décembre 2024",
    author: "Mme Fatou Ndiaye",
    category: "Félicitations à Dr Dalahata Ba",
    imageUrl: "/dr-dalahata-ba.jpg",
    tags: ["FélicitationsDrDalahataBa", "ExcellenceAcadémique", "ActionSanitairePourLeFouta", "SantéEtEngagement"]
  },
  {
    id: "formation-sage-femmes",
    title: "Félicitations au Pr Oumar BASSOUM : Un Major qui fait rayonner la Médecine et l’Action Sanitaire pour le Fouta",
    excerpt: "Félicitations au Pr Oumar BASSOUM : Un Major qui fait rayonner la Médecine et l’Action Sanitaire pour le Fouta ",
    content: "L’Action Sanitaire pour le Fouta (ASFO) tient à féliciter chaleureusement le Pr Oumar BASSOUM, qui a brillamment réussi au concours d’agrégation de Médecine, décrochant ainsi le titre de Major. Un exploit qui suscite à la fois fierté et admiration dans le monde de la santé et de l’éducation.\nUne Réussite Exceptionnelle\nC'est avec une grande émotion que nous apprenons cette distinction méritée, qui témoigne de l’excellence et du dévouement du Pr Oumar BASSOUM dans le domaine de la médecine. Ce concours d’agrégation, qui est l’un des plus exigeants dans le secteur académique, n’a pas seulement couronné un professionnel de la santé, mais également un modèle d’engagement et de rigueur.\nUn Parcours Remarquable au Service de la Médecine et de la Santé\nLe Pr Oumar BASSOUM n'est pas un inconnu dans le milieu de l’Action Sanitaire pour le Fouta (ASFO). Ancien président de cette organisation, il a œuvré sans relâche pour améliorer l'accès aux soins de santé pour les populations du Fouta. Sa passion pour la médecine et son leadership visionnaire ont fait de lui un acteur incontournable du secteur.\nAvant cette consécration, il a également marqué les esprits en tant qu’un des piliers de la Faculté de Médecine, de Pharmacie et d’Odonto-Stomatologie (FMPO) de l'Université Cheikh Anta Diop de Dakar, où il a su allier la transmission du savoir et la pratique de la médecine avec un engagement constant pour la santé publique.\nUn Modèle pour les Jeunes Générations\nLe Pr Oumar BASSOUM incarne un modèle de réussite à la fois académique et professionnelle, inspirant ainsi la jeunesse du Fouta et les étudiants en médecine de tout le pays. Son parcours est un exemple de persévérance, de discipline, et de passion pour la santé publique, valeurs qui font aujourd’hui la réputation de l’ASFO et de la FMPO.\nL'Action Sanitaire pour le Fouta et la FMPO : Un Héritage Commun\nLe Pr BASSOUM fait honneur à l'ensemble de la FMPO et de l'ASFO. Son succès est une fierté partagée par tous ceux qui croient en l’importance de l’éducation, de la recherche et de l'engagement pour des soins de santé de qualité. En tant qu’ancien président de l’ASFO, il a marqué un tournant décisif dans l’histoire de cette organisation, contribuant à son rayonnement et à la réalisation de nombreuses initiatives locales en matière de santé.\nL’Action Sanitaire pour le Fouta est fière de compter parmi ses membres un homme de la trempe du Pr Oumar BASSOUM, dont l’ambition et la réussite ouvrent la voie à une nouvelle ère pour la médecine au Sénégal et au Fouta.\nNous lui adressons nos sincères félicitations et lui souhaitons encore plus de succès dans ses projets futurs.",
    date: "11 novembre 2024",
    author: "Dr. Aminata Diallo",
    category: "Félicitations au Pr Oumar BASSOUM",
    imageUrl: "/pr-oumar-bassoum.jpg",
    tags: ["PrOumarBASSOUM", "AgrégationMédecine", "FiertéFouta", "ActionSanitaire"]
  }
];

const SingleNewsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState(newsItems.find(item => item.id === id));
  const [currentIndex, setCurrentIndex] = useState(newsItems.findIndex(item => item.id === id));
  
  useEffect(() => {
    // Update the news item and current index when the URL parameter changes
    setNewsItem(newsItems.find(item => item.id === id));
    setCurrentIndex(newsItems.findIndex(item => item.id === id));
    
    // Set page title
    if (newsItem) {
      document.title = `${newsItem.title} | ASFO - Association de Santé et Formation`;
    } else {
      document.title = 'ASFO | Action Sanitaire pour le Fouta';
    }
  }, [id, newsItem]);
  
  if (!newsItem) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 max-w-md mx-auto transform transition-all duration-300 hover:shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Article non trouvé</h1>
          <p className="text-gray-600 mb-8">L'article que vous recherchez n'existe pas ou a été déplacé.</p>
          <Button variant="primary" to="/news">
            Retour aux actualités
          </Button>
        </div>
      </div>
    );
  }
  
  const prevNews = currentIndex > 0 ? newsItems[currentIndex - 1] : null;
  const nextNews = currentIndex < newsItems.length - 1 ? newsItems[currentIndex + 1] : null;
  
  // Format content with paragraphs
  const formattedContent = newsItem.content.split('\n').map((paragraph, index) => (
    <p key={index} className="mb-4">{paragraph}</p>
  ));

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[600px] transition-all duration-500">
        <div className="absolute inset-0 z-0">
          <img 
            src={newsItem.imageUrl} 
            alt={newsItem.title} 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex items-end pb-16 relative z-10">
          <div className="max-w-4xl animate-fade-in-up">
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="inline-block bg-teal-500 text-white text-sm px-4 py-1.5 rounded-full shadow-md transform transition-transform duration-300 hover:scale-105">
                {newsItem.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              {newsItem.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-white/90 text-base gap-6">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Calendar size={18} className="mr-2 text-teal-300" />
                <span className="font-medium">{newsItem.date}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <User size={18} className="mr-2 text-teal-300" />
                <span className="font-medium">{newsItem.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-2/3">
              <article className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-teal-600 prose-a:no-underline hover:prose-a:text-teal-700 prose-a:transition-colors prose-img:rounded-xl prose-img:shadow-md">
                {formattedContent}
              </article>
              
              {/* Tags Section */}
              <div className="mt-10 flex flex-wrap gap-2 border-t border-gray-100 pt-8">
                <Tag size={20} className="text-teal-500 mr-2" />
                {newsItem.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-block bg-gray-100 text-gray-800 text-sm px-4 py-2 rounded-full hover:bg-teal-50 hover:text-teal-700 transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* Social Sharing */}
              <div className="mt-10 bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Share2 size={20} className="mr-2 text-teal-500" />
                  Partager cet article
                </h3>
                <div className="flex space-x-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors transform hover:scale-110 shadow-md"
                    aria-label="Partager sur Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${newsItem.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors transform hover:scale-110 shadow-md"
                    aria-label="Partager sur Twitter"
                  >
                    <Twitter size={20} />
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Lien copié !');
                    }}
                    className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white hover:bg-gray-700 transition-colors transform hover:scale-110 shadow-md"
                    aria-label="Copier le lien"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
              
              {/* Navigation between articles */}
              <div className="mt-10 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between">
                <div className="mb-4 sm:mb-0 group">
                  {prevNews && (
                    <Link 
                      to={`/news/${prevNews.id}`} 
                      className="flex items-center text-gray-700 hover:text-teal-600 transition-all duration-300 transform group-hover:-translate-x-1"
                    >
                      <ChevronLeft size={20} className="mr-2 text-teal-500 transition-transform duration-300 group-hover:-translate-x-1" />
                      <div>
                        <span className="text-sm text-gray-500 block">Article précédent</span>
                        <span className="font-medium line-clamp-1">{prevNews.title.substring(0, 30)}...</span>
                      </div>
                    </Link>
                  )}
                </div>
                <div className="group">
                  {nextNews && (
                    <Link 
                      to={`/news/${nextNews.id}`} 
                      className="flex items-center text-gray-700 hover:text-teal-600 transition-all duration-300 transform group-hover:translate-x-1"
                    >
                      <div className="text-right">
                        <span className="text-sm text-gray-500 block">Article suivant</span>
                        <span className="font-medium line-clamp-1">{nextNews.title.substring(0, 30)}...</span>
                      </div>
                      <ChevronRight size={20} className="ml-2 text-teal-500 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="mt-12 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-8 border border-teal-100 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Vous avez aimé cet article ?</h3>
                <p className="text-gray-700 mb-6">Découvrez comment vous pouvez soutenir nos actions ou rejoindre notre équipe de bénévoles.</p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="primary" 
                    to="/donate"
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                    icon={<Heart size={18} />}
                  >
                    Faire un don
                  </Button>
                  <Button 
                    variant="outline" 
                    to="/join"
                    className="border-2"
                    icon={<MessageCircle size={18} />}
                  >
                    Devenir bénévole
                  </Button>
                </div>
              </div>
            </div>
            
            <aside className="lg:w-1/3">
              <div className="bg-white rounded-xl p-6 sticky top-24 shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Bookmark size={20} className="mr-2 text-teal-500" />
                  Articles similaires
                </h3>
                <div className="space-y-6">
                  {newsItems
                    .filter(item => item.id !== newsItem.id && item.category === newsItem.category)
                    .slice(0, 3)
                    .map(item => (
                      <Link 
                        key={item.id} 
                        to={`/news/${item.id}`}
                        className="block group bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:bg-teal-50 hover:shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div>
                            <h4 className="text-base font-medium text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-2 flex items-center">
                              <Calendar size={14} className="mr-1 text-teal-500" />
                              {item.date}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
                
                <div className="mt-10">
                  <Button 
                    variant="primary" 
                    to="/news"
                    fullWidth 
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px]"
                  >
                    Voir toutes les actualités
                  </Button>
                </div>
                
                {/* Newsletter Signup */}
                <div className="mt-10 pt-10 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Restez informé</h3>
                  <p className="text-gray-600 mb-4">Recevez nos dernières actualités directement dans votre boîte mail.</p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Votre adresse email" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                      S'abonner
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleNewsPage;