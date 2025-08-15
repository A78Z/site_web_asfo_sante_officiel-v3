import React from 'react';
import SectionTitle from '../components/common/SectionTitle';
import { FileText, Download } from 'lucide-react';

const ReportsPage: React.FC = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'Rapports d\'activité | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  // Generate years array from 2025 to 2000 (descending order)
  const years = Array.from({ length: 26 }, (_, i) => 2025 - i);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-20 bg-teal-600">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Documents and reports" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-700/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              📄 Rapports d'activité de l'ASFO
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Retrouvez ici l'ensemble des rapports d'activité de l'ASFO de 2000 à 2025. Chaque rapport présente le bilan annuel de nos campagnes sanitaires, nos chiffres clés, et nos actions sur le terrain.
            </p>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {years.map(year => (
              <div 
                key={year}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-4">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Rapport {year}</h3>
                    <p className="text-gray-600 mt-1">
                      Bilan de la campagne sanitaire et des activités menées en {year}
                    </p>
                  </div>
                </div>
                
                <a 
                  href="#"
                  className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  <Download size={18} className="mr-2" />
                  📥 Télécharger
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportsPage;