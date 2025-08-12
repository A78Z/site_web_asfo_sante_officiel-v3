import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/common/SectionTitle';
import ReportFilters from '../components/reports/ReportFilters';
import ReportCard from '../components/reports/ReportCard';
import { FileText, TrendingUp, Calendar, Award } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Set page title
  React.useEffect(() => {
    document.title = 'Nos Interventions | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  // Generate years array from 2025 to 2000, excluding 2020 (COVID-19)
  const allYears = Array.from({ length: 26 }, (_, i) => 2025 - i)
    .filter(year => year !== 2020) // Remove 2020 due to COVID-19
    .map(year => year.toString());

  // Reports data with availability status
  const reportsData = allYears.map(year => ({
    year,
    title: `Rapport ${year}`,
    description: `Bilan complet des activités de l'ASFO pour l'année ${year} : campagnes médicales, consultations réalisées, actions communautaires, formations dispensées et impact sur les populations bénéficiaires.`,
    downloadUrl: `/rapport${year}.pdf`,
    isAvailable: ['2020', '2021', '2022', '2023', '2024'].includes(year)
  }));

  // Filter reports based on selected year
  const filteredReports = selectedYear === '' 
    ? reportsData 
    : reportsData.filter(report => report.year === selectedYear);

  const handleYearChange = (year: string) => {
    setIsLoading(true);
    setSelectedYear(year);
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="/aoure.webp" 
            alt="Medical consultation" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-700/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <FileText className="mr-2" size={16} />
              <span>Nos interventions documentées</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Nos Interventions
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              Découvrez les différents services humanitaires offerts par ASFO pour améliorer 
              la santé et le bien-être des populations au Sénégal.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <FileText className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-2xl font-bold text-white mb-2">{allYears.length}</h3>
                <p className="text-white/80">Rapports disponibles</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Calendar className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-2xl font-bold text-white mb-2">25+</h3>
                <p className="text-white/80">Années d'activité</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Award className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-2xl font-bold text-white mb-2">250K+</h3>
                <p className="text-white/80">Bénéficiaires</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-teal-50/30 to-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Rapport d'activité ASFO" 
            subtitle="Plongez au cœur des actions menées par ASFO sur le terrain, à travers un aperçu détaillé de ses campagnes médicales, bilans chiffrés et engagements en faveur de la santé publique au Fouta." 
            center
          />

          {/* Important Note about 2020 */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Calendar className="text-yellow-600" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-yellow-800 mb-2">Note importante</h3>
                  <p className="text-yellow-700 leading-relaxed">
                    <strong>Aucun rapport n'a été produit pour l'année 2020</strong> en raison de la pandémie de COVID-19 
                    qui a suspendu nos activités habituelles. Nos équipes ont repris leurs missions dès 2021 
                    avec des protocoles sanitaires renforcés.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <p className="text-center text-gray-600 mb-8 text-lg">
              Cliquez sur un rapport pour consulter les réalisations de l'ASFO sur l'année correspondante.
            </p>
            
            {/* Filters */}
            <ReportFilters
              years={allYears}
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              totalCount={reportsData.length}
              filteredCount={filteredReports.length}
            />
            
            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
                    <div className="animate-pulse">
                      <div className="flex items-center mb-4">
                        <div className="w-14 h-14 bg-teal-200 rounded-xl mr-4"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-teal-200 rounded mb-2"></div>
                          <div className="h-4 bg-teal-100 rounded w-2/3"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                      </div>
                      <div className="h-12 bg-teal-200 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReports.map((report) => (
                    <div
                      key={report.year}
                      className="transition-all duration-500 hover:scale-105"
                    >
                      <ReportCard {...report} />
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {filteredReports.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="text-teal-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Aucun rapport trouvé</h3>
                    <p className="text-lg text-gray-600 mb-8">
                      Aucun rapport ne correspond à l'année sélectionnée.
                    </p>
                    <button
                      onClick={() => setSelectedYear('')}
                      className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Voir tous les rapports
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Additional Info */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-teal-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="text-teal-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Transparence et redevabilité
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Chaque rapport d'activité témoigne de notre engagement envers la transparence. 
                  Vous y trouverez nos réalisations, nos défis, nos apprentissages et notre impact 
                  mesurable sur les communautés que nous servons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;