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

  const contentHtml = isHtml(article.content)
    ? article.content
    : article.content
        .split('\n')
        .map((p) => `<p>${p}</p>`)
        .join('');

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
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-2/3">
              <article
                className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-teal-600 prose-a:no-underline hover:prose-a:text-teal-700 prose-img:rounded-xl prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* Tags */}
              <div className="mt-10 flex flex-wrap gap-2 border-t border-gray-100 pt-8">
                <Tag size={20} className="text-teal-500 mr-2" />
                {(article.tags || []).map((tag, index) => (
                  <span key={index} className="inline-block bg-gray-100 text-gray-800 text-sm px-4 py-2 rounded-full hover:bg-teal-50 hover:text-teal-700 transition-all duration-300 cursor-pointer border border-gray-200">
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* Social Sharing */}
              <div className="mt-10 bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Share2 size={20} className="mr-2 text-teal-500" />
                  Partager cet article
                </h3>
                <div className="flex space-x-3">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors transform hover:scale-110 shadow-md" aria-label="Partager sur Facebook">
                    <Facebook size={20} />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${article.title}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors transform hover:scale-110 shadow-md" aria-label="Partager sur Twitter">
                    <Twitter size={20} />
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Lien copié !'); }} className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white hover:bg-gray-700 transition-colors transform hover:scale-110 shadow-md" aria-label="Copier le lien">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
              
              {/* Navigation between articles */}
              <div className="mt-10 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between">
                <div className="mb-4 sm:mb-0 group">
                  {prevNews && (
                    <Link to={`/news/${prevNews.slug}`} className="flex items-center text-gray-700 hover:text-teal-600 transition-all duration-300">
                      <ChevronLeft size={20} className="mr-2 text-teal-500" />
                      <div>
                        <span className="text-sm text-gray-500 block">Article précédent</span>
                        <span className="font-medium line-clamp-1">{prevNews.title.substring(0, 30)}...</span>
                      </div>
                    </Link>
                  )}
                </div>
                <div className="group">
                  {nextNews && (
                    <Link to={`/news/${nextNews.slug}`} className="flex items-center text-gray-700 hover:text-teal-600 transition-all duration-300">
                      <div className="text-right">
                        <span className="text-sm text-gray-500 block">Article suivant</span>
                        <span className="font-medium line-clamp-1">{nextNews.title.substring(0, 30)}...</span>
                      </div>
                      <ChevronRight size={20} className="ml-2 text-teal-500" />
                    </Link>
                  )}
                </div>
              </div>
              
              {/* CTA */}
              <div className="mt-12 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-8 border border-teal-100 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Vous avez aimé cet article ?</h3>
                <p className="text-gray-700 mb-6">Découvrez comment vous pouvez soutenir nos actions ou rejoindre notre équipe de bénévoles.</p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" to="/donate" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700" icon={<Heart size={18} />}>
                    Faire un don
                  </Button>
                  <Button variant="outline" to="/join" className="border-2" icon={<MessageCircle size={18} />}>
                    Devenir bénévole
                  </Button>
                </div>
              </div>
            </div>
            
            <aside className="lg:w-1/3">
              <div className="bg-white rounded-xl p-6 sticky top-24 shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Bookmark size={20} className="mr-2 text-teal-500" />
                  Articles similaires
                </h3>
                <div className="space-y-6">
                  {similarArticles.map((item) => (
                    <Link key={item.objectId} to={`/news/${item.slug}`} className="block group bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:bg-teal-50 hover:shadow-md">
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
                          <img src={getImage(item)} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          </div>
                          <div>
                          <h4 className="text-base font-medium text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2">{item.title}</h4>
                            <p className="text-sm text-gray-500 mt-2 flex items-center">
                              <Calendar size={14} className="mr-1 text-teal-500" />
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
                
                <div className="mt-10">
                  <Button variant="primary" to="/news" fullWidth className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300">
                    Voir toutes les actualités
                  </Button>
                </div>
                
                <NewsletterForm />
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
