import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  Handshake,
  Building2,
  Users,
  HeartHandshake,
  Stethoscope,
  ArrowRight,
  ExternalLink,
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  ShieldCheck,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  GraduationCap,
  Truck,
  Eye,
  BadgeCheck,
  ClipboardCheck,
  MessageSquare,
  Sparkles,
  Award,
  Globe,
  Phone,
} from 'lucide-react';
import { PARTNERS, PARTNER_CATEGORIES, type Partner } from '../data/partners';
import { createObject, uploadFile, ParseFile } from '../lib/parse';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const ORG_TYPES = [
  'Institution publique',
  'Université',
  'Association',
  'ONG',
  'Fondation',
  'Entreprise',
  'Collectivité',
  'Organisation professionnelle',
  'Autre',
];

const DOMAINS = [
  'Missions médicales',
  'Formation',
  'Sensibilisation',
  'Recherche',
  'Soutien logistique',
  'Financement',
  'Communication',
  'Autre',
];

const inputCls =
  'w-full rounded-xl border border-teal-100 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50';
const labelCls = 'mb-1.5 block text-xs font-semibold text-gray-700';

/* ------------------------------------------------------------------ */
/* Compteur animé                                                     */
/* ------------------------------------------------------------------ */

const StatCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1400, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Logo (zone blanche homogène, object-contain)                       */
/* ------------------------------------------------------------------ */

const LogoBox: React.FC<{ partner: Partner; className?: string }> = ({ partner, className = '' }) => (
  <div className={`flex items-center justify-center rounded-xl border border-gray-100 bg-white ${className}`}>
    <img
      src={partner.logo}
      alt={`Logo — ${partner.name}`}
      loading="lazy"
      className="max-h-full max-w-full object-contain"
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* Carte partenaire                                                   */
/* ------------------------------------------------------------------ */

const PartnerCard: React.FC<{ partner: Partner; onOpen: (p: Partner) => void }> = ({ partner, onOpen }) => (
  <motion.article
    {...fadeUp()}
    className="group flex h-full flex-col rounded-2xl border border-teal-100 bg-white/90 p-6 backdrop-blur-sm shadow-[0_18px_45px_-28px_rgba(18,63,56,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-25px_rgba(18,63,56,0.4)]"
  >
    <div className="flex items-start justify-between gap-3">
      <LogoBox partner={partner} className="h-20 w-20 flex-none p-3" />
      <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700" style={poppins}>
        {partner.category}
      </span>
    </div>
    <h3 className="mt-4 text-base font-bold leading-snug text-[#123f38]" style={poppins}>
      {partner.name}
    </h3>
    <p className="mt-2 flex-grow text-sm leading-relaxed text-gray-600">{partner.description}</p>
    <div className="mt-5 flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={() => onOpen(partner)}
        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-4 py-2 text-xs font-bold text-white shadow-[0_12px_30px_-14px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
        style={poppins}
      >
        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
        Découvrir
      </button>
      {partner.website && (
        <a
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-bold text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          style={poppins}
        >
          Site officiel
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
    </div>
  </motion.article>
);

/* ------------------------------------------------------------------ */
/* Modal détail partenaire                                            */
/* ------------------------------------------------------------------ */

const PartnerModal: React.FC<{ partner: Partner; onClose: () => void }> = ({ partner, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0b2a26]/70 p-3 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Fiche partenaire : ${partner.name}`}
    >
      <motion.div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <LogoBox partner={partner} className="h-16 w-16 flex-none p-2.5" />
            <div>
              <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-teal-700" style={poppins}>
                {partner.category}
              </span>
              <h3 className="mt-1 text-lg font-bold leading-snug text-[#123f38]" style={poppins}>
                {partner.name}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="p-6">
          <h4 className="text-xs font-bold uppercase tracking-wide text-teal-600" style={poppins}>
            Présentation
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{partner.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {partner.website ? (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_-14px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
                Visiter le site
              </a>
            ) : (
              <span className="text-xs text-gray-400">Site officiel non renseigné.</span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Formulaire de partenariat (PartnershipRequests réel)               */
/* ------------------------------------------------------------------ */

const EMPTY_FORM = {
  organisation: '',
  responsable: '',
  fonction: '',
  email: '',
  telephone: '',
  pays: 'Sénégal',
  ville: '',
  siteWeb: '',
  typeOrganisation: '',
  domaine: '',
  description: '',
  accept: false,
};

const MAX_LOGO_MB = 10;
const LOGO_ACCEPT = '.png,.svg,.jpg,.jpeg,.webp';

const PartnershipForm: React.FC = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [reference, setReference] = useState<string | null>(null);

  const set = (key: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({
        ...f,
        [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value,
      }));

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError('');
    const file = e.target.files?.[0] ?? null;
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    if (!file) {
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }
    const okType = /\.(png|svg|jpe?g|webp)$/i.test(file.name);
    if (!okType) {
      setLogoError('Format non pris en charge (PNG, JPG, JPEG, WEBP ou SVG).');
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }
    if (file.size > MAX_LOGO_MB * 1024 * 1024) {
      setLogoError(`Fichier trop volumineux (max ${MAX_LOGO_MB} Mo).`);
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');
    try {
      let logo: ParseFile | undefined;
      if (logoFile) {
        logo = await uploadFile(logoFile.name, logoFile);
      }
      /* Aucun paiement ici. Après validation par l'administration ASFO, un lien
         de paiement sécurisé (Wave / Orange Money / Stripe) pourra être envoyé —
         champs paymentStatus / paymentLink réservés à cet effet côté serveur. */
      const created = await createObject('PartnershipRequests', {
        organisation: form.organisation.trim(),
        responsable: form.responsable.trim(),
        fonction: form.fonction.trim(),
        email: form.email.trim().toLowerCase(),
        telephone: form.telephone.trim(),
        pays: form.pays.trim(),
        ville: form.ville.trim(),
        siteWeb: form.siteWeb.trim(),
        typeOrganisation: form.typeOrganisation,
        domaine: form.domaine,
        description: form.description.trim(),
        ...(logo ? { logo } : {}),
        source: 'Page partenaires',
        status: 'En attente',
        paymentStatus: 'Non applicable',
      });
      setReference((created as { objectId?: string })?.objectId ?? null);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez.');
    }
  };

  if (status === 'success') {
    const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-teal-100 bg-teal-50/50 p-8 text-center" role="status">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2fb391] to-[#178066]">
          <CheckCircle2 className="h-8 w-8 text-white" aria-hidden="true" />
        </span>
        <h4 className="mt-4 text-xl font-bold text-[#123f38]" style={poppins}>
          Votre demande de partenariat a bien été envoyée
        </h4>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
          L’équipe de l’ASFO étudiera votre proposition et vous contactera pour la suite du
          processus.
        </p>
        <dl className="mt-5 w-full max-w-xs space-y-2 rounded-xl border border-teal-100 bg-white p-4 text-left text-sm">
          {reference && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">Numéro de demande</dt>
              <dd className="font-bold text-[#123f38]">{reference}</dd>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <dt className="text-gray-500">Date</dt>
            <dd className="font-semibold text-gray-700">{today}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-gray-500">Statut</dt>
            <dd>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                En attente
              </span>
            </dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-5 py-2.5 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            style={poppins}
          >
            Retour à l’accueil
          </Link>
          <Link
            to="/archives"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            Découvrir nos missions
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Demande de partenariat">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pf-org" className={labelCls}>Nom de l’organisation *</label>
          <input id="pf-org" required value={form.organisation} onChange={set('organisation')} className={inputCls} placeholder="Ex. : Fondation Santé Plus" autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="pf-resp" className={labelCls}>Nom du responsable *</label>
          <input id="pf-resp" required value={form.responsable} onChange={set('responsable')} className={inputCls} placeholder="Prénom et nom" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="pf-fonction" className={labelCls}>Fonction</label>
          <input id="pf-fonction" value={form.fonction} onChange={set('fonction')} className={inputCls} placeholder="Ex. : Directeur des partenariats" autoComplete="organization-title" />
        </div>
        <div>
          <label htmlFor="pf-email" className={labelCls}>Adresse email *</label>
          <input id="pf-email" type="email" required value={form.email} onChange={set('email')} className={inputCls} placeholder="contact@organisation.org" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="pf-tel" className={labelCls}>Téléphone</label>
          <input id="pf-tel" type="tel" value={form.telephone} onChange={set('telephone')} className={inputCls} placeholder="+221 …" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="pf-pays" className={labelCls}>Pays *</label>
          <input id="pf-pays" required value={form.pays} onChange={set('pays')} className={inputCls} autoComplete="country-name" />
        </div>
        <div>
          <label htmlFor="pf-ville" className={labelCls}>Ville</label>
          <input id="pf-ville" value={form.ville} onChange={set('ville')} className={inputCls} placeholder="Ex. : Dakar" autoComplete="address-level2" />
        </div>
        <div>
          <label htmlFor="pf-web" className={labelCls}>Site web</label>
          <input id="pf-web" type="url" value={form.siteWeb} onChange={set('siteWeb')} className={inputCls} placeholder="https://…" autoComplete="url" />
        </div>
        <div>
          <label htmlFor="pf-type" className={labelCls}>Type d’organisation *</label>
          <select id="pf-type" required value={form.typeOrganisation} onChange={set('typeOrganisation')} className={inputCls}>
            <option value="" disabled>Sélectionnez…</option>
            {ORG_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pf-domaine" className={labelCls}>Domaine de partenariat souhaité</label>
          <select id="pf-domaine" value={form.domaine} onChange={set('domaine')} className={inputCls}>
            <option value="">Sélectionnez…</option>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="pf-desc" className={labelCls}>Description de la proposition *</label>
        <textarea id="pf-desc" required rows={4} value={form.description} onChange={set('description')} className={`${inputCls} resize-none`} placeholder="Décrivez votre organisation et le partenariat envisagé…" />
      </div>

      <div>
        <label htmlFor="pf-logo" className={labelCls}>Logo de l’organisation (PNG, JPG, JPEG, WEBP ou SVG — {MAX_LOGO_MB} Mo max)</label>
        <label
          htmlFor="pf-logo"
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-teal-200 bg-teal-50/50 px-4 py-3 text-sm text-gray-600 transition-colors hover:border-teal-400 hover:bg-teal-50 focus-within:ring-2 focus-within:ring-teal-300/50"
        >
          {logoPreview ? (
            <img src={logoPreview} alt="Aperçu du logo" className="h-10 w-10 flex-none rounded-md border border-gray-100 bg-white object-contain p-1" />
          ) : (
            <Upload className="h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
          )}
          <span className="min-w-0 flex-1 truncate">{logoFile ? logoFile.name : 'Cliquez pour joindre votre logo'}</span>
          {logoFile && <CheckCircle2 className="h-4 w-4 flex-none text-teal-600" aria-hidden="true" />}
          <input id="pf-logo" type="file" accept={LOGO_ACCEPT} className="sr-only" onChange={onLogoChange} />
        </label>
        {logoError && <p className="mt-1.5 text-xs text-red-600" role="alert">{logoError}</p>}
        <p className="mt-1.5 text-xs text-gray-400">
          Votre logo reste privé et n’est jamais publié tant que le partenariat n’est pas validé.
        </p>
      </div>

      <label htmlFor="pf-accept" className="flex items-start gap-2.5 text-sm text-gray-600">
        <input id="pf-accept" type="checkbox" required checked={form.accept} onChange={set('accept')} className="mt-0.5 h-4 w-4 rounded border-teal-300 text-teal-600 focus:ring-teal-400" />
        <span>J’accepte les conditions du partenariat et le traitement de ma demande par l’ASFO. *</span>
      </label>

      {status === 'error' && (
        <p className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 disabled:cursor-not-allowed disabled:opacity-70"
        style={poppins}
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Handshake className="h-5 w-5" aria-hidden="true" />
            Envoyer ma demande
          </>
        )}
      </button>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-500">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none text-teal-600" aria-hidden="true" />
        Aucun paiement n’est demandé à cette étape. Aucune organisation n’est publiée sans
        validation humaine par l’ASFO.
      </p>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Données statiques (présentation, non chiffrée)                     */
/* ------------------------------------------------------------------ */

const INTRO_CARDS = [
  { icon: Sparkles, title: 'Expertise partagée', text: 'Universités et institutions apportent savoir-faire médical et scientifique.' },
  { icon: HeartHandshake, title: 'Soutien aux missions', text: 'Un appui logistique et humain qui rend possibles nos campagnes de terrain.' },
  { icon: Award, title: 'Impact durable', text: 'Des collaborations pensées pour des effets qui durent au-delà des missions.' },
];

const IMPACT_CARDS = [
  { icon: Stethoscope, title: 'Missions médicales', text: 'Consultations et soins gratuits menés avec l’appui de nos partenaires.' },
  { icon: GraduationCap, title: 'Formation', text: 'Encadrement et formation des professionnels et étudiants en santé.' },
  { icon: Megaphone, title: 'Sensibilisation', text: 'Campagnes de prévention et d’éducation à la santé dans les communautés.' },
  { icon: Truck, title: 'Soutien logistique', text: 'Mobilisation de moyens matériels pour atteindre les villages du Fouta.' },
];

const BENEFITS = [
  { icon: Eye, title: 'Visibilité sur le site officiel', text: 'Votre logo et votre présentation sur la page partenaires de l’ASFO.' },
  { icon: Award, title: 'Valorisation de l’engagement', text: 'Une reconnaissance publique de votre action sociale et solidaire.' },
  { icon: Stethoscope, title: 'Participation aux missions', text: 'La possibilité de vous associer à nos campagnes médicales.' },
  { icon: Building2, title: 'Collaboration institutionnelle', text: 'Un cadre de coopération sérieux et durable.' },
  { icon: Megaphone, title: 'Communication conjointe', text: 'Des actions de communication partagées autour de vos contributions.' },
  { icon: Users, title: 'Présence lors d’événements', text: 'Une visibilité lors de certains événements de l’ASFO.' },
];

const PROCESS = [
  { icon: Handshake, label: 'Envoi de la demande' },
  { icon: Search, label: 'Étude par l’ASFO' },
  { icon: MessageSquare, label: 'Échange avec le demandeur' },
  { icon: BadgeCheck, label: 'Validation du partenariat' },
  { icon: ClipboardCheck, label: 'Paiement éventuel' },
  { icon: Globe, label: 'Publication sur le site' },
];

const TIERS = [
  {
    name: 'Partenaire Essentiel',
    emoji: '🤝',
    accent: 'from-teal-400 to-teal-600',
    features: ['Logo sur la page partenaires', 'Lien vers votre site', 'Fiche partenaire simple'],
    highlight: false,
  },
  {
    name: 'Partenaire Plus',
    emoji: '⭐',
    accent: 'from-sky-400 to-teal-500',
    features: ['Logo mis en avant', 'Fiche détaillée', 'Visibilité renforcée', 'Présence dans certaines communications'],
    highlight: false,
  },
  {
    name: 'Partenaire Premium',
    emoji: '🏅',
    accent: 'from-amber-400 to-yellow-500',
    features: ['Grande mise en avant', 'Article ou contenu dédié', 'Communication conjointe', 'Présence sur certains événements', 'Badge partenaire officiel'],
    highlight: true,
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const PartenairesPage: React.FC = () => {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('tous');
  const [sort, setSort] = useState<'alpha' | 'categorie'>('alpha');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [modal, setModal] = useState<Partner | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Nos partenaires | ASFO — Action Sanitaire pour le Fouta';
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const header = document.getElementById('site-header');
    const offset = (header?.offsetHeight ?? 0) + 16;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  };

  const filtersActive = query.trim() !== '' || category !== 'tous';

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return PARTNERS.filter((p) => {
      if (category !== 'tous' && p.category !== category) return false;
      if (q && !normalize(`${p.name} ${p.description} ${p.category}`).includes(q)) return false;
      return true;
    });
  }, [query, category]);

  const grouped = useMemo(
    () =>
      PARTNER_CATEGORIES.map((cat) => ({
        cat,
        items: filtered.filter((p) => p.category === cat),
      })).filter((g) => g.items.length > 0),
    [filtered],
  );

  const resetFilters = () => {
    setQuery('');
    setCategory('tous');
    setSort('alpha');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      <div className="pointer-events-none absolute -left-32 top-44 h-72 w-72 rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-[70rem] h-80 w-80 rounded-full bg-teal-100/30 blur-[130px]" aria-hidden="true" />

      {/* ------------------------- HERO ------------------------- */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-teal-700 backdrop-blur-sm" style={poppins}>
              <Handshake className="h-4 w-4" aria-hidden="true" />
              Réseau de partenaires
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] text-[#123f38] sm:text-5xl" style={poppins}>
              Des collaborations qui{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
                renforcent notre impact
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              L’ASFO travaille main dans la main avec des institutions publiques, des universités,
              des associations, des professionnels et des organisations humanitaires pour mener à
              bien sa mission sanitaire au Fouta.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollTo(gridRef)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Building2 className="h-4 w-4" aria-hidden="true" />
                Découvrir nos partenaires
              </button>
              <button
                type="button"
                onClick={() => scrollTo(formRef)}
                className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60"
                style={poppins}
              >
                Devenir partenaire
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          {/* Composition logos + carte flottante */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <LogoBox partner={PARTNERS[0]} className="col-span-2 h-40 p-8 shadow-[0_24px_55px_-30px_rgba(18,63,56,0.45)]" />
              {PARTNERS.slice(1, 5).map((p) => (
                <LogoBox key={p.slug} partner={p} className="h-28 p-5 shadow-[0_18px_45px_-28px_rgba(18,63,56,0.35)]" />
              ))}
            </div>
            <div className="pointer-events-none absolute -bottom-5 -left-3 hidden rounded-2xl border border-teal-100 bg-white/95 p-4 shadow-[0_20px_45px_-20px_rgba(18,63,56,0.5)] backdrop-blur-sm sm:block">
              <div className="flex items-center gap-4 text-center">
                <div>
                  <p className="text-2xl font-extrabold text-[#123f38]" style={poppins}>
                    <StatCounter value={PARTNERS.length} />
                  </p>
                  <p className="text-[11px] text-gray-500">partenaires</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <p className="text-2xl font-extrabold text-[#123f38]" style={poppins}>
                    <StatCounter value={PARTNER_CATEGORIES.length} />
                  </p>
                  <p className="text-[11px] text-gray-500">catégories</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------------- INTRO INSTITUTIONNELLE --------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div {...fadeUp()}>
            <div className="h-1 w-14 rounded-full bg-gradient-to-r from-[#2fb391] to-[#137a61]" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
              Un réseau engagé pour la santé et l’action humanitaire
            </h2>
            <p className="mt-4 text-gray-600">
              L’ASFO s’appuie sur un réseau solide d’<strong className="text-[#123f38]">institutions</strong>,
              d’<strong className="text-[#123f38]">universités</strong> et d’
              <strong className="text-[#123f38]">organisations</strong> pour mener à bien sa mission
              sanitaire. Chaque collaboration renforce notre capacité à agir au plus près des
              communautés du Fouta.
            </p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {INTRO_CARDS.map((c, i) => (
              <motion.div
                key={c.title}
                {...fadeUp(i * 0.08)}
                className="rounded-2xl border border-teal-50 bg-white/85 p-5 shadow-[0_18px_45px_-30px_rgba(18,63,56,0.3)] backdrop-blur-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <c.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-[#123f38]" style={poppins}>{c.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------- FILTRES + CATÉGORIES --------------------- */}
      <section ref={gridRef} className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
            Nos partenaires par catégorie
          </h2>
          <p className="mt-2 text-gray-600">Recherchez une organisation ou filtrez par catégorie.</p>
        </motion.div>

        {/* Bouton filtres (mobile) */}
        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-700"
            aria-expanded={mobileFiltersOpen}
            style={poppins}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filtres
          </button>
        </div>

        {/* Barre de contrôle */}
        <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} mb-10 rounded-2xl border border-teal-100 bg-white/85 p-5 shadow-[0_18px_45px_-30px_rgba(18,63,56,0.35)] backdrop-blur-sm lg:block`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="lg:flex-1">
              <label htmlFor="p-search" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500" style={poppins}>Rechercher</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input id="p-search" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un partenaire..." className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Effacer la recherche">
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
            <div className="lg:w-56">
              <label htmlFor="p-cat" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500" style={poppins}>Catégorie</label>
              <select id="p-cat" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100">
                <option value="tous">Toutes les catégories</option>
                {PARTNER_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="lg:w-52">
              <label htmlFor="p-sort" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500" style={poppins}>Trier</label>
              <select id="p-sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100">
                <option value="alpha">Ordre alphabétique</option>
                <option value="categorie">Par catégorie</option>
              </select>
            </div>
            <button type="button" onClick={resetFilters} disabled={!filtersActive} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40" style={poppins}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Résultats */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-teal-200 bg-white/70 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-500">
              <Search className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="text-lg font-bold text-[#123f38]" style={poppins}>Aucun partenaire trouvé</p>
            <p className="mt-2 text-gray-500">Modifiez votre recherche ou réinitialisez les filtres.</p>
            <button type="button" onClick={resetFilters} className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white" style={poppins}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Réinitialiser les filtres
            </button>
          </div>
        ) : sort === 'alpha' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...filtered].sort((a, b) => a.name.localeCompare(b.name, 'fr')).map((p) => (
              <PartnerCard key={p.slug} partner={p} onOpen={setModal} />
            ))}
          </div>
        ) : (
          // Sections par catégorie
          <div className="space-y-14">
            {grouped.map((g) => (
              <div key={g.cat}>
                <motion.div {...fadeUp()} className="mb-6">
                  <h3 className="flex items-center gap-3 text-xl font-extrabold text-[#123f38]" style={poppins}>
                    <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-[#2fb391] to-[#137a61]" aria-hidden="true" />
                    {g.cat}
                  </h3>
                  <p className="mt-1.5 pl-4 text-sm text-gray-500">
                    {g.items.length} partenaire{g.items.length > 1 ? 's' : ''}
                  </p>
                </motion.div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {g.items.map((p) => (
                    <PartnerCard key={p.slug} partner={p} onOpen={setModal} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --------------------- NOTRE IMPACT ENSEMBLE --------------------- */}
      <section className="relative scroll-mt-24 bg-[#f2fbf8]/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
              Notre impact ensemble
            </h2>
            <p className="mt-4 text-gray-600">
              Chaque partenariat repose sur des objectifs communs, une validation institutionnelle
              et un engagement concret au service des communautés.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT_CARDS.map((c, i) => (
              <motion.div key={c.title} {...fadeUp(i * 0.08)} className="rounded-2xl border border-teal-50 bg-white p-6 text-center shadow-[0_18px_45px_-30px_rgba(18,63,56,0.3)]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2fbf8] text-teal-600">
                  <c.icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-[#123f38]" style={poppins}>{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------- DEVENIR PARTENAIRE --------------------- */}
      <section ref={formRef} className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="mx-auto mb-10 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-teal-700" style={poppins}>
            <Handshake className="h-4 w-4" aria-hidden="true" />
            Devenir partenaire
          </span>
          <h2 className="mt-5 text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
            Construisons ensemble un partenariat à fort impact
          </h2>
          <p className="mt-4 text-gray-600">
            Institution, université, association, ONG, fondation ou entreprise : proposez une
            collaboration avec l’ASFO et participez au développement de nos actions médicales et
            communautaires.
          </p>
        </motion.div>

        <div className="overflow-hidden rounded-[2rem] border border-teal-100 bg-white/85 shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr]">
            {/* Avantages */}
            <div className="relative min-w-0 bg-gradient-to-br from-[#0e4a3d] via-[#136353] to-[#178066] p-8 sm:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-300/15 blur-3xl" aria-hidden="true" />
              <h3 className="text-2xl font-extrabold leading-tight text-white" style={poppins}>
                Pourquoi devenir partenaire ?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-teal-50/85">
                Rejoignez l’écosystème d’organisations qui rendent possibles nos campagnes médicales
                au Fouta.
              </p>
              <ul className="mt-7 space-y-4">
                {BENEFITS.map((b, i) => (
                  <motion.li
                    key={b.title}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: 0.05 + i * 0.06, ease: 'easeOut' }}
                    className="flex items-start gap-3.5"
                  >
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                      <b.icon className="h-4 w-4 text-teal-200" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white" style={poppins}>{b.title}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-teal-50/70">{b.text}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
            {/* Formulaire */}
            <div className="min-w-0 p-8 sm:p-10">
              <h3 className="text-xl font-bold text-[#123f38] sm:text-2xl" style={poppins}>
                Demande de partenariat
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Remplissez ce formulaire : notre équipe étudie chaque demande avant validation.
              </p>
              <div className="mt-6">
                <PartnershipForm />
              </div>
            </div>
          </div>
        </div>

        {/* Processus de validation */}
        <div className="mx-auto mt-16 max-w-5xl">
          <motion.h3 {...fadeUp()} className="text-center text-xl font-bold text-[#123f38] sm:text-2xl" style={poppins}>
            De votre demande à la collaboration
          </motion.h3>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-500">
            Aucune demande n’est publiée automatiquement : chaque partenariat est validé par l’ASFO.
          </p>
          <ol className="relative mt-10 grid gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {PROCESS.map((step, i) => (
              <motion.li key={step.label} {...fadeUp(0.06 + i * 0.06)} className="relative flex flex-col items-center gap-3 text-center">
                <span className={`z-10 flex h-11 w-11 flex-none items-center justify-center rounded-full border shadow-sm ${i === PROCESS.length - 1 ? 'border-teal-500 bg-gradient-to-br from-[#2fb391] to-[#178066] text-white' : 'border-teal-200 bg-white text-teal-600'}`}>
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600/80" style={poppins}>Étape {i + 1}</p>
                  <p className="text-xs font-semibold text-gray-700" style={poppins}>{step.label}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Niveaux de visibilité (sans prix) */}
        <div className="mx-auto mt-16 max-w-5xl">
          <motion.div {...fadeUp()} className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600" style={poppins}>Programme Partenaire Officiel</span>
            <h3 className="mt-2 text-xl font-bold text-[#123f38] sm:text-2xl" style={poppins}>Trois niveaux de visibilité</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
              Le niveau et l’éventuelle contribution sont définis d’un commun accord après l’étude
              de votre demande.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                {...fadeUp(0.06 + i * 0.08)}
                className={`relative flex flex-col rounded-3xl border bg-white/90 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 ${tier.highlight ? 'border-amber-300/80 shadow-[0_25px_60px_-25px_rgba(217,160,32,0.45)] ring-1 ring-amber-200' : 'border-teal-100 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)]'}`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 px-4 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white shadow-md" style={poppins}>Le plus complet</span>
                )}
                <span className="text-3xl" aria-hidden="true">{tier.emoji}</span>
                <h4 className="mt-3 text-lg font-bold text-[#123f38]" style={poppins}>{tier.name}</h4>
                <div className={`mt-2 h-1 w-12 rounded-full bg-gradient-to-r ${tier.accent}`} aria-hidden="true" />
                <p className="mt-3 text-xs font-semibold text-gray-400">Contribution définie avec l’ASFO</p>
                <ul className="mt-4 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <BadgeCheck className="mt-0.5 h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => scrollTo(formRef)} className={`mt-auto pt-6 text-left text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${tier.highlight ? 'text-amber-600 hover:text-amber-500' : 'text-teal-700 hover:text-teal-500'}`} style={poppins}>
                  Proposer ce niveau →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------- CTA FINAL --------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-white via-[#eefaf6] to-[#e3f5ee] px-6 py-12 text-center shadow-[0_30px_70px_-40px_rgba(18,63,56,0.5)] sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-200/40 blur-[90px]" aria-hidden="true" />
          <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
            Unissons nos expertises au service des communautés.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-gray-600">
            Rejoignez le réseau de partenaires de l’ASFO et construisons ensemble des actions
            médicales et humanitaires durables.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => scrollTo(formRef)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
              <Handshake className="h-4 w-4" aria-hidden="true" />
              Devenir partenaire
            </button>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60" style={poppins}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Contacter l’ASFO
            </Link>
            <Link to="/archives" className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60" style={poppins}>
              Voir nos missions
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Modal détail */}
      <AnimatePresence>
        {modal && <PartnerModal partner={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default PartenairesPage;
