import React from 'react';
import { Filter, Calendar } from 'lucide-react';

interface ArchiveFiltersProps {
  years: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
  totalCount: number;
  filteredCount: number;
}

const ArchiveFilters: React.FC<ArchiveFiltersProps> = ({
  years,
  selectedYear,
  onYearChange,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Filter Header */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
            <Filter className="text-teal-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Filtrer par année</h3>
            <p className="text-sm text-gray-600">
              {filteredCount} mission{filteredCount > 1 ? 's' : ''} sur {totalCount} au total
            </p>
          </div>
        </div>

        {/* Year Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onYearChange('')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              selectedYear === ''
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar size={16} className="inline mr-2" />
            Toutes les années
          </button>
          
          {years.map((year) => (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedYear === year
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchiveFilters;