import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  Share2,
  Facebook,
  Twitter,
  Bookmark,
  Heart,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import Button from '../components/common/Button';
import { createObject, queryObjects } from '../lib/parse';

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
const getDate = (a: NewsArticle) => {
  const d =
    typeof a.publishedAt === 'object' && a.publishedAt !== null
      ? (a.publishedAt as { iso: string }).iso
      : typeof a.publishedAt === 'string'
        ? a.publishedAt
        : a.createdAt;
  return new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const isHtml = (str: string) => /<[a-z][\s\S]*>/i.test(str);

/** Sanitise CMS HTML: strip ALL inline styles, classes, indentation to prevent shifts */
const sanitizeCmsHtml = (raw: string): string => {
  let html = raw;

  // If the content is NOT html, convert plain-text → paragraphs
  if (!isHtml(html)) {
    html = html
      .split(/\n\s*\n/) // double line breaks → paragraph separators
      .map((block) => {
        const lines = block.trim().split('\n').join('<br />');
        return lines ? `<p>${lines}</p>` : '';
      })
      .join('');
  }

  // Strip ALL inline styles (margin-left, text-indent, text-align, etc.)
  html = html.replace(/\s*style="[^"]*"/gi, '');

  // Strip ALL class attributes (ql-indent-1, ql-align-center, etc.)
  html = html.replace(/\s*class="[^"]*"/gi, '');

  // Convert massive non-breaking space chains (used to simulate centering) into paragraph breaks
  html = html.replace(/(?:&nbsp;|\u00A0){4,}/gi, '</p><p>');

  // Unwrap useless <span> wrappers — keep inner content
  html = html.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');

  // Unwrap unnecessary wrapper divs → paragraphs
  html = html.replace(/<div[^>]*>(.*?)<\/div>/gi, '<p>$1</p>');

  // Remove empty paragraphs
  html = html.replace(/<p>(?:&nbsp;|\u00A0|\s)*<\/p>/gi, '');

  // Clean up stray CSS properties that might remain
  html = html.replace(/margin-left:[^;"]*;?/gi, '');
  html = html.replace(/text-indent:[^;"]*;?/gi, '');
  html = html.replace(/padding-left:[^;"]*;?/gi, '');

  // Detect paragraphs containing emojis and force left-align on them
  // Emoji ranges: common emoji Unicode blocks
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1FA00}-\u{1FA9F}]/u;
  html = html.replace(/<p([^>]*)>(.*?)<\/p>/gis, (_match, attrs, inner) => {
    if (emojiRegex.test(inner)) {
      return `<p${attrs} class="notice-line">${inner}</p>`;
    }
    return `<p${attrs}>${inner}</p>`;
  });

  return html;
};

const SingleNewsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { results } = await queryObjects<NewsArticle>('News', {
          where: { status: 'Publié' },
          order: '-createdAt',
          limit: 100,
        });
        setAllArticles(results);
        const found = results.find((a) => a.slug === id);
        setArticle(found || null);
        if (found) {
          document.title = `${found.title} | ASFO`;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        <span className="ml-3 text-gray-500">Chargement de l'article...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Article non trouvé</h1>
          <p className="text-gray-600 mb-8">L'article que vous recherchez n'existe pas ou a été déplacé.</p>
          <Button variant="primary" to="/news">Retour aux actualités</Button>
        </div>
      </div>
    );
  }

  const currentIndex = allArticles.findIndex((a) => a.objectId === article.objectId);
  const prevNews = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextNews = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const contentHtml = sanitizeCmsHtml(article.content);

  const similarArticles = allArticles
    .filter((a) => a.objectId !== article.objectId && a.category === article.category)
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[600px]">
        <div className="absolute inset-0 z-0">
          <img src={getImage(article)} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>
        <div className="container mx-auto px-4 h-full flex items-end pb-16 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="inline-block bg-teal-500 text-white text-sm px-4 py-1.5 rounded-full shadow-md">
                {article.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center text-white/90 text-base gap-6">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Calendar size={18} className="mr-2 text-teal-300" />
                <span className="font-medium">{getDate(article)}</span>
              </div>
              {article.author && (
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <User size={18} className="mr-2 text-teal-300" />
                  <span className="font-medium">{article.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main Article */}
            <article className="lg:col-span-2 min-w-0 space-y-10">

              {/* CMS Content — proper prose rendering */}
              <div
                className="article-content max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* Tags — pill style */}
              {(article.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-8">
                  <Tag size={18} className="text-teal-500 mr-1 mt-1" />
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors cursor-pointer border border-gray-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Sharing */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Share2 size={18} className="mr-2 text-teal-500" />
                  Partager cet article
                </h3>
                <div className="flex gap-3">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-all hover:scale-105 shadow-sm" aria-label="Partager sur Facebook">
                    <Facebook size={18} />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${article.title}`} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-sky-500 flex items-center justify-center text-white hover:bg-sky-600 transition-all hover:scale-105 shadow-sm" aria-label="Partager sur Twitter">
                    <Twitter size={18} />
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Lien copié !'); }} className="w-11 h-11 rounded-full bg-gray-600 flex items-center justify-center text-white hover:bg-gray-700 transition-all hover:scale-105 shadow-sm" aria-label="Copier le lien">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* Navigation between articles */}
              <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  {prevNews && (
                    <Link to={`/news/${prevNews.slug}`} className="group flex items-center text-gray-600 hover:text-teal-600 transition-colors">
                      <ChevronLeft size={20} className="mr-2 text-teal-500 group-hover:-translate-x-1 transition-transform" />
                      <div>
                        <span className="text-xs uppercase tracking-wider text-gray-400 block">Article précédent</span>
                        <span className="font-medium text-sm line-clamp-1">{prevNews.title.substring(0, 40)}...</span>
                      </div>
                    </Link>
                  )}
                </div>
                <div className="flex-1 text-right">
                  {nextNews && (
                    <Link to={`/news/${nextNews.slug}`} className="group inline-flex items-center text-gray-600 hover:text-teal-600 transition-colors">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-gray-400 block">Article suivant</span>
                        <span className="font-medium text-sm line-clamp-1">{nextNews.title.substring(0, 40)}...</span>
                      </div>
                      <ChevronRight size={20} className="ml-2 text-teal-500 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-8 border border-teal-100">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Vous avez aimé cet article ?</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Découvrez comment vous pouvez soutenir nos actions ou rejoindre notre équipe de bénévoles.</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" to="/donate" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700" icon={<Heart size={18} />}>
                    Faire un don
                  </Button>
                  <Button variant="outline" to="/join" className="border-2" icon={<MessageCircle size={18} />}>
                    Devenir bénévole
                  </Button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">

                {/* Similar articles */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center">
                    <Bookmark size={18} className="mr-2 text-teal-500" />
                    Articles similaires
                  </h3>
                  <div className="space-y-4">
                    {similarArticles.map((item) => (
                      <Link key={item.objectId} to={`/news/${item.slug}`} className="block group rounded-lg p-3 transition-colors hover:bg-teal-50/60">
                        <div className="flex items-start gap-3">
                          <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                            <img src={getImage(item)} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-medium text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">{item.title}</h4>
                            <p className="text-xs text-gray-400 mt-1.5 flex items-center">
                              <Calendar size={12} className="mr-1" />
                              {getDate(item)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {similarArticles.length === 0 && (
                      <p className="text-sm text-gray-400">Aucun article similaire</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <Button variant="primary" to="/news" fullWidth className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-sm">
                      Voir toutes les actualités
                    </Button>
                  </div>

                  <NewsletterForm />
                </div>

              </div>
            </aside>

          </div>
        </div>
      </section>
    </div>
  );
};

/* ── Newsletter form ── */
function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle');
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return;
    setStatus('loading');
    try {
      const { results } = await queryObjects('NewsletterSubscribers', {
        where: { email },
        limit: 1,
      });
      if (results.length > 0) { setStatus('exists'); return; }
      await createObject('NewsletterSubscribers', { email, status: 'Actif' });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="mt-10 pt-10 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Restez informé</h3>
      <p className="text-gray-600 mb-4">Recevez nos dernières actualités directement dans votre boîte mail.</p>
      {status === 'success' ? (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700 font-medium">
          Merci ! Vous êtes inscrit à notre newsletter.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }} placeholder="Votre adresse email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
          <button type="submit" disabled={status === 'loading' || !isValidEmail(email)} className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-60">
            {status === 'loading' ? 'Inscription...' : "S'abonner"}
          </button>
          {status === 'exists' && <p className="text-sm text-amber-600">Cet email est déjà inscrit à notre newsletter.</p>}
          {status === 'error' && <p className="text-sm text-red-600">Une erreur est survenue. Réessayez.</p>}
        </form>
      )}
    </div>
  );
}

export default SingleNewsPage;
