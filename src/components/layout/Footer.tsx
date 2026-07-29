import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  Handshake,
  Users,
  Ambulance,
  ChevronDown,
  ExternalLink,
  ArrowUp,
  CalendarDays,
  Stethoscope,
} from 'lucide-react';
import WhatsAppButton from '../common/WhatsAppButton';
import MobileAppShowcase from './MobileAppShowcase';
import { createObject, queryObjects } from '../../lib/parse';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

/* ------------------------------------------------------------------ */
/* Données                                                              */
/* ------------------------------------------------------------------ */

const QUICK_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/about', label: "Présentation de l'ASFO" },
  { to: '/president-message', label: 'Le mot du Président' },
  { to: '/organization', label: 'Notre organisation' },
  { to: '/notre-equipe-medicale', label: 'Notre Équipe Médicale' },
  { to: '/archives', label: 'Archives des Missions' },
  { to: '/gallery', label: 'Notre Médiathèque' },
];

const SERVICE_LINKS = [
  { to: '/services/consultations', label: 'Consultations médicales' },
  { to: '/services/awareness', label: 'Campagnes de sensibilisation' },
  { to: '/services/training', label: 'Formations et renforcement' },
  { to: '/services', label: "Rapport d'activité ASFO" },
  { to: '/join', label: 'Rejoignez notre équipe' },
  { to: '/donate', label: 'Je fais un don maintenant' },
];

const RESOURCE_LINKS = [
  { to: '/news', label: 'Actualités' },
  { to: '/rapport', label: "Rapport d'activité" },
  { to: '/presse', label: 'Presse & communiqués' },
  { to: '/documentaire', label: 'Documentaire & vidéos' },
  { to: '/sante/fiches', label: 'Fiches santé' },
  { to: '/about/partenaires', label: 'Nos partenaires' },
];

/* Chiffres réels du site */
const BADGES = [
  { icon: CalendarDays, label: "20+ ans d'engagement" },
  { icon: Stethoscope, label: '600+ bénévoles' },
  { icon: Ambulance, label: '37+ missions' },
  { icon: Heart, label: '25 000+ bénéficiaires' },
];

/* Logos réels des partenaires (mêmes assets que la section Partenaires) */
const PARTNER_LOGOS = [
  { src: '/Logo_ucad_2.png', alt: 'UCAD' },
  { src: '/msascoro.jpg', alt: 'Ministère de la Santé et de l’Action Sociale' },
  { src: '/logo-ugb.jpg', alt: 'Université Gaston Berger' },
  { src: '/logo-medecine.jpg', alt: 'FMPOS' },
  { src: '/SENPNA.jpeg', alt: 'SEN PNA' },
  { src: '/ligue_senegalaise.jpeg', alt: 'LISCA' },
  { src: '/sene-asso.jpg', alt: 'SENE ASSO' },
  { src: '/logo-thies.jpg', alt: 'Université Iba Der Thiam de Thiès' },
  { src: '/axiomlogo.webp', alt: 'Axiomtext' },
  { src: '/Logo-fide.jpg', alt: 'FIDE' },
];

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Facult%C3%A9+de+M%C3%A9decine+et+Pharmacie+Dakar+S%C3%A9n%C3%A9gal';

const TikTokIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-2.54v5.79a3.07 3.07 0 0 1-3.07 3.07 3.07 3.07 0 0 1-3.07-3.07V2H5.6v5.79a4.83 4.83 0 0 0 4.83 4.83c.24 0 .48 0 .72-.05v9.02h2.54v-9.02c.24.05.48.05.72.05a4.83 4.83 0 0 0 4.83-4.83V6.69h.35Z" />
  </svg>
);

const WhatsAppIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const SOCIAL_LINKS = [
  { icon: <Facebook size={18} aria-hidden="true" />, href: 'https://www.facebook.com/share/1EuuqYDYVc/?mibextid=wwXIfr', label: 'Facebook' },
  { icon: <Instagram size={18} aria-hidden="true" />, href: 'https://www.instagram.com/asfo.sante?igsh=aXBpZGNsNzMycmJ2&utm_source=qr', label: 'Instagram' },
  { icon: TikTokIcon, href: 'https://www.tiktok.com/@asfo.sante?_t=ZM-8xhjTZx6pUM&_r=1', label: 'TikTok' },
  { icon: <Youtube size={18} aria-hidden="true" />, href: 'https://youtube.com/@asfosante2751?si=lAoZeT1B4ztPWG6s', label: 'YouTube' },
  { icon: <Linkedin size={18} aria-hidden="true" />, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: WhatsAppIcon, href: 'https://whatsapp.com/channel/0029VbApa2jFSAtDZBz9pr1o', label: 'Chaîne WhatsApp' },
];

const TOP_CTAS = [
  { to: '/donate', label: 'Faire un don', icon: Heart, primary: true },
  { to: '/about/partenaires', label: 'Devenir partenaire', icon: Handshake },
  { to: '/join', label: 'Rejoindre nos bénévoles', icon: Users },
  { to: '/candidature', label: 'Organiser une mission', icon: Ambulance },
];

/* ------------------------------------------------------------------ */
/* Colonne de liens — accordéon sur mobile                              */
/* ------------------------------------------------------------------ */

const LinkColumn: React.FC<{ title: string; links: { to: string; label: string }[] }> = ({ title, links }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 pb-4 md:border-none md:pb-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 md:pointer-events-none md:py-0"
      >
        <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-teal-300" style={poppins}>
          {title}
        </h3>
        <ChevronDown
          className={`h-4 w-4 text-teal-300 transition-transform duration-300 md:hidden ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <ul className={`mt-4 space-y-2.5 ${open ? 'block' : 'hidden'} md:block`}>
        {links.map((link) => (
          <li key={link.to + link.label}>
            <Link
              to={link.to}
              className="group inline-flex items-center text-sm text-teal-50/70 transition-all duration-300 hover:translate-x-1 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
            >
              <span className="mr-0 h-px w-0 rounded-full bg-teal-300 transition-all duration-300 group-hover:mr-2 group-hover:w-2" aria-hidden="true" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Newsletter (logique Parse inchangée)                                 */
/* ------------------------------------------------------------------ */

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
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-teal-300" style={poppins}>
        Recevez notre actualité
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-teal-50/60">
        Missions, campagnes médicales et événements, directement dans votre boîte mail.
      </p>
      {status === 'success' ? (
        <p className="mt-4 text-sm font-medium text-emerald-300" role="status">Merci ! Inscription confirmée.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2.5">
          <label htmlFor="footer-newsletter-email" className="sr-only">Votre adresse email</label>
          <input
            id="footer-newsletter-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
            placeholder="Votre email"
            required
            className="min-h-11 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-teal-50/40 backdrop-blur-sm transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
          />
          <button
            type="submit"
            disabled={status === 'loading' || !isValid(email)}
            className="min-h-11 w-full rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ touchAction: 'manipulation', ...poppins }}
          >
            {status === 'loading' ? 'Inscription…' : 'Je m’abonne'}
          </button>
          {status === 'exists' && <p className="text-xs text-amber-300" role="status">Cet email est déjà inscrit.</p>}
          {status === 'error' && <p className="text-xs text-red-300" role="alert">Erreur. Veuillez réessayer.</p>}
        </form>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bouton retour en haut                                                */
/* ------------------------------------------------------------------ */

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
          aria-label="Retour en haut de page"
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-[#0d2733]/80 text-teal-200 shadow-[0_15px_40px_-12px_rgba(0,0,0,0.6),0_0_25px_rgba(63,201,164,0.25)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:text-white hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.7),0_0_35px_rgba(63,201,164,0.4)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const reduce = useReducedMotion();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#0b1626] via-[#0d2733] to-[#0f3a33] text-white">
      {/* ─── Fond : halos, glow, formes organiques ─── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 -top-32 h-[420px] w-[420px] rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-[380px] w-[380px] rounded-full bg-sky-500/10 blur-[110px]" />
        <div className="absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-emerald-400/10 blur-[120px]" />
        <div className="absolute right-[8%] top-16 hidden h-28 w-28 rounded-full border border-white/10 lg:block" />
        <svg className="absolute left-[5%] bottom-24 hidden h-28 w-28 text-teal-300/10 lg:block">
          <defs>
            <pattern id="asfo-dots-footer" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.7" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#asfo-dots-footer)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* ─── Bande supérieure : identité + CTA ─── */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-12 xl:grid xl:grid-cols-[minmax(18rem,0.6fr)_minmax(0,1.8fr)] xl:items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo ASFO" className="h-16 w-16 rounded-full bg-white object-contain shadow-[0_0_35px_rgba(63,201,164,0.3)]" />
            <div>
              <p className="text-lg font-extrabold text-white" style={poppins}>ASFO</p>
              <p className="text-sm text-teal-50/70">Action Sanitaire pour le Fouta</p>
              <p className="mt-1 text-sm font-medium italic text-teal-300">
                « Agir aujourd’hui pour une meilleure santé demain. »
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap xl:flex-nowrap xl:gap-2">
            {TOP_CTAS.map((cta) => (
              <Link
                key={cta.to}
                to={cta.to}
                className={`inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 sm:w-[calc(50%-0.375rem)] sm:flex-[1_1_calc(50%-0.375rem)] xl:w-auto xl:min-w-0 xl:flex-1 xl:px-3 ${
                  cta.primary
                    ? 'bg-gradient-to-r from-[#e5533d] to-[#c73d28] text-white shadow-[0_15px_35px_-12px_rgba(229,83,61,0.6)] hover:shadow-[0_20px_45px_-12px_rgba(229,83,61,0.75)]'
                    : 'border border-white/15 bg-white/10 text-teal-50 backdrop-blur-sm hover:bg-white/20 hover:text-white'
                }`}
                style={poppins}
              >
                <cta.icon className="h-4 w-4" aria-hidden="true" />
                {cta.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ─── Grille principale ─── */}
        <div className="grid gap-10 py-14 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Présentation */}
          <div>
            <p className="max-w-sm text-sm leading-relaxed text-teal-50/70">
              Fondée dans les années 2000 par des étudiants en santé, l’ASFO œuvre pour
              l’accès aux soins et la solidarité en milieu communautaire.
            </p>

            {/* Badges chiffres réels */}
            <div className="mt-6 grid max-w-sm grid-cols-2 gap-2.5">
              {BADGES.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-teal-50/85 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10"
                >
                  <badge.icon className="h-3.5 w-3.5 flex-none text-teal-300" aria-hidden="true" />
                  {badge.label}
                </span>
              ))}
            </div>

            {/* Réseaux sociaux */}
            <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Réseaux sociaux">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <motion.a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={reduce ? undefined : { scale: 1.12, y: -3 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-teal-50/80 backdrop-blur-sm transition-colors duration-300 hover:border-teal-300/60 hover:bg-teal-400/20 hover:text-white hover:shadow-[0_0_25px_rgba(63,201,164,0.35)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                  >
                    {social.icon}
                  </motion.a>
                </li>
              ))}
            </ul>

            {/* WhatsApp */}
            <div className="mt-7 max-w-sm space-y-3">
              <WhatsAppButton
                phoneNumber="+221710401760"
                className="w-full justify-center rounded-xl border-0 bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-green-500 hover:to-green-400 hover:shadow-xl"
              />
              <a
                href="https://whatsapp.com/channel/0029VbApa2jFSAtDZBz9pr1o"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-medium text-green-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-green-400/50 hover:bg-green-500/20 hover:text-white"
                style={{ touchAction: 'manipulation' }}
              >
                <span className="transition-transform duration-300 group-hover:scale-110">{WhatsAppIcon}</span>
                Suivre notre chaîne WhatsApp
              </a>
            </div>
          </div>

          {/* Colonnes de liens (accordéons sur mobile) */}
          <LinkColumn title="Liens rapides" links={QUICK_LINKS} />
          <div>
            <LinkColumn title="Nos services" links={SERVICE_LINKS} />
            <Link
              to="/member-card"
              className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-3.5 text-sm font-bold text-white shadow-[0_15px_35px_-12px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-12px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
              style={poppins}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
              Commander ma carte membre
            </Link>
          </div>
          <LinkColumn title="Ressources" links={RESOURCE_LINKS} />
        </div>

        {/* ─── Cartes : contact, localisation, newsletter ─── */}
        <div className="grid gap-5 border-t border-white/10 py-12 md:grid-cols-2 xl:grid-cols-3">
          {/* Contact */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.07] sm:p-7">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-teal-300" style={poppins}>Contact</h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-white/10 bg-teal-400/10">
                  <Mail className="h-4 w-4 text-teal-300" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5 text-sm">
                  <a href="mailto:contact@asfosante.org" className="break-all text-teal-50/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70">contact@asfosante.org</a>
                  <a href="mailto:asfosante@gmail.com" className="break-all text-teal-50/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70">asfosante@gmail.com</a>
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-white/10 bg-teal-400/10">
                  <Phone className="h-4 w-4 text-teal-300" aria-hidden="true" />
                </span>
                <a href="tel:+221710401760" className="pt-1.5 text-sm text-teal-50/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70">
                  +221 71 040 17 60
                </a>
              </li>
              <li className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-white/10 bg-teal-400/10">
                  <MapPin className="h-4 w-4 text-teal-300" aria-hidden="true" />
                </span>
                <span className="pt-1.5 text-sm leading-relaxed text-teal-50/80">
                  Faculté de Médecine et Pharmacie, Dakar, Sénégal
                </span>
              </li>
            </ul>
          </div>

          {/* Localisation */}
          <div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.07] sm:p-7">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-teal-300" style={poppins}>Localisation</h3>
              <p className="mt-3 text-sm leading-relaxed text-teal-50/80">
                Faculté de Médecine et Pharmacie<br />Dakar, Sénégal
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-bold text-teal-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                Voir sur Google Maps
                <ExternalLink className="h-3 w-3 opacity-70" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Newsletter + candidature */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.07] sm:p-7 md:col-span-2 xl:col-span-1">
            <FooterNewsletter />
            <div className="mt-6 border-t border-white/10 pt-6">
              <Link
                to="/candidature"
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-base font-bold text-white shadow-[0_15px_40px_-12px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-12px_rgba(16,185,129,0.65)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <span className="text-xl" aria-hidden="true">🚑</span>
                Déposer une candidature
              </Link>
            </div>
          </div>

          <MobileAppShowcase />
        </div>

        {/* ─── Bande des partenaires ─── */}
        <div className="relative overflow-hidden border-t border-white/10 py-10">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-teal-300/80" style={poppins}>
            Ils nous accompagnent
          </p>
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-[#0f3a33] to-transparent sm:w-24" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-[#0f3a33] to-transparent sm:w-24" aria-hidden="true" />
          {reduce ? (
            <div className="flex flex-wrap justify-center gap-4">
              {PARTNER_LOGOS.map((logo) => (
                <span key={logo.alt} className="flex h-14 w-24 items-center justify-center rounded-xl bg-white/95 p-2">
                  <img src={logo.src} alt={logo.alt} loading="lazy" className="max-h-10 max-w-[80px] object-contain" />
                </span>
              ))}
            </div>
          ) : (
            <div className="flex w-max animate-[scroll_55s_linear_infinite] hover:[animation-play-state:paused]">
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
                <div key={`${logo.alt}-${i}`} className="px-3">
                  <span className="flex h-14 w-28 items-center justify-center rounded-xl bg-white/95 p-2 shadow-[0_8px_25px_-10px_rgba(0,0,0,0.5)]">
                    <img src={logo.src} alt={logo.alt} loading="lazy" className="max-h-10 max-w-[90px] object-contain" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Citation ─── */}
        <div className="border-t border-white/10 py-12">
          <figure className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm sm:px-6 sm:py-10 lg:px-10">
            <span className="text-5xl font-extrabold leading-none text-teal-300/50" style={poppins} aria-hidden="true">
              «&nbsp;»
            </span>
            <blockquote className="mt-3 text-lg font-semibold leading-relaxed text-white sm:text-xl" style={poppins}>
              Chaque geste compte. Chaque engagement sauve des vies.
            </blockquote>
            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#3fc9a4] to-[#8ff0d4]" aria-hidden="true" />
          </figure>
        </div>

        {/* ─── Ligne finale ─── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-center md:flex-row md:text-left">
          <p className="text-sm font-medium text-teal-50/70">
            &copy; {currentYear} ASFO — Tous droits réservés.
          </p>
          <Link
            to="/privacy"
            className="group relative text-sm font-medium text-teal-50/70 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
          >
            Politique de confidentialité
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-teal-300 transition-all duration-300 group-hover:w-full" aria-hidden="true" />
          </Link>
          <p className="text-sm text-teal-50/70">
            Conçu avec <span className="text-red-400" aria-hidden="true">❤</span>
            <span className="sr-only">amour</span> au Sénégal
          </p>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
};

export default Footer;
