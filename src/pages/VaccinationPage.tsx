import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  Syringe,
  Baby,
  Users,
  Activity,
  UserPlus,
  Milk,
  CalendarClock,
  Stethoscope,
  ArrowRight,
  Clock,
  BookOpen,
  Bell,
  Send,
  Loader2,
  Phone,
  AlertTriangle,
  ChevronDown,
  Plane,
  PersonStanding,
  HeartPulse,
  HelpCircle,
  Info,
  ClipboardList,
} from 'lucide-react';
import {
  VACCINE_CATEGORIES,
  VACCINE_STAGES,
  PUBLISHED_CATEGORIES,
  SCHEDULE_UPDATED_AT,
  type VaccineCategory,
  type VaccineStage,
} from '../data/vaccinationSchedule';
import { createObject, queryObjects } from '../lib/parse';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ICONS: Record<string, React.ElementType> = {
  baby: Baby,
  activity: Activity,
  userPlus: UserPlus,
  milk: Milk,
  calendarClock: CalendarClock,
  users: Users,
};

/* ------------------------------------------------------------------ */
/* Carte catégorie                                                    */
/* ------------------------------------------------------------------ */

const CategoryCard: React.FC<{ category: VaccineCategory }> = ({ category }) => {
  const Icon = ICONS[category.icon] ?? Syringe;
  const published = category.status === 'publie';
  return (
    <motion.article
      {...fadeUp()}
      className="flex h-full flex-col rounded-2xl border border-teal-100 bg-white/85 p-6 backdrop-blur-sm shadow-[0_18px_45px_-28px_rgba(18,63,56,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-25px_rgba(18,63,56,0.4)]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
        {published ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700" style={poppins}>
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            Calendrier disponible
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700" style={poppins}>
            <Clock className="h-3 w-3" aria-hidden="true" />
            En préparation
          </span>
        )}
      </div>

      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#f2fbf8] px-2.5 py-1 text-[11px] font-semibold text-teal-700">
        <CalendarClock className="h-3 w-3" aria-hidden="true" />
        {category.ageRange}
      </span>
      <h3 className="mt-2 text-lg font-bold text-[#123f38]" style={poppins}>
        {category.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{category.description}</p>

      <div className="mt-auto pt-5">
        {published ? (
          <Link
            to={`/sante/vaccination/${category.slug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_-14px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Consulter le calendrier
          </Link>
        ) : (
          <>
            <p className="mb-3 text-xs leading-relaxed text-gray-500">
              Cette section sera publiée après vérification et validation par l’équipe médicale de
              l’ASFO.
            </p>
            <span
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-400"
              aria-disabled="true"
              style={poppins}
            >
              <Clock className="h-4 w-4" aria-hidden="true" />
              Bientôt disponible
            </span>
          </>
        )}
      </div>
    </motion.article>
  );
};

/* ------------------------------------------------------------------ */
/* Étape de timeline                                                  */
/* ------------------------------------------------------------------ */

const StageItem: React.FC<{ stage: VaccineStage; index: number }> = ({ stage, index }) => {
  const Icon = ICONS[stage.icon] ?? CalendarClock;
  return (
    <motion.li {...fadeUp(index * 0.06)} className="relative flex gap-4 sm:flex-col sm:items-center sm:text-center">
      <span className="z-10 flex h-12 w-12 flex-none items-center justify-center rounded-full border border-teal-200 bg-white text-teal-600 shadow-sm">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="sm:px-1.5">
        <p className="text-sm font-bold text-[#123f38]" style={poppins}>{stage.label}</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">{stage.intro}</p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-bold text-amber-700">
          <Clock className="h-2.5 w-2.5" aria-hidden="true" />
          À venir
        </span>
      </div>
    </motion.li>
  );
};

/* ------------------------------------------------------------------ */
/* FAQ                                                                */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS = [
  {
    q: 'Pourquoi respecter le calendrier vaccinal ?',
    a: 'Le respect des étapes de vaccination permet une protection au bon moment. Un professionnel de santé peut vous indiquer les repères adaptés à votre situation.',
  },
  {
    q: 'Que faire si une dose a été oubliée ?',
    a: 'En cas de dose manquée ou de retard, rapprochez-vous d’un professionnel de santé ou d’une structure de vaccination : un rattrapage est souvent possible.',
  },
  {
    q: 'Où retrouver mon historique vaccinal ?',
    a: 'Votre carnet de vaccination reste le document de référence. Conservez-le et présentez-le lors de vos consultations.',
  },
  {
    q: 'Qui peut me conseiller ?',
    a: 'Un médecin, un(e) infirmier(ère) ou une structure de vaccination sont les interlocuteurs les mieux placés pour vous orienter.',
  },
  {
    q: 'Le calendrier est-il identique pour tout le monde ?',
    a: 'Les recommandations peuvent varier selon l’âge, les antécédents et la situation de chacun. Seul un professionnel de santé peut personnaliser les conseils.',
  },
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white/85 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      >
        <span className="text-sm font-bold text-[#123f38] sm:text-base" style={poppins}>{q}</span>
        <ChevronDown className={`h-5 w-5 flex-none text-teal-600 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <p className="px-5 pb-4 text-sm leading-relaxed text-gray-600">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Newsletter « être informé »                                        */
/* ------------------------------------------------------------------ */

const NotifyCard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'exists' | 'error' | 'invalid'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    const normalized = email.trim().toLowerCase();
    if (!emailRe.test(normalized)) {
      setStatus('invalid');
      return;
    }
    setStatus('loading');
    try {
      const { results } = await queryObjects('NewsletterSubscribers', { where: { email: normalized }, limit: 1 });
      if (results.length > 0) {
        setStatus('exists');
        return;
      }
      await createObject('NewsletterSubscribers', { email: normalized, source: 'Calendrier vaccinal', status: 'Actif' });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div {...fadeUp()} className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-white via-[#eefaf6] to-[#e3f5ee] p-6 shadow-[0_24px_60px_-38px_rgba(18,63,56,0.45)] sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-teal-200/40 blur-[90px]" aria-hidden="true" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-teal-700" style={poppins}>
            <Bell className="h-3.5 w-3.5" aria-hidden="true" />
            Restez informé
          </span>
          <h3 className="mt-4 text-xl font-extrabold text-[#123f38] sm:text-2xl" style={poppins}>
            Soyez informé de la publication du calendrier
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Recevez un message dès que le calendrier vaccinal validé est mis en ligne par l’ASFO.
          </p>
        </div>
        <form onSubmit={submit} noValidate className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="notify-email" className="sr-only">Adresse email</label>
            <input
              id="notify-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status !== 'loading') setStatus('idle'); }}
              placeholder="Votre email"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              aria-invalid={status === 'invalid'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex flex-none items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_35px_-16px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 disabled:cursor-not-allowed disabled:opacity-70"
              style={poppins}
            >
              {status === 'loading' ? (<><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />…</>) : (<><Send className="h-4 w-4" aria-hidden="true" />M’avertir</>)}
            </button>
          </div>
          <div aria-live="polite" className="min-h-[1.25rem] text-xs">
            {status === 'success' && <p className="font-semibold text-teal-700">Merci ! Votre inscription est confirmée.</p>}
            {status === 'exists' && <p className="font-semibold text-teal-700">Cette adresse est déjà inscrite.</p>}
            {status === 'invalid' && <p className="font-semibold text-red-600">Veuillez saisir un email valide.</p>}
            {status === 'error' && <p className="font-semibold text-red-600">Inscription impossible pour le moment. Réessayez plus tard.</p>}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const NAV_STEPS = VACCINE_CATEGORIES.map((c) => ({ slug: c.slug, label: c.title }));

const VaccinationPage: React.FC = () => {
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = 'Calendrier vaccinal | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.getElementById('site-header');
    const offset = (header?.offsetHeight ?? 0) + 16;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      <div className="pointer-events-none absolute -left-32 top-44 h-72 w-72 rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-[64rem] h-80 w-80 rounded-full bg-teal-100/30 blur-[130px]" aria-hidden="true" />

      {/* ------------------------- HERO ------------------------- */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-teal-700 backdrop-blur-sm" style={poppins}>
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Santé &amp; Prévention
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] text-[#123f38] sm:text-5xl" style={poppins}>
              Le calendrier vaccinal,{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">étape par étape</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Retrouvez les repères essentiels de la vaccination, de la naissance à l’âge adulte,
              dans une présentation claire et accessible.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollTo('categories')}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
                Explorer le calendrier
              </button>
              <Link
                to="/sante/fiches"
                className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60"
                style={poppins}
              >
                Voir les fiches santé
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          {/* Composition — motif seringue + cartes d'âge (icônes, sobre) */}
          <motion.div className="relative" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}>
            <div className="relative mx-auto max-w-md">
              <div className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-[#f2fbf8] to-white p-8 shadow-[0_30px_65px_-35px_rgba(18,63,56,0.5)]">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2fb391] to-[#137a61] text-white shadow-lg">
                  <Syringe className="h-12 w-12" aria-hidden="true" />
                </div>
                <p className="mt-5 text-center text-sm font-semibold text-[#123f38]" style={poppins}>
                  De la naissance à l’âge adulte
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { icon: Baby, label: 'Naissance' },
                    { icon: Activity, label: 'Enfance' },
                    { icon: Users, label: 'Adolescence' },
                    { icon: UserPlus, label: 'Adulte' },
                  ].map((c, i) => (
                    <motion.div
                      key={c.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                      className="flex items-center gap-2 rounded-xl border border-teal-100 bg-white px-3 py-2.5 shadow-sm"
                    >
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                        <c.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-bold text-[#123f38]" style={poppins}>{c.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------- AVERTISSEMENT MÉDICAL --------------- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="rounded-2xl border border-teal-100 bg-[#f2fbf8] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#123f38] sm:text-2xl" style={poppins}>
                Un repère informatif, pas une prescription
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                Le calendrier vaccinal peut évoluer selon les recommandations officielles. Pour
                connaître les vaccins adaptés à votre situation, consultez un professionnel de santé
                ou une structure de vaccination.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --------------- NAVIGATION PAR ÂGE --------------- */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap" role="list" aria-label="Navigation par tranche d’âge">
          {NAV_STEPS.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => scrollTo('categories')}
              className="inline-flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              style={poppins}
            >
              <CalendarClock className="h-3.5 w-3.5 text-teal-500" aria-hidden="true" />
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* ------------------------- CATÉGORIES ------------------------- */}
      <section id="categories" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="mb-8 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Syringe className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
              Par tranche d’âge
            </h2>
          </div>
          <p className="mt-3 text-gray-600">Repérez les grandes catégories du calendrier vaccinal.</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VACCINE_CATEGORIES.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
        {PUBLISHED_CATEGORIES.length === 0 && (
          <motion.p {...fadeUp(0.1)} className="mt-6 text-center text-sm text-gray-500">
            Le calendrier détaillé est en cours de vérification et sera publié après validation par
            l’équipe médicale de l’ASFO.
          </motion.p>
        )}
      </section>

      {/* ------------------------- TIMELINE ------------------------- */}
      <section className="relative bg-[#f2fbf8]/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
              Les grandes étapes, de la naissance à l’âge adulte
            </h2>
            <p className="mt-3 text-gray-600">
              Un aperçu des étapes de la vaccination. Le détail de chaque étape sera publié après
              validation médicale.
            </p>
          </motion.div>
          <ol className="relative grid gap-8 sm:grid-cols-3 lg:grid-cols-6">
            <div className="absolute left-6 top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-teal-200 to-teal-100 sm:block sm:left-0 sm:right-0 sm:top-6 sm:h-px sm:w-full sm:bg-gradient-to-r" aria-hidden="true" />
            {VACCINE_STAGES.map((stage, i) => (
              <StageItem key={stage.slug} stage={stage} index={i} />
            ))}
          </ol>
          <p className="mx-auto mt-10 flex max-w-2xl items-start gap-2 rounded-xl border border-teal-100 bg-white/80 p-4 text-sm text-gray-600">
            <Info className="mt-0.5 h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
            Ce calendrier ne remplace pas votre carnet de vaccination ni les recommandations de votre
            professionnel de santé.
          </p>
        </div>
      </section>

      {/* ------------------------- POURQUOI SE VACCINER ------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>Pourquoi se vacciner ?</h2>
          <p className="mt-3 text-gray-600">La vaccination est un geste de prévention individuel et collectif.</p>
        </motion.div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: 'Se protéger', text: 'Réduire son propre risque face à certaines maladies.' },
            { icon: HeartPulse, title: 'Protéger les plus vulnérables', text: 'Contribuer à protéger les personnes fragiles autour de soi.' },
            { icon: Activity, title: 'Prévenir les complications', text: 'Limiter les formes graves de certaines maladies évitables.' },
            { icon: Users, title: 'Limiter la circulation des maladies', text: 'Participer à la protection de toute la communauté.' },
          ].map((c, i) => (
            <motion.div key={c.title} {...fadeUp(i * 0.08)} className="rounded-2xl border border-teal-50 bg-white p-6 text-center shadow-[0_18px_45px_-30px_rgba(18,63,56,0.3)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2fbf8] text-teal-600">
                <c.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-[#123f38]" style={poppins}>{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --------------- AVANT / APRÈS UNE VACCINATION --------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div {...fadeUp()} className="rounded-2xl border border-teal-100 bg-white/85 p-6 backdrop-blur-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><ClipboardList className="h-5 w-5" aria-hidden="true" /></span>
              <h3 className="text-lg font-bold text-[#123f38] sm:text-xl" style={poppins}>Avant une vaccination</h3>
            </div>
            <ul className="mt-5 space-y-3">
              {[
                'Apporter le carnet de vaccination.',
                'Signaler ses antécédents et ses traitements.',
                'Poser ses questions au professionnel de santé.',
                'Respecter les recommandations reçues.',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-teal-400" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="rounded-2xl border border-teal-100 bg-white/85 p-6 backdrop-blur-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><HeartPulse className="h-5 w-5" aria-hidden="true" /></span>
              <h3 className="text-lg font-bold text-[#123f38] sm:text-xl" style={poppins}>Après une vaccination</h3>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-gray-600">
              Suivez les recommandations du professionnel de santé et consultez rapidement en cas de
              réaction inhabituelle ou préoccupante.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-500" aria-hidden="true" />
              <p className="text-sm text-amber-800">
                En cas de doute, un professionnel de santé reste votre meilleur interlocuteur.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------- CAS PARTICULIERS --------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>Cas particuliers</h2>
          <p className="mt-3 text-gray-600">Certaines situations nécessitent un avis personnalisé.</p>
        </motion.div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Baby, title: 'Femmes enceintes' },
            { icon: Plane, title: 'Voyageurs' },
            { icon: PersonStanding, title: 'Personnes âgées' },
            { icon: HeartPulse, title: 'Maladie chronique' },
          ].map((c, i) => (
            <motion.div key={c.title} {...fadeUp(i * 0.08)} className="flex h-full flex-col rounded-2xl border border-teal-100 bg-white/85 p-6 backdrop-blur-sm shadow-[0_18px_45px_-30px_rgba(18,63,56,0.3)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <c.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#123f38]" style={poppins}>{c.title}</h3>
              <p className="mt-2 flex-grow text-sm leading-relaxed text-gray-600">
                Les recommandations peuvent varier. Demandez conseil à un professionnel de santé.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --------------- SOURCES + FAQ --------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="mb-10 flex flex-col items-start gap-3 rounded-2xl border border-teal-100 bg-[#f2fbf8] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm"><BookOpen className="h-5 w-5" aria-hidden="true" /></span>
            <div>
              <h3 className="text-base font-bold text-[#123f38]" style={poppins}>Sources et références</h3>
              <p className="mt-1 text-sm text-gray-600">
                Le calendrier détaillé sera publié avec ses sources officielles vérifiées et sa date
                de mise à jour.
                {SCHEDULE_UPDATED_AT && (
                  <> Dernière mise à jour : <strong className="text-[#123f38]">{SCHEDULE_UPDATED_AT}</strong>.</>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.05)} className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-center gap-2 text-center">
            <HelpCircle className="h-5 w-5 text-teal-600" aria-hidden="true" />
            <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* --------------- NOTIFICATION --------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <NotifyCard />
      </section>

      {/* --------------- CTA FINAL --------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-white via-[#eefaf6] to-[#e3f5ee] px-6 py-12 text-center shadow-[0_30px_70px_-40px_rgba(18,63,56,0.5)] sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-200/40 blur-[90px]" aria-hidden="true" />
          <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
            La vaccination est un acte de prévention essentiel.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-gray-600">
            Rapprochez-vous d’un professionnel de santé pour vérifier votre situation vaccinale et
            celle de votre famille.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/services/consultations" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
              <Stethoscope className="h-4 w-4" aria-hidden="true" />
              Découvrir nos consultations
            </Link>
            <Link to="/sante/fiches" className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60" style={poppins}>
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Voir les fiches santé
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60" style={poppins}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Contacter l’ASFO
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default VaccinationPage;
