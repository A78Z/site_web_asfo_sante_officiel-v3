import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Clock,
  Loader2,
  TrendingUp,
  Sparkles,
  Megaphone,
  Droplet,
  GraduationCap,
  Handshake,
  HeartPulse,
  Newspaper,
  Search,
  Mail,
  Send,
  Images,
  Film,
  FileText,
  Quote,
  Camera,
  Home,
} from 'lucide-react';
import { queryObjects, createObject } from '../../lib/parse';
import { archives } from '@/data/archives';
import { galleryImages } from '@/data/gallery';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

interface NewsArticle {
  objectId: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: { __type: string; name: string; url: string };
  imageUrl?: string;
  category: string;
  isFeatured: boolean;
  publishedAt?: { __type: string; iso: string } | string;
  createdAt: string;
}

const getImage = (a: NewsArticle) => a.coverImage?.url || a.imageUrl || '';
const getDate = (a: NewsArticle) => {
  const d =
    typeof a.publishedAt === 'object' && a.publishedAt !== null
      ? (a.publishedAt as { iso: string }).iso
      : typeof a.publishedAt === 'string'
        ? a.publishedAt
        : a.createdAt;
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};
const readingTime = (a: NewsArticle) =>
  Math.max(2, Math.round(`${a.title} ${a.excerpt}`.split(/\s+/).length / 60));

/* Icône du badge selon la catégorie */
const categoryIcon = (category: string): React.ElementType => {
  const c = (category || '').toLowerCase();
  if (c.includes('campagne')) return Megaphone;
  if (c.includes('don')) return Droplet;
  if (c.includes('formation')) return GraduationCap;
  if (c.includes('partenar')) return Handshake;
  if (c.includes('santé') || c.includes('sante')) return HeartPulse;
  if (c.includes('évén') || c.includes('even')) return Sparkles;
  return Newspaper;
};

/* Le back-office saisit les catégories librement (« À la une », « A LA UNE »…) :
   on normalise pour fusionner les variantes dans les filtres. */
const categoryKey = (category: string) =>
  (category || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const CategoryBadge: React.FC<{ category: string; className?: string }> = ({ category, className = '' }) => {
  const Icon = categoryIcon(category);
  if (!category || !category.trim()) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-md ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {category}
    </span>
  );
};

const StatCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const DURATION = 1500;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION);
      setN(Math.round(easeOutCubic(p) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
};

/* ─── Bloc newsletter (même backend que le footer : NewsletterSubscribers) ─── */
const NewsletterBlock: React.FC = () => {
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
      if (results.length > 0) {
        setStatus('exists');
        return;
      }
      await createObject('NewsletterSubscribers', { email: normalized, status: 'Actif' });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div
      {...fadeUp(0.1)}
      className="relative mx-auto mt-20 max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-[#178066] px-8 py-12 text-center shadow-[0_30px_60px_-20px_rgba(18,63,56,0.5)] sm:px-14"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-20 -left-14 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" aria-hidden="true" />

      <Mail className="relative mx-auto h-10 w-10 text-teal-100" aria-hidden="true" />
      <h3 style={poppins} className="relative mt-4 text-2xl font-extrabold text-white sm:text-3xl">
        Ne manquez aucune actualité
      </h3>
      <p className="relative mx-auto mt-3 max-w-xl text-base leading-relaxed text-teal-50/90">
        Recevez les dernières missions, campagnes médicales et événements directement dans votre
        boîte mail.
      </p>

      {status === 'success' ? (
        <p className="relative mt-7 text-base font-semibold text-white">
          Merci&nbsp;! Votre inscription est confirmée. ✓
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="relative mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="news-nl-email" className="sr-only">
            Adresse email
          </label>
          <input
            id="news-nl-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus('idle');
            }}
            placeholder="Votre adresse email"
            required
            className="w-full flex-1 rounded-xl border border-white/30 bg-white/15 px-5 py-3.5 text-sm text-white placeholder-teal-100/70 backdrop-blur-sm transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white/60"
          />
          <button
            type="submit"
            disabled={status === 'loading' || !isValid(email)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-teal-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {status === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            Je m'abonne
          </button>
        </form>
      )}
      {status === 'exists' && (
        <p className="relative mt-3 text-sm font-medium text-amber-200">Cet email est déjà inscrit.</p>
      )}
      {status === 'error' && (
        <p className="relative mt-3 text-sm font-medium text-red-200">Erreur. Veuillez réessayer.</p>
      )}
    </motion.div>
  );
};

const mediaLinks = [
  { icon: Images, label: 'Photos', to: '/gallery' },
  { icon: Film, label: 'Vidéos', to: '/documentaire' },
  { icon: Newspaper, label: 'Communiqués', to: '/presse' },
  { icon: FileText, label: 'Rapports', to: '/rapport' },
];

const NewsPreview: React.FC = () => {
  const reduce = useReducedMotion();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { results, count } = await queryObjects<NewsArticle>('News', {
          where: { status: 'Publié' },
          order: '-publishedAt',
          limit: 8,
          count: true,
        });
        setArticles(results);
        if (typeof count === 'number') setTotalCount(count);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const byKey = new Map<string, string>();
    articles.forEach((a) => {
      const key = categoryKey(a.category);
      if (key && !byKey.has(key)) byKey.set(key, a.category.trim());
    });
    return [...byKey.values()];
  }, [articles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articles.filter(
      (a) =>
        (categoryFilter === 'all' || categoryKey(a.category) === categoryKey(categoryFilter)) &&
        (!q || `${a.title} ${a.excerpt}`.toLowerCase().includes(q)),
    );
  }, [articles, categoryFilter, search]);

  const featured = filtered.find((a) => a.isFeatured) || filtered[0];
  const others = featured ? filtered.filter((a) => a.objectId !== featured.objectId).slice(0, 3) : [];

  const stats = useMemo(
    () => [
      { icon: Newspaper, value: totalCount ?? articles.length, suffix: '+', label: 'Articles publiés' },
      { icon: HeartPulse, value: archives.length, suffix: '', label: 'Missions documentées' },
      { icon: Camera, value: galleryImages.length, suffix: '+', label: 'Photos archivées' },
      { icon: Home, value: 6, suffix: '', label: 'Villages couverts en 2024' },
    ],
    [totalCount, articles.length],
  );

  if (!loading && articles.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/40 via-[#f6fbf9] to-white py-24 sm:py-32">
      {/* ─── Fond ─── */}
      <div className="pointer-events-none absolute -right-40 top-16 h-[440px] w-[440px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-40 bottom-40 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[6%] top-36 hidden h-28 w-28 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />
      <svg className="pointer-events-none absolute right-[4%] bottom-32 hidden h-32 w-32 text-teal-300/20 lg:block" aria-hidden="true">
        <defs>
          <pattern id="asfo-dots-news" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.7" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#asfo-dots-news)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* ─── En-tête ─── */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp(0)} className="inline-block">
            <motion.span
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/70 bg-white/70 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-[0_10px_25px_-10px_rgba(18,63,56,0.3)] backdrop-blur-md"
            >
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              Dernières nouvelles
            </motion.span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.08)}
            style={poppins}
            className="mt-7 bg-gradient-to-r from-gray-900 via-teal-700 to-[#178066] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl"
          >
            Actualités
          </motion.h2>

          <motion.p
            {...fadeUp(0.16)}
            className="mx-auto mt-6 max-w-[700px] text-lg leading-loose text-gray-600"
          >
            Suivez les dernières nouvelles et événements de l'ASFO — missions, campagnes et vie de
            l'association.
          </motion.p>
        </div>

        {/* ─── Recherche + filtres ─── */}
        <motion.div {...fadeUp(0.2)} className="mx-auto mt-10 max-w-3xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-teal-500" aria-hidden="true" />
            <label htmlFor="news-search" className="sr-only">
              Rechercher une actualité
            </label>
            <input
              id="news-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une actualité..."
              className="w-full rounded-2xl border border-teal-100 bg-white/80 py-3.5 pl-11 pr-5 text-sm text-gray-700 shadow-[0_10px_28px_-14px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all placeholder:text-gray-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
          </div>
          {categories.length > 1 && (
            <div role="tablist" aria-label="Filtrer par catégorie" className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {['all', ...categories].map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={categoryFilter === c}
                  onClick={() => setCategoryFilter(c)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold backdrop-blur-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 ${
                    categoryFilter === c
                      ? 'bg-gradient-to-r from-[#2fb391] to-[#178066] text-white shadow-[0_10px_22px_-8px_rgba(23,128,102,0.6)]'
                      : 'border border-teal-100 bg-white/70 text-gray-600 shadow-sm hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700'
                  }`}
                >
                  {c === 'all' ? 'Toutes' : c}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ─── Chargement ─── */}
        {loading && (
          <div className="flex items-center justify-center py-20" role="status">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" aria-hidden="true" />
            <span className="ml-3 text-gray-500">Chargement des actualités...</span>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="mt-14 text-center text-gray-500">Aucune actualité ne correspond à votre recherche.</p>
        )}

        {/* ─── Article vedette ─── */}
        {!loading && featured && (
          <motion.article {...fadeUp(0.1)} className="mt-14">
            <div className="group relative overflow-hidden rounded-[28px] border border-white/80 bg-white/85 shadow-[0_25px_55px_-18px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_35px_70px_-18px_rgba(18,63,56,0.4)]">
              <div className="grid lg:grid-cols-2">
                {/* Image */}
                <Link
                  to={`/news/${featured.slug}`}
                  className="relative block h-72 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-teal-500 lg:h-full lg:min-h-[400px]"
                  aria-label={`Lire l'article : ${featured.title}`}
                >
                  <img
                    src={getImage(featured)}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/50 via-transparent to-transparent" aria-hidden="true" />
                  <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[#e5533d] px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    À la une
                  </span>
                </Link>

                {/* Contenu */}
                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                  <CategoryBadge category={featured.category} className="w-fit" />
                  <Link to={`/news/${featured.slug}`} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500">
                    <h3
                      style={poppins}
                      className="mt-5 text-2xl font-extrabold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-teal-700 sm:text-3xl"
                    >
                      {featured.title}
                    </h3>
                  </Link>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-teal-500" aria-hidden="true" />
                      {getDate(featured)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-teal-500" aria-hidden="true" />
                      {readingTime(featured)} min de lecture
                    </span>
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-gray-600 line-clamp-4">
                    {featured.excerpt}
                  </p>
                  <Link
                    to={`/news/${featured.slug}`}
                    className="group/btn mt-7 inline-flex w-fit items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-8px_rgba(23,128,102,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-8px_rgba(23,128,102,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98]"
                  >
                    Lire l'article complet
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {/* ─── Autres actualités ─── */}
        {!loading && others.length > 0 && (
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item, i) => (
              <motion.article key={item.objectId} {...fadeUp(i * 0.1)} className="group h-full">
                <Link
                  to={`/news/${item.slug}`}
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-[0_15px_40px_-18px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_55px_-18px_rgba(18,63,56,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={getImage(item)}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-950/45 via-transparent to-transparent" aria-hidden="true" />
                    <CategoryBadge category={item.category} className="absolute left-4 top-4" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-teal-500" aria-hidden="true" />
                        {getDate(item)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-teal-500" aria-hidden="true" />
                        {readingTime(item)} min
                      </span>
                    </div>
                    <h3
                      style={poppins}
                      className="mt-3 text-lg font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-teal-700 line-clamp-2"
                    >
                      {item.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3">
                      {item.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 opacity-80 transition-all duration-300 group-hover:opacity-100">
                      Lire plus
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {/* ─── Bouton toutes les actualités ─── */}
        <motion.div {...fadeUp(0.1)} className="mt-12 flex justify-center">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 rounded-xl border border-teal-300/70 bg-white/80 px-7 py-3.5 text-sm font-semibold text-teal-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98]"
          >
            Voir toutes les actualités
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* ─── Statistiques ─── */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                {...fadeUp(i * 0.08)}
                className="group rounded-2xl border border-white/80 bg-white/80 p-5 text-center shadow-[0_12px_30px_-14px_rgba(18,63,56,0.2)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_-14px_rgba(18,63,56,0.3)]"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 ring-1 ring-teal-100 transition-all duration-300 group-hover:scale-110 group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p
                  style={poppins}
                  className="mt-3 bg-gradient-to-br from-teal-600 to-[#178066] bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl"
                >
                  <StatCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-600 sm:text-sm">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Accès rapide aux médias ─── */}
        <motion.div {...fadeUp(0.1)} className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {mediaLinks.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.span key={m.label} {...fadeUp(0.12 + i * 0.06)}>
                <Link
                  to={m.to}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-teal-100 bg-white/80 px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 transition-all duration-300 group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {m.label}
                </Link>
              </motion.span>
            );
          })}
        </motion.div>

        {/* ─── Citation ─── */}
        <motion.figure
          {...fadeUp(0.1)}
          className="relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-3xl border border-teal-100/80 bg-gradient-to-br from-[#e8f3ef]/70 to-white px-8 py-10 text-center shadow-[0_18px_45px_-20px_rgba(18,63,56,0.25)] sm:px-14"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-200/25 blur-2xl" aria-hidden="true" />
          <Quote className="mx-auto h-11 w-11 -scale-x-100 text-teal-300/70" aria-hidden="true" />
          <blockquote
            style={poppins}
            className="mt-3 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-relaxed"
          >
            «&nbsp;Notre engagement ne se limite pas aux soins. Nous partageons également nos
            actions avec transparence afin d'informer et de sensibiliser nos partenaires ainsi que
            les communautés.&nbsp;»
          </blockquote>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-300" aria-hidden="true" />
        </motion.figure>

        {/* ─── Newsletter ─── */}
        <NewsletterBlock />
      </div>
    </section>
  );
};

export default NewsPreview;
