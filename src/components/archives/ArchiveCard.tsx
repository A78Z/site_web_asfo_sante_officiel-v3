import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ChevronRight } from 'lucide-react';

interface ArchiveProps {
  id: string;
  year: string;
  title: string;
  location: string;
  date: string;
  participants: number;
  consultations: number;
  imageUrl: string;
  summary: string;
  specialties: {
    name: string;
    count: number;
  }[];
}

const ArchiveCard: React.FC<ArchiveProps> = ({
  id,
  year,
  title,
  consultations,
  imageUrl,
  summary,
}) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
      {/* Image Header */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Year Badge */}
        <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm text-teal-600 text-sm font-bold rounded-full shadow-lg border border-teal-100">
          {year}
        </div>

        {/* Quick Stats Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{consultations}</div>
              <div className="text-xs text-gray-600">Consultations réalisées</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors duration-300">
          {title}
        </h3>
        
        {/* Summary */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {summary}
        </p>
        
        {/* Action Button */}
        <Link
          to={`/archives/${id}`}
          className="group/btn inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Eye size={18} className="mr-2 transition-transform duration-300 group-hover/btn:scale-110" />
          Voir les détails
          <ChevronRight size={18} className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default ArchiveCard;