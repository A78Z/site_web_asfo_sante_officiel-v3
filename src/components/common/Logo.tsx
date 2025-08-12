import React from 'react';

interface LogoProps {
  size?: 'small' | 'normal' | 'large';
  variant?: 'default' | 'white';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'normal', 
  variant = 'default' 
}) => {
  let sizeClass;
  switch (size) {
    case 'small':
      sizeClass = 'h-10';
      break;
    case 'large':
      sizeClass = 'h-16';
      break;
    default:
      sizeClass = 'h-12';
  }

  const textColor = variant === 'white' ? 'text-white' : 'text-gray-800';
  const accentColor = variant === 'white' ? 'text-white' : 'text-teal-600';

  return (
    <div className={`flex items-center ${sizeClass} group transition-transform duration-300 hover:scale-105`}>
      <div className="relative flex items-center">
        <div className="absolute -inset-1 bg-teal-500 rounded-full opacity-20 blur"></div>
        <div className={`relative flex flex-col items-center justify-center ${size === 'small' ? 'w-8 h-8' : size === 'large' ? 'w-12 h-12' : 'w-10 h-10'} bg-white rounded-full shadow-md`}>
          <div className="relative w-full h-full">
            {/* Cross Symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/2 h-[2px] bg-red-500"></div>
              <div className="h-1/2 w-[2px] bg-red-500"></div>
            </div>
            {/* House Icon */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/5 h-2/5">
              <div className="w-full h-full border-2 border-teal-600 rounded-sm"></div>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-teal-600"></div>
            </div>
            {/* Stethoscope */}
            <div className="absolute top-1 right-1 w-2 h-2 border-2 border-teal-600 rounded-full"></div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Logo;