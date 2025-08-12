import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import WhatsAppButton from '../common/WhatsAppButton';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook size={20} />, href: 'https://www.facebook.com/share/1EuuqYDYVc/?mibextid=wwXIfr', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: <Instagram size={20} />, href: 'https://www.instagram.com/asfo.sante?igsh=aXBpZGNsNzMycmJ2&utm_source=qr', label: 'Instagram', color: 'hover:bg-pink-600' },
    { 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-2.54v5.79a3.07 3.07 0 0 1-3.07 3.07 3.07 3.07 0 0 1-3.07-3.07V2H5.6v5.79a4.83 4.83 0 0 0 4.83 4.83c.24 0 .48 0 .72-.05v9.02h2.54v-9.02c.24.05.48.05.72.05a4.83 4.83 0 0 0 4.83-4.83V6.69h.35Z"/>
        </svg>
      ), 
      href: 'https://www.tiktok.com/@asfo.sante?_t=ZM-8xhjTZx6pUM&_r=1', 
      label: 'TikTok', 
      color: 'hover:bg-black' 
    },
    { icon: <Youtube size={20} />, href: 'https://youtube.com/@asfosante2751?si=lAoZeT1B4ztPWG6s', label: 'YouTube', color: 'hover:bg-red-600' },
    { icon: <Linkedin size={20} />, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:bg-blue-700' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20 pb-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Logo and About */}
          <div className="md:col-span-1 relative">
            <div className="mb-6">
              <img className="logo transition-transform duration-300 hover:scale-105" src="../../logo.png" alt="ASFO Logo" />
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed text-sm lg:text-base">
              Fondée dans les années 2000 par des étudiants en santé, l'ASFO œuvre pour l'accès aux soins et la solidarité en milieu communautaire.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group w-12 h-12 rounded-xl flex items-center justify-center bg-gray-800/50 backdrop-blur-sm text-gray-300 ${social.color} hover:text-white transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:-translate-y-1 border border-gray-700/50 hover:border-transparent`}
                  aria-label={social.label}
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
            
            {/* WhatsApp Button */}
            <div>
              <WhatsAppButton 
                phoneNumber="+221710401760"
                className="w-full justify-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-0"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1 relative">
            {/* Subtle separator line */}
            <div className="hidden md:block absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-700/50 to-transparent"></div>
            
            <h3 className="text-xl font-bold mb-6 text-teal-400 relative">
              Liens rapides
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-400 to-transparent rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li className="group">
                <Link to="/" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Accueil
                </Link>
              </li>
              <li className="group">
                <Link to="/about" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Présentation de l'ASFO
                </Link>
              </li>
              <li className="group">
                <Link to="/president-message" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Le mot du Président
                </Link>
              </li>
              <li className="group">
                <Link to="/organization" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Notre organisation
                </Link>
              </li>
              <li className="group">
                <Link to="/notre-equipe-medicale" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Notre Équipe Médicale
                </Link>
              </li>
              <li className="group">
                <Link to="/archives" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Archives des Missions
                </Link>
              </li>
              <li className="group">
                <Link to="/gallery" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Notre Médiathèque
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-1 relative">
            {/* Subtle separator line */}
            <div className="hidden md:block absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-700/50 to-transparent"></div>
            
            <h3 className="text-xl font-bold mb-6 text-teal-400 relative">
              Nos Services
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-400 to-transparent rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li className="group">
                <Link to="/services/consultations" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Consultations medicales
                </Link>
              </li>
              <li className="group">
                <Link to="/services/awareness" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Campagnes de sensibilisation
                </Link>
              </li>
              <li className="group">
                <Link to="/services/training" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Formations et renforcement
                </Link>
              </li>
              <li className="group">
                <Link to="/services" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Rapport d'activité ASFO
                </Link>
              </li>
              <li className="group">
                <Link to="/join" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Rejoignez notre équipe
                </Link>
              </li>
              <li className="group">
                <Link to="/donate" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group-hover:translate-x-1 text-sm lg:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300 mr-0 group-hover:mr-3 rounded-full"></span>
                  Je fais un don maintenant
                </Link>
              </li>
            </ul>
            
            {/* Member Card Button */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <Link
                to="/member-card"
                className="group relative inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-0"
              >
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                  </svg>
                  Commander ma carte membre
                </span>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1 relative">
            {/* Subtle separator line */}
            <div className="hidden md:block absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-700/50 to-transparent"></div>
            
            <h3 className="text-xl font-bold mb-6 text-teal-400 relative">
              Contact
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-400 to-transparent rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              <li className="group flex items-start">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mr-4 mt-0.5 group-hover:bg-teal-500/20 transition-colors duration-300">
                  <Mail size={18} className="text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
                </div>
                <a href="mailto:contact@asfosante.org" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 break-all text-sm lg:text-base">
                  contact@asfosante.org
                </a>
              </li>
              <li className="group flex items-start">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mr-4 mt-0.5 group-hover:bg-teal-500/20 transition-colors duration-300">
                  <Phone size={18} className="text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
                </div>
                <a href="tel:+221770581788" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 text-sm lg:text-base">
                  +221 71 040 17 60
                </a>
              </li>
              <li className="group flex items-start">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mr-4 mt-0.5 group-hover:bg-teal-500/20 transition-colors duration-300">
                  <MapPin size={18} className="text-teal-400 group-hover:text-teal-300 transition-colors duration-300 flex-shrink-0" />
                </div>
                <span className="text-gray-300 leading-relaxed text-sm lg:text-base">
                  Faculté de Médecine et Pharmacie, Dakar, Sénégal
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="relative mt-16 pt-8">
          {/* Gradient separator */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>
          
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm lg:text-base flex items-center font-medium">
              &copy; {currentYear} ASFO - Tous droits réservés.
            </p>

            <div className="flex justify-center">
              <Link to="/privacy" className="text-gray-300 text-sm lg:text-base hover:text-white transition-all duration-300 hover:translate-x-1 relative group font-medium">
                Politique de confidentialité
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;