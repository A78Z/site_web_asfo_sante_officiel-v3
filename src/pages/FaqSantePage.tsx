import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Copy,
  Facebook,
  HelpCircle,
  HeartPulse,
  Loader2,
  MessageCircle,
  PhoneCall,
  Pill,
  Printer,
  Search,
  Send,
  ShieldCheck,
  ShieldPlus,
  Stethoscope,
  ThumbsDown,
  ThumbsUp,
  Users,
  X,
} from 'lucide-react';
import { createObject } from '../lib/parse';
import {
  HEALTH_FAQ_CATEGORIES,
  PUBLISHED_HEALTH_FAQ_QUESTIONS,
  getHealthFaqCategory,
  type HealthFaqCategoryIcon,
  type HealthFaqCategoryId,
  type HealthFaqQuestion,
} from '../data/healthFaq';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const CATEGORY_ICONS: Record<HealthFaqCategoryIcon, React.ElementType> = {
  consultations: Stethoscope,
  medicines: Pill,
  consult: HeartPulse,
};

const HERO_TOPICS = [
  { label: 'Consultations', icon: Stethoscope },
  { label: 'Médicaments', icon: Pill },
  { label: 'Prévention', icon: ShieldPlus },
  { label: 'Quand consulter', icon: HeartPulse },
];

const QUICK_SUGGESTIONS = [
  'soins gratuits',
  'médicaments',
  'quand consulter',
];

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const Highlight: React.FC<{ text: string; query: string }> = ({
  text,
  query,
}) => {
  const words = query
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 1);

  if (words.length === 0) return <>{text}</>;

  const expression = new RegExp(
    `(${words.map(escapeRegExp).join('|')})`,
    'gi',
  );
  const matcher = new RegExp(words.map(escapeRegExp).join('|'), 'i');

  return (
    <>
      {text.split(expression).map((part, index) =>
        matcher.test(part) ? (
          <mark
            key={`${part}-${index}`}
            className="rounded bg-amber-200/80 px-0.5 text-inherit"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

const CategoryCard: React.FC<{
  category: (typeof HEALTH_FAQ_CATEGORIES)[number];
  index: number;
  reducedMotion: boolean;
  onSelect: (category: HealthFaqCategoryId) => void;
}> = ({ category, index, reducedMotion, onSelect }) => {
  const Icon = CATEGORY_ICONS[category.icon];
  const availableCount = PUBLISHED_HEALTH_FAQ_QUESTIONS.filter(
    (question) => question.categoryId === category.id,
  ).length;
  const isAvailable = availableCount > 0;

  return (
    <motion.article
      initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.08 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-teal-100/80 bg-white p-6 shadow-[0_16px_45px_-30px_rgba(15,118,110,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_24px_55px_-28px_rgba(15,118,110,0.5)] sm:p-7"
    >
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-teal-100/55 blur-3xl transition-colors group-hover:bg-teal-200/65"
      />
      <div className="relative flex items-start justify-between gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 text-teal-700 ring-1 ring-teal-200/70">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
            isAvailable
              ? 'border-teal-200 bg-teal-50 text-teal-800'
              : 'border-amber-200 bg-amber-50 text-amber-800'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isAvailable ? 'bg-teal-500' : 'bg-amber-500'
            }`}
          />
          {isAvailable ? 'Questions disponibles' : 'En préparation'}
        </span>
      </div>

      <h2
        style={poppins}
        className="relative mt-6 text-2xl font-extrabold leading-tight text-slate-900"
      >
        {category.title}
      </h2>
      <p className="relative mt-3 text-base leading-7 text-slate-600">
        {category.description}
      </p>
      <p className="relative mt-4 text-sm font-bold text-teal-700">
        {availableCount}{' '}
        {availableCount === 1 ? 'question validée' : 'questions validées'}
      </p>

      <div className="relative my-5 h-px bg-gradient-to-r from-teal-200 via-teal-100 to-transparent" />

      <p className="relative text-sm font-bold text-slate-800">
        Sujets couverts
      </p>
      <ul className="relative mt-3 space-y-2.5">
        {category.topics.map((topic) => (
          <li
            key={topic}
            className="flex items-start gap-2.5 text-sm leading-6 text-slate-600"
          >
            <CheckCircle2
              className="mt-1 h-4 w-4 shrink-0 text-teal-600"
              aria-hidden="true"
            />
            {topic}
          </li>
        ))}
      </ul>

      {!isAvailable && (
        <div className="relative mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-sm leading-6 text-slate-600">
            Les réponses seront publiées après rédaction et validation par
            l’équipe médicale de l’ASFO.
          </p>
        </div>
      )}

      <div className="relative mt-auto grid gap-2.5 pt-6">
        {isAvailable ? (
          <button
            type="button"
            onClick={() => onSelect(category.id)}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-4 py-3 text-sm font-bold text-white ${focusRing}`}
          >
            Voir les questions
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-500"
          >
            Bientôt disponible
          </button>
        )}
        <Link
          to="/news"
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-3 text-center text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 ${focusRing}`}
        >
          Être informé de la publication
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
};

const FaqAccordion: React.FC<{
  question: HealthFaqQuestion;
  query: string;
  isOpen: boolean;
  reducedMotion: boolean;
  onToggle: () => void;
  onFeedback: (questionId: string, helpful: boolean) => Promise<void>;
  feedbackState: 'idle' | 'sending' | 'sent' | 'error';
  onPrint: (questionId: string) => void;
  hiddenForPrint: boolean;
}> = ({
  question,
  query,
  isOpen,
  reducedMotion,
  onToggle,
  onFeedback,
  feedbackState,
  onPrint,
  hiddenForPrint,
}) => {
  const category = getHealthFaqCategory(question.categoryId);
  const answerId = `faq-answer-${question.id}`;
  const triggerId = `faq-trigger-${question.id}`;
  const shareUrl = `${window.location.origin}${window.location.pathname}#faq-${question.id}`;
  const shareText = `${question.question} — FAQ santé ASFO`;
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article
      id={`faq-${question.id}`}
      className={`${hiddenForPrint ? 'print:hidden' : ''} scroll-mt-40 overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-[0_12px_35px_-28px_rgba(15,118,110,0.45)]`}
    >
      <h3>
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={onToggle}
          className={`flex min-h-16 w-full items-center gap-4 px-5 py-5 text-left sm:px-6 ${focusRing}`}
        >
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
              {category?.title}
            </span>
            <span
              style={poppins}
              className="mt-1.5 block text-lg font-extrabold leading-7 text-slate-900"
            >
              <Highlight text={question.question} query={query} />
            </span>
          </span>
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
              isOpen
                ? 'bg-teal-700 text-white'
                : 'bg-teal-50 text-teal-700'
            }`}
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={answerId}
            role="region"
            aria-labelledby={triggerId}
            initial={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            animate={reducedMotion ? undefined : { height: 'auto', opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-teal-50 px-5 pb-6 pt-5 sm:px-6">
              <p className="text-base leading-8 text-slate-700">
                <Highlight text={question.answer} query={query} />
              </p>

              <dl className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-bold text-slate-500">
                    Dernière validation
                  </dt>
                  <dd className="mt-1 text-slate-800">
                    {question.validatedAt}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-500">Source</dt>
                  <dd className="mt-1 text-slate-800">
                    {question.sources.join(', ')}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Cette réponse vous a-t-elle été utile ?
                  </p>
                  <div className="mt-2 flex gap-2">
                    {feedbackState === 'sent' ? (
                      <span
                        role="status"
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-teal-50 px-4 text-sm font-bold text-teal-800"
                      >
                        <Check className="h-4 w-4" /> Merci pour votre avis
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled={feedbackState === 'sending'}
                          onClick={() => onFeedback(question.id, true)}
                          className={`inline-flex min-h-10 items-center gap-2 rounded-xl border border-teal-200 px-4 text-sm font-bold text-teal-800 hover:bg-teal-50 disabled:opacity-60 ${focusRing}`}
                        >
                          <ThumbsUp className="h-4 w-4" /> Oui
                        </button>
                        <button
                          type="button"
                          disabled={feedbackState === 'sending'}
                          onClick={() => onFeedback(question.id, false)}
                          className={`inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60 ${focusRing}`}
                        >
                          <ThumbsDown className="h-4 w-4" /> Non
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className="flex flex-wrap gap-2 print:hidden"
                  aria-label="Partager ou imprimer cette réponse"
                >
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Partager sur WhatsApp"
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-teal-200 text-teal-700 hover:bg-teal-50 ${focusRing}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Partager sur Facebook"
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-teal-200 text-teal-700 hover:bg-teal-50 ${focusRing}`}
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={copyLink}
                    aria-label={copied ? 'Lien copié' : 'Copier le lien'}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-teal-200 text-teal-700 hover:bg-teal-50 ${focusRing}`}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onPrint(question.id)}
                    aria-label="Imprimer cette réponse"
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-teal-200 text-teal-700 hover:bg-teal-50 ${focusRing}`}
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};

type SuggestionForm = {
  name: string;
  email: string;
  category: HealthFaqCategoryId;
  question: string;
  consent: boolean;
};

const EMPTY_FORM: SuggestionForm = {
  name: '',
  email: '',
  category: 'consultations-asfo',
  question: '',
  consent: false,
};

const QuestionSuggestionForm: React.FC = () => {
  const [form, setForm] = useState<SuggestionForm>(EMPTY_FORM);
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (form.question.trim().length < 15) {
      setError('Décrivez votre question en au moins 15 caractères.');
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Saisissez une adresse email valide ou laissez ce champ vide.');
      return;
    }
    if (!form.consent) {
      setError('Votre consentement est nécessaire pour envoyer la question.');
      return;
    }

    setStatus('sending');
    try {
      await createObject('HealthFaqSuggestions', {
        name: form.name.trim() || null,
        email: form.email.trim().toLowerCase() || null,
        category: form.category,
        question: form.question.trim(),
        consent: true,
        status: 'A examiner',
        source: 'FAQ santé',
      });
      setForm(EMPTY_FORM);
      setStatus('success');
    } catch (submitError) {
      console.error(submitError);
      setStatus('error');
      setError(
        'La question n’a pas pu être envoyée. Veuillez réessayer plus tard.',
      );
    }
  };

  const inputClass =
    'min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100';

  return (
    <form onSubmit={submit} className="mt-8 grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">
          Nom <span className="font-normal text-slate-400">(facultatif)</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            className={`${inputClass} mt-2`}
            autoComplete="name"
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          Email <span className="font-normal text-slate-400">(facultatif)</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className={`${inputClass} mt-2`}
            autoComplete="email"
          />
        </label>
      </div>

      <label className="text-sm font-bold text-slate-700">
        Catégorie
        <select
          value={form.category}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              category: event.target.value as HealthFaqCategoryId,
            }))
          }
          className={`${inputClass} mt-2`}
        >
          {HEALTH_FAQ_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-bold text-slate-700">
        Votre question
        <textarea
          value={form.question}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              question: event.target.value,
            }))
          }
          className={`${inputClass} mt-2 min-h-32 resize-y`}
          placeholder="Décrivez votre question sans indiquer de données médicales ou personnelles sensibles."
          maxLength={1200}
          required
        />
      </label>

      <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        Votre question sera examinée par l’administration. Elle ne sera pas
        publiée automatiquement et aucune réponse médicale personnalisée ne
        sera générée.
      </p>

      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              consent: event.target.checked,
            }))
          }
          className="mt-1 h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
        />
        <span>
          J’accepte que cette question soit examinée par l’ASFO dans le cadre
          de l’amélioration de la FAQ.
        </span>
      </label>

      {error && (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      {status === 'success' && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm font-semibold text-teal-800"
        >
          <CheckCircle2 className="h-4 w-4" />
          Votre question a bien été transmise pour examen.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/15 disabled:opacity-60 sm:w-fit ${focusRing}`}
      >
        {status === 'sending' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma question'}
      </button>
    </form>
  );
};

const FaqSantePage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<
    HealthFaqCategoryId | 'all'
  >('all');
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<
    Record<string, 'idle' | 'sending' | 'sent' | 'error'>
  >({});
  const [printQuestionId, setPrintQuestionId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'FAQ santé | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const visibleQuestions = useMemo(() => {
    const normalizedQuery = normalize(query);

    return PUBLISHED_HEALTH_FAQ_QUESTIONS.filter((question) => {
      const matchesCategory =
        activeCategory === 'all' ||
        question.categoryId === activeCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const searchable = normalize(
        [
          question.question,
          question.answer,
          ...question.keywords,
          getHealthFaqCategory(question.categoryId)?.title ?? '',
        ].join(' '),
      );

      return normalizedQuery
        .split(/\s+/)
        .filter(Boolean)
        .every((word) => searchable.includes(word));
    });
  }, [activeCategory, query]);

  useEffect(() => {
    if (
      openQuestionId &&
      !visibleQuestions.some((question) => question.id === openQuestionId)
    ) {
      setOpenQuestionId(null);
    }
  }, [openQuestionId, visibleQuestions]);

  const reveal = (delay = 0) => ({
    initial: reducedMotion ? undefined : { opacity: 0, y: 24 },
    whileInView: reducedMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.55, delay: reducedMotion ? 0 : delay },
  });

  const selectCategory = (category: HealthFaqCategoryId) => {
    setActiveCategory(category);
    document
      .getElementById('questions-frequentes')
      ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const sendFeedback = async (questionId: string, helpful: boolean) => {
    setFeedback((current) => ({ ...current, [questionId]: 'sending' }));
    try {
      await createObject('HealthFaqFeedback', {
        questionId,
        helpful,
        source: 'FAQ santé',
      });
      setFeedback((current) => ({ ...current, [questionId]: 'sent' }));
    } catch (feedbackError) {
      console.error(feedbackError);
      setFeedback((current) => ({ ...current, [questionId]: 'error' }));
    }
  };

  const printAnswer = (questionId: string) => {
    setPrintQuestionId(questionId);
    window.setTimeout(() => {
      window.print();
      setPrintQuestionId(null);
    }, 0);
  };

  return (
    <div className="overflow-hidden bg-gradient-to-b from-white via-[#f4fbfa] to-white text-slate-900 print:bg-white">
      <section className="relative isolate overflow-hidden border-b border-teal-100 bg-gradient-to-br from-[#f8fffd] via-white to-[#eaf8f4] print:hidden">
        <div
          aria-hidden="true"
          className="absolute -left-36 top-12 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#3fc9a4]/20 blur-3xl"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-8 lg:py-24">
          <motion.div {...reveal()} className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-bold text-teal-800 shadow-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Santé &amp; Prévention
            </span>
            <h1
              style={poppins}
              className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[#123f38] sm:text-5xl lg:text-6xl"
            >
              Des réponses claires à vos{' '}
              <span className="bg-gradient-to-r from-[#178066] to-[#3fc9a4] bg-clip-text text-transparent">
                questions de santé
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Retrouvez les questions les plus fréquentes posées pendant les
              consultations et les missions médicales de l’ASFO.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById('recherche-faq')
                    ?.scrollIntoView({
                      behavior: reducedMotion ? 'auto' : 'smooth',
                    });
                  window.setTimeout(() => searchInputRef.current?.focus(), 400);
                }}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(23,128,102,0.8)] transition-all hover:-translate-y-0.5 ${focusRing}`}
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Rechercher une réponse
              </button>
              <Link
                to="/services/consultations"
                className={`inline-flex min-h-12 items-center justify-center rounded-xl border border-teal-300 bg-white/80 px-6 py-3 text-sm font-bold text-teal-800 transition-all hover:-translate-y-0.5 hover:bg-teal-50 ${focusRing}`}
              >
                Découvrir nos consultations
              </Link>
            </div>
          </motion.div>

          <motion.div
            {...reveal(0.12)}
            className="relative mx-auto w-full max-w-xl lg:mx-0"
          >
            <div className="relative overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-[0_32px_80px_-36px_rgba(15,118,110,0.55)]">
              <img
                src="/sensibilisation-consultation.jpg"
                alt="Échange avec une patiente pendant une consultation ASFO"
                className="aspect-[4/3.3] w-full object-cover object-center sm:aspect-[4/3] lg:aspect-[4/3.3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/55 via-transparent to-white/5" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/25 bg-[#123f38]/75 p-4 text-white backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-100">
                  Écouter, expliquer, orienter
                </p>
                <p className="mt-1 text-sm leading-6 text-white/90">
                  Une information claire aide chacun à mieux préparer son
                  échange avec un professionnel de santé.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:absolute sm:-left-8 sm:-right-8 sm:-top-5 sm:mt-0 sm:gap-y-[16rem] lg:-left-10 lg:-right-6">
              {HERO_TOPICS.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex min-h-12 items-center gap-2 rounded-xl border border-teal-100 bg-white/95 px-3.5 py-3 text-sm font-bold text-[#123f38] shadow-lg shadow-teal-900/10 backdrop-blur"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6 lg:px-8 print:hidden">
        <motion.div
          {...reveal(0.05)}
          className="mx-auto flex max-w-7xl items-start gap-4 rounded-2xl border border-teal-200/80 bg-gradient-to-r from-teal-50 to-white p-5 shadow-sm sm:p-6"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
            <Stethoscope className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 style={poppins} className="text-lg font-extrabold text-slate-900">
              Ces réponses sont informatives
            </h2>
            <p className="mt-2 max-w-5xl text-sm leading-7 text-slate-700 sm:text-base">
              La FAQ ne remplace jamais l’avis d’un professionnel de santé. En
              cas de symptômes importants, persistants ou inhabituels, consultez
              rapidement une structure médicale.
            </p>
          </div>
        </motion.div>
      </section>

      <section
        id="recherche-faq"
        className="scroll-mt-36 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 print:hidden"
      >
        <motion.div
          {...reveal()}
          className="mx-auto max-w-5xl rounded-[2rem] border border-teal-100 bg-white p-6 shadow-[0_22px_65px_-42px_rgba(15,118,110,0.5)] sm:p-8"
        >
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Recherche
            </span>
            <h2
              style={poppins}
              className="mt-3 text-3xl font-extrabold text-[#123f38] sm:text-4xl"
            >
              Comment pouvons-nous vous aider ?
            </h2>
          </div>

          <label htmlFor="faq-search" className="sr-only">
            Rechercher dans la FAQ santé
          </label>
          <div className="relative mx-auto mt-8 max-w-3xl">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-700"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setQuery('');
              }}
              placeholder="Posez votre question ou recherchez un mot-clé..."
              className="min-h-14 w-full rounded-2xl border border-teal-200 bg-[#fbfefd] py-4 pl-14 pr-14 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  searchInputRef.current?.focus();
                }}
                aria-label="Réinitialiser la recherche"
                className={`absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 ${focusRing}`}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-semibold text-slate-500">
              Suggestions :
            </span>
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setQuery(suggestion);
                  searchInputRef.current?.focus();
                }}
                className={`min-h-10 rounded-full border border-teal-100 bg-teal-50/70 px-4 py-2 text-sm font-semibold text-teal-800 transition-colors hover:bg-teal-100 ${focusRing}`}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {visibleQuestions.length}{' '}
            {visibleQuestions.length === 1 ? 'réponse trouvée' : 'réponses trouvées'}
          </p>
        </motion.div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8 print:hidden">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Parcourir par thème
            </span>
            <h2
              style={poppins}
              className="mt-3 text-3xl font-extrabold text-[#123f38] sm:text-4xl"
            >
              Trois catégories pour mieux vous orienter
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {HEALTH_FAQ_CATEGORIES.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                reducedMotion={reducedMotion}
                onSelect={selectCategory}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="questions-frequentes"
        className="scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <motion.div {...reveal()} className="text-center print:hidden">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Réponses validées
            </span>
            <h2
              style={poppins}
              className="mt-3 text-3xl font-extrabold text-[#123f38] sm:text-4xl"
            >
              Questions les plus fréquentes
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Seules les réponses relues, sourcées et validées par l’équipe
              médicale sont publiées.
            </p>
          </motion.div>

          <div className="mt-8 overflow-x-auto pb-2 print:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`min-h-11 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${focusRing} ${
                  activeCategory === 'all'
                    ? 'bg-teal-700 text-white'
                    : 'border border-teal-100 bg-white text-slate-600 hover:bg-teal-50'
                }`}
              >
                Toutes
              </button>
              {HEALTH_FAQ_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`min-h-11 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${focusRing} ${
                    activeCategory === category.id
                      ? 'bg-teal-700 text-white'
                      : 'border border-teal-100 bg-white text-slate-600 hover:bg-teal-50'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {visibleQuestions.length > 0 ? (
              visibleQuestions.map((question) => (
                <FaqAccordion
                  key={question.id}
                  question={question}
                  query={query}
                  isOpen={openQuestionId === question.id}
                  reducedMotion={reducedMotion}
                  onToggle={() =>
                    setOpenQuestionId((current) =>
                      current === question.id ? null : question.id,
                    )
                  }
                  onFeedback={sendFeedback}
                  feedbackState={feedback[question.id] ?? 'idle'}
                  onPrint={printAnswer}
                  hiddenForPrint={
                    Boolean(printQuestionId) &&
                    printQuestionId !== question.id
                  }
                />
              ))
            ) : (
              <motion.div
                {...reveal()}
                className="rounded-[2rem] border border-dashed border-teal-200 bg-white/80 px-6 py-12 text-center print:hidden"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  {query ? (
                    <Search className="h-6 w-6" />
                  ) : (
                    <ClipboardList className="h-6 w-6" />
                  )}
                </span>
                <h3
                  style={poppins}
                  className="mt-5 text-xl font-extrabold text-slate-900"
                >
                  {query
                    ? 'Aucune réponse validée ne correspond à votre recherche'
                    : 'Les premières réponses sont en cours de validation'}
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                  {query
                    ? 'Essayez un autre mot-clé ou proposez votre question à l’équipe ASFO.'
                    : 'Elles seront publiées ici après rédaction, relecture médicale et vérification des sources.'}
                </p>
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className={`mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-teal-200 px-5 py-2.5 text-sm font-bold text-teal-800 hover:bg-teal-50 ${focusRing}`}
                  >
                    Réinitialiser la recherche
                  </button>
                )}
              </motion.div>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-teal-100 bg-teal-50/70 p-5 print:block">
            <p className="flex items-start gap-3 text-sm font-semibold leading-6 text-teal-950">
              <Stethoscope className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
              La FAQ ne remplace jamais l’avis d’un professionnel de santé. En
              cas de symptômes importants, persistants ou inhabituels, consultez
              rapidement une structure médicale.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 print:hidden">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <motion.article
            {...reveal()}
            className="rounded-[2rem] border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-7 sm:p-9"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm">
              <Pill className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2
              style={poppins}
              className="mt-5 text-2xl font-extrabold text-slate-900"
            >
              À propos des médicaments
            </h2>
            <p className="mt-4 text-base font-semibold leading-7 text-amber-950">
              Ne prenez jamais un médicament sur la seule base d’une réponse en
              ligne.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Respectez la prescription reçue et demandez conseil à un
              professionnel de santé en cas de doute ou d’effet inhabituel.
            </p>
          </motion.article>

          <motion.article
            {...reveal(0.08)}
            className="rounded-[2rem] border border-red-100 bg-gradient-to-br from-red-50/70 to-white p-7 sm:p-9"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2
              style={poppins}
              className="mt-5 text-2xl font-extrabold text-slate-900"
            >
              En cas de doute
            </h2>
            <p className="mt-4 text-base font-semibold leading-7 text-red-950">
              Il vaut mieux consulter rapidement un professionnel de santé.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Une aggravation rapide, une douleur importante, une difficulté à
              respirer ou une situation préoccupante chez une personne fragile
              nécessitent un avis professionnel sans attendre.
            </p>
          </motion.article>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 print:hidden">
        <motion.div
          {...reveal()}
          className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-teal-100 bg-white shadow-[0_24px_70px_-45px_rgba(15,118,110,0.55)]"
        >
          <div className="grid gap-8 bg-gradient-to-r from-[#effaf7] via-white to-[#f8fdfb] p-7 sm:p-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-teal-800 shadow-sm">
                <HelpCircle className="h-4 w-4" />
                Besoin d’une orientation
              </span>
              <h2
                style={poppins}
                className="mt-5 text-3xl font-extrabold text-[#123f38] sm:text-4xl"
              >
                Votre question reste sans réponse ?
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
                Contactez l’ASFO ou rapprochez-vous d’un professionnel de santé
                pour obtenir un conseil adapté à votre situation.
              </p>
            </div>
            <div className="grid gap-3">
              <Link
                to="/contact"
                className={`inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800 ${focusRing}`}
              >
                Contacter l’ASFO
              </Link>
              <Link
                to="/services/consultations"
                className={`inline-flex min-h-12 items-center justify-center rounded-xl border border-teal-200 bg-white px-5 py-3 text-sm font-bold text-teal-800 hover:bg-teal-50 ${focusRing}`}
              >
                Voir nos consultations
              </Link>
              <Link
                to="/sante/fiches"
                className={`inline-flex min-h-12 items-center justify-center rounded-xl border border-teal-200 bg-white px-5 py-3 text-sm font-bold text-teal-800 hover:bg-teal-50 ${focusRing}`}
              >
                Consulter les fiches santé
              </Link>
            </div>
          </div>

          <div className="border-t border-teal-100 p-7 sm:p-10 lg:p-12">
            <div className="max-w-3xl">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
                Proposer une question
              </span>
              <h2
                style={poppins}
                className="mt-3 text-2xl font-extrabold text-[#123f38] sm:text-3xl"
              >
                Aidez-nous à améliorer cette FAQ
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                N’indiquez aucun diagnostic, résultat d’examen, traitement ou
                autre donnée médicale personnelle.
              </p>
            </div>
            <QuestionSuggestionForm />
          </div>
        </motion.div>
      </section>

      <section className="px-4 pb-20 pt-8 sm:px-6 sm:pb-24 lg:px-8 print:hidden">
        <motion.div
          {...reveal()}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-teal-100 bg-gradient-to-br from-white via-[#effaf7] to-[#dff5ee] p-7 shadow-[0_24px_70px_-45px_rgba(15,118,110,0.55)] sm:p-10 lg:p-14"
        >
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-300/25 blur-3xl"
          />
          <div className="relative max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-teal-800 shadow-sm">
              <Users className="h-4 w-4" aria-hidden="true" />
              Information &amp; accompagnement
            </span>
            <h2
              style={poppins}
              className="mt-5 text-3xl font-extrabold text-[#123f38] sm:text-4xl"
            >
              Une question de santé mérite une réponse fiable.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg">
              Consultez nos fiches, découvrez nos conseils de prévention ou
              rapprochez-vous d’un professionnel de santé.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/sante/fiches"
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition-all hover:-translate-y-0.5 ${focusRing}`}
              >
                <BookOpenCheck className="h-4 w-4" />
                Voir les fiches santé
              </Link>
              <Link
                to="/sante/prevention"
                className={`inline-flex min-h-12 items-center justify-center rounded-xl border border-teal-300 bg-white/90 px-6 py-3 text-sm font-bold text-teal-800 hover:bg-white ${focusRing}`}
              >
                Découvrir les conseils
              </Link>
              <Link
                to="/contact"
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-teal-300 bg-transparent px-6 py-3 text-sm font-bold text-teal-800 hover:bg-white/70 ${focusRing}`}
              >
                <PhoneCall className="h-4 w-4" />
                Contacter l’ASFO
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default FaqSantePage;
