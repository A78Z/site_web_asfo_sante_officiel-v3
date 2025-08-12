import React, { useState } from 'react';
import SectionTitle from '../components/common/SectionTitle';
import Button from '../components/common/Button';
import MobilePaymentModal from '../components/common/MobilePaymentModal';
import { Heart, CheckCircle, DollarSign, CreditCard, Calendar, Activity, Smartphone, User } from 'lucide-react';

const DonatePage: React.FC = () => {
  const [isMobilePaymentModalOpen, setIsMobilePaymentModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'wave' | 'orange'>('wave');

  // Set page title
  React.useEffect(() => {
    document.title = 'ASFO | Action Sanitair pour le Fouta';
  }, []);

  const impactItems = [
    {
      amount: "10 €",
      description: "Permet de fournir des médicaments essentiels à un patient"
    },
    {
      amount: "25 €",
      description: "Finance une consultation médicale complète pour une personne"
    },
    {
      amount: "50 €",
      description: "Contribue à l'achat de matériel médical pour les missions"
    },
    {
      amount: "100 €",
      description: "Soutient une journée de sensibilisation dans un village"
    },
    {
      amount: "250 €",
      description: "Finance la formation d'un agent de santé communautaire"
    },
    {
      amount: "500 €",
      description: "Permet d'organiser une mission médicale d'une journée dans un village"
    }
  ];

  const openMobilePaymentModal = (provider: 'wave' | 'orange') => {
    setSelectedProvider(provider);
    setIsMobilePaymentModalOpen(true);
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-20 bg-teal-600">
        <div className="absolute inset-0 z-0">
          <img 
            src="/41.webp" 
            alt="ASFO medical mission" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-700/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Heart className="mr-2 text-red-300" size={16} />
              <span>Votre générosité sauve des vies</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Faire un don à ASFO
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Votre soutien financier est essentiel pour nous permettre de continuer nos missions humanitaires auprès des populations vulnérables au Sénégal.
            </p>
            
            <Button 
              variant="accent" 
              size="large" 
              href="#donation-form"
              className="bg-red-500 hover:bg-red-600"
            >
              Je fais un don maintenant
            </Button>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="L'Impact de Votre Don" 
            subtitle="Découvrez comment votre contribution fait une différence concrète sur le terrain" 
            center
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {impactItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex items-start transition-all duration-300 hover:shadow-md"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4 text-teal-600">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.amount}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section id="donation-form" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionTitle 
                title="Faites un Don" 
                subtitle="Choisissez le montant et la méthode de votre don" 
              />
              
              <p className="text-gray-600 mb-8">
                ASFO est une association à but non lucratif reconnue d'utilité publique. Vos dons sont déductibles des impôts à hauteur de 66% dans la limite de 20% de votre revenu imposable.
              </p>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Je fais un don</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant du don
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[10, 25, 50, 100, 250, 500].map((amount, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`py-2 px-4 ${index === 2 ? 
                          'bg-teal-600 text-white' : 
                          'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors`}
                      >
                        {amount} €
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Autre montant
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="custom-amount"
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-gray-800"
                        placeholder="Montant personnalisé"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fréquence du don
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="py-2 px-4 bg-teal-600 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                    >
                      Ponctuel
                    </button>
                    <button
                      type="button"
                      className="py-2 px-4 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                    >
                      Mensuel
                    </button>
                  </div>
                </div>
                
                <Button 
                  variant="accent" 
                  size="large" 
                  fullWidth
                  className="mt-4 bg-red-500 hover:bg-red-600"
                  icon={<Heart size={18} />}
                >
                  Valider mon don
                </Button>
                
                <div className="mt-6 flex items-center justify-center space-x-4">
                  <CreditCard size={20} className="text-gray-500" />
                  <span className="text-gray-500 text-sm">Paiement sécurisé</span>
                </div>
              </div>

              {/* Mobile Payment Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Pour nos donateurs au Sénégal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => openMobilePaymentModal('wave')}
              className="flex items-center justify-center p-4 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-all duration-300 group"
            >
              <img src="/wave.webp" alt="Logo Wave" className="w-6 h-6 mr-3" />
              <span className="font-medium text-blue-700">Faire un don via Wave</span>
            </button>

            <button
              onClick={() => openMobilePaymentModal('orange')}
             className="flex items-center justify-center p-4 bg-orange-50 border border-orange-100 rounded-lg hover:bg-orange-100 transition-all duration-300 group"
            >
             <img src="/orange_money.webp" alt="Logo Orange Money" className="w-6 h-6 mr-3" />
             <span className="font-medium text-orange-700">Faire un don via Orange Money</span>
            </button>
            </div>

                <p className="text-sm text-gray-600 text-center mt-4">
                  Les dons via Wave et Orange Money sont instantanés et sécurisés.
                </p>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 text-red-600">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Pourquoi faire un don ?</h3>
                    <p className="text-gray-600">
                      Votre don permet de financer nos missions médicales humanitaires au Sénégal, d'acheter des médicaments et du matériel médical, et de former le personnel de santé local.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-600">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Comment sont utilisés vos dons ?</h3>
                    <p className="text-gray-600">
                      80% de vos dons sont directement affectés à nos missions sur le terrain, 15% aux frais de fonctionnement et 5% à la communication et à la collecte de fonds.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 text-green-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Déduction fiscale</h3>
                    <p className="text-gray-600">
                      Un don de 100€ ne vous coûte que 34€ après déduction fiscale. Vous recevrez automatiquement un reçu fiscal pour votre déclaration d'impôts.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-2">Autres moyens de faire un don</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                      <span>Par chèque à l'ordre de ASFO</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                      <span>Par virement bancaire (RIB sur demande)</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                      <span>Dons en nature (médicaments, matériel médical...)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Témoignages de Donateurs" 
            subtitle="Ils nous soutiennent et expliquent pourquoi" 
            center
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                name: "Mamadou Diop",
                role: "Donateur régulier",
                quote: "Je soutiens ASFO depuis 5 ans car je sais que mon don est utilisé efficacement. Les rapports d'activité détaillés me permettent de suivre l'impact concret de ma contribution.",
              },
              {
                name: "Aissatou Ndiaye",
                role: "Donatrice et ancienne bénévole",
                quote: "Après avoir participé à une mission avec ASFO, j'ai décidé de continuer à soutenir financièrement cette association. Je peux témoigner de leur sérieux et de l'impact réel de leurs actions.",
              },
              {
                name: "Entreprise AxiomText",
                role: "Partenaire ASFO",
                quote: "Notre entreprise soutient ASFO dans le cadre de notre politique RSE. Nous sommes fiers de contribuer à améliorer l'accès aux soins des populations défavorisées au Sénégal.",
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="text-teal-600" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Payment Modal */}
      <MobilePaymentModal
        isOpen={isMobilePaymentModalOpen}
        onClose={() => setIsMobilePaymentModalOpen(false)}
        provider={selectedProvider}
        phoneNumber="+221 77 058 17 88"
      />
    </div>
  );
};

export default DonatePage;