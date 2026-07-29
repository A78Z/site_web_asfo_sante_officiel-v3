import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  MessageSquareQuote,
  Quote,
  ChevronLeft,
  ChevronRight,
  Star,
  GraduationCap,
  Users,
  Heart,
  Stethoscope,
  ShieldCheck,
  Globe,
  Play,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Upload,
  Handshake,
} from 'lucide-react';
import { createObject, uploadFile, ParseFile } from '../../lib/parse';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

/* ------------------------------------------------------------------ */
/* Témoignages réels                                                    */
/* ------------------------------------------------------------------ */

interface Testimonial {
  content: string;
  author: string;
  role: string;
  location: string;
  category: string;
  categoryIcon: React.ElementType;
  /** Note laissée par l'auteur via le formulaire — absente pour les
      témoignages historiques : aucune étoile n'est alors affichée. */
  rating?: number;
  featured?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    content:
      "L'ASFO incarne l'espoir et les aspirations d'un peuple tout entier. Véritable joyau du Fouta, elle symbolise notre fierté collective et notre engagement commun pour un avenir meilleur. Merci pour votre dévouement indéfectible.",
    author: 'Abdoul Baba Poulo Gaynako',
    role: 'Faculté de médecine de Dakar',
    location: 'Thilogne, Sénégal',
    category: 'Étudiant en santé',
    categoryIcon: GraduationCap,
    featured: true,
  },
  {
    content:
      "Masha Allah, que la bénédiction d'Allah vous accompagne et vous élève. Vos actions sont d'une portée admirable et témoignent d'un engagement profondément inspirant.",
    author: 'Serigne Modou Babou',
    role: 'UCAD FMPOS',
    location: 'Région de Dakar, Sénégal',
    category: 'Étudiant en santé',
    categoryIcon: GraduationCap,
  },
  {
    content:
      "Mâcha Allah, toutes nos félicitations à l'ensemble de l'équipe ! Un grand merci à toutes celles et ceux qui ont contribué, de près ou de loin, au succès de cette belle campagne. Cap sur l'horizon 2025 pour un Matam uni et ambitieux !",
    author: 'Oumou Bocoum',
    role: 'Sympathisante de l’ASFO',
    location: 'Sénégal',
    category: 'Communauté',
    categoryIcon: Users,
  },
];

const TRUST_CARDS = [
  { icon: Heart, title: 'Humanité', text: 'Des équipes proches des populations.' },
  { icon: Stethoscope, title: 'Professionnalisme', text: 'Des interventions organisées avec rigueur.' },
  { icon: ShieldCheck, title: 'Transparence', text: 'Une gouvernance responsable.' },
  { icon: Globe, title: 'Impact', text: 'Des milliers de bénéficiaires chaque année.' },
];

/* Chiffres réels du site : 25 000+ patients, 600+ professionnels,
   10 partenaires listés, 37 missions archivées. */
const STATS = [
  { icon: Users, value: 25000, suffix: '+', label: 'Personnes accompagnées' },
  { icon: Stethoscope, value: 600, suffix: '+', label: 'Professionnels engagés' },
  { icon: Handshake, value: 10, suffix: '+', label: 'Partenaires' },
  { icon: Globe, value: 37, suffix: '+', label: 'Campagnes réalisées' },
];

/* Vidéo réelle de la chaîne ASFO Santé : campagne Podor 2024, avec les
   paroles filmées des équipes et des populations. */
const FIELD_VIDEO = { id: 'QtCIyH1yuOQ', title: 'Campagne médicale ASFO — Podor 2024', duration: '8:57' };

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

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

const Avatar: React.FC<{ name: string; size?: 'md' | 'lg' }> = ({ name, size = 'md' }) => (
  <span
    className={`flex flex-none items-center justify-center rounded-full bg-gradient-to-br from-[#2fb391] to-[#178066] font-bold text-white shadow-[0_10px_25px_-10px_rgba(23,128,102,0.6)] ${
      size === 'lg' ? 'h-16 w-16 text-xl' : 'h-12 w-12 text-base'
    }`}
    style={poppins}
    aria-hidden="true"
  >
    {initialsOf(name)}
  </span>
);

const CategoryBadge: React.FC<{ t: Testimonial }> = ({ t }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700" style={poppins}>
    <t.categoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
    {t.category}
  </span>
);

const RatingStars: React.FC<{ rating?: number }> = ({ rating }) => {
  if (!rating) return null;
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Note : ${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} aria-hidden="true" />
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-500">{rating}/5</span>
    </span>
  );
};

const inputCls =
  'w-full rounded-xl border border-teal-100 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50';
const labelCls = 'mb-1.5 block text-xs font-semibold text-gray-700';

/* ------------------------------------------------------------------ */
/* Formulaire « Partager votre expérience »                             */
/* ------------------------------------------------------------------ */

const TestimonialForm: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', organisation: '', fonction: '', message: '' });
  const [note, setNote] = useState(0);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');
    try {
      let photo: ParseFile | undefined;
      if (photoFile) photo = await uploadFile(photoFile.name, photoFile);
      /* Le témoignage n'est jamais publié directement : il attend la
         validation de l'administration dans le back-office. */
      await createObject('Testimonials', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        organisation: form.organisation.trim(),
        fonction: form.fonction.trim(),
        message: form.message.trim(),
        ...(note > 0 ? { note } : {}),
        ...(photo ? { photo } : {}),
        status: 'En attente',
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
        <h4 className="mt-4 text-lg font-bold text-gray-900" style={poppins}>Merci pour votre témoignage !</h4>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
          Il sera relu par l’administration de l’ASFO avant publication sur le site.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Partager votre expérience">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tf-name" className={labelCls}>Nom *</label>
          <input id="tf-name" required value={form.name} onChange={set('name')} className={inputCls} placeholder="Prénom et nom" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="tf-email" className={labelCls}>Email *</label>
          <input id="tf-email" type="email" required value={form.email} onChange={set('email')} className={inputCls} placeholder="vous@exemple.com" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="tf-org" className={labelCls}>Organisation</label>
          <input id="tf-org" value={form.organisation} onChange={set('organisation')} className={inputCls} placeholder="Ex. : UCAD, mairie, association…" autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="tf-fonction" className={labelCls}>Fonction</label>
          <input id="tf-fonction" value={form.fonction} onChange={set('fonction')} className={inputCls} placeholder="Ex. : étudiant, médecin, élu…" autoComplete="organization-title" />
        </div>
      </div>

      <div>
        <label htmlFor="tf-message" className={labelCls}>Votre témoignage *</label>
        <textarea id="tf-message" required rows={4} value={form.message} onChange={set('message')} className={`${inputCls} resize-none`} placeholder="Racontez votre expérience avec l'ASFO…" />
      </div>

      <fieldset>
        <legend className={labelCls}>Votre note</legend>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Note de 1 à 5 étoiles">
          {[1, 2, 3, 4, 5].map((i) => (
            <label key={i} className="cursor-pointer rounded p-0.5 focus-within:ring-2 focus-within:ring-teal-400">
              <input
                type="radio"
                name="tf-note"
                value={i}
                checked={note === i}
                onChange={() => setNote(i)}
                className="sr-only"
                aria-label={`${i} étoile${i > 1 ? 's' : ''}`}
              />
              <Star
                className={`h-7 w-7 transition-colors ${i <= note ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-300'}`}
                aria-hidden="true"
              />
            </label>
          ))}
          {note > 0 && <span className="ml-2 text-sm font-semibold text-gray-600">{note}/5</span>}
        </div>
      </fieldset>

      <div>
        <label htmlFor="tf-photo" className={labelCls}>Photo (optionnelle — JPG, PNG, 10 Mo max)</label>
        <label
          htmlFor="tf-photo"
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-teal-200 bg-teal-50/50 px-4 py-3 text-sm text-gray-600 transition-colors hover:border-teal-400 hover:bg-teal-50 focus-within:ring-2 focus-within:ring-teal-300/50"
        >
          <Upload className="h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">{photoFile ? photoFile.name : 'Joindre une photo'}</span>
          <input id="tf-photo" type="file" accept=".png,.jpg,.jpeg,.webp" className="sr-only" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
        </label>
      </div>

      {status === 'error' && (
        <p className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 disabled:cursor-not-allowed disabled:opacity-70"
        style={poppins}
      >
        {status === 'sending' ? (
          <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Envoi en cours…</>
        ) : (
          <><Send className="h-5 w-5" aria-hidden="true" /> Envoyer mon témoignage</>
        )}
      </button>

      <p className="text-xs leading-relaxed text-gray-500">
        Votre témoignage ne sera publié qu’après validation par l’administration de l’ASFO.
      </p>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

const TestimonialsSection: React.FC = () => {
  const reduce = useReducedMotion();
  /* Le slider démarre sur un témoignage différent de la vedette affichée au-dessus */
  const [index, setIndex] = useState(() => Math.max(0, TESTIMONIALS.findIndex((t) => !t.featured)));
  const [paused, setPaused] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const featured = TESTIMONIALS.find((t) => t.featured) ?? TESTIMONIALS[0];
  const sliderItems = TESTIMONIALS;
  const current = sliderItems[index];

  const next = useCallback(() => setIndex((i) => (i + 1) % sliderItems.length), [sliderItems.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + sliderItems.length) % sliderItems.length), [sliderItems.length]);

  /* Rotation automatique — en pause au survol/focus, coupée si reduced-motion */
  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [reduce, paused, next]);

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#f6fbf9] to-teal-50/50 py-24 sm:py-32"
      aria-labelledby="testimonials-title"
    >
      {/* ─── Fond premium (identique aux autres sections — validé) ─── */}
      <div className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-44 bottom-32 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[6%] top-24 hidden h-32 w-32 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />
      <svg className="pointer-events-none absolute right-[5%] bottom-24 hidden h-32 w-32 text-teal-300/20 lg:block" aria-hidden="true">
        <defs>
          <pattern id="asfo-dots-testimonials" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.7" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#asfo-dots-testimonials)" />
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
              <MessageSquareQuote className="h-4 w-4 text-teal-600" aria-hidden="true" />
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
                Témoignages
              </span>
            </motion.span>
          </motion.div>

          <motion.h2
            id="testimonials-title"
            {...fadeUp(0.1)}
            className="mt-7 text-4xl font-extrabold leading-[1.08] text-gray-900 sm:text-5xl lg:text-6xl"
            style={poppins}
          >
            Ce qu’ils pensent de{' '}
            <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
              l’ASFO
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.18)}
            className="mx-auto mt-6 max-w-[700px] text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8"
          >
            Découvrez les témoignages de celles et ceux qui ont bénéficié de nos actions
            et qui nous accompagnent dans notre mission au Fouta.
          </motion.p>
        </div>

        {/* ─── Témoignage vedette ─── */}
        <motion.figure
          {...fadeUp(0.12)}
          className="relative mx-auto mt-14 max-w-4xl rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-12"
        >
          <span className="absolute -top-3.5 left-8 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md sm:left-12" style={poppins}>
            <Star className="h-3.5 w-3.5 fill-white" aria-hidden="true" />
            Témoignage vedette
          </span>
          <Quote className="absolute right-8 top-8 h-14 w-14 -scale-x-100 text-teal-100 sm:h-20 sm:w-20" aria-hidden="true" />
          <blockquote className="relative max-w-3xl text-lg font-medium leading-relaxed text-gray-800 sm:text-2xl sm:leading-9" style={poppins}>
            «&nbsp;{featured.content}&nbsp;»
          </blockquote>
          <figcaption className="mt-7 flex flex-wrap items-center gap-4">
            <Avatar name={featured.author} size="lg" />
            <div className="min-w-0">
              <p className="text-base font-bold text-gray-900" style={poppins}>{featured.author}</p>
              <p className="text-sm text-gray-500">{featured.role} · {featured.location}</p>
            </div>
            <span className="ml-auto hidden sm:block"><CategoryBadge t={featured} /></span>
          </figcaption>
        </motion.figure>

        {/* ─── Slider + vidéo ─── */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Slider */}
          <motion.div
            {...fadeUp(0)}
            role="region"
            aria-roledescription="carrousel"
            aria-label="Témoignages"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
              if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="relative flex flex-col rounded-3xl border border-white/80 bg-white/80 p-7 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/50 sm:p-9"
          >
            <Quote className="absolute left-7 top-6 h-10 w-10 -scale-x-100 text-teal-100" aria-hidden="true" />
            <div className="relative min-h-[220px] flex-1 sm:min-h-[190px]">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={index}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 42, scale: 0.985 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -42, scale: 0.985 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  drag={reduce ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) next();
                    else if (info.offset.x > 60) prev();
                  }}
                  className="cursor-grab pt-8 active:cursor-grabbing"
                >
                  <blockquote className="text-base font-medium italic leading-relaxed text-gray-700 sm:text-lg sm:leading-8">
                    «&nbsp;{current.content}&nbsp;»
                  </blockquote>
                  <figcaption className="mt-6 flex flex-wrap items-center gap-3.5">
                    <Avatar name={current.author} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900" style={poppins}>{current.author}</p>
                      <p className="text-xs text-gray-500">{current.role} · {current.location}</p>
                    </div>
                    <span className="ml-auto flex flex-col items-end gap-1.5">
                      <CategoryBadge t={current} />
                      <RatingStars rating={current.rating} />
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-7 flex items-center justify-between border-t border-teal-50 pt-5">
              <div className="flex items-center gap-2" role="tablist" aria-label="Choisir un témoignage">
                {sliderItems.map((t, i) => (
                  <button
                    key={t.author}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Témoignage ${i + 1} — ${t.author}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                      i === index ? 'w-8 bg-gradient-to-r from-[#2fb391] to-[#178066]' : 'w-2.5 bg-teal-100 hover:bg-teal-200'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Témoignage précédent"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-100 bg-white text-teal-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Témoignage suivant"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-100 bg-white text-teal-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Vidéo — paroles filmées sur le terrain */}
          <motion.div
            {...fadeUp(0.1)}
            className="flex flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm"
          >
            <div className="relative aspect-video bg-black">
              {videoPlaying ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${FIELD_VIDEO.id}?rel=0&autoplay=1`}
                  title={FIELD_VIDEO.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={`https://i.ytimg.com/vi/${FIELD_VIDEO.id}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03130f]/85 via-[#03130f]/25 to-transparent" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => setVideoPlaying(true)}
                    aria-label={`Lancer la vidéo : ${FIELD_VIDEO.title}`}
                    className="group/play absolute inset-0 flex items-center justify-center focus:outline-none"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/15 shadow-[0_0_35px_rgba(63,201,164,0.5)] backdrop-blur-md transition-transform duration-300 group-hover/play:scale-110 group-focus-visible/play:ring-4 group-focus-visible/play:ring-teal-300/70">
                      <Play className="ml-0.5 h-6 w-6 fill-white text-white" aria-hidden="true" />
                    </span>
                  </button>
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                    {FIELD_VIDEO.duration}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-600" style={poppins}>
                Paroles du terrain
              </span>
              <p className="mt-1.5 text-sm font-bold leading-snug text-gray-900" style={poppins}>
                Les équipes et les populations racontent la campagne Podor 2024
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
                Témoignages filmés lors de la 25e Grande Campagne Médicale de l’ASFO.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ─── Voir tous les témoignages (grille dépliable) ─── */}
        <AnimatePresence>
          {showAll && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              id="tous-temoignages"
              className="mx-auto max-w-6xl overflow-hidden"
            >
              <div className="grid gap-5 pt-10 sm:grid-cols-2 lg:grid-cols-3">
                {TESTIMONIALS.map((t) => (
                  <figure
                    key={t.author}
                    className="flex flex-col rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_15px_40px_-20px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                  >
                    <CategoryBadge t={t} />
                    <blockquote className="mt-4 flex-1 text-sm italic leading-relaxed text-gray-700">
                      «&nbsp;{t.content}&nbsp;»
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3">
                      <Avatar name={t.author} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900" style={poppins}>{t.author}</p>
                        <p className="truncate text-xs text-gray-500">{t.role} · {t.location}</p>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Pourquoi ils nous font confiance ? ─── */}
        <div className="mx-auto mt-20 max-w-5xl">
          <motion.h3 {...fadeUp(0)} className="text-center text-xl font-bold text-gray-900 sm:text-2xl" style={poppins}>
            Pourquoi ils nous font confiance ?
          </motion.h3>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {TRUST_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                {...fadeUp(0.06 + i * 0.08)}
                className="rounded-3xl border border-white/80 bg-white/80 p-6 text-center shadow-[0_15px_40px_-20px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_22px_50px_-20px_rgba(18,63,56,0.35)]"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_10px_25px_-10px_rgba(23,128,102,0.6)]">
                  <card.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <h4 className="mt-4 text-base font-bold text-gray-900" style={poppins}>{card.title}</h4>
                <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Statistiques ─── */}
        <motion.div {...fadeUp(0)} className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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

        {/* ─── Partager votre expérience ─── */}
        <motion.div
          {...fadeUp(0.1)}
          ref={formRef}
          id="partager-experience"
          className="mx-auto mt-20 max-w-6xl scroll-mt-28 overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
            <div className="relative min-w-0 bg-gradient-to-br from-[#0e4a3d] via-[#136353] to-[#178066] p-8 sm:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-300/15 blur-3xl" aria-hidden="true" />
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-100 backdrop-blur-sm" style={poppins}>
                <MessageSquareQuote className="h-3.5 w-3.5" aria-hidden="true" />
                Votre voix compte
              </span>
              <h3 className="mt-5 text-2xl font-extrabold leading-tight text-white sm:text-3xl" style={poppins}>
                Partager votre expérience
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-teal-50/85">
                Vous avez été soigné lors d’une campagne, accompagné par nos équipes, ou vous
                collaborez avec l’ASFO ? Votre témoignage aide d’autres communautés à nous
                faire confiance — et nos équipes à s’améliorer.
              </p>
              <ul className="mt-7 space-y-3.5">
                {['Publication après validation par l’ASFO', 'Votre email reste confidentiel', 'Photo facultative'].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm text-teal-50/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-teal-300" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 p-8 sm:p-10">
              <TestimonialForm />
            </div>
          </div>
        </motion.div>

        {/* ─── Boutons ─── */}
        <motion.div {...fadeUp(0.1)} className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-4 text-base font-bold text-white shadow-[0_20px_45px_-18px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_55px_-18px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            <MessageSquareQuote className="h-5 w-5" aria-hidden="true" />
            Partager mon expérience
          </button>
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            aria-controls="tous-temoignages"
            className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-8 py-4 text-base font-semibold text-teal-800 shadow-[0_12px_30px_-18px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            {showAll ? 'Réduire les témoignages' : 'Voir tous les témoignages'}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
