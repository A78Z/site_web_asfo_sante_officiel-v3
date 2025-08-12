import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'Page non trouvée | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-500">
            <AlertTriangle size={48} />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">Page non trouvée</h2>
        
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-12">
          La page que vous cherchez n'existe pas ou a été déplacée. 
          Veuillez retourner à la page d'accueil ou utiliser la navigation.
        </p>
        
        <Button 
          variant="primary" 
          size="large" 
          to="/"
          icon={<Home size={20} />}
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;