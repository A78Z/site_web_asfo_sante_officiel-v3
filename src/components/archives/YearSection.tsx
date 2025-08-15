import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Archive } from 'lucide-react';
import ArchiveCard from './ArchiveCard';

interface Archive {
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

interface YearSectionProps {
  year: string;
  archives: Archive[];
  initialShowCount?: number;
}

const YearSection: React.FC<YearSectionProps> = ({ 
  year, 
  archives, 
  initialShowCount = 3 
}) => {
  const [showAll, setShowAll] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  const displayedArchives = showAll ? archives : archives.slice(0, initialShowCount);
  const hasMore = archives.length > initialShowCount;

  const handleToggle = () => {
    if (!showAll) {
      setIsExpanding(true);
      setTimeout(() => setIsExpanding(false), 500);
    }
    setShowAll(!showAll);
  };

  return (
    <div className="mb-16">
      {/* Year Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
            <Archive className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{year}</h2>
            <p className="text-gray-600">
              {archives.length} mission{archives.length > 1 ? 's' : ''} réalisée{archives.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {hasMore && (
          <button
            onClick={handleToggle}
            className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
          >
            <span className="mr-2 font-medium text-gray-700">
              {showAll ? 'Afficher moins' : 'Afficher plus'}
            </span>
            {showAll ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Archives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedArchives.map((archive, index) => (
          <div
            key={archive.id}
            className={`transition-all duration-500 ${
              isExpanding && index >= initialShowCount
                ? 'animate-fade-in-up'
                : ''
            }`}
            style={{
              animationDelay: isExpanding && index >= initialShowCount 
                ? `${(index - initialShowCount) * 100}ms` 
                : '0ms'
            }}
          >
            <ArchiveCard {...archive} />
          </div>
        ))}
      </div>

      {/* Show More Button (Alternative Position) */}
      {hasMore && !showAll && (
        <div className="text-center mt-8">
          <button
            onClick={handleToggle}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">Voir plus de missions {year}</span>
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default YearSection;