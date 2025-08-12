import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X as MenuX, Facebook, Instagram, Youtube, Linkedin, MessageCircle } from 'lucide-react';
import CandidatureModal from '../home/CandidatureModal';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'ACCUEIL', path: '/' },
    { name: 'ASFO', path: '/about' },
    { name: 'ARCHIVES', path: '/archives' },
    { name: 'MÉDIATHÈQUE', path: '/gallery' },
    { name: 'ACTUALITÉS', path: '/news' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: 'https://www.facebook.com/share/1EuuqYDYVc/?mibextid=wwXIfr', label: 'Facebook' },
    { icon: <Instagram size={20} />, href: 'https://www.instagram.com/asfo.sante?igsh=aXBpZGNsNzMycmJ2&utm_source=qr', label: 'Instagram' },
    { icon: <Youtube size={20} />, href: 'https://youtube.com/@asfosante2751?si=lAoZeT1B4ztPWG6s', label: 'YouTube' },
    { icon: <Linkedin size={20} />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <MessageCircle size={20} />, href: 'https://wa.me/+221710401760', label: 'WhatsApp' }
  ];

  return (
    <>
      <header 
        className={`fixed w-full z-40 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-white/98 backdrop-blur-lg shadow-xl border-b border-gray-100/80'
            : 'bg-white/95 backdrop-blur-md border-b border-gray-100/50'
        }`}
        style={{ top: isScrolled ? '0' : '30px' }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20 py-3 lg:py-4">
            
            {/* Logo Section - Enhanced spacing */}
            

            {/* Desktop Navigation - Enhanced spacing */}
            <div className="hidden lg:flex items-center space-x-6">
              <nav className="flex items-center space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-4 py-2.5 text-sm font-semibold transition-all duration-300 rounded-lg group ${
                      location.pathname === link.path
                        ? 'text-teal-600 bg-teal-50 shadow-sm border border-teal-100'
                        : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'
                    }`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    
                    {/* Hover effect background */}
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500/15 to-teal-600/15 scale-0 group-hover:scale-100 transition-transform duration-300 ${
                      location.pathname === link.path ? 'scale-100' : ''
                    }`}></div>
                    
                    {/* Active indicator - Enhanced */}
                    {location.pathname === link.path && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full shadow-sm"></div>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Social Media Icons - Enhanced spacing */}
              <div className="flex items-center space-x-3 px-4 border-l border-gray-200/80 ml-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-gradient-to-br hover:from-teal-500 hover:to-teal-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg border border-transparent hover:border-teal-200"
                    aria-label={social.label}
                  >
                    <span className="transition-transform duration-300 group-hover:scale-110">
                      {React.cloneElement(social.icon as React.ReactElement, { size: 16 })}
                    </span>
                  </a>
                ))}
              </div>

              {/* Action Buttons - Enhanced spacing */}
              <div className="flex items-center space-x-3 ml-4">
                {/* Candidature Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group relative px-4 py-2 text-teal-600 hover:text-white font-medium transition-all duration-300 rounded-lg border border-teal-200 hover:border-teal-400 hover:bg-gradient-to-r hover:from-teal-500 hover:to-teal-600 transform hover:scale-105 hover:shadow-lg overflow-hidden"
                >
                  <span className="relative z-10 text-sm">Candidature</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-teal-600/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-lg"></div>
                </button>
                
                {/* Donation Button */}
                <Link
                  to="/donate"
                  className="group relative px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 overflow-hidden border-0"
                >
                  <span className="relative z-10 flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Don
                  </span>
                  <div className="absolute inset-0 bg-white/25 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-lg"></div>
                </Link>
                
                {/* Support Button - New button to the right */}
                <Link
                  to="/member-card"
                  className="group relative px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 overflow-hidden border-0"
                >
                  <span className="relative z-10 flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Soutenir
                  </span>
                  <div className="absolute inset-0 bg-white/25 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-lg"></div>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative z-50 p-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-md ml-4"
              onClick={toggleMenu}
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <div className="relative w-5 h-5">
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1'
                }`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1'
                }`}></span>
              </div>
            </button>

            {/* Mobile Navigation */}
            <div
              className={`fixed inset-0 bg-white/98 backdrop-blur-lg z-40 transform transition-all duration-500 ease-in-out lg:hidden ${
                isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
              style={{ top: '94px' }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col justify-center items-center px-8 py-16">
                  <div className="space-y-8 text-center w-full max-w-sm">
                    {navLinks.map((link, index) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`block text-xl font-semibold transition-all duration-300 transform hover:scale-105 py-5 px-10 rounded-xl shadow-sm hover:shadow-md ${
                          location.pathname === link.path
                            ? 'text-teal-600 bg-teal-50 border border-teal-200'
                            : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50 border border-transparent hover:border-teal-200'
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {link.name}
                      </Link>
                    ))}

                    {/* Social Media Icons - Mobile */}
                    <div className="flex justify-center space-x-6 pt-12 border-t border-gray-200">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg border border-gray-200 hover:border-teal-200"
                          aria-label={social.label}
                        >
                          {React.cloneElement(social.icon as React.ReactElement, { size: 20 })}
                        </a>
                      ))}
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="pt-12 space-y-6 w-full">
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setIsOpen(false);
                        }}
                        className="w-full px-8 py-4 text-teal-600 bg-teal-50 border border-teal-200 rounded-xl text-lg font-medium hover:bg-teal-100 hover:border-teal-300 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        Candidature
                      </button>
                      
                      <Link
                        to="/donate"
                        className="block w-full px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg text-center"
                      >
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          Faire un don
                        </span>
                      </Link>
                      
                      <Link
                        to="/member-card"
                        className="block w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg text-center"
                      >
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Soutenir
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CandidatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Header;