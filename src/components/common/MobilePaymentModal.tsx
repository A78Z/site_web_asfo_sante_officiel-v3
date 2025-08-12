import React from 'react';
import { X, Smartphone, CheckCircle } from 'lucide-react';

interface MobilePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: 'wave' | 'orange';
  phoneNumber: string;
}

const MobilePaymentModal: React.FC<MobilePaymentModalProps> = ({
  isOpen,
  onClose,
  provider,
  phoneNumber,
}) => {
  if (!isOpen) return null;

  const providerInfo = {
    wave: {
      name: 'Wave',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
    },
    orange: {
      name: 'Orange Money',
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      bgColor: 'bg-orange-50',
    },
  };

  const { name, color, textColor, borderColor, bgColor } = providerInfo[provider];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all"
          onClick={e => e.stopPropagation()}
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Smartphone className="text-white" size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Payer avec {name}
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              Suivez ces étapes pour effectuer votre don via {name}
            </p>

            <div className={`${bgColor} border ${borderColor} rounded-lg p-4 mb-6`}>
              <div className="text-center mb-2">
                <span className="text-sm text-gray-600">Numéro à créditer</span>
                <div className={`text-xl font-bold ${textColor}`}>
                  {phoneNumber}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="font-medium text-gray-600">1</span>
                </div>
                <div>
                  <p className="text-gray-700">Ouvrez votre application {name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="font-medium text-gray-600">2</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    Sélectionnez "Envoyer de l'argent" et entrez le numéro ci-dessus
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="font-medium text-gray-600">3</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    Saisissez le montant de votre don et validez la transaction
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-lg flex items-start">
              <CheckCircle className="text-green-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-green-800">
                Votre don sera instantanément crédité sur notre compte. Un reçu vous sera envoyé par SMS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePaymentModal;