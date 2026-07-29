import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Ambulance,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Clock,
  Copy,
  ExternalLink,
  Facebook,
  HandHeart,
  Handshake,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Users,
  Video,
  Youtube,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/contact/ContactForm';
import { CONTACT_DETAILS, CONTACT_SOCIAL_LINKS } from '../data/contact';

const QUICK_LINKS = [
  { href: '#coordonnees', label: 'Coordonnées' },
  { href: '#formulaire-contact', label: 'Formulaire' },
  { href: '#localisation', label: 'Localisation' },
  { href: '#reseaux-sociaux', label: 'Réseaux sociaux' },
  { href: '#faq-contact', label: 'FAQ' },
];

const HELP_CARDS = [
  {
    icon: Ambulance,
    title: 'Accueillir une caravane',
    description: 'Déposez la candidature de votre localité pour une future mission médicale.',
    to: '/candidature',
    action: 'Déposer une candidature',
  },
  {
    icon: Users,
    title: 'Devenir membre',
    description: 'Rejoignez l’association et demandez votre carte membre numérique.',
    to: '/member-card',
    action: 'Demander ma carte',
  },
  {
    icon: Handshake,
    title: 'Devenir partenaire',
    description: 'Construisez une collaboration institutionnelle ou opérationnelle avec l’ASFO.',
    to: '/about/partenaires',
    action: 'Proposer un partenariat',
  },
  {
    icon: HandHeart,
    title: 'Devenir bénévole',
    description: 'Mettez vos compétences au service des missions et actions communautaires.',
    to: '/join',
    action: 'Rejoindre les bénévoles',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Comment contacter l’ASFO rapidement ?',
    answer:
      'Utilisez le téléphone ou WhatsApp pour un contact direct. Le formulaire permet de transmettre une demande détaillée qui sera enregistrée dans le portail ASFO.',
  },
  {
    question: 'Comment proposer une localité pour une caravane ?',
    answer:
      'La route Candidature village permet de consulter le guide, préparer les pièces et déposer le dossier de la localité en ligne.',
  },
  {
    question: 'Comment devenir partenaire ?',
    answer:
      'Consultez la page Partenaires puis transmettez votre proposition grâce au formulaire prévu pour les organisations.',
  },
  {
    question: 'Comment demander une carte membre ?',
    answer:
      'La page Carte membre permet de vérifier les critères, ajouter votre photo et envoyer une demande qui sera examinée par l’ASFO.',
  },
  {
    question: 'Comment suivre une candidature ?',
    answer:
      'Il n’existe pas encore de suivi public sécurisé. Conservez votre numéro de dossier et contactez l’ASFO par téléphone ou par email.',
  },
  {
    question: 'Comment faire un don ?',
    answer:
      'La page Faire un don présente les moyens de contribution actuellement disponibles. Pour un don en nature, contactez directement l’ASFO.',
  },
];

const SOCIAL_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Video,
  youtube: Youtube,
  'whatsapp-channel': MessageCircle,
} as const;

const getDakarOpenStatus = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Dakar',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const weekday = parts.find((part) => part.type === 'weekday')?.value.toLowerCase() ?? '';
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);
  const currentMinutes = hour * 60 + minute;

  if (weekday.startsWith('dim')) return false;
  if (weekday.startsWith('sam')) return currentMinutes >= 9 * 60 && currentMinutes < 13 * 60;
  return currentMinutes >= 9 * 60 && currentMinutes < 17 * 60;
};

interface ContactMethodCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const ContactMethodCard: React.FC<ContactMethodCardProps> = ({
  icon: Icon,
  title,
  children,
  action,
  className = '',
}) => (
  <article className={`flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-5 ${className}`}>
    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
      <Icon size={21} aria-hidden="true" />
    </span>
    <h3 className="mt-4 font-black text-slate-950">{title}</h3>
    <div className="mt-2 flex-1 text-sm leading-6 text-slate-600">{children}</div>
    {action && <div className="mt-4">{action}</div>}
  </article>
);

const ContactPage: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [emailCopied, setEmailCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(() => getDakarOpenStatus());
  const [hideMobileActions, setHideMobileActions] = useState(false);

  useEffect(() => {
    document.title = 'Contact | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setIsOpen(getDakarOpenStatus()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const form = document.getElementById('formulaire-contact');
    const stop = document.getElementById('contact-mobile-stop');
    const visibility = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibility.set(entry.target, entry.isIntersecting));
        setHideMobileActions([...visibility.values()].some(Boolean));
      },
      { threshold: 0.08 },
    );
    if (form) observer.observe(form);
    if (stop) observer.observe(stop);
    return () => observer.disconnect();
  }, []);

  const addressText = useMemo(
    () =>
      [
        CONTACT_DETAILS.address.line1,
        CONTACT_DETAILS.address.line2,
        CONTACT_DETAILS.address.line3,
      ].join(', '),
    [],
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_DETAILS.email);
    } catch {
      const input = document.createElement('input');
      input.value = CONTACT_DETAILS.email;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setEmailCopied(true);
    window.setTimeout(() => setEmailCopied(false), 2200);
  };

  const fadeUp = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.5 },
      };

  return (
    <div className="min-h-0 overflow-x-hidden bg-gradient-to-b from-white via-[#f4fbfa] to-white pb-20 text-slate-900 md:pb-0">
      <section className="relative overflow-hidden border-b border-teal-100/80">
        <div className="pointer-events-none absolute -left-36 top-10 h-[420px] w-[420px] rounded-full bg-teal-100/45 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-36 -top-28 h-[500px] w-[500px] rounded-full bg-cyan-100/40 blur-[120px]" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8 lg:py-16">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/85 px-3 py-1.5 text-xs font-black uppercase tracking-[0.13em] text-teal-800 shadow-sm">
              <MessageCircle size={14} /> Nous sommes à votre écoute
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.06] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[58px]">
              Contactez l’équipe de l’ASFO
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Une question, une proposition de partenariat, une demande de mission ou un besoin d’accompagnement ? Notre équipe vous répond.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#formulaire-contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-teal-800/15 transition hover:-translate-y-0.5 hover:bg-teal-800"
              >
                Envoyer un message <ArrowRight size={17} />
              </a>
              <a
                href={CONTACT_DETAILS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-300 bg-white/90 px-5 py-3.5 text-sm font-black text-teal-800 transition hover:border-teal-500 hover:bg-teal-50"
              >
                <MessageCircle size={17} /> Nous écrire sur WhatsApp
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
            className="relative mx-auto w-full max-w-xl pb-7"
          >
            <div className="overflow-hidden rounded-[28px] border-4 border-white bg-white shadow-[0_30px_80px_-34px_rgba(15,23,42,0.45)]">
              <img
                src="/medicalteam.webp"
                alt="Équipe médicale de l’ASFO réunie lors d’une activité"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-1 rounded-[24px] bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-2 left-3 right-3 grid grid-cols-3 gap-2 sm:left-7 sm:right-7">
              {[
                { icon: MessageCircle, title: 'Réponse rapide' },
                { icon: ShieldCheck, title: 'Accompagnement personnalisé' },
                { icon: MapPin, title: 'Dakar, Sénégal' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex min-h-[76px] flex-col items-center justify-center rounded-xl border border-white/80 bg-white/95 p-2 text-center shadow-lg backdrop-blur">
                    <Icon size={17} className="text-teal-700" />
                    <p className="mt-1 text-[10px] font-black leading-4 text-slate-700 sm:text-xs">{item.title}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <nav aria-label="Navigation rapide de la page Contact" className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-max items-center gap-2 py-3">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <motion.div
              id="coordonnees"
              {...fadeUp}
              className="scroll-mt-24 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_-42px_rgba(15,23,42,0.35)] sm:p-8"
            >
              <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Nos coordonnées</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Choisissez le canal qui vous convient</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Appelez, écrivez ou venez rencontrer l’équipe au siège de l’ASFO à Dakar.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <ContactMethodCard
                  icon={MapPin}
                  title="Adresse"
                  className="sm:col-span-2"
                  action={
                    <a
                      href={CONTACT_DETAILS.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900"
                    >
                      Obtenir l’itinéraire <ExternalLink size={15} />
                    </a>
                  }
                >
                  <address className="not-italic">
                    {CONTACT_DETAILS.address.line1}<br />
                    {CONTACT_DETAILS.address.line2}<br />
                    {CONTACT_DETAILS.address.line3}
                  </address>
                </ContactMethodCard>

                <ContactMethodCard
                  icon={Phone}
                  title="Téléphone"
                  action={
                    <a
                      href={`tel:${CONTACT_DETAILS.phone.raw}`}
                      className="inline-flex items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900"
                    >
                      Appeler maintenant <Phone size={15} />
                    </a>
                  }
                >
                  <a href={`tel:${CONTACT_DETAILS.phone.raw}`} className="font-bold text-slate-800 hover:text-teal-700">
                    {CONTACT_DETAILS.phone.display}
                  </a>
                </ContactMethodCard>

                <ContactMethodCard
                  icon={Mail}
                  title="Email"
                  action={
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`mailto:${CONTACT_DETAILS.email}`}
                        className="inline-flex items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900"
                      >
                        Envoyer un email
                      </a>
                      <button
                        type="button"
                        onClick={copyEmail}
                        className="inline-flex items-center gap-1.5 text-sm font-black text-slate-500 hover:text-teal-700"
                        aria-live="polite"
                      >
                        {emailCopied ? <CheckCircle size={15} /> : <Copy size={15} />}
                        {emailCopied ? 'Adresse copiée' : 'Copier'}
                      </button>
                    </div>
                  }
                >
                  <a href={`mailto:${CONTACT_DETAILS.email}`} className="break-all font-bold text-slate-800 hover:text-teal-700">
                    {CONTACT_DETAILS.email}
                  </a>
                </ContactMethodCard>

                <ContactMethodCard icon={Clock} title="Horaires">
                  <div className="space-y-1">
                    {CONTACT_DETAILS.hours.map((hours) => (
                      <div key={hours.label} className="flex justify-between gap-3">
                        <span>{hours.label}</span>
                        <strong className="text-right text-slate-800">{hours.value}</strong>
                      </div>
                    ))}
                  </div>
                  <span className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${
                    isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                    {isOpen ? 'Ouvert maintenant' : 'Fermé actuellement'}
                  </span>
                </ContactMethodCard>

                <ContactMethodCard
                  icon={MessageCircle}
                  title="WhatsApp"
                  action={
                    <a
                      href={CONTACT_DETAILS.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900"
                    >
                      Écrire sur WhatsApp <ExternalLink size={15} />
                    </a>
                  }
                >
                  Contact direct avec le numéro principal de l’ASFO.
                </ContactMethodCard>
              </div>

              <div id="reseaux-sociaux" className="scroll-mt-24 mt-8 border-t border-slate-100 pt-7">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">Suivez l’ASFO</h3>
                    <p className="mt-1 text-sm text-slate-500">Uniquement les comptes officiellement configurés sur le site.</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {CONTACT_SOCIAL_LINKS.map((social) => {
                    const Icon = SOCIAL_ICONS[social.id];
                    return (
                      <a
                        key={social.id}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Suivre l’ASFO sur ${social.label}`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      >
                        <Icon size={17} aria-hidden="true" /> {social.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div
              id="formulaire-contact"
              {...fadeUp}
              className="scroll-mt-24 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_-42px_rgba(15,23,42,0.35)] sm:p-8"
            >
              <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Formulaire de contact</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Envoyez-nous un message</h2>
              <p className="mb-7 mt-3 text-sm leading-6 text-slate-600">
                Décrivez votre demande afin qu’elle soit orientée vers la bonne équipe.
              </p>
              <ContactForm />
            </motion.div>
          </div>
        </section>

        <motion.section {...fadeUp} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Démarches principales</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Comment pouvons-nous vous aider ?</h2>
          </div>
          <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HELP_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Icon size={21} /></span>
                  <h3 className="mt-4 text-lg font-black text-slate-950">{card.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{card.description}</p>
                  <Link to={card.to} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900">
                    {card.action} <ArrowRight size={15} />
                  </Link>
                </article>
              );
            })}
          </div>
        </motion.section>

        <motion.section id="localisation" {...fadeUp} className="scroll-mt-24 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Notre siège</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Nous localiser</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">Retrouvez le siège de l’ASFO à Dakar.</p>
          </div>

          <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.4)] sm:aspect-[16/9]">
              <iframe
                title="Localisation du siège de l’ASFO à la Faculté de Médecine et de Pharmacie de Dakar"
                src={CONTACT_DETAILS.mapsEmbedUrl}
                className="h-full w-full pointer-events-none sm:pointer-events-auto"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={CONTACT_DETAILS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-teal-800 shadow-lg sm:hidden"
              >
                <Navigation size={16} /> Ouvrir la carte
              </a>
            </div>

            <aside className="flex flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <MapPin size={23} />
              </span>
              <h3 className="mt-5 text-xl font-black text-slate-950">Siège de l’ASFO</h3>
              <address className="mt-3 not-italic text-sm leading-6 text-slate-600">
                {CONTACT_DETAILS.address.line1}<br />
                {CONTACT_DETAILS.address.line2}<br />
                {CONTACT_DETAILS.address.line3}
              </address>

              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
                <a href={`tel:${CONTACT_DETAILS.phone.raw}`} className="flex items-center gap-3 font-bold text-slate-700 hover:text-teal-700">
                  <Phone size={17} className="text-teal-700" /> {CONTACT_DETAILS.phone.display}
                </a>
                <a href={`mailto:${CONTACT_DETAILS.email}`} className="flex items-start gap-3 break-all font-bold text-slate-700 hover:text-teal-700">
                  <Mail size={17} className="mt-0.5 shrink-0 text-teal-700" /> {CONTACT_DETAILS.email}
                </a>
                <div className="flex items-start gap-3 text-slate-600">
                  <Clock size={17} className="mt-0.5 shrink-0 text-teal-700" />
                  <span>Lundi à vendredi : 9h00 – 17h00<br />Samedi : 9h00 – 13h00</span>
                </div>
              </div>

              <div className="mt-auto grid gap-3 pt-7">
                <a
                  href={CONTACT_DETAILS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white hover:bg-teal-800"
                >
                  <Navigation size={16} /> Obtenir l’itinéraire
                </a>
                <a
                  href={CONTACT_DETAILS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-300 bg-white px-4 py-3 text-sm font-black text-teal-800 hover:bg-teal-50"
                >
                  <MessageCircle size={16} /> Contacter sur WhatsApp
                </a>
              </div>
            </aside>
          </div>
          <p className="mt-3 text-xs text-slate-500">{addressText}</p>
        </motion.section>

        <motion.section id="faq-contact" {...fadeUp} className="scroll-mt-24 border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">FAQ contact</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Les réponses aux demandes courantes</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ces réponses utilisent uniquement les démarches et routes réellement disponibles sur le site.
              </p>
            </div>
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 px-5">
              {FAQ_ITEMS.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-slate-900">
                    {item.question}
                    <ChevronDown size={18} className="shrink-0 text-slate-400 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 pr-8 text-sm leading-6 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </motion.section>

        <section id="contact-mobile-stop" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[28px] border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-7 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-200/35 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Échangeons</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Parlons de votre projet ou de votre besoin.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  L’équipe de l’ASFO est disponible pour vous informer, vous orienter et construire de nouvelles actions avec vous.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <a href="#formulaire-contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-black text-white hover:bg-teal-800">
                  Envoyer un message <ArrowRight size={16} />
                </a>
                <a href={CONTACT_DETAILS.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-300 bg-white px-5 py-3.5 text-sm font-black text-teal-800 hover:bg-teal-50">
                  <MessageCircle size={16} /> Contacter sur WhatsApp
                </a>
                <Link to="/about" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-black text-teal-800 hover:bg-white/70">
                  Découvrir l’ASFO
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {!hideMobileActions && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.45)] backdrop-blur md:hidden"
          aria-label="Actions de contact rapides"
        >
          <a href={`tel:${CONTACT_DETAILS.phone.raw}`} className="inline-flex min-h-12 flex-col items-center justify-center rounded-xl text-xs font-black text-slate-700 hover:bg-teal-50 hover:text-teal-800">
            <Phone size={18} /> <span className="mt-1">Appeler</span>
          </a>
          <a href={CONTACT_DETAILS.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 flex-col items-center justify-center rounded-xl bg-teal-700 text-xs font-black text-white">
            <MessageCircle size={18} /> <span className="mt-1">WhatsApp</span>
          </a>
          <a href={`mailto:${CONTACT_DETAILS.email}`} className="inline-flex min-h-12 flex-col items-center justify-center rounded-xl text-xs font-black text-slate-700 hover:bg-teal-50 hover:text-teal-800">
            <Mail size={18} /> <span className="mt-1">Email</span>
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default ContactPage;
