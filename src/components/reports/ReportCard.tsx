import React from 'react';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

interface ReportCardProps {
  year: string;
  title: string;
  description: string;
  downloadUrl?: string;
  isAvailable: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({
  year,
  title,
  description,
  downloadUrl,
  isAvailable
}) => {
  const handleDownload = () => {
    if (!isAvailable) {
      alert('Ce rapport sera bientôt disponible au téléchargement.');
      return;
    }
    
    // Create download link with proper filename
    const link = document.createElement('a');
    link.href = `/rapport${year}.pdf`;
    link.download = `rapport${year}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-teal-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <FileText size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors duration-300">
              {title}
            </h3>
            <div className="flex items-center text-teal-600 text-sm font-medium mt-1">
              <Calendar size={14} className="mr-1" />
              <span>Année {year}</span>
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isAvailable 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
        }`}>
          {isAvailable ? 'Disponible' : 'Bientôt'}
        </div>
      </div>
      
      {/* Description */}
      <p className="text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>
      
      {/* Stats Preview */}
      <div className="bg-gradient-to-r from-teal-50 to-teal-100/50 rounded-xl p-4 mb-6 border border-teal-100">
        <div className="flex items-center text-teal-700">
          <TrendingUp size={16} className="mr-2" />
          <span className="text-sm font-medium">
            Bilan complet des activités {year}
          </span>
        </div>
      </div>
      
      {/* Download Button */}
      <button
        onClick={handleDownload}
        className={`w-full flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
          isAvailable
            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-teal-700'
            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!isAvailable}
      >
        <Download size={18} className="mr-2" />
        {isAvailable ? 'Télécharger le rapport' : 'Bientôt disponible'}
      </button>
    </div>
  );
};

export default ReportCard;