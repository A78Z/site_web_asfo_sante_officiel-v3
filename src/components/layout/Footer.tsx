import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import WhatsAppButton from '../common/WhatsAppButton';
import { Button } from '../ui/button';
import { createObject, queryObjects } from '../../lib/parse';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook size={20} />, href: 'https://www.facebook.com/share/1EuuqYDYVc/?mibextid=wwXIfr', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: <Instagram size={20} />, href: 'https://www.instagram.com/asfo.sante?igsh=aXBpZGNsNzMycmJ2&utm_source=qr', label: 'Instagram', color: 'hover:bg-pink-600' },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-2.54v5.79a3.07 3.07 0 0 1-3.07 3.07 3.07 3.07 0 0 1-3.07-3.07V2H5.6v5.79a4.83 4.83 0 0 0 4.83 4.83c.24 0 .48 0 .72-.05v9.02h2.54v-9.02c.24.05.48.05.72.05a4.83 4.83 0 0 0 4.83-4.83V6.69h.35Z" />
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
            <div className="space-y-3">
              <WhatsAppButton
                phoneNumber="+221710401760"
                className="w-full justify-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-0"
              />
              <a
                href="https://whatsapp.com/channel/0029VbApa2jFSAtDZBz9pr1o"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-3 font-medium text-green-400 backdrop-blur-sm transition-all duration-300 hover:border-green-400/50 hover:bg-green-500/20 hover:text-white hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-0.5"
                style={{ touchAction: 'manipulation' }}
              >
                <svg className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-sm">Suivre notre chaîne WhatsApp</span>
              </a>
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
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
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
                <div className="flex flex-col gap-1">
                  <a href="mailto:contact@asfosante.org" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 break-all text-sm lg:text-base">
                    contact@asfosante.org
                  </a>
                  <a href="mailto:asfosante@gmail.com" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 break-all text-sm lg:text-base">
                    asfosante@gmail.com
                  </a>
                </div>
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

            {/* Newsletter */}
            <FooterNewsletter />

            {/* CTA Candidature Mobile & Desktop */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <Link to="/candidature" className="block w-full outline-none">
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-lg h-auto py-5 rounded-xl shadow-lg hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300 animate-[pulse_3s_ease-in-out_infinite] border-none flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative z-10 text-xl">🚑</span>
                  <span className="relative z-10 tracking-wide">Déposer une candidature</span>
                </Button>
              </Link>
            </div>
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

/* ── Footer Newsletter ── */
function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle');
  const isValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!isValid(normalized)) return;
    setStatus('loading');
    try {
      const { results } = await queryObjects('NewsletterSubscribers', {
        where: { email: normalized },
        limit: 1,
      });
      if (results.length > 0) { setStatus('exists'); return; }
      await createObject('NewsletterSubscribers', { email: normalized, status: 'Actif' });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-700/50">
      <h4 className="text-sm font-bold text-teal-400 mb-3">Newsletter</h4>
      {status === 'success' ? (
        <p className="text-sm text-emerald-400 font-medium">Merci ! Inscription confirmée.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
            placeholder="Votre email"
            required
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800/60 border border-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={status === 'loading' || !isValid(email)}
            className="w-full bg-teal-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal-500 transition-colors disabled:opacity-50"
            style={{ touchAction: 'manipulation' }}
          >
            {status === 'loading' ? 'Inscription...' : "S'abonner à la newsletter"}
          </button>
          {status === 'exists' && <p className="text-xs text-amber-400">Cet email est déjà inscrit.</p>}
          {status === 'error' && <p className="text-xs text-red-400">Erreur. Veuillez réessayer.</p>}
        </form>
      )}
    </div>
  );
}

export default Footer;