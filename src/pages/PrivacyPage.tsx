import React from 'react';
import SectionTitle from '../components/common/SectionTitle';

const PrivacyPage: React.FC = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'Politique de confidentialité | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-16 bg-teal-600">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-teal-700 opacity-90"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Politique de confidentialité
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Comment nous protégeons vos données personnelles
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                Conditions d'Utilisation et Politique de Confidentialité du Site Web de l'ASFO
              </h1>

              <div className="prose prose-lg max-w-none">
                
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</span>
                    Objet
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Les présentes conditions régissent l'accès et l'utilisation du site web officiel de l'Action Sanitaire pour le Fouta (ASFO), accessible à l'adresse www.asfosante.org. En accédant au site, l'utilisateur accepte pleinement et sans réserve les présentes CGU.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</span>
                    Accès au site
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    L'accès au site est libre, gratuit et ouvert à tous. Certaines rubriques peuvent nécessiter une inscription préalable ou la fourniture d'informations personnelles.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</span>
                    Utilisation autorisée
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Tous les contenus présents sur le site (textes, images, vidéos, logos, documents, etc.) sont protégés par les lois relatives à la propriété intellectuelle. Toute reproduction, distribution ou utilisation sans autorisation expresse de l'ASFO est interdite.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">4</span>
                    Engagement de l'utilisateur
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    L'utilisateur s'engage à :
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Ne pas publier de contenu illicite, diffamatoire ou nuisible
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Ne pas compromettre la sécurité ou le bon fonctionnement du site
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Utiliser le site de manière loyale et conforme à sa destination
                    </li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">5</span>
                    Liens externes
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Des liens hypertextes peuvent renvoyer vers des sites tiers. L'ASFO décline toute responsabilité concernant le contenu ou l'usage de ces sites.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">6</span>
                    Modifications des CGU
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    L'ASFO se réserve le droit de modifier à tout moment les présentes conditions. Toute mise à jour entre en vigueur dès sa publication sur le site.
                  </p>
                </div>

                {/* Separator */}
                <div className="my-12 border-t-2 border-gray-200"></div>

                {/* POLITIQUE DE CONFIDENTIALITÉ */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                  POLITIQUE DE CONFIDENTIALITÉ
                </h1>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</span>
                    Données collectées
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Nous collectons uniquement les données strictement nécessaires via :
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Les formulaires de contact, d'inscription à des événements ou au bénévolat
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Les demandes de partenariat ou de téléchargement de documents
                    </li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</span>
                    Utilisation des données
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Les informations collectées sont utilisées exclusivement pour :
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Répondre aux demandes et sollicitations
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Vous informer sur nos actions et événements
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Gérer les inscriptions aux campagnes et activités
                    </li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</span>
                    Durée de conservation
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Les données personnelles sont conservées pour une durée maximale de 3 ans après la dernière interaction, sauf demande contraire ou obligation légale.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">4</span>
                    Sécurité des données
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    L'ASFO s'engage à protéger les données collectées par des mesures de sécurité physiques et logiques. En aucun cas ces données ne seront vendues, cédées ou partagées avec des tiers à des fins commerciales.
                  </p>
                </div>

                {/* Separator */}
                <div className="my-12 border-t-2 border-gray-200"></div>

                {/* GESTION DES COOKIES */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                  GESTION DES COOKIES
                </h1>

                <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    Lors de la navigation, des cookies peuvent être installés sur le terminal de l'utilisateur afin de faciliter l'accès aux services et d'améliorer l'expérience utilisateur. Ces fichiers sont anonymes et ne permettent pas l'identification directe. L'utilisateur peut à tout moment désactiver les cookies dans les paramètres de son navigateur.
                  </p>
                </div>

                {/* Separator */}
                <div className="my-12 border-t-2 border-gray-200"></div>

                {/* PUBLICATION DES UTILISATEURS */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                  PUBLICATION DES UTILISATEURS
                </h1>

                <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    Les membres peuvent publier des commentaires sur le site. En publiant, ils s'engagent à respecter la loi. L'ASFO se réserve le droit de modérer ou supprimer les publications sans préavis. L'auteur conserve ses droits mais accorde à l'ASFO une licence non exclusive d'usage, de diffusion et d'adaptation de ses contenus.
                  </p>
                </div>

                {/* Separator */}
                <div className="my-12 border-t-2 border-gray-200"></div>

                {/* VOS DROITS */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                  VOS DROITS
                </h1>

                <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Conformément aux lois sur la protection des données (RGPD et équivalents locaux), tout utilisateur dispose :
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      D'un droit d'accès, de rectification, de suppression
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      D'un droit d'opposition au traitement de ses données
                    </li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Ces droits peuvent être exercés en écrivant à : <strong>contact@asfosante.org</strong>
                  </p>
                </div>

                {/* Separator */}
                <div className="my-12 border-t-2 border-gray-200"></div>

                {/* CONTACT */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                  CONTACT
                </h1>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-3 flex-shrink-0"></span>
                      <strong>Email :</strong> asfosante@gmail.com
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <strong>Adresse :</strong> Siège de l'ASFO – Université Cheikh Anta Diop, Dakar, Sénégal
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-3 flex-shrink-0"></span>
                      <strong>Site web :</strong> www.asfosante.org
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mt-12 border border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    <strong>Site officiel :</strong> www.asfosante.org<br />
                    <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
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

export default PrivacyPage;