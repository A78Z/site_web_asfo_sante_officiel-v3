import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'small' | 'medium' | 'large';
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  to,
  href,
  onClick,
  className = '',
  disabled = false,
  fullWidth = false,
  type = 'button',
  icon,
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500',
    accent: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    outline: 'bg-transparent text-teal-600 border border-teal-600 hover:bg-teal-50 focus:ring-teal-500',
  };
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };
  
  const disabledStyles = disabled 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : '';
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const allStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${widthStyles} ${className}`;

  const iconElement = icon && (
    <span className={`${children ? 'mr-2' : ''}`}>{icon}</span>
  );

  if (to) {
    return (
      <Link to={to} className={allStyles}>
        {iconElement}
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={allStyles} target="_blank" rel="noopener noreferrer">
        {iconElement}
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={allStyles}
      onClick={onClick}
      disabled={disabled}
    >
      {iconElement}
      {children}
    </button>
  );
};

export default Button;