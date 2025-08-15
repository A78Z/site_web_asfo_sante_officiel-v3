import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  text?: string;
  className?: string;
  variant?: 'primary' | 'outline';
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  text = "Contacter via WhatsApp",
  className = '',
  variant = 'primary'
}) => {
  // Remove any non-numeric characters from phone number
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}`;

  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-[#075E54] hover:bg-[#128C7E] text-white focus:ring-[#075E54]",
    outline: "border-2 border-[#075E54] text-[#075E54] hover:bg-[#075E54] hover:text-white focus:ring-[#075E54]"
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variantStyles[variant]} px-6 py-3 ${className}`}
    >
      <MessageCircle className="mr-2" size={20} />
      <span>{text}</span>
    </a>
  );
};

export default WhatsAppButton;