import React from 'react';
import SectionTitle from '../components/common/SectionTitle';
import MedicalTeam from '../components/about/MedicalTeam';

const MedicalTeamPage: React.FC = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'Notre Équipe Médicale | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-20 bg-teal-600">
        <div className="absolute inset-0 z-0">
          <img 
            src="/medicalteam.webp" 
            alt="Équipe médicale ASFO" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-700/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Notre Équipe Médicale
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Des professionnels de santé dévoués et expérimentés au service de votre bien-être
            </p>
          </div>
        </div>
      </div>

      {/* Medical Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mt-12">
            <MedicalTeam />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicalTeamPage;