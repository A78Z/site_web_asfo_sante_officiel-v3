import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Newspaper,
  Megaphone,
  Radio,
  Tv,
  Mic,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowRight,
  Globe,
  ShieldCheck,
  BookOpen,
  Palette,
  BarChart3,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Camera,
  Sparkles,
  Inbox,
  Loader2,
  ChevronRight,
  Users,
} from 'lucide-react';
import { createObject, queryObjects } from '../lib/parse';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

/* ------------------------------------------------------------------ */
/* Coordonnées réelles (identiques à Contact / Footer)                */
/* ------------------------------------------------------------------ */

const PRESS = {
  email: 'contact@asfosante.org',
  emailAlt: 'asfosante@gmail.com',
  phoneDisplay: '+221 71 040 17 60',
  phoneRaw: '+221710401760',
  addressLines: [
    'Faculté de Médecine et Pharmacie',
    'Université Cheikh Anta Diop',
    'Dakar, Sénégal',
  ],
  hours: [
    'Lundi – Vendredi : 9h00 – 17h00',
    'Samedi : 9h00 – 13h00',
    'Dimanche : Fermé',
  ],
};

/* Ancres de navigation rapide */
const NAV = [
  { id: 'communiques', label: 'Communiqués officiels', icon: Megaphone },
  { id: 'revue-presse', label: 'Revue de presse', icon: Newspaper },
  { id: 'kit-media', label: 'Kit média', icon: BookOpen },
  { id: 'contact-presse', label: 'Contact presse', icon: Mail },
];

/* Ressources du kit média — uniquement les fichiers réellement présents */
type KitResource = {
  icon: React.ElementType;
  name: string;
  format: string;
  meta?: string;
} & (
  | { kind: 'download'; href: string }
  | { kind: 'link'; to: string; cta: string }
  | { kind: 'external'; href: string; cta: string }
  | { kind: 'pending' }
);

const KIT_RESOURCES: KitResource[] = [
  {
    icon: Sparkles,
    name: 'Logo officiel de l’ASFO',
    format: 'PNG',
    kind: 'download',
    href: '/logo-asfo.png',
  },
  {
    icon: FileText,
    name: 'Rapport d’activité 2020',
    format: 'PDF',
    meta: '≈ 4 Mo',
    kind: 'download',
    href: '/Rapport2020.pdf',
  },
  {
    icon: BookOpen,
    name: 'Guide de la campagne médicale',
    format: 'PDF',
    meta: '≈ 4 Mo',
    kind: 'download',
    href: '/GUIDE_DE_CANDIDATURE_CAMPAGNE_MEDICALE_ASFO.pdf',
  },
  {
    icon: Camera,
    name: 'Photothèque institutionnelle',
    format: 'Galerie en ligne',
    kind: 'link',
    to: '/gallery',
    cta: 'Consulter',
  },
  {
    icon: Users,
    name: 'Présentation du Président',
    format: 'Page web',
    kind: 'link',
    to: '/president-message',
    cta: 'Consulter',
  },
  {
    icon: BarChart3,
    name: 'Impact & chiffres clés',
    format: 'Page web',
    kind: 'link',
    to: '/impact',
    cta: 'Consulter',
  },
  {
    icon: Palette,
    name: 'Charte graphique complète',
    format: 'À venir',
    kind: 'pending',
  },
  {
    icon: Newspaper,
    name: 'Dossier de presse complet',
    format: 'À venir',
    kind: 'pending',
  },
];

const REQUEST_TYPES = [
  'Demande d’interview',
  'Demande d’information',
  'Demande de visuels',
  'Invitation média',
  'Partenariat média',
  'Autre',
];

/* ------------------------------------------------------------------ */
/* État vide premium                                                  */
/* ------------------------------------------------------------------ */

const EmptyState: React.FC<{ icon: React.ElementType; title: string; text: string }> = ({
  icon: Icon,
  title,
  text,
}) => (
  <div className="flex flex-col items-center rounded-2xl border border-dashed border-teal-200/70 bg-white/70 px-6 py-14 text-center backdrop-blur-sm">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-500">
      <Icon className="h-8 w-8" aria-hidden="true" />
    </div>
    <h3 className="text-lg font-bold text-[#123f38]" style={poppins}>
      {title}
    </h3>
    <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600">{text}</p>
  </div>
);

/* ------------------------------------------------------------------ */
/* Kit média — carte ressource                                        */
/* ------------------------------------------------------------------ */

const KitCard: React.FC<{ resource: KitResource }> = ({ resource }) => {
  const Icon = resource.icon;
  const pending = resource.kind === 'pending';
  return (
    <motion.div
      {...fadeUp()}
      className={`flex h-full flex-col rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 ${
        pending
          ? 'border-gray-100 bg-white/60'
          : 'border-teal-100 bg-white/85 shadow-[0_18px_45px_-28px_rgba(18,63,56,0.3)] hover:-translate-y-1 hover:shadow-[0_24px_55px_-25px_rgba(18,63,56,0.4)]'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl ${
            pending ? 'bg-gray-100 text-gray-400' : 'bg-teal-50 text-teal-600'
          }`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${
            pending ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'
          }`}
          style={poppins}
        >
          {resource.format}
        </span>
      </div>
      <h3 className="text-base font-bold text-[#123f38]" style={poppins}>
        {resource.name}
      </h3>
      {resource.meta && <p className="mt-1 text-xs text-gray-400">{resource.meta}</p>}

      <div className="mt-5 flex-grow" />

      {resource.kind === 'download' && (
        <a
          href={resource.href}
          download
          className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-4 py-2 text-xs font-bold text-white shadow-[0_12px_30px_-14px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
          style={poppins}
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Télécharger
        </a>
      )}
      {resource.kind === 'link' && (
        <Link
          to={resource.to}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-bold text-teal-700 transition-all hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          style={poppins}
        >
          {resource.cta}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      )}
      {resource.kind === 'external' && (
        <a
          href={resource.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-bold text-teal-700 transition-all hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          style={poppins}
        >
          {resource.cta}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
      {resource.kind === 'pending' && (
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-400"
          aria-disabled="true"
          style={poppins}
        >
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          En préparation
        </span>
      )}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Formulaire de contact presse (backend ContactMessages réel)        */
/* ------------------------------------------------------------------ */

const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PressContactForm: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    subject: '',
    requestType: REQUEST_TYPES[0],
    message: '',
    deadline: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Votre nom est requis.';
    if (!form.email.trim()) e.email = 'L’email est requis.';
    else if (!emailRe.test(form.email.trim())) e.email = 'Veuillez saisir un email valide.';
    if (!form.subject.trim()) e.subject = 'L’objet est requis.';
    if (!form.message.trim()) e.message = 'Le message est requis.';
    else if (form.message.trim().length < 10)
      e.message = 'Le message doit contenir au moins 10 caractères.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (state === 'sending') return;
    if (!validate()) return;
    setState('sending');
    setErrorMsg('');

    // On regroupe tout le contexte presse dans le message pour ne rien perdre,
    // quel que soit le schéma admin (classe ContactMessages partagée).
    const details = [
      `Type de demande : ${form.requestType}`,
      form.organization.trim() && `Média / organisation : ${form.organization.trim()}`,
      form.deadline.trim() && `Date limite de réponse : ${form.deadline.trim()}`,
      '',
      form.message.trim(),
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await createObject('ContactMessages', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        subject: `[Presse] ${form.subject.trim()}`,
        message: details,
        organization: form.organization.trim() || undefined,
        requestType: form.requestType,
        source: 'Espace presse',
        status: 'Nouveau',
      });
      setState('success');
      setForm({
        name: '',
        organization: '',
        email: '',
        phone: '',
        subject: '',
        requestType: REQUEST_TYPES[0],
        message: '',
        deadline: '',
      });
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Erreur inconnue.');
    }
  };

  if (state === 'success') {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-teal-100 bg-white/90 p-8 text-center shadow-[0_18px_45px_-28px_rgba(18,63,56,0.3)]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-[#123f38]" style={poppins}>
          Votre demande a bien été envoyée
        </h3>
        <p className="mt-2 max-w-sm text-sm text-gray-600">
          L’équipe de l’ASFO a bien reçu votre message et reviendra vers vous par email.
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-5 py-2.5 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          style={poppins}
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  const inputCls = (field: string) =>
    `w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100 ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-teal-100 bg-white/90 p-6 shadow-[0_18px_45px_-28px_rgba(18,63,56,0.3)] backdrop-blur-sm sm:p-7"
    >
      {state === 'error' && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-none text-red-500" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-red-800">Une erreur est survenue</p>
            <p className="mt-0.5 text-xs text-red-700">
              {errorMsg} Vous pouvez aussi nous écrire à {PRESS.email}.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pf-name" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            id="pf-name"
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className={inputCls('name')}
            placeholder="Votre nom"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'pf-name-err' : undefined}
          />
          {errors.name && (
            <p id="pf-name-err" className="mt-1 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="pf-org" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Média / organisation
          </label>
          <input
            id="pf-org"
            type="text"
            value={form.organization}
            onChange={(e) => set('organization', e.target.value)}
            className={inputCls('organization')}
            placeholder="Rédaction, chaîne, agence…"
          />
        </div>
        <div>
          <label htmlFor="pf-email" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="pf-email"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            className={inputCls('email')}
            placeholder="vous@media.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'pf-email-err' : undefined}
          />
          {errors.email && (
            <p id="pf-email-err" className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="pf-phone" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Téléphone
          </label>
          <input
            id="pf-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            className={inputCls('phone')}
            placeholder="+221 7X XXX XX XX"
          />
        </div>
        <div>
          <label htmlFor="pf-type" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Type de demande
          </label>
          <select
            id="pf-type"
            value={form.requestType}
            onChange={(e) => set('requestType', e.target.value)}
            className={inputCls('requestType')}
          >
            {REQUEST_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pf-deadline" className="mb-1.5 block text-sm font-semibold text-gray-700">
            Date limite de réponse{' '}
            <span className="font-normal text-gray-400">(facultatif)</span>
          </label>
          <input
            id="pf-deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => set('deadline', e.target.value)}
            className={inputCls('deadline')}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="pf-subject" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Objet <span className="text-red-500">*</span>
        </label>
        <input
          id="pf-subject"
          type="text"
          value={form.subject}
          onChange={(e) => set('subject', e.target.value)}
          className={inputCls('subject')}
          placeholder="Objet de votre demande"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'pf-subject-err' : undefined}
        />
        {errors.subject && (
          <p id="pf-subject-err" className="mt-1 text-xs text-red-600">
            {errors.subject}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="pf-message" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="pf-message"
          rows={5}
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          className={inputCls('message')}
          placeholder="Décrivez votre demande…"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'pf-message-err' : undefined}
        />
        {errors.message && (
          <p id="pf-message-err" className="mt-1 text-xs text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={state === 'sending'}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 disabled:cursor-not-allowed disabled:opacity-70"
        style={poppins}
      >
        {state === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Envoyer ma demande
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-gray-400">
        Vos informations sont transmises à l’équipe de l’ASFO et ne sont pas rendues publiques.
      </p>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Newsletter médias (backend NewsletterSubscribers réel)             */
/* ------------------------------------------------------------------ */

const MediaNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'exists' | 'error' | 'invalid' | 'consent'
  >('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    const normalized = email.trim().toLowerCase();
    if (!emailRe.test(normalized)) {
      setStatus('invalid');
      return;
    }
    if (!consent) {
      setStatus('consent');
      return;
    }
    setStatus('loading');
    try {
      const { results } = await queryObjects('NewsletterSubscribers', {
        where: { email: normalized },
        limit: 1,
      });
      if (results.length > 0) {
        setStatus('exists');
        return;
      }
      await createObject('NewsletterSubscribers', {
        email: normalized,
        organization: organization.trim() || undefined,
        source: 'Espace presse',
        status: 'Actif',
      });
      setStatus('success');
      setEmail('');
      setOrganization('');
      setConsent(false);
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div
      {...fadeUp()}
      className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-white via-[#eefaf6] to-[#e3f5ee] p-6 shadow-[0_24px_60px_-38px_rgba(18,63,56,0.45)] sm:p-8"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-teal-200/40 blur-[90px]"
        aria-hidden="true"
      />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <span
            className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-teal-700"
            style={poppins}
          >
            <Inbox className="h-3.5 w-3.5" aria-hidden="true" />
            Newsletter médias
          </span>
          <h3 className="mt-4 text-xl font-extrabold text-[#123f38] sm:text-2xl" style={poppins}>
            Recevez les communiqués de l’ASFO
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Inscrivez-vous pour recevoir les annonces officielles et les invitations médias.
          </p>
        </div>

        <form onSubmit={submit} noValidate className="space-y-3">
          <div>
            <label htmlFor="nl-email" className="sr-only">
              Adresse email
            </label>
            <input
              id="nl-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'loading') setStatus('idle');
              }}
              placeholder="Votre email professionnel"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              aria-invalid={status === 'invalid'}
            />
          </div>
          <div>
            <label htmlFor="nl-org" className="sr-only">
              Média ou organisation (facultatif)
            </label>
            <input
              id="nl-org"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Média ou organisation (facultatif)"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          <label className="flex items-start gap-2.5 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (status === 'consent') setStatus('idle');
              }}
              className="mt-0.5 h-4 w-4 flex-none rounded border-gray-300 text-teal-600 focus:ring-teal-400"
            />
            <span>
              J’accepte de recevoir les communiqués et informations médias de l’ASFO par email.
            </span>
          </label>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_35px_-16px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 disabled:cursor-not-allowed disabled:opacity-70"
            style={poppins}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Inscription…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                S’inscrire
              </>
            )}
          </button>

          <div aria-live="polite" className="min-h-[1.25rem] text-xs">
            {status === 'success' && (
              <p className="font-semibold text-teal-700">
                Merci ! Votre inscription est confirmée.
              </p>
            )}
            {status === 'exists' && (
              <p className="font-semibold text-teal-700">
                Cette adresse est déjà inscrite.
              </p>
            )}
            {status === 'invalid' && (
              <p className="font-semibold text-red-600">Veuillez saisir un email valide.</p>
            )}
            {status === 'consent' && (
              <p className="font-semibold text-red-600">
                Merci de cocher la case de consentement.
              </p>
            )}
            {status === 'error' && (
              <p className="font-semibold text-red-600">
                Inscription impossible pour le moment. Réessayez plus tard.
              </p>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const PressePage: React.FC = () => {
  const reduce = useReducedMotion();
  const [activeSection, setActiveSection] = useState('communiques');
  const [headerH, setHeaderH] = useState(0);

  useEffect(() => {
    document.title = 'Communiqués & presse | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  // La barre de navigation se colle sous le header (hauteur variable) réel
  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;
    const update = () => setHeaderH(header.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.getElementById('site-header');
    const offset = (header?.offsetHeight ?? 0) + 16;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  };

  // Surligne l'onglet de la section visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const kitAvailable = useMemo(
    () => KIT_RESOURCES.filter((r) => r.kind !== 'pending').length,
    [],
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* Halos décoratifs discrets */}
      <div
        className="pointer-events-none absolute -left-32 top-52 h-72 w-72 rounded-full bg-teal-100/40 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-[70rem] h-80 w-80 rounded-full bg-teal-100/30 blur-[130px]"
        aria-hidden="true"
      />

      {/* ------------------------- HERO ------------------------- */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-teal-700 backdrop-blur-sm"
              style={poppins}
            >
              <Megaphone className="h-4 w-4" aria-hidden="true" />
              Espace médias
            </span>
            <h1
              className="mt-6 text-4xl font-extrabold leading-[1.1] text-[#123f38] sm:text-5xl"
              style={poppins}
            >
              Communiqués{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
                &amp; presse
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Retrouvez les annonces officielles, les publications médias et les ressources
              destinées aux journalistes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollTo('communiques')}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Megaphone className="h-4 w-4" aria-hidden="true" />
                Voir les communiqués
              </button>
              <button
                type="button"
                onClick={() => scrollTo('contact-presse')}
                className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60"
                style={poppins}
              >
                Contacter le service presse
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          {/* Composition visuelle */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="relative mx-auto flex h-[24rem] max-w-md items-center justify-center">
              {/* icônes médias flottantes */}
              <div
                className="absolute left-2 top-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-100 bg-white text-teal-600 shadow-lg"
                aria-hidden="true"
              >
                <Mic className="h-6 w-6" />
              </div>
              <div
                className="absolute right-4 top-16 flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-100 bg-white text-teal-600 shadow-lg"
                aria-hidden="true"
              >
                <Radio className="h-5 w-5" />
              </div>
              <div
                className="absolute bottom-8 left-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-100 bg-white text-teal-600 shadow-lg"
                aria-hidden="true"
              >
                <Tv className="h-5 w-5" />
              </div>

              {/* document officiel central */}
              <div className="relative w-full max-w-xs rounded-2xl border border-teal-100 bg-white p-6 shadow-[0_30px_60px_-30px_rgba(18,63,56,0.55)]">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <img
                    src="/logo-asfo.png"
                    alt="Logo ASFO"
                    className="h-11 w-11 flex-none rounded-lg object-contain"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#123f38]" style={poppins}>
                      ASFO
                    </p>
                    <p className="text-[11px] text-gray-500">Communiqué officiel</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2" aria-hidden="true">
                  <div className="h-2.5 w-3/4 rounded-full bg-teal-100" />
                  <div className="h-2.5 w-full rounded-full bg-gray-100" />
                  <div className="h-2.5 w-5/6 rounded-full bg-gray-100" />
                  <div className="h-2.5 w-2/3 rounded-full bg-gray-100" />
                </div>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-[11px] font-bold text-teal-700">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Espace presse officiel de l’ASFO
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------------- NAVIGATION RAPIDE --------------------- */}
      <nav
        aria-label="Navigation de l’espace presse"
        style={{ top: headerH }}
        className="sticky z-30 border-y border-teal-100/70 bg-white/85 backdrop-blur-md"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = activeSection === n.id;
              return (
                <li key={n.id} className="flex-none">
                  <button
                    type="button"
                    onClick={() => scrollTo(n.id)}
                    aria-current={active ? 'true' : undefined}
                    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
                    }`}
                    style={poppins}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {n.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ------------------- COMMUNIQUÉS OFFICIELS ------------------- */}
      <section
        id="communiques"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
      >
        <motion.div {...fadeUp()} className="mb-8 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Megaphone className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
              Communiqués officiels
            </h2>
          </div>
          <p className="mt-3 text-gray-600">
            Consultez les annonces, prises de parole et informations institutionnelles publiées
            par l’ASFO.
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.05)}>
          <EmptyState
            icon={Megaphone}
            title="Aucun communiqué publié pour le moment"
            text="Les prochaines annonces officielles de l’ASFO seront disponibles dans cet espace. Inscrivez-vous à la newsletter médias pour être informé dès leur publication."
          />
        </motion.div>
      </section>

      {/* --------------------- REVUE DE PRESSE --------------------- */}
      <section
        id="revue-presse"
        className="relative scroll-mt-24 bg-[#f2fbf8]/60 py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-8 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Newspaper className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
                Revue de presse
              </h2>
            </div>
            <p className="mt-3 text-gray-600">
              Les articles, émissions, interviews et publications parlant de l’ASFO dans les
              médias sénégalais et internationaux.
            </p>
          </motion.div>

          {/* Types de média (repères — activés dès qu'une publication existe) */}
          <div className="mb-8 flex flex-wrap gap-2" aria-hidden="true">
            {[
              { icon: Newspaper, label: 'Presse écrite' },
              { icon: Tv, label: 'Télévision' },
              { icon: Radio, label: 'Radio' },
              { icon: Globe, label: 'Web' },
            ].map((t) => (
              <span
                key={t.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-gray-400"
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </span>
            ))}
          </div>

          <motion.div {...fadeUp(0.05)}>
            <EmptyState
              icon={Newspaper}
              title="La revue de presse sera bientôt disponible"
              text="Les publications médias consacrées aux missions de l’ASFO seront rassemblées ici. Vous couvrez nos actions ? Signalez-nous votre publication via le formulaire de contact presse."
            />
          </motion.div>
        </div>
      </section>

      {/* ------------------------- KIT MÉDIA ------------------------- */}
      <section
        id="kit-media"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
      >
        <motion.div {...fadeUp()} className="mb-8 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
              Kit média de l’ASFO
            </h2>
          </div>
          <p className="mt-3 text-gray-600">
            Les ressources officielles à disposition des journalistes et partenaires.{' '}
            <span className="font-semibold text-teal-700">
              {kitAvailable} ressources disponibles
            </span>{' '}
            aujourd’hui.
          </p>
        </motion.div>

        {/* Bandeau Président actuel */}
        <motion.div
          {...fadeUp(0.05)}
          className="mb-8 flex flex-col items-center gap-5 rounded-2xl border border-teal-100 bg-white/85 p-5 backdrop-blur-sm sm:flex-row sm:p-6"
        >
          <img
            src="/images/president-asfo.jpg"
            alt="Portrait du Dr Abdaramani Ndiaye, 21e Président de l’ASFO"
            className="h-20 w-20 flex-none rounded-2xl object-cover shadow-md"
            loading="lazy"
          />
          <div className="text-center sm:text-left">
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700"
              style={poppins}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Président en exercice
            </span>
            <h3 className="mt-2 text-lg font-extrabold text-[#123f38]" style={poppins}>
              Dr Abdaramani Ndiaye
            </h3>
            <p className="text-sm text-gray-600">21e Président de l’ASFO</p>
          </div>
          <Link
            to="/president-message"
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-bold text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 sm:ml-auto sm:mt-0"
            style={poppins}
          >
            Lire son message
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {KIT_RESOURCES.map((r) => (
            <KitCard key={r.name} resource={r} />
          ))}
        </div>
      </section>

      {/* ---------------------- RÉPONSE RAPIDE ---------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp()}
          className="rounded-3xl border border-teal-100 bg-white/85 p-6 backdrop-blur-sm sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div>
              <span
                className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-teal-700"
                style={poppins}
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Accompagnement médias
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-[#123f38]" style={poppins}>
                Un interlocuteur pour vos contenus
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                L’équipe de l’ASFO accompagne les journalistes et partenaires dans la préparation
                de contenus fiables sur ses missions et son impact.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Mic, label: 'Interviews' },
                { icon: BookOpen, label: 'Ressources médias' },
                { icon: ShieldCheck, label: 'Demandes institutionnelles' },
                { icon: Users, label: 'Partenariats presse' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-teal-50 bg-[#f2fbf8] p-4 text-center"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold text-[#123f38]" style={poppins}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ----------------------- CONTACT PRESSE ----------------------- */}
      <section
        id="contact-presse"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Colonne infos */}
          <motion.div {...fadeUp()} className="self-start">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
                Vous êtes journaliste&nbsp;?
              </h2>
            </div>
            <p className="mt-3 text-gray-600">
              Contactez le service presse de l’ASFO pour une interview, une demande d’information
              ou de visuels, ou une invitation média.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#123f38]" style={poppins}>
                    Email presse
                  </p>
                  <a
                    href={`mailto:${PRESS.email}`}
                    className="text-sm text-gray-600 transition-colors hover:text-teal-700"
                  >
                    {PRESS.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#123f38]" style={poppins}>
                    Téléphone
                  </p>
                  <a
                    href={`tel:${PRESS.phoneRaw}`}
                    className="text-sm text-gray-600 transition-colors hover:text-teal-700"
                  >
                    {PRESS.phoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#123f38]" style={poppins}>
                    Adresse
                  </p>
                  <p className="text-sm text-gray-600">
                    {PRESS.addressLines.map((l) => (
                      <React.Fragment key={l}>
                        {l}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#123f38]" style={poppins}>
                    Horaires
                  </p>
                  <p className="text-sm text-gray-600">
                    {PRESS.hours.map((h) => (
                      <React.Fragment key={h}>
                        {h}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </li>
            </ul>

            <a
              href={`https://wa.me/${PRESS.phoneRaw.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#075E54] px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#128C7E] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
              style={poppins}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Contacter via WhatsApp
            </a>
          </motion.div>

          {/* Colonne formulaire */}
          <motion.div {...fadeUp(0.1)} className="self-start">
            <PressContactForm />
          </motion.div>
        </div>
      </section>

      {/* --------------------- NEWSLETTER MÉDIAS --------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <MediaNewsletter />
      </section>
    </div>
  );
};

export default PressePage;
