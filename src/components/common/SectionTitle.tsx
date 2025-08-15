import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  center = false,
  className = '',
}) => {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-lg text-gray-600 mt-2 leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`h-1 w-20 bg-teal-500 mt-4 ${center ? 'mx-auto' : ''}`}></div>
    </div>
  );
};

export default SectionTitle;