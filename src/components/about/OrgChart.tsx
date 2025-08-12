import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface MemberProps {
  title: string;
  name?: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

const OrgMember: React.FC<MemberProps> = ({ title, name, imageUrl, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = React.Children.count(children) > 0;

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div 
        className={`relative transition-all duration-500 transform ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="bg-white rounded-lg shadow-md p-4 w-64 transition-all duration-300 hover:shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={name || title} 
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-800">{title}</h3>
              {name && <p className="text-sm text-gray-600">{name}</p>}
            </div>
          </div>
          
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
        </div>
      </div>

      {hasChildren && (
        <div 
          className={`mt-8 transition-all duration-300 transform origin-top ${
            isExpanded ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0'
          }`}
        >
          <div className="w-px h-8 bg-gray-300 mx-auto -mt-4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const OrgChart: React.FC = () => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[768px] p-8">
        <div className="space-y-12">
          {/* Top Level */}
          <OrgMember 
            title="Président(e)"
            imageUrl="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg"
          >
            {/* Second Level */}
            <OrgMember 
              title="Vice-Président(e)"
              imageUrl="https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg"
            >
              
            </OrgMember>

            <OrgMember 
              title="Secrétaire Général(e)"
              imageUrl="https://images.pexels.com/photos/5722164/pexels-photo-5722164.jpeg"
            >
              <OrgMember title="Secrétaire Adjoint(e)" />
            </OrgMember>

            <OrgMember 
              title="Trésorier(e)"
              imageUrl="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg"
            >
              <OrgMember title="Trésorier Adjoint(e)" />
            </OrgMember>
          </OrgMember>

          {/* Volunteers Section */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Volontaires et Bénévoles Actifs
              </h2>
              <p className="text-gray-600">
                Plus de 600 bénévoles engagés dans nos missions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-teal-50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Médecins</h3>
                <p className="text-gray-600">200+ bénévoles</p>
              </div>
              
              <div className="bg-teal-50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Paramedicaux</h3>
                <p className="text-gray-600">350+ bénévoles</p>
              </div>
              
              <div className="bg-teal-50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Autres</h3>
                <p className="text-gray-600">50+ bénévoles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgChart;