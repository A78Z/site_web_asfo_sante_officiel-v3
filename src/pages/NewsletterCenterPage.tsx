import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,
  Handshake,
  Heart,
  Loader2,
  Lock,
  Mail,
  Megaphone,
  MessageSquare,
  Newspaper,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { z } from 'zod';
import { CONTACT_DETAILS } from '../data/contact';
import {
  NEWSLETTER_FAQ,
  NEWSLETTER_INTRO_CATEGORIES,
  NEWSLETTER_PREFERENCES,
  NEWSLETTER_RECEIVE_CARDS,
  SECURE_PREFERENCES_AVAILABLE,
  SMS_ALERTS_AVAILABLE,
  type NewsletterIconKey,
  type NewsletterPreferenceId,
} from '../data/newsletter';
import { createObject, queryObjects } from '../lib/parse';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const iconMap: Record<NewsletterIconKey, LucideIcon> = {
  megaphone: Megaphone,
  stethoscope: Stethoscope,
  clipboard: ClipboardList,
  calendar: CalendarDays,
  newspaper: Newspaper,
  report: FileText,
  handshake: Handshake,
  users: Users,
  heart: Heart,
};

interface NewsArticle {
  objectId: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  imageUrl?: string;
  coverImage?: {
    __type: 'File';
    name: string;
    url: string;
  };
  publishedAt?: string | { __type: 'Date'; iso: string };
  createdAt: string;
}

type FormField = 'firstName' | 'lastName' | 'email' | 'preferences' | 'consent' | 'website';
type FormErrors = Partial<Record<FormField, string>>;
type SubmitStatus = 'idle' | 'loading' | 'success' | 'exists' | 'error';

const subscriptionSchema = z.object({
  firstName: z.string().trim().max(80, 'Le prénom est trop long.'),
  lastName: z.string().trim().max(80, 'Le nom est trop long.'),
  email: z.string().trim().email('Saisissez une adresse email valide.').max(160),
  preferences: z
    .array(z.string())
    .min(1, 'Choisissez au moins une catégorie.')
    .refine(
      (values) =>
        values.every((value) =>
          NEWSLETTER_PREFERENCES.some((preference) => preference.id === value),
        ),
      'Une préférence sélectionnée est invalide.',
    ),
  consent: z.literal(true, {
    error: 'Votre consentement est nécessaire pour enregistrer l’inscription.',
  }),
  website: z.string().max(0, 'La demande ne peut pas être traitée.'),
});

const formatNewsDate = (article: NewsArticle) => {
  const source =
    typeof article.publishedAt === 'string'
      ? article.publishedAt
      : article.publishedAt?.iso ?? article.createdAt;
  const date = new Date(source);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
};

const getNewsImage = (article: NewsArticle) =>
  article.coverImage?.url || article.imageUrl || '';

const NewsletterCenterPage: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const formRef = useRef<HTMLElement>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<NewsletterPreferenceId[]>([]);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = 'Newsletter & alertes | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  useEffect(() => {
    let active = true;

    const loadNews = async () => {
      setNewsLoading(true);
      setNewsError(false);
      try {
        const { results } = await queryObjects<NewsArticle>('News', {
          where: { status: 'Publié' },
          order: '-createdAt',
          limit: 4,
        });
        if (active) setNews(results);
      } catch {
        if (active) setNewsError(true);
      } finally {
        if (active) setNewsLoading(false);
      }
    };

    void loadNews();
    return () => {
      active = false;
    };
  }, []);

  const selectedPreferenceLabels = useMemo(
    () =>
      NEWSLETTER_PREFERENCES.filter((preference) =>
        preferences.includes(preference.id),
      ).map((preference) => preference.label),
    [preferences],
  );

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const resetFeedback = () => {
    if (submitStatus !== 'loading') {
      setSubmitStatus('idle');
      setServerMessage('');
    }
  };

  const togglePreference = (id: NewsletterPreferenceId) => {
    resetFeedback();
    setErrors((current) => ({ ...current, preferences: undefined }));
    setPreferences((current) =>
      current.includes(id)
        ? current.filter((preference) => preference !== id)
        : [...current, id],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitStatus === 'loading') return;

    const parsed = subscriptionSchema.safeParse({
      firstName,
      lastName,
      email,
      preferences,
      consent,
      website,
    });

    if (!parsed.success) {
      const nextErrors: FormErrors = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as FormField | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      setSubmitStatus('idle');
      setServerMessage('Vérifiez les champs signalés avant de continuer.');
      return;
    }

    const normalizedEmail = parsed.data.email.toLowerCase();
    const lastAttempt = Number(
      window.localStorage.getItem('asfo-newsletter-last-submit') ?? 0,
    );
    if (Date.now() - lastAttempt < 10_000) {
      setSubmitStatus('error');
      setServerMessage(
        'Une demande vient déjà d’être envoyée depuis cet appareil. Patientez quelques secondes.',
      );
      return;
    }

    setErrors({});
    setSubmitStatus('loading');
    setServerMessage('');

    try {
      const { results } = await queryObjects<{ objectId: string; status?: string }>(
        'NewsletterSubscribers',
        {
          where: { email: normalizedEmail },
          limit: 1,
          keys: 'objectId,status',
        },
      );

      if (results.length > 0) {
        setSubmitStatus('exists');
        setServerMessage(
          'Cette adresse est déjà connue. Pour protéger votre abonnement, ses préférences ne sont pas modifiées sans lien sécurisé. Contactez l’ASFO si nécessaire.',
        );
        return;
      }

      await createObject('NewsletterSubscribers', {
        email: normalizedEmail,
        firstName: parsed.data.firstName || undefined,
        lastName: parsed.data.lastName || undefined,
        preferences: parsed.data.preferences,
        channelEmail: true,
        channelSms: false,
        status: 'Actif',
        source: 'Centre newsletter',
        consent: true,
        consentAt: {
          __type: 'Date',
          iso: new Date().toISOString(),
        },
      });

      window.localStorage.setItem(
        'asfo-newsletter-last-submit',
        String(Date.now()),
      );
      setSubmitStatus('success');
      setServerMessage(
        'Votre inscription a bien été enregistrée sur le serveur. Aucun email de confirmation n’est actuellement envoyé.',
      );
      setFirstName('');
      setLastName('');
      setEmail('');
      setPreferences([]);
      setConsent(false);
    } catch {
      setSubmitStatus('error');
      setServerMessage(
        'L’inscription n’a pas pu être enregistrée. Vérifiez votre connexion puis réessayez.',
      );
    }
  };

  const heroLabels = [
    { icon: Megaphone, label: 'Annonces officielles', className: 'left-3 top-6 sm:-left-5' },
    { icon: Bell, label: 'Alertes importantes', className: 'right-2 top-1/2 sm:-right-6' },
    { icon: FileText, label: 'Comptes-rendus de missions', className: 'bottom-5 left-8 sm:left-2' },
  ];

  const mainNews = news[0];
  const secondaryNews = news.slice(1, 4);

  return (
    <main className="min-h-0 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f4fbfa_48%,#ffffff_100%)] text-slate-900">
      <section className="relative isolate overflow-hidden border-b border-teal-100/80 bg-gradient-to-br from-[#f7fffd] via-white to-[#e8f8f5]">
        <div
          className="pointer-events-none absolute -left-24 top-12 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.03fr_0.97fr] lg:gap-16 lg:px-8 lg:py-24">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-teal-800 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Ressources & informations
            </span>
            <h1
              className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
              style={poppins}
            >
              Restez informé des actions de l’ASFO
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Recevez nos annonces, convocations, campagnes, comptes-rendus et
              informations importantes directement par email ou SMS.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(15,118,110,0.8)] transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                S’inscrire à la newsletter
              </button>
              <Link
                to="/news"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/85 px-6 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-teal-400 hover:text-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
              >
                Voir les dernières actualités
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-5 flex max-w-xl items-start gap-2 text-sm leading-6 text-slate-600">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-teal-700" aria-hidden="true" />
              Vous gardez le contrôle sur vos préférences. La gestion autonome
              et sécurisée est clairement signalée tant qu’elle reste en préparation.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-xl px-3 py-5 sm:px-8"
          >
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_35px_90px_-35px_rgba(15,80,70,0.45)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#082f2a]/75 via-transparent to-transparent" aria-hidden="true" />
              <img
                src="/asfo-news-barre.jpg"
                alt="Une équipe médicale de l’ASFO échange avec une communauté lors d’une mission."
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-100">
                  Sur le terrain
                </p>
                <p className="mt-1 text-xl font-bold" style={poppins}>
                  L’information au service de l’action
                </p>
              </div>
            </div>
            {heroLabels.map(({ icon: Icon, label, className }) => (
              <div
                key={label}
                className={`absolute ${className} hidden items-center gap-2 rounded-2xl border border-white/90 bg-white/95 px-3.5 py-3 text-xs font-bold text-slate-800 shadow-[0_18px_45px_-20px_rgba(15,80,70,0.55)] backdrop-blur sm:flex`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-teal-700">
              Vos choix
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl" style={poppins}>
              Choisissez les informations que vous souhaitez recevoir
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Inscrivez-vous uniquement aux catégories qui vous intéressent. La
              gestion sécurisée des préférences sera proposée dès que son
              infrastructure sera disponible.
            </p>
          </motion.div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {NEWSLETTER_INTRO_CATEGORIES.map((category, index) => {
              const Icon = iconMap[category.icon];
              return (
                <motion.article
                  key={category.title}
                  {...reveal(index * 0.06)}
                  className="group rounded-3xl border border-teal-100/80 bg-white/90 p-5 shadow-[0_18px_55px_-35px_rgba(15,80,70,0.35)] transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_24px_60px_-32px_rgba(15,118,110,0.4)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-slate-900" style={poppins}>
                    {category.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-teal-100/70 bg-white/75 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <motion.article
              {...reveal()}
              className="relative overflow-hidden rounded-[2rem] border border-teal-200 bg-gradient-to-br from-white to-teal-50 p-7 shadow-[0_25px_70px_-42px_rgba(15,80,70,0.45)] sm:p-9"
            >
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-teal-200/35 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg">
                  <Mail className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                  Inscription newsletter
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-950" style={poppins}>
                  Votre sélection, dans votre boîte email
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                  Enregistrez votre adresse et choisissez précisément les sujets
                  pour lesquels vous souhaitez être informé.
                </p>
                <ul className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                  {[
                    'Email obligatoire uniquement',
                    'Préférences non présélectionnées',
                    'Consentement horodaté',
                    'Enregistrement serveur réel',
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
                >
                  S’inscrire
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.article>

            <motion.article
              {...reveal(0.08)}
              className="relative overflow-hidden rounded-[2rem] border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/70 p-7 shadow-[0_25px_70px_-42px_rgba(120,80,15,0.3)] sm:p-9"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                  <Phone className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                  En préparation
                </span>
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-amber-800">
                Alertes SMS
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-950" style={poppins}>
                Les informations urgentes, quand le canal sera prêt
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Le service SMS n’est pas encore connecté. Aucun numéro de
                téléphone n’est recueilli et aucun message n’est simulé.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {['Convocations importantes', 'Informations de campagne', 'Alertes de dernière minute'].map(
                  (alert) => (
                    <li key={alert} className="flex items-center gap-2">
                      <Bell className="h-4 w-4 flex-none text-amber-700" aria-hidden="true" />
                      {alert}
                    </li>
                  ),
                )}
              </ul>
              {!SMS_ALERTS_AVAILABLE && (
                <p className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-600">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Activation indisponible
                </p>
              )}
            </motion.article>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-teal-700">
              Ce que vous recevrez
            </span>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl" style={poppins}>
              Des informations utiles, sans catégories imposées
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {NEWSLETTER_RECEIVE_CARDS.map((card, index) => {
              const Icon = iconMap[card.icon];
              return (
                <motion.article
                  key={card.title}
                  {...reveal(index * 0.06)}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_45px_-34px_rgba(15,23,42,0.4)]"
                >
                  <Icon className="h-6 w-6 text-teal-700" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-bold text-slate-900" style={poppins}>
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        ref={formRef}
        id="inscription-newsletter"
        className="scroll-mt-24 border-y border-teal-100/80 bg-gradient-to-br from-[#eaf9f6] via-white to-[#f8fffd] py-16 sm:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14 lg:px-8">
          <motion.div {...reveal()} className="lg:sticky lg:top-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-teal-800">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Inscription newsletter
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl" style={poppins}>
              Configurez votre abonnement
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Seul l’email est obligatoire. Le prénom et le nom restent
              facultatifs et aucune donnée médicale n’est demandée.
            </p>
            <div className="mt-7 rounded-3xl border border-teal-100 bg-white/85 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-teal-700" aria-hidden="true" />
                <div>
                  <p className="font-bold text-slate-900">Inscription transparente</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Le succès n’est affiché qu’après la réponse effective du
                    serveur. Aucun email ou SMS n’est annoncé s’il n’a pas été envoyé.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...reveal(0.08)}
            className="rounded-[2rem] border border-white bg-white p-5 shadow-[0_30px_80px_-42px_rgba(15,80,70,0.45)] sm:p-8 lg:p-10"
          >
            {submitStatus === 'success' ? (
              <div
                className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8"
                role="status"
                aria-live="polite"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Check className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-2xl font-extrabold text-emerald-950" style={poppins}>
                  Inscription enregistrée
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-900">
                  {serverMessage}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitStatus('idle');
                    setServerMessage('');
                  }}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-300 bg-white px-5 py-2.5 text-sm font-bold text-emerald-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
                >
                  Nouvelle inscription
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="newsletter-first-name" className="block text-sm font-bold text-slate-800">
                      Prénom <span className="font-normal text-slate-500">(facultatif)</span>
                    </label>
                    <input
                      id="newsletter-first-name"
                      type="text"
                      autoComplete="given-name"
                      maxLength={80}
                      value={firstName}
                      onChange={(event) => {
                        setFirstName(event.target.value);
                        setErrors((current) => ({ ...current, firstName: undefined }));
                        resetFeedback();
                      }}
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={errors.firstName ? 'newsletter-first-name-error' : undefined}
                      className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                      placeholder="Votre prénom"
                    />
                    {errors.firstName && (
                      <p id="newsletter-first-name-error" className="mt-1.5 text-sm text-red-700">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="newsletter-last-name" className="block text-sm font-bold text-slate-800">
                      Nom <span className="font-normal text-slate-500">(facultatif)</span>
                    </label>
                    <input
                      id="newsletter-last-name"
                      type="text"
                      autoComplete="family-name"
                      maxLength={80}
                      value={lastName}
                      onChange={(event) => {
                        setLastName(event.target.value);
                        setErrors((current) => ({ ...current, lastName: undefined }));
                        resetFeedback();
                      }}
                      aria-invalid={Boolean(errors.lastName)}
                      aria-describedby={errors.lastName ? 'newsletter-last-name-error' : undefined}
                      className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                      placeholder="Votre nom"
                    />
                    {errors.lastName && (
                      <p id="newsletter-last-name-error" className="mt-1.5 text-sm text-red-700">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="newsletter-email" className="block text-sm font-bold text-slate-800">
                    Adresse email <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    maxLength={160}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setErrors((current) => ({ ...current, email: undefined }));
                      resetFeedback();
                    }}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'newsletter-email-error' : 'newsletter-email-help'}
                    className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    placeholder="vous@exemple.com"
                  />
                  {errors.email ? (
                    <p id="newsletter-email-error" className="mt-1.5 text-sm text-red-700">
                      {errors.email}
                    </p>
                  ) : (
                    <p id="newsletter-email-help" className="mt-1.5 text-xs text-slate-500">
                      Cette adresse sert uniquement à gérer et transmettre les informations choisies.
                    </p>
                  )}
                </div>

                <fieldset className="mt-8">
                  <legend className="text-base font-extrabold text-slate-900" style={poppins}>
                    Catégories souhaitées
                  </legend>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Aucune catégorie n’est présélectionnée. Choisissez au moins un sujet.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPreferences(NEWSLETTER_PREFERENCES.map((item) => item.id));
                        setErrors((current) => ({ ...current, preferences: undefined }));
                        resetFeedback();
                      }}
                      className="min-h-10 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-800 transition hover:bg-teal-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                    >
                      Tout sélectionner
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPreferences([]);
                        resetFeedback();
                      }}
                      className="min-h-10 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                    >
                      Tout désélectionner
                    </button>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {NEWSLETTER_PREFERENCES.map((preference) => {
                      const checked = preferences.includes(preference.id);
                      const Icon = iconMap[preference.icon];
                      return (
                        <label
                          key={preference.id}
                          className={`flex min-h-24 cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                            checked
                              ? 'border-teal-500 bg-teal-50 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-teal-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="newsletter-preferences"
                            value={preference.id}
                            checked={checked}
                            onChange={() => togglePreference(preference.id)}
                            className="sr-only"
                          />
                          <span
                            className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-xl ${
                              checked ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                            aria-hidden="true"
                          >
                            {checked ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-slate-900">
                              {preference.label}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-slate-600">
                              {preference.description}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.preferences && (
                    <p className="mt-2 text-sm text-red-700" role="alert">
                      {errors.preferences}
                    </p>
                  )}
                  {selectedPreferenceLabels.length > 0 && (
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Sélection : {selectedPreferenceLabels.join(', ')}.
                    </p>
                  )}
                </fieldset>

                <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="newsletter-website">Votre site internet</label>
                  <input
                    id="newsletter-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </div>

                <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => {
                      setConsent(event.target.checked);
                      setErrors((current) => ({ ...current, consent: undefined }));
                      resetFeedback();
                    }}
                    className="mt-1 h-4 w-4 flex-none rounded border-slate-400 text-teal-700 focus:ring-teal-500"
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? 'newsletter-consent-error' : undefined}
                  />
                  <span className="text-sm leading-6 text-slate-700">
                    J’accepte que l’ASFO utilise mon email pour m’envoyer les
                    catégories sélectionnées. Je peux exercer mes droits en
                    contactant l’association.{' '}
                    <Link
                      to="/privacy"
                      className="font-bold text-teal-800 underline decoration-teal-300 underline-offset-2"
                    >
                      Politique de confidentialité
                    </Link>
                    .
                  </span>
                </label>
                {errors.consent && (
                  <p id="newsletter-consent-error" className="mt-2 text-sm text-red-700" role="alert">
                    {errors.consent}
                  </p>
                )}

                {serverMessage && submitStatus !== 'success' && (
                  <div
                    className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6 ${
                      submitStatus === 'exists'
                        ? 'border-amber-200 bg-amber-50 text-amber-950'
                        : submitStatus === 'error'
                          ? 'border-red-200 bg-red-50 text-red-900'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                    role={submitStatus === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                  >
                    {submitStatus === 'exists' ? (
                      <ShieldCheck className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
                    ) : submitStatus === 'error' ? (
                      <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
                    )}
                    <span>{serverMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-15px_rgba(15,118,110,0.8)] transition hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Enregistrement…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Confirmer mon inscription
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-teal-700">
                Dernières actualités
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl" style={poppins}>
                Les publications récentes de l’ASFO
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Cette sélection provient directement de la même source que la page Actualités.
              </p>
            </div>
            <Link
              to="/news"
              className="inline-flex min-h-11 flex-none items-center justify-center gap-2 rounded-full border border-teal-200 bg-white px-5 py-2.5 text-sm font-bold text-teal-800 transition hover:border-teal-400 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
            >
              Voir toutes les actualités
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>

          {newsLoading ? (
            <div className="mt-10 grid gap-5 lg:grid-cols-2" aria-label="Chargement des actualités">
              <div className="h-96 animate-pulse rounded-[2rem] bg-teal-100/60" />
              <div className="grid gap-4">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-28 animate-pulse rounded-2xl bg-teal-100/50" />
                ))}
              </div>
            </div>
          ) : newsError ? (
            <div className="mt-10 flex items-start gap-3 rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-900" role="alert">
              <AlertCircle className="h-5 w-5 flex-none" aria-hidden="true" />
              Les actualités n’ont pas pu être chargées. Vous pouvez les consulter directement sur la page dédiée.
            </div>
          ) : news.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <Newspaper className="mx-auto h-8 w-8 text-teal-600" aria-hidden="true" />
              <p className="mt-3 font-bold text-slate-900">Aucune actualité publiée pour le moment.</p>
              <p className="mt-1 text-sm text-slate-600">Cette section se remplira automatiquement après publication dans le back-office.</p>
            </div>
          ) : (
            <div className="mt-10 grid items-start gap-5 lg:grid-cols-[1.12fr_0.88fr]">
              {mainNews && (
                <motion.article {...reveal()} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_65px_-40px_rgba(15,23,42,0.45)]">
                  <Link to={`/news/${mainNews.slug}`} className="block">
                    <div className="relative overflow-hidden bg-teal-50">
                      {getNewsImage(mainNews) ? (
                        <img
                          src={getNewsImage(mainNews)}
                          alt=""
                          loading="lazy"
                          className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                        />
                      ) : (
                        <div className="flex aspect-[16/9] items-center justify-center">
                          <Newspaper className="h-10 w-10 text-teal-300" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                        {mainNews.category && (
                          <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-800">
                            {mainNews.category}
                          </span>
                        )}
                        <span>{formatNewsDate(mainNews)}</span>
                      </div>
                      <h3 className="mt-4 text-2xl font-extrabold leading-tight text-slate-950 transition group-hover:text-teal-800" style={poppins}>
                        {mainNews.title}
                      </h3>
                      {mainNews.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{mainNews.excerpt}</p>
                      )}
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700">
                        Lire l’article
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              )}

              <div className="grid gap-4">
                {secondaryNews.map((article, index) => (
                  <motion.article
                    key={article.objectId}
                    {...reveal(index * 0.06)}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_16px_45px_-36px_rgba(15,23,42,0.4)]"
                  >
                    <Link to={`/news/${article.slug}`} className="grid grid-cols-[6.5rem_1fr] items-center gap-4 sm:grid-cols-[8rem_1fr]">
                      <div className="overflow-hidden rounded-xl bg-teal-50">
                        {getNewsImage(article) ? (
                          <img
                            src={getNewsImage(article)}
                            alt=""
                            loading="lazy"
                            className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex aspect-square items-center justify-center">
                            <Newspaper className="h-6 w-6 text-teal-300" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 pr-2">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
                          {article.category && <span className="text-teal-700">{article.category}</span>}
                          <span>{formatNewsDate(article)}</span>
                        </div>
                        <h3 className="mt-2 line-clamp-2 text-sm font-extrabold leading-snug text-slate-900 transition group-hover:text-teal-800 sm:text-base" style={poppins}>
                          {article.title}
                        </h3>
                        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700">
                          Lire l’article
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
                {secondaryNews.length < 3 && (
                  <Link
                    to="/news"
                    className="flex min-h-24 items-center justify-center gap-2 rounded-2xl border border-dashed border-teal-200 bg-teal-50/60 p-5 text-sm font-bold text-teal-800"
                  >
                    Consulter toutes les publications
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-teal-100/80 bg-white/80 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.article {...reveal()} className="rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-7 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-bold text-teal-800">
                Confidentialité
              </span>
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-slate-950" style={poppins}>
              Vos données restent protégées
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Vos coordonnées sont utilisées uniquement pour gérer votre
              inscription et transmettre les informations sélectionnées. Elles
              ne sont pas vendues ni affichées publiquement.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/privacy" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-bold text-white">
                Politique de confidentialité
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={`mailto:${CONTACT_DETAILS.email}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800"
              >
                Exercer mes droits
              </a>
            </div>
          </motion.article>

          <motion.article {...reveal(0.08)} className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </span>
              {!SECURE_PREFERENCES_AVAILABLE && (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
                  En préparation
                </span>
              )}
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-slate-950" style={poppins}>
              Gérer mes préférences
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              La modification autonome exige un lien personnel sécurisé. Cette
              infrastructure n’est pas encore disponible : aucune adresse ne
              peut donc modifier l’abonnement d’une autre personne depuis cette page.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:border-teal-400 hover:text-teal-800"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Contacter l’ASFO
            </Link>
          </motion.article>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-teal-700">FAQ</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl" style={poppins}>
              Questions sur les abonnements
            </h2>
          </motion.div>
          <div className="mt-10 space-y-3">
            {NEWSLETTER_FAQ.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={item.question}
                  {...reveal(index * 0.03)}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`newsletter-faq-${index}`}
                      className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-extrabold text-slate-900 outline-none transition hover:bg-teal-50/60 focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-teal-200 sm:px-6 sm:text-base"
                      style={poppins}
                    >
                      {item.question}
                      <ChevronDown
                        className={`h-5 w-5 flex-none text-teal-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <div
                    id={`newsletter-faq-${index}`}
                    hidden={!isOpen}
                    className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-slate-600 sm:px-6"
                  >
                    {item.answer}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...reveal()}
            className="relative overflow-hidden rounded-[2rem] border border-teal-200 bg-gradient-to-br from-[#ddf6f1] via-[#f6fffd] to-white px-6 py-12 text-center sm:px-10 sm:py-16"
          >
            <div className="pointer-events-none absolute -left-20 top-0 h-52 w-52 rounded-full bg-teal-200/45 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-emerald-100/70 blur-3xl" aria-hidden="true" />
            <div className="relative mx-auto max-w-3xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl" style={poppins}>
                Ne manquez aucune information importante de l’ASFO.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Choisissez vos préférences et recevez uniquement les annonces,
                campagnes et publications qui vous intéressent.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
                >
                  S’inscrire à la newsletter
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <Link
                  to="/news"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-800"
                >
                  Voir les actualités
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white/70 px-6 py-3 text-sm font-bold text-slate-800"
                >
                  Contacter l’ASFO
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default NewsletterCenterPage;
