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
          {/* Enhanced Banking Information Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2b7a78' }}>
                💚 Soutenez ASFO Santé
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Ensemble, sauvons des vies et améliorons la santé des communautés.
              </p>
            </div>
            
            <div 
              className="rounded-xl p-8 shadow-xl text-center relative overflow-hidden border-2 mb-12"
              style={{
                background: 'linear-gradient(135deg, #eafaf9, #d6f4ef)',
                borderColor: '#2b7a78',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}
            >
              {/* Icon */}
              <div className="mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-10 h-10 mx-auto" 
                  style={{ fill: '#2b7a78' }}
                  viewBox="0 0 24 24"
                >
                  <path d="M3 6l9-4 9 4v6c0 5-4 9-9 9s-9-4-9-9V6zm9-2.18L5 6.09v5.66c0 3.87 3.13 7 7 7s7-3.13 7-7V6.09l-7-2.27z"/>
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#2b7a78' }}>
                Coordonnées Bancaires pour Virement
              </h3>
              
              <div className="space-y-2 mb-6 text-lg">
                <p><strong>Titulaire :</strong> ASSOCIATION « ACTION SANITAIRE POUR LE FOUTA »</p>
                <p><strong>IBAN :</strong> SN08 SN03 9010 0106 4657 2045 0011</p>
                <p><strong>BIC/Swift :</strong> LHSESNDAXXX</p>
              </div>
              
              <p className="text-gray-600 text-sm">
                💡 Merci d'indiquer <strong>"Don ASFO Santé"</strong> en référence de votre virement.
              </p>
            </div>
          </div>

          {/* Impact Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8" style={{ color: '#2b7a78' }}>
              L'Impact de Votre Don
            </h3>
            <p className="text-center text-gray-600 mb-8">
              Découvrez comment votre contribution fait une différence concrète sur le terrain
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {impactItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1"
                style={{ 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  ':hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
                  }
                }}
              >
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                  <CheckCircle size={24} />
                </div>
                <div className="text-lg font-bold mb-2" style={{ color: '#2b7a78' }}>
                  {item.amount}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          
          {/* Explanations Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div 
              className="bg-white rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
                <Heart size={24} />
              </div>
              <h4 className="text-xl font-bold mb-4" style={{ color: '#2b7a78' }}>
                Pourquoi faire un don ?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Votre don finance nos missions médicales au Sénégal, l'achat de médicaments et de matériel médical, et la formation du personnel.
              </p>
            </div>
            
            <div 
              className="bg-white rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                <Activity size={24} />
              </div>
              <h4 className="text-xl font-bold mb-4" style={{ color: '#2b7a78' }}>
                Comment nous utilisons vos dons
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Chaque euro est utilisé de manière transparente et efficace pour maximiser l'impact de nos actions sur le terrain.
              </p>
            </div>
            
            <div 
              className="bg-white rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                <CheckCircle size={24} />
              </div>
              <h4 className="text-xl font-bold mb-4" style={{ color: '#2b7a78' }}>
                Transparence et suivi
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Nous publions régulièrement des rapports détaillés sur l'utilisation des fonds et l'impact de nos actions.
              </p>
            </div>
          </div>

          {/* Mobile Payment Section for Senegal */}
          <div className="bg-white rounded-lg p-8 mb-8" style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Pour nos donateurs au Sénégal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            <p className="text-sm text-gray-600 text-center">
              Les dons via Wave et Orange Money sont instantanés et sécurisés.
            </p>
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