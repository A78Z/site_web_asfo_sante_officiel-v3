import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  Stethoscope,
  Search,
  X,
  RotateCcw,
  ArrowRight,
  Clock,
  Droplets,
  Salad,
  Bug,
  Hand,
  Leaf,
  Users,
  AlertTriangle,
  Bell,
  Send,
  Loader2,
  Megaphone,
  Phone,
  BookOpen,
} from 'lucide-react';
import {
  PREVENTION_TIPS,
  PUBLISHED_TIPS,
  TIP_CATEGORIES,
  type PreventionTip,
} from '../data/preventionTips';
import { createObject, queryObjects } from '../lib/parse';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ICONS: Record<string, React.ElementType> = {
  droplets: Droplets,
  salad: Salad,
  bug: Bug,
};

/* ------------------------------------------------------------------ */
/* Carte thématique                                                   */
/* ------------------------------------------------------------------ */

const TipCard: React.FC<{ tip: PreventionTip }> = ({ tip }) => {
  const Icon = ICONS[tip.icon] ?? ShieldCheck;
  const published = tip.status === 'publie';
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
            Conseil disponible
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700" style={poppins}>
            <Clock className="h-3 w-3" aria-hidden="true" />
            En préparation
          </span>
        )}
      </div>

      <span className="text-[11px] font-bold uppercase tracking-wide text-teal-600/80" style={poppins}>
        {tip.category}
      </span>
      <h3 className="mt-1 text-lg font-bold text-[#123f38]" style={poppins}>
        {tip.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{tip.description}</p>

      <ul className="mt-4 space-y-1.5">
        {tip.topics.map((t) => (
          <li key={t} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="h-1.5 w-1.5 flex-none rounded-full bg-teal-400" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        {published ? (
          <Link
            to={`/sante/prevention/${tip.slug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_-14px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
            style={poppins}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Consulter les conseils
          </Link>
        ) : (
          <>
            <p className="mb-3 text-xs leading-relaxed text-gray-500">
              Ce contenu sera publié après rédaction et validation par l’équipe médicale de l’ASFO.
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
/* Newsletter « être informé »                                        */
/* ------------------------------------------------------------------ */

const NotifyCard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'exists' | 'error' | 'invalid'
  >('idle');

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
        source: 'Conseils de prévention',
        status: 'Actif',
      });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div
      {...fadeUp()}
      className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-white via-[#eefaf6] to-[#e3f5ee] p-6 shadow-[0_24px_60px_-38px_rgba(18,63,56,0.45)] sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-teal-200/40 blur-[90px]" aria-hidden="true" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-teal-700" style={poppins}>
            <Bell className="h-3.5 w-3.5" aria-hidden="true" />
            Restez informé
          </span>
          <h3 className="mt-4 text-xl font-extrabold text-[#123f38] sm:text-2xl" style={poppins}>
            Soyez informé de la publication des conseils
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Recevez un message dès qu’un nouveau conseil de prévention validé est mis en ligne par
            l’ASFO.
          </p>
        </div>

        <form onSubmit={submit} noValidate className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="notify-email" className="sr-only">
              Adresse email
            </label>
            <input
              id="notify-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'loading') setStatus('idle');
              }}
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
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  …
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  M’avertir
                </>
              )}
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

const PreventionPage: React.FC = () => {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('tous');
  const [sort, setSort] = useState<'alpha' | 'disponibles' | 'a_venir'>('alpha');

  useEffect(() => {
    document.title = 'Conseils de prévention | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.getElementById('site-header');
    const offset = (header?.offsetHeight ?? 0) + 16;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  };

  const filtersActive = query.trim() !== '' || category !== 'tous' || sort !== 'alpha';

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    let list = PREVENTION_TIPS.filter((t) => {
      if (category !== 'tous' && t.category !== category) return false;
      if (sort === 'disponibles' && t.status !== 'publie') return false;
      if (sort === 'a_venir' && t.status === 'publie') return false;
      if (q && !normalize(`${t.title} ${t.description} ${t.category} ${t.topics.join(' ')}`).includes(q))
        return false;
      return true;
    });
    list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
    return list;
  }, [query, category, sort]);

  const resetFilters = () => {
    setQuery('');
    setCategory('tous');
    setSort('alpha');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      <div className="pointer-events-none absolute -left-32 top-44 h-72 w-72 rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-[62rem] h-80 w-80 rounded-full bg-teal-100/30 blur-[130px]" aria-hidden="true" />

      {/* ------------------------- HERO ------------------------- */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-teal-700 backdrop-blur-sm" style={poppins}>
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Santé &amp; Prévention
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] text-[#123f38] sm:text-5xl" style={poppins}>
              Les bons gestes pour protéger durablement{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
                votre santé
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Découvrez des conseils simples et pratiques pour réduire les risques, adopter de
              meilleures habitudes et protéger votre famille au quotidien.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollTo('conseils')}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Explorer les conseils
              </button>
              <Link
                to="/services/awareness"
                className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60"
                style={poppins}
              >
                Voir nos campagnes de sensibilisation
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          {/* Composition — vraie photo + cartes flottantes de thèmes */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="relative mx-auto max-w-md">
              <div className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-[0_30px_65px_-35px_rgba(18,63,56,0.55)]">
                <img
                  src="/Distribution-de-flyers.jpg"
                  alt="Bénévoles de l’ASFO distribuant des supports de sensibilisation à la population"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -left-4 top-8 flex items-center gap-2 rounded-2xl border border-teal-100 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600"><Droplets className="h-4 w-4" aria-hidden="true" /></span>
                <span className="text-xs font-bold text-[#123f38]" style={poppins}>Hygiène</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -right-4 top-24 flex items-center gap-2 rounded-2xl border border-teal-100 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Salad className="h-4 w-4" aria-hidden="true" /></span>
                <span className="text-xs font-bold text-[#123f38]" style={poppins}>Nutrition</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -left-4 bottom-20 flex items-center gap-2 rounded-2xl border border-teal-100 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600"><ShieldCheck className="h-4 w-4" aria-hidden="true" /></span>
                <span className="text-xs font-bold text-[#123f38]" style={poppins}>Protection</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -right-3 bottom-6 flex items-center gap-2 rounded-2xl border border-teal-100 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500"><Users className="h-4 w-4" aria-hidden="true" /></span>
                <span className="text-xs font-bold text-[#123f38]" style={poppins}>Prévention communautaire</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------- INTRO PÉDAGOGIQUE + AVERTISSEMENT --------------- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="rounded-2xl border border-teal-100 bg-[#f2fbf8] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
              <Stethoscope className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#123f38] sm:text-2xl" style={poppins}>
                La prévention commence par des gestes simples
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                De nombreuses maladies peuvent être évitées ou mieux maîtrisées grâce à
                l’information, à l’hygiène, à une alimentation adaptée et à une consultation
                précoce.
              </p>
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-500" aria-hidden="true" />
                <p className="text-sm text-amber-800">
                  Ces conseils ont une vocation informative. Ils ne remplacent jamais l’avis d’un
                  professionnel de santé.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ------------------------- CONSEILS ------------------------- */}
      <section id="conseils" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="mb-8 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
              Nos thématiques de prévention
            </h2>
          </div>
          <p className="mt-3 text-gray-600">
            Recherchez une thématique et repérez les conseils disponibles ou en préparation.
          </p>
        </motion.div>

        {/* Recherche */}
        <motion.div {...fadeUp(0.05)} className="mb-5">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <label htmlFor="tip-search" className="sr-only">
              Rechercher un conseil ou une thématique
            </label>
            <input
              id="tip-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un conseil ou une thématique..."
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Effacer la recherche">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Catégories + tri */}
        <motion.div {...fadeUp(0.08)} className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:min-w-0 lg:flex-1 lg:flex-wrap lg:overflow-visible lg:px-0">
            {['tous', ...TIP_CATEGORIES].map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={active}
                  className={`inline-flex flex-none items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active ? 'bg-teal-600 text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-700'
                  }`}
                  style={poppins}
                >
                  {c === 'tous' ? 'Tous' : c}
                </button>
              );
            })}
          </div>
          <div className="flex flex-none items-center gap-2 lg:pt-1">
            <label htmlFor="tip-sort" className="sr-only">
              Trier les conseils
            </label>
            <select
              id="tip-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-full border border-gray-200 bg-white py-2 px-4 text-sm text-gray-700 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            >
              <option value="alpha">Ordre alphabétique</option>
              <option value="disponibles">Conseils disponibles</option>
              <option value="a_venir">Contenus à venir</option>
            </select>
            {filtersActive && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                style={poppins}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Réinitialiser
              </button>
            )}
          </div>
        </motion.div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-teal-200 bg-white/70 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-500">
              <Search className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="text-lg font-bold text-[#123f38]" style={poppins}>
              {sort === 'disponibles'
                ? 'Aucun conseil publié pour le moment'
                : 'Aucune thématique ne correspond à votre recherche'}
            </p>
            <p className="mt-2 text-gray-500">
              {sort === 'disponibles'
                ? 'Les conseils sont en cours de rédaction et de validation médicale.'
                : 'Modifiez votre recherche ou explorez une autre catégorie.'}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-2.5 text-sm font-bold text-white"
              style={poppins}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <TipCard key={t.slug} tip={t} />
            ))}
          </div>
        )}

        {PUBLISHED_TIPS.length === 0 && filtered.length > 0 && (
          <motion.p {...fadeUp(0.1)} className="mt-6 text-center text-sm text-gray-500">
            Les conseils sont en cours de rédaction et seront publiés après validation par l’équipe
            médicale de l’ASFO.
          </motion.p>
        )}
      </section>

      {/* --------------------- LES RÉFLEXES ESSENTIELS --------------------- */}
      <section className="relative bg-[#f2fbf8]/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
              Les réflexes essentiels
            </h2>
            <p className="mt-3 text-gray-600">
              Des principes simples et généraux pour prendre soin de sa santé au quotidien.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: 'Se protéger', text: 'Adopter les gestes de protection adaptés à son environnement.' },
              { icon: Hand, title: 'Maintenir une bonne hygiène', text: 'Des gestes d’hygiène réguliers pour limiter les risques.' },
              { icon: Salad, title: 'Adopter une alimentation équilibrée', text: 'Bien se nourrir avec les ressources disponibles localement.' },
              { icon: Stethoscope, title: 'Consulter sans attendre', text: 'Demander un avis médical dès que cela est nécessaire.' },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                {...fadeUp(i * 0.08)}
                className="rounded-2xl border border-teal-50 bg-white p-6 text-center shadow-[0_18px_45px_-30px_rgba(18,63,56,0.3)]"
              >
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

      {/* --------------------- PRÉVENTION AU QUOTIDIEN --------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div {...fadeUp()} className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-[0_30px_65px_-35px_rgba(18,63,56,0.5)]">
            <img
              src="/Nutrition-hygiene-alimentaire.webp"
              alt="Séance de sensibilisation de l’ASFO sur la nutrition et l’hygiène alimentaire"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <div className="h-1 w-14 rounded-full bg-gradient-to-r from-[#2fb391] to-[#137a61]" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
              Adopter de bonnes habitudes, chaque jour
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                { icon: Leaf, text: 'Protéger son environnement.' },
                { icon: Users, text: 'Partager les bons gestes avec sa famille.' },
                { icon: Megaphone, text: 'Participer aux actions de sensibilisation.' },
                { icon: Stethoscope, text: 'Consulter un professionnel de santé lorsque nécessaire.' },
              ].map((p, i) => (
                <motion.li key={p.text} {...fadeUp(0.1 + i * 0.06)} className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <p.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="pt-2 text-sm font-medium text-gray-700 sm:text-base">{p.text}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* --------------------- NOTIFICATION --------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <NotifyCard />
      </section>

      {/* --------------------- CTA FINAL --------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp()}
          className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-white via-[#eefaf6] to-[#e3f5ee] px-6 py-12 text-center shadow-[0_30px_70px_-40px_rgba(18,63,56,0.5)] sm:px-12"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-200/40 blur-[90px]" aria-hidden="true" />
          <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold text-[#123f38] sm:text-3xl" style={poppins}>
            Prévenir aujourd’hui, c’est protéger durablement les communautés.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-gray-600">
            Découvrez les campagnes de sensibilisation de l’ASFO et partagez les bons gestes autour
            de vous.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/services/awareness"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(23,128,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
              style={poppins}
            >
              <Megaphone className="h-4 w-4" aria-hidden="true" />
              Voir les campagnes
            </Link>
            <Link
              to="/sante/fiches"
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60"
              style={poppins}
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Découvrir les fiches santé
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60"
              style={poppins}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Contacter l’ASFO
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default PreventionPage;
