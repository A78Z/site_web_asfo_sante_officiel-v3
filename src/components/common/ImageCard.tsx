import React from 'react';

interface ImageCardProps {
  image: string;
  title: string;
  description: string;
  imageAlt?: string;
  className?: string;
  onClick?: () => void;
  badge?: string;
  footer?: React.ReactNode;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  title,
  description,
  imageAlt,
  className = '',
  onClick,
  badge,
  footer
}) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={imageAlt || title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {badge && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-teal-500 text-white text-sm font-medium rounded-full">
            {badge}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 text-center mb-3">
          {title}
        </h3>
        <p className="text-gray-600 text-center leading-relaxed">
          {description}
        </p>
        
        {footer && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;