import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Building2,
  Landmark,
  GraduationCap,
  Briefcase,
  Users,
  Eye,
  HeartHandshake,
  Award,
  CalendarDays,
  Megaphone,
  Send,
  Search,
  CheckCircle2,
  Globe,
  Handshake,
  Upload,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
  MapPin,
  Loader2,
  AlertCircle,
  Heart,
  Stethoscope,
} from 'lucide-react';
import { createObject, uploadFile, ParseFile } from '../../lib/parse';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

/* ------------------------------------------------------------------ */
/* Partenaires réels                                                    */
/* ------------------------------------------------------------------ */

interface Partner {
  name: string;
  logo: string;
  category: string;
  type: string;
  typeIcon: React.ElementType;
  country: string;
}

const PARTNERS: Partner[] = [
  { name: 'Université Cheikh Anta Diop de Dakar', logo: '/Logo_ucad_2.png', category: 'UCAD', type: 'Université', typeIcon: GraduationCap, country: 'Sénégal' },
  { name: "Ministère de la Santé et de l'Action Sociale", logo: '/msascoro.jpg', category: 'MSAS', type: 'Institution publique', typeIcon: Landmark, country: 'Sénégal' },
  { name: 'Université Gaston Berger de Saint-Louis', logo: '/logo-ugb.jpg', category: 'UGB', type: 'Université', typeIcon: GraduationCap, country: 'Sénégal' },
  { name: 'Faculté de médecine, de pharmacie et d’odontologie', logo: '/logo-medecine.jpg', category: 'FMPOS', type: 'Université', typeIcon: GraduationCap, country: 'Sénégal' },
  { name: 'Pharmacie Nationale d’Approvisionnement', logo: '/SENPNA.jpeg', category: 'SEN PNA', type: 'Institution publique', typeIcon: Landmark, country: 'Sénégal' },
  { name: 'Ligue Sénégalaise contre le Cancer', logo: '/ligue_senegalaise.jpeg', category: 'LISCA', type: 'Association', typeIcon: Users, country: 'Sénégal' },
  { name: 'SENE ASSO', logo: '/sene-asso.jpg', category: 'SENE ASSO', type: 'Association', typeIcon: Users, country: 'Sénégal' },
  { name: 'Université Iba Der Thiam de Thiès', logo: '/logo-thies.jpg', category: 'THIÈS', type: 'Université', typeIcon: GraduationCap, country: 'Sénégal' },
  { name: 'Axiomtext.com', logo: '/axiomlogo.webp', category: 'AXIOMTEXT', type: 'Entreprise', typeIcon: Briefcase, country: 'Sénégal' },
  { name: 'FIDE', logo: '/Logo-fide.jpg', category: 'FIDE', type: 'Association', typeIcon: Users, country: 'Sénégal' },
];

const BENEFITS = [
  { icon: Eye, title: 'Visibilité sur le site officiel', text: 'Votre logo et votre lien présentés à tous nos visiteurs.' },
  { icon: HeartHandshake, title: 'Participation aux campagnes humanitaires', text: 'Impliquez vos équipes dans des missions à fort impact.' },
  { icon: Users, title: 'Collaboration avec l’ASFO', text: 'Travaillez main dans la main avec nos professionnels de santé.' },
  { icon: Award, title: 'Valorisation de votre engagement sociétal', text: 'Un engagement RSE concret, mesurable et documenté.' },
  { icon: CalendarDays, title: 'Présence lors des événements', text: 'Panels, assemblées, cérémonies : soyez à nos côtés.' },
  { icon: Megaphone, title: 'Opportunités de communication commune', text: 'Communiqués, réseaux sociaux et contenus co-signés.' },
];

const PROCESS_STEPS = [
  { icon: Send, label: 'Envoi de la demande' },
  { icon: Search, label: 'Analyse par l’ASFO' },
  { icon: CheckCircle2, label: 'Validation' },
  { icon: Globe, label: 'Publication sur le site' },
  { icon: Handshake, label: 'Début de la collaboration' },
];

const TIERS = [
  {
    emoji: '🥉',
    name: 'Partenaire Bronze',
    accent: 'from-amber-700 to-amber-500',
    features: ['Visibilité standard', 'Logo sur le site', 'Lien vers votre site'],
    highlight: false,
  },
  {
    emoji: '🥈',
    name: 'Partenaire Silver',
    accent: 'from-slate-500 to-slate-400',
    features: ['Mise en avant', 'Logo plus visible', 'Présence lors des campagnes'],
    highlight: false,
  },
  {
    emoji: '🥇',
    name: 'Partenaire Gold',
    accent: 'from-yellow-500 to-amber-400',
    features: ['Logo Premium', 'Article dédié', 'Communication conjointe', 'Présence lors des événements', 'Badge officiel'],
    highlight: true,
  },
];

/* Chiffres réels : 10 partenaires listés, 37 missions aux archives. */
const STATS = [
  { icon: Handshake, value: 10, suffix: '+', label: 'Partenaires engagés' },
  { icon: CalendarDays, value: 20, suffix: '+', label: 'Années de collaboration' },
  { icon: Stethoscope, value: 37, suffix: '+', label: 'Campagnes réalisées ensemble' },
  { icon: Heart, value: 25000, suffix: '+', label: 'Bénéficiaires' },
];

const ORG_TYPES = ['Association', 'ONG', 'Entreprise', 'Université', 'Collectivité', 'Institution publique', 'Fondation', 'Autre'];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const StatCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
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
      const p = Math.min((now - start) / 1600, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <span ref={ref}>
      {display.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
};

const inputCls =
  'w-full rounded-xl border border-teal-100 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50';
const labelCls = 'mb-1.5 block text-xs font-semibold text-gray-700';

/* ------------------------------------------------------------------ */
/* Carte partenaire (marquee)                                           */
/* ------------------------------------------------------------------ */

const PartnerCard: React.FC<{ partner: Partner }> = ({ partner }) => (
  <div className="group/card relative h-52 w-52 flex-none">
    <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-[0_15px_40px_-20px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-500 group-hover/card:-translate-y-2 group-hover/card:shadow-[0_25px_55px_-20px_rgba(18,63,56,0.4)]">
      <div className="flex h-full items-center justify-center p-6">
        <img
          src={partner.logo}
          alt={`Logo — ${partner.name}`}
          loading="lazy"
          className="max-h-[130px] max-w-[130px] object-contain transition-transform duration-500 group-hover/card:scale-105"
        />
      </div>

      {/* infos au survol */}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0b3a30]/90 via-[#0b3a30]/35 to-transparent p-3 opacity-0 transition-all duration-500 group-hover/card:opacity-100 group-focus-within/card:opacity-100">
        <div className="w-full translate-y-3 rounded-xl border border-white/60 bg-white/95 p-3 shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover/card:translate-y-0 group-focus-within/card:translate-y-0">
          <p className="line-clamp-2 text-[12.5px] font-bold leading-snug text-gray-900" style={poppins}>
            {partner.name}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10.5px] font-semibold text-teal-700">
              <partner.typeIcon className="h-3 w-3" aria-hidden="true" />
              {partner.type}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10.5px] font-semibold text-gray-600">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {partner.country}
            </span>
          </div>
          <Link
            to="/about/partenaires"
            className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-bold text-teal-700 transition-colors hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            Découvrir
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Formulaire de partenariat                                            */
/* ------------------------------------------------------------------ */

const EMPTY_FORM = {
  organisation: '',
  responsable: '',
  email: '',
  telephone: '',
  pays: 'Sénégal',
  ville: '',
  siteWeb: '',
  typeOrganisation: '',
  description: '',
  accept: false,
};

const PartnershipForm: React.FC = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({
        ...f,
        [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value,
      }));

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
      /* Paiement : aucun règlement n'est demandé ici. Après validation par
         l'administration ASFO, un lien de paiement sécurisé (Stripe / Wave)
         pourra être envoyé — champs `paymentStatus` / `paymentLink` réservés
         à cet effet dans la classe PartnershipRequests. */
      await createObject('PartnershipRequests', {
        organisation: form.organisation.trim(),
        responsable: form.responsable.trim(),
        email: form.email.trim().toLowerCase(),
        telephone: form.telephone.trim(),
        pays: form.pays.trim(),
        ville: form.ville.trim(),
        siteWeb: form.siteWeb.trim(),
        typeOrganisation: form.typeOrganisation,
        description: form.description.trim(),
        ...(logo ? { logo } : {}),
        status: 'En attente',
        paymentStatus: 'Non applicable',
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-teal-100 bg-teal-50/60 p-8 text-center" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2fb391] to-[#178066]">
          <CheckCircle2 className="h-7 w-7 text-white" aria-hidden="true" />
        </span>
        <h4 className="mt-4 text-lg font-bold text-gray-900" style={poppins}>
          Demande envoyée !
        </h4>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
          Merci pour votre confiance. L’administration de l’ASFO va étudier votre demande
          et vous recontactera à l’adresse indiquée. Si des frais de visibilité s’appliquent,
          un lien de paiement sécurisé vous sera envoyé après validation.
        </p>
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
      </div>

      <div>
        <label htmlFor="pf-desc" className={labelCls}>Description du partenariat proposé *</label>
        <textarea id="pf-desc" required rows={4} value={form.description} onChange={set('description')} className={`${inputCls} resize-none`} placeholder="Décrivez votre organisation et le partenariat envisagé…" />
      </div>

      <div>
        <label htmlFor="pf-logo" className={labelCls}>Logo de l’organisation (PNG, SVG, JPG ou PDF — 10 Mo max)</label>
        <label
          htmlFor="pf-logo"
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-teal-200 bg-teal-50/50 px-4 py-3 text-sm text-gray-600 transition-colors hover:border-teal-400 hover:bg-teal-50 focus-within:ring-2 focus-within:ring-teal-300/50"
        >
          <Upload className="h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">{logoFile ? logoFile.name : 'Cliquez pour joindre votre logo ou une présentation'}</span>
          <input
            id="pf-logo"
            type="file"
            accept=".png,.svg,.jpg,.jpeg,.webp,.pdf"
            className="sr-only"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <label htmlFor="pf-accept" className="flex items-start gap-2.5 text-sm text-gray-600">
        <input
          id="pf-accept"
          type="checkbox"
          required
          checked={form.accept}
          onChange={set('accept')}
          className="mt-0.5 h-4 w-4 rounded border-teal-300 text-teal-600 focus:ring-teal-400"
        />
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
        Aucun paiement n’est demandé à cette étape. Si le partenariat implique des frais de
        visibilité, un lien de paiement sécurisé vous sera envoyé uniquement après validation
        de votre demande par l’ASFO.
      </p>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

const Partners: React.FC = () => {
  const reduce = useReducedMotion();
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#f6fbf9] to-teal-50/50 py-24 sm:py-32"
      aria-labelledby="partners-title"
    >
      {/* ─── Fond premium (identique aux autres sections — validé) ─── */}
      <div className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-44 bottom-32 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[6%] top-24 hidden h-32 w-32 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />
      <svg className="pointer-events-none absolute right-[5%] bottom-24 hidden h-32 w-32 text-teal-300/20 lg:block" aria-hidden="true">
        <defs>
          <pattern id="asfo-dots-partners" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.7" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#asfo-dots-partners)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* ─── En-tête ─── */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp(0)}>
            <motion.span
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-6 py-2.5 shadow-[0_10px_30px_-15px_rgba(18,63,56,0.3)] backdrop-blur-sm"
            >
              <Building2 className="h-4 w-4 text-teal-600" aria-hidden="true" />
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
                Nos collaborations
              </span>
            </motion.span>
          </motion.div>

          <motion.h2
            id="partners-title"
            {...fadeUp(0.1)}
            className="mt-7 text-4xl font-extrabold leading-[1.08] text-gray-900 sm:text-5xl lg:text-6xl"
            style={poppins}
          >
            Nos Partenaires{' '}
            <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
              &amp; Réseaux
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.18)}
            className="mx-auto mt-6 max-w-[700px] text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8"
          >
            Depuis sa création, l’ASFO collabore avec des institutions publiques, des
            universités et des associations engagées dans la promotion de la santé,
            l’action humanitaire et l’encadrement étudiant.
          </motion.p>
        </div>

        {/* ─── Logos premium (défilement, pause au survol) ─── */}
        <motion.div {...fadeUp(0.15)} className="relative mt-14 overflow-hidden py-4">
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-[#f8fcfa] to-transparent sm:w-24" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-[#f8fcfa] to-transparent sm:w-24" aria-hidden="true" />
          {reduce ? (
            <ul className="flex flex-wrap justify-center gap-5" aria-label="Nos partenaires">
              {PARTNERS.map((p) => (
                <li key={p.category}><PartnerCard partner={p} /></li>
              ))}
            </ul>
          ) : (
            <div
              className="flex w-max animate-[scroll_45s_linear_infinite] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
              aria-label="Nos partenaires"
            >
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <div key={`${p.category}-${i}`} className="px-2.5">
                  <PartnerCard partner={p} />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ─── Devenir Partenaire Officiel ─── */}
        <motion.div
          {...fadeUp(0.1)}
          ref={formRef}
          id="devenir-partenaire"
          className="mx-auto mt-20 max-w-6xl scroll-mt-28 overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
            {/* Colonne gauche — avantages */}
            <div className="relative min-w-0 bg-gradient-to-br from-[#0e4a3d] via-[#136353] to-[#178066] p-8 sm:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-300/15 blur-3xl" aria-hidden="true" />
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-100 backdrop-blur-sm" style={poppins}>
                <Handshake className="h-3.5 w-3.5" aria-hidden="true" />
                Devenir Partenaire Officiel
              </span>
              <h3 className="mt-5 text-2xl font-extrabold leading-tight text-white sm:text-3xl" style={poppins}>
                Pourquoi devenir partenaire ?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-teal-50/85">
                Rejoignez l’écosystème d’institutions qui rendent possibles nos campagnes
                médicales au Fouta.
              </p>
              <ul className="mt-7 space-y-4">
                {BENEFITS.map((b, i) => (
                  <motion.li
                    key={b.title}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: 0.08 + i * 0.07, ease: 'easeOut' }}
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

            {/* Colonne droite — formulaire */}
            <div className="min-w-0 p-8 sm:p-10">
              <h3 className="text-xl font-bold text-gray-900 sm:text-2xl" style={poppins}>
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
        </motion.div>

        {/* ─── Processus ─── */}
        <div className="mx-auto mt-16 max-w-5xl">
          <motion.h3 {...fadeUp(0)} className="text-center text-xl font-bold text-gray-900 sm:text-2xl" style={poppins}>
            De votre demande à la collaboration
          </motion.h3>
          <ol className="relative mt-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
            <div className="absolute left-5 top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-teal-200 via-teal-300 to-teal-200 sm:left-[10%] sm:right-[10%] sm:top-5 sm:h-px sm:w-[80%] sm:bg-gradient-to-r" aria-hidden="true" />
            {PROCESS_STEPS.map((step, i) => (
              <motion.li
                key={step.label}
                {...fadeUp(0.08 + i * 0.09)}
                className="relative flex items-center gap-4 sm:w-1/5 sm:flex-col sm:gap-3 sm:text-center"
              >
                <span
                  className={`z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border shadow-sm ${
                    i === PROCESS_STEPS.length - 1
                      ? 'border-teal-500 bg-gradient-to-br from-[#2fb391] to-[#178066] text-white'
                      : 'border-teal-200 bg-white text-teal-600'
                  }`}
                >
                  <step.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="sm:px-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600/80" style={poppins}>
                    Étape {i + 1}
                  </p>
                  <p className="text-sm font-semibold text-gray-800" style={poppins}>{step.label}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* ─── Programme Partenaire Officiel ─── */}
        <div className="mx-auto mt-20 max-w-5xl">
          <motion.div {...fadeUp(0)} className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600" style={poppins}>
              Programme Partenaire Officiel
            </span>
            <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl" style={poppins}>
              Trois niveaux de visibilité
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
              Le niveau est défini d’un commun accord après l’étude de votre demande.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                {...fadeUp(0.08 + i * 0.09)}
                className={`relative flex flex-col rounded-3xl border bg-white/85 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 ${
                  tier.highlight
                    ? 'border-amber-300/80 shadow-[0_25px_60px_-25px_rgba(217,160,32,0.45)] ring-1 ring-amber-200'
                    : 'border-white/80 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)]'
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 px-4 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white shadow-md" style={poppins}>
                    Le plus complet
                  </span>
                )}
                <span className="text-3xl" aria-hidden="true">{tier.emoji}</span>
                <h4 className="mt-3 text-lg font-bold text-gray-900" style={poppins}>{tier.name}</h4>
                <div className={`mt-2 h-1 w-12 rounded-full bg-gradient-to-r ${tier.accent}`} aria-hidden="true" />
                <ul className="mt-5 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <BadgeCheck className="mt-0.5 h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={scrollToForm}
                  className={`mt-auto pt-6 text-left text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                    tier.highlight ? 'text-amber-600 hover:text-amber-500' : 'text-teal-700 hover:text-teal-500'
                  }`}
                  style={poppins}
                >
                  Proposer ce niveau →
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Statistiques ─── */}
        <motion.div {...fadeUp(0)} className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/80 bg-white/80 px-5 py-6 text-center shadow-[0_15px_40px_-20px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
                <stat.icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
              </span>
              <p className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}>
                <StatCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ─── Boutons ─── */}
        <motion.div {...fadeUp(0.1)} className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-4 text-base font-bold text-white shadow-[0_20px_45px_-18px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_55px_-18px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            <Handshake className="h-5 w-5" aria-hidden="true" />
            Devenir partenaire
          </button>
          <Link
            to="/about/partenaires"
            className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-8 py-4 text-base font-semibold text-teal-800 shadow-[0_12px_30px_-18px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            Voir tous les partenaires
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
