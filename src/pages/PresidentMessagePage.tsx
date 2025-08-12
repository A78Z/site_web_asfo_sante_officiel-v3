import React from 'react';
import { Quote, Heart, Users, Target } from 'lucide-react';

const PresidentMessagePage: React.FC = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'Le mot du Président | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-16 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Heart className="mr-2 text-red-300" size={16} />
              <span>Message du Président de l'ASFO</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Le mot du Président
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Un message d'engagement et de vision pour l'avenir de la santé communautaire
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* President Profile Card */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 mb-16">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                
                {/* President Photo */}
                <div className="relative">
                  <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white ring-4 ring-teal-100">
                    <img 
                      src="/thioye.webp" 
                      alt="Mamadou THIOYE - Président ASFO"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
                    <Users className="text-white w-6 h-6" />
                  </div>
                </div>

                {/* President Info */}
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Mamadou THIOYE
                  </h2>
                  <p className="text-xl text-teal-600 font-medium italic mb-4">
                    Président de l'Action Sanitaire pour le Fouta
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                      <Target className="w-4 h-4 mr-2" />
                      20e Président
                    </span>
                    <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Doctorant en Médecine
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="relative">
              {/* Quote Icon */}
              <div className="absolute -top-6 -left-6 text-teal-500 opacity-20">
                <Quote size={80} className="fill-current" />
              </div>

              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100 relative z-10">
                <div className="prose prose-lg max-w-none">
                  
                  <div className="text-center mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                      Le mot du Président
                    </h3>
                    <div className="w-20 h-1 bg-teal-500 mx-auto"></div>
                  </div>

                  <div className="space-y-8 text-gray-700 leading-relaxed">
                    
                    <p className="text-lg font-medium text-gray-800 bg-teal-50 p-6 rounded-xl border-l-4 border-teal-500">
                      <strong>Bienvenue au portail web de l'Action Sanitaire pour le Fouta (ASFO).</strong>
                    </p>

                    <p className="text-lg">
                      Ce site incarne une nouvelle étape dans notre volonté de rendre l'ASFO plus accessible, plus visible et plus proche des populations que nous servons depuis plus de deux décennies.
                    </p>

                    <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-8 rounded-2xl border border-blue-100">
                      <p className="text-lg">
                        L'ASFO, c'est une <strong className="text-teal-600">jeunesse engagée</strong>, une <strong className="text-teal-600">chaîne de solidarité intergénérationnelle</strong>, une vision portée par le <strong className="text-teal-600">don de soi</strong>. Depuis sa création en <strong className="text-blue-600">2000</strong>, notre association n'a cessé de mobiliser des professionnels de la santé et bénévoles autour d\'une mission noble : <strong className="text-gray-800">soigner</strong>, <strong className="text-gray-800">former</strong>, <strong className="text-gray-800">sensibiliser</strong> et <strong className="text-gray-800">bâtir un avenir en meilleure santé</strong> pour les zones les plus vulnérables, en particulier le Fouta.
                      </p>
                    </div>

                    <p className="text-lg">
                      Aujourd'hui, grâce à l'extension de nos sections dans les universités du pays, à la modernisation de nos outils de communication et à notre ambition de devenir une <strong className="text-teal-600">ONG structurée</strong>, nous renforçons notre impact et préparons l'avenir avec responsabilité.
                    </p>

                    <div className="bg-yellow-50 p-8 rounded-2xl border border-yellow-200">
                      <p className="text-lg">
                        Ce site est plus qu'une vitrine : il est un <strong className="text-yellow-700">espace de mémoire, de mobilisation, de partage et d'engagement</strong>. Il vous permet de suivre nos actions, de découvrir nos archives, de rejoindre nos équipes ou de nous accompagner comme <strong className="text-yellow-700">partenaire ou mécène</strong>.
                      </p>
                    </div>

                    <div className="text-center bg-gradient-to-r from-teal-600 to-blue-600 text-white p-8 rounded-2xl">
                      <p className="text-xl font-semibold mb-4">
                        <strong>Merci à tous ceux qui, de près ou de loin, soutiennent l'ASFO. C'est ensemble que nous continuerons à faire la différence.</strong>
                      </p>
                    </div>

                    <div className="text-right mt-12 pt-8 border-t border-gray-200">
                      <p className="text-lg font-medium text-gray-600 italic">
                        Mamadou THIOYE
                      </p>
                      <p className="text-teal-600 font-semibold">
                        Président de l'ASFO
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 border border-teal-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Rejoignez notre mission
                </h3>
                <p className="text-gray-600 mb-6">
                  Ensemble, construisons un avenir plus sain pour les communautés du Fouta et au-delà
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a 
                    href="/join" 
                    className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                  >
                    <Users className="mr-2" size={20} />
                    Devenir bénévole
                  </a>
                  <a 
                    href="/donate" 
                    className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    <Heart className="mr-2" size={20} />
                    Faire un don
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PresidentMessagePage;