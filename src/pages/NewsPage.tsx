import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Search,
  CalendarDays,
  ArrowRight,
  Newspaper,
  LayoutGrid,
  List,
  RotateCcw,
  Share2,
  Facebook,
  Linkedin,
  Link2,
  Check,
  Clock,
  User,
  Mail,
  Heart,
  MapPin,
  Users,
  Flame,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { queryObjects, createObject } from '../lib/parse';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

/* ------------------------------------------------------------------ */
/* Types & source de données (Parse News — inchangée)                   */
/* ------------------------------------------------------------------ */

interface NewsArticle {
  objectId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: { __type: 'File'; name: string; url: string };
  imageUrl?: string;
  tags: string[];
  category: string;
  author: string;
  isFeatured: boolean;
  status: string;
  publishedAt?: { __type: 'Date'; iso: string } | string;
  createdAt: string;
}

const getImage = (a: NewsArticle) => a.coverImage?.url || a.imageUrl || '';
const getRawDate = (a: NewsArticle): Date => {
  const d = typeof a.publishedAt === 'object' && a.publishedAt !== null
    ? (a.publishedAt as { iso: string }).iso
    : typeof a.publishedAt === 'string' ? a.publishedAt : a.createdAt;
  return new Date(d);
};
const getDate = (a: NewsArticle) => getRawDate(a).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const getYear = (a: NewsArticle) => String(getRawDate(a).getFullYear());
const readingTime = (a: NewsArticle) => {
  const words = `${a.content ?? ''} ${a.excerpt ?? ''}`.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/* Badge de catégorie — teal par défaut, variations très discrètes. */
const categoryStyle = (cat: string) => {
  const c = normalize(cat);
  if (c.includes('la une')) return 'bg-[#e5533d] text-white';
  if (c.includes('felicit')) return 'bg-amber-100 text-amber-800';
  if (c.includes('evenement') || c.includes('koumtari')) return 'bg-sky-100 text-sky-800';
  if (c.includes('president') || c.includes('vie assoc')) return 'bg-teal-100 text-teal-800';
  return 'bg-teal-600 text-white';
};

const PAGE_SIZE = 9;

/* ------------------------------------------------------------------ */
/* Partage                                                              */
/* ------------------------------------------------------------------ */

const ShareRow: React.FC<{ slug: string; title: string }> = ({ slug, title }) => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/news/${slug}` : `/news/${slug}`;
  const links = [
    { label: 'WhatsApp', icon: Share2, href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { label: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];
  const copy = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* noop */ } };
  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.preventDefault()}>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`Partager sur ${l.label}`} onClick={(e) => e.stopPropagation()} className="flex h-8 w-8 items-center justify-center rounded-full border border-teal-100 bg-white text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
          <l.icon className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      ))}
      <button type="button" onClick={(e) => { e.stopPropagation(); copy(); }} aria-label="Copier le lien" className="flex h-8 w-8 items-center justify-center rounded-full border border-teal-100 bg-white text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> : <Link2 className="h-3.5 w-3.5" aria-hidden="true" />}
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Carte article                                                        */
/* ------------------------------------------------------------------ */

const ArticleCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
  <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, ease: 'easeOut' }} className="group flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)]">
    <Link to={`/news/${article.slug}`} className="relative block h-52 overflow-hidden">
      {getImage(article) ? (
        <img src={getImage(article)} alt={article.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-[#e8f6f1]"><Newspaper className="h-10 w-10 text-teal-300" aria-hidden="true" /></div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/70 via-transparent to-transparent" aria-hidden="true" />
      {article.category && <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm ${categoryStyle(article.category)}`} style={poppins}>{article.category}</span>}
    </Link>
    <div className="flex flex-1 flex-col p-5">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-gray-500">
        <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3 text-teal-600" aria-hidden="true" />{getDate(article)}</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3 text-teal-600" aria-hidden="true" />{readingTime(article)} min</span>
        {article.author && <span className="inline-flex items-center gap-1"><User className="h-3 w-3 text-teal-600" aria-hidden="true" />{article.author}</span>}
      </p>
      <Link to={`/news/${article.slug}`}>
        <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-teal-700" style={poppins}>{article.title}</h3>
      </Link>
      <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-gray-600">{article.excerpt}</p>
      <div className="mt-4 flex items-center justify-between border-t border-teal-50 pt-3.5">
        <Link to={`/news/${article.slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 transition-colors hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}>Lire plus<ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" /></Link>
        <ShareRow slug={article.slug} title={article.title} />
      </div>
    </div>
  </motion.article>
);

/* Ligne article (vue liste) */
const ArticleRow: React.FC<{ article: NewsArticle }> = ({ article }) => (
  <motion.article {...fadeUp(0)} className="group flex gap-4 rounded-2xl border border-white/80 bg-white/85 p-3.5 shadow-[0_12px_35px_-22px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:gap-5 sm:p-4">
    <Link to={`/news/${article.slug}`} className="relative h-24 w-28 flex-none overflow-hidden rounded-xl sm:h-28 sm:w-40">
      {getImage(article) ? <img src={getImage(article)} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-teal-50"><Newspaper className="h-6 w-6 text-teal-300" aria-hidden="true" /></div>}
    </Link>
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-2">
        {article.category && <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryStyle(article.category)}`} style={poppins}>{article.category}</span>}
        <span className="text-[11px] font-semibold text-gray-500">{getDate(article)}</span>
      </div>
      <Link to={`/news/${article.slug}`}><h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-teal-700 sm:text-base" style={poppins}>{article.title}</h3></Link>
      <p className="mt-1 line-clamp-2 flex-1 text-[12.5px] leading-relaxed text-gray-600">{article.excerpt}</p>
      <Link to={`/news/${article.slug}`} className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-teal-700 transition-colors hover:text-teal-500" style={poppins}>Lire plus<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
    </div>
  </motion.article>
);

const CardSkeleton: React.FC = () => (
  <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/85">
    <div className="h-52 animate-pulse bg-teal-50" />
    <div className="space-y-3 p-5">
      <div className="h-3 w-1/3 animate-pulse rounded bg-teal-50" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-teal-100" />
      <div className="h-3 w-full animate-pulse rounded bg-teal-50" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-teal-50" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Newsletter (backend Parse existant)                                  */
/* ------------------------------------------------------------------ */

const NewsletterCard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle');
  const isValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const norm = email.trim().toLowerCase();
    if (!isValid(norm)) return;
    setStatus('loading');
    try {
      const { results } = await queryObjects('NewsletterSubscribers', { where: { email: norm }, limit: 1 });
      if (results.length > 0) { setStatus('exists'); return; }
      await createObject('NewsletterSubscribers', { email: norm, status: 'Actif' });
      setStatus('success'); setEmail('');
    } catch { setStatus('error'); }
  };
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-[#0e4a3d] via-[#136353] to-[#178066] p-8 shadow-[0_30px_70px_-35px_rgba(18,63,56,0.5)] sm:p-12">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-300/15 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10"><Mail className="h-5 w-5 text-teal-100" aria-hidden="true" /></span>
        <h2 className="mt-5 text-2xl font-extrabold text-white sm:text-3xl" style={poppins}>Ne manquez aucune actualité de l'ASFO</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-teal-50/85 sm:text-base">Recevez les nouvelles de nos missions, événements et campagnes directement dans votre boîte mail.</p>
        {status === 'success' ? (
          <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm font-semibold text-white" role="status"><CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />Merci ! Votre inscription est confirmée.</p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="news-newsletter" className="sr-only">Votre adresse email</label>
            <input id="news-newsletter" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }} placeholder="vous@exemple.com" required className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-teal-50/50 backdrop-blur-sm outline-none transition-colors focus:border-teal-300 focus:ring-2 focus:ring-teal-300/40" />
            <button type="submit" disabled={status === 'loading' || !isValid(email)} className="inline-flex flex-none items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0b3a30] shadow-lg transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 disabled:cursor-not-allowed disabled:opacity-60" style={poppins}>
              {status === 'loading' ? 'Inscription…' : <><Send className="h-4 w-4" aria-hidden="true" />Je m'abonne</>}
            </button>
          </form>
        )}
        {status === 'exists' && <p className="mt-3 text-sm text-amber-200" role="status">Cet email est déjà inscrit.</p>}
        {status === 'error' && <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-red-200" role="alert"><AlertCircle className="h-4 w-4" aria-hidden="true" />Une erreur est survenue. Réessayez.</p>}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

type Sort = 'recent' | 'ancien' | 'alpha';
type View = 'grille' | 'liste';

const NewsPage: React.FC = () => {
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState(params.get('cat') ?? '');
  const [year, setYear] = useState(params.get('an') ?? '');
  const [sort, setSort] = useState<Sort>('recent');
  const [view, setView] = useState<View>(() => (typeof localStorage !== 'undefined' && localStorage.getItem('asfo-news-view') === 'liste' ? 'liste' : 'grille'));
  const [visible, setVisible] = useState(PAGE_SIZE);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = 'Actualités | ASFO - Action Sanitaire pour le Fouta'; }, []);
  useEffect(() => { localStorage.setItem('asfo-news-view', view); }, [view]);

  useEffect(() => {
    (async () => {
      try {
        const { results } = await queryObjects<NewsArticle>('News', { where: { status: 'Publié' }, order: '-createdAt', limit: 100 });
        setArticles(results);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(params);
    if (category) p.set('cat', category); else p.delete('cat');
    if (year) p.set('an', year); else p.delete('an');
    if (query) p.set('q', query); else p.delete('q');
    setParams(p, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, year, query]);

  const categories = useMemo(() => [...new Set(articles.map((a) => a.category).filter(Boolean))].sort(), [articles]);
  const years = useMemo(() => [...new Set(articles.map(getYear))].sort((a, b) => parseInt(b) - parseInt(a)), [articles]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    let list = articles.filter((a) => {
      if (category && a.category !== category) return false;
      if (year && getYear(a) !== year) return false;
      if (q && !normalize(`${a.title} ${a.excerpt} ${(a.tags || []).join(' ')}`).includes(q)) return false;
      return true;
    });
    if (sort === 'ancien') list = [...list].sort((a, b) => getRawDate(a).getTime() - getRawDate(b).getTime());
    else if (sort === 'alpha') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else list = [...list].sort((a, b) => getRawDate(b).getTime() - getRawDate(a).getTime());
    return list;
  }, [articles, query, category, year, sort]);

  useEffect(() => { setVisible(PAGE_SIZE); }, [query, category, year, sort]);

  const filtersActive = query.trim() !== '' || category !== '' || year !== '';
  const featured = filtered.find((a) => a.isFeatured) ?? filtered[0];
  const rest = featured ? filtered.filter((a) => a.objectId !== featured.objectId) : filtered;
  const dontMiss = rest.slice(0, 3);

  const reset = () => { setQuery(''); setCategory(''); setYear(''); setSort('recent'); };
  const selectCategory = (cat: string) => { setCategory((c) => (c === cat ? '' : cat)); gridRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); };
  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  const selectCls = 'rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50';
  const heroImages = articles.slice(0, 3).map(getImage).filter(Boolean);

  return (
    <div className="bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-44 top-64 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[44%] top-8 hidden h-28 w-28 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8">
          <div>
            <motion.span {...fadeUp(0)} className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
              Restez informé de nos actions
            </motion.span>
            <motion.h1 {...fadeUp(0.08)} className="mt-6 text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl xl:text-6xl" style={poppins}>
              L'actualité de{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">l'ASFO</span>
            </motion.h1>
            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8">
              Missions médicales, événements, communiqués et réalisations : suivez les dernières
              nouvelles de l'ASFO au Sénégal.
            </motion.p>
            <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <button type="button" onClick={scrollToGrid} className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Découvrir les dernières nouvelles
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link to="/archives" className="inline-flex items-center justify-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Voir nos missions
              </Link>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.15)} className="relative">
            <div className="grid grid-cols-3 grid-rows-3 gap-3.5">
              <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl border border-white/80 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.45)]">
                <img src={heroImages[0] || '/asfo-news-barre.jpg'} alt="Actualité de l'ASFO" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="row-span-2 overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img src={heroImages[1] || '/medicalteam.webp'} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img src={heroImages[2] || '/9.webp'} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            </div>
            {!loading && articles.length > 0 && (
              <motion.div animate={reduce ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-6 -left-4 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-[0_20px_50px_-20px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:-left-8">
                <div className="flex items-center gap-4">
                  <div><p className="text-lg font-extrabold text-teal-700" style={poppins}>{articles.length}</p><p className="text-[11px] font-semibold text-gray-500">articles</p></div>
                  <div className="h-9 w-px bg-teal-100" aria-hidden="true" />
                  <div><p className="text-lg font-extrabold text-teal-700" style={poppins}>{categories.length}</p><p className="text-[11px] font-semibold text-gray-500">catégories</p></div>
                  <div className="h-9 w-px bg-teal-100" aria-hidden="true" />
                  <div><p className="text-lg font-extrabold text-teal-700" style={poppins}>{years[0] ?? '—'}</p><p className="text-[11px] font-semibold text-gray-500">plus récent</p></div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ INTRODUCTION ════════════════ */}
      <section className="relative overflow-hidden pb-8 pt-8 text-center sm:pt-12">
        <div className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.span {...fadeUp(0)} className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            Nos dernières nouvelles
          </motion.span>
          <motion.h2 {...fadeUp(0.08)} className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
            Découvrez nos{' '}
            <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">actualités</span>
          </motion.h2>
          <motion.div {...fadeUp(0.14)} className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
          <motion.p {...fadeUp(0.18)} className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Suivez les dernières nouvelles et activités de l'ASFO au Sénégal, mission après mission.
          </motion.p>
        </div>
      </section>

      {/* ════════════════ ARTICLE À LA UNE ════════════════ */}
      {!loading && featured && !filtersActive && (
        <section className="relative pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.article {...fadeUp(0)} className="group grid overflow-hidden rounded-[2rem] border-2 border-teal-200/60 bg-white/85 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.4)] backdrop-blur-sm lg:grid-cols-2">
              <Link to={`/news/${featured.slug}`} className="relative h-64 overflow-hidden lg:h-auto">
                {getImage(featured) ? <img src={getImage(featured)} alt={featured.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="flex h-full w-full items-center justify-center bg-teal-50"><Newspaper className="h-12 w-12 text-teal-300" aria-hidden="true" /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/50 to-transparent" aria-hidden="true" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#e5533d] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md" style={poppins}><Flame className="h-3.5 w-3.5" aria-hidden="true" />À la une</span>
              </Link>
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
                  {featured.category && <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${categoryStyle(featured.category)}`} style={poppins}>{featured.category}</span>}
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />{getDate(featured)}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />{readingTime(featured)} min de lecture</span>
                </div>
                <h3 className="mt-4 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl" style={poppins}>{featured.title}</h3>
                <p className="mt-4 line-clamp-3 text-[15px] leading-7 text-gray-600 sm:text-base sm:leading-8">{featured.excerpt}</p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link to={`/news/${featured.slug}`} className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>Lire l'article complet<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                  <ShareRow slug={featured.slug} title={featured.title} />
                </div>
              </div>
            </motion.article>
          </div>
        </section>
      )}

      {/* ════════════════ À NE PAS MANQUER ════════════════ */}
      {!loading && !filtersActive && dontMiss.length >= 3 && (
        <section className="relative pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2 {...fadeUp(0)} className="mb-6 flex items-center gap-2.5 text-xl font-bold text-gray-900 sm:text-2xl" style={poppins}><Flame className="h-5 w-5 text-[#e5533d]" aria-hidden="true" />À ne pas manquer</motion.h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dontMiss.map((a) => <ArticleCard key={a.objectId} article={a} />)}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ PANNEAU + GRILLE ════════════════ */}
      <section ref={gridRef} className="relative scroll-mt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Contrôles */}
          <motion.div {...fadeUp(0)} className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_12px_35px_-20px_rgba(18,63,56,0.3)] backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600" aria-hidden="true" />
              <label htmlFor="news-search" className="sr-only">Rechercher une actualité</label>
              <input id="news-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une actualité…" className="w-full rounded-full border border-teal-100 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="news-cat" className="sr-only">Catégorie</label>
              <select id="news-cat" value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
                <option value="">Toutes les catégories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <label htmlFor="news-year" className="sr-only">Année</label>
              <select id="news-year" value={year} onChange={(e) => setYear(e.target.value)} className={selectCls}>
                <option value="">Toutes les années</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <label htmlFor="news-sort" className="sr-only">Trier</label>
              <select id="news-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectCls}>
                <option value="recent">Plus récentes</option>
                <option value="ancien">Plus anciennes</option>
                <option value="alpha">Ordre alphabétique</option>
              </select>
              <div className="flex items-center gap-1 rounded-full border border-teal-100 bg-white p-1 shadow-sm" role="group" aria-label="Mode d'affichage">
                {([['grille', LayoutGrid, 'Vue grille'], ['liste', List, 'Vue liste']] as [View, React.ElementType, string][]).map(([key, Icon, lbl]) => (
                  <button key={key} type="button" onClick={() => setView(key)} aria-pressed={view === key} aria-label={lbl} className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${view === key ? 'bg-[#123f38] text-white' : 'text-gray-500 hover:bg-teal-50'}`}><Icon className="h-4 w-4" aria-hidden="true" /></button>
                ))}
              </div>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-sm transition-all duration-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />Réinitialiser</button>
            </div>
          </motion.div>

          {/* Chips catégories */}
          {categories.length > 0 && (
            <motion.div {...fadeUp(0.06)} className="mt-5 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filtrer par catégorie">
              <button type="button" onClick={() => setCategory('')} aria-pressed={category === ''} className={`flex-none rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${category === '' ? 'bg-gradient-to-r from-[#2fb391] to-[#178066] text-white shadow-[0_10px_25px_-12px_rgba(23,128,102,0.7)]' : 'border border-teal-100 bg-white text-gray-600 hover:bg-teal-50'}`} style={poppins}>Toutes</button>
              {categories.map((c) => (
                <button key={c} type="button" onClick={() => selectCategory(c)} aria-pressed={category === c} className={`flex-none rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${category === c ? 'bg-gradient-to-r from-[#2fb391] to-[#178066] text-white shadow-[0_10px_25px_-12px_rgba(23,128,102,0.7)]' : 'border border-teal-100 bg-white text-gray-600 hover:bg-teal-50'}`} style={poppins}>{c}</button>
              ))}
            </motion.div>
          )}

          {!loading && (
            <p className="mt-5 text-sm text-gray-500"><strong className="text-gray-800">{filtered.length}</strong> actualité{filtered.length > 1 ? 's' : ''}{filtersActive && ' trouvée' + (filtered.length > 1 ? 's' : '')}</p>
          )}

          {/* Contenu */}
          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-teal-100 bg-teal-50"><Search className="h-8 w-8 text-teal-400" aria-hidden="true" /></span>
              <h3 className="mt-6 text-2xl font-bold text-gray-900" style={poppins}>Aucune actualité trouvée</h3>
              <p className="mx-auto mt-3 max-w-md text-gray-600">Modifiez votre recherche ou réinitialisez les filtres pour découvrir d'autres publications.</p>
              <button type="button" onClick={reset} className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}><RotateCcw className="h-4 w-4" aria-hidden="true" />Réinitialiser les filtres</button>
            </div>
          ) : view === 'liste' ? (
            <div className="mt-6 space-y-3">
              {(filtersActive ? filtered : rest).slice(0, visible).map((a) => <ArticleRow key={a.objectId} article={a} />)}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(filtersActive ? filtered : rest).slice(0, visible).map((a) => <ArticleCard key={a.objectId} article={a} />)}
            </div>
          )}

          {/* Charger plus */}
          {!loading && (filtersActive ? filtered.length : rest.length) > visible && (
            <div className="mt-10 text-center">
              <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white px-8 py-3.5 text-base font-bold text-teal-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Charger plus d'actualités
                <span className="text-sm font-normal text-gray-400">({(filtersActive ? filtered.length : rest.length) - visible})</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════ NEWSLETTER ════════════════ */}
      <section className="relative pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><motion.div {...fadeUp(0)}><NewsletterCard /></motion.div></div>
      </section>

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/90 to-teal-50/60 p-10 text-center shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl" style={poppins}>
              Suivez l'engagement de l'ASFO sur le{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">terrain</span>.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Découvrez nos missions, rejoignez nos équipes ou soutenez nos prochaines actions.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link to="/archives" className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}><MapPin className="h-5 w-5" aria-hidden="true" />Voir nos missions</Link>
              <Link to="/join" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}><Users className="h-5 w-5 text-teal-600" aria-hidden="true" />Devenir bénévole</Link>
              <Link to="/donate" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}><Heart className="h-5 w-5 text-teal-600" aria-hidden="true" />Faire un don</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
