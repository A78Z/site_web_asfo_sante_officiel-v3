import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { Calendar, ArrowRight, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { queryObjects } from '../../lib/parse';

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

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-700 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Link to={`/news/${article.slug}`} className="block">
        <div className="relative h-56 md:h-64 overflow-hidden">
          <img src={getImage(article)} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-bold rounded-full shadow-lg border border-teal-400 transform group-hover:scale-110 transition-transform duration-300">
            {article.category}
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
            <Sparkles size={24} className="text-white/80 animate-pulse" />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center text-teal-600">
                <Calendar size={16} className="mr-2" />
                <span className="font-medium text-sm">{getDate(article)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-6 md:p-8">
        <Link to={`/news/${article.slug}`} className="block">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors duration-300 leading-tight line-clamp-2">
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
          {article.excerpt}
        </p>
        <Link to={`/news/${article.slug}`} className="group/btn inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-all duration-300 transform hover:translate-x-1">
          <span className="mr-2">Lire plus</span>
          <ArrowRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

const NewsPreview: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const [titleRef, titleInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [buttonRef, buttonInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    (async () => {
      try {
        const { results } = await queryObjects<NewsArticle>('News', {
          where: { status: 'Publié' },
          order: '-publishedAt',
          limit: 4,
        });
        setArticles(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featured = articles.find((a) => a.isFeatured) || articles[0];
  const others = featured ? articles.filter((a) => a.objectId !== featured.objectId).slice(0, 3) : [];

  if (!loading && articles.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/5 to-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div
            ref={titleRef}
            className={`flex-1 transition-all duration-1000 transform ${titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6 transform hover:scale-105 transition-transform duration-300">
              <TrendingUp className="text-teal-600 mr-3 animate-pulse" size={20} />
              <span className="text-teal-700 font-semibold">Dernières Nouvelles</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6 leading-tight">
              Actualités
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
              Suivez les dernières nouvelles et événements d'ASFO
            </p>
            <div className="flex items-center mt-8">
              <div className="h-px bg-gradient-to-r from-teal-400 to-transparent w-32" />
              <div className="w-3 h-3 bg-teal-400 rounded-full mx-4 animate-pulse" />
              <div className="h-px bg-gradient-to-r from-transparent to-teal-400 w-32" />
            </div>
          </div>

          <div
            ref={buttonRef}
            className={`hidden lg:block transition-all duration-1000 transform ${buttonInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ animationDelay: '300ms' }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300" />
              <Button
                variant="outline"
                to="/news"
                className="relative bg-white/90 backdrop-blur-sm text-teal-600 border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-300 rounded-xl py-3 px-8 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                icon={<ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />}
              >
                Voir toutes les actualités
              </Button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            <span className="ml-3 text-gray-500">Chargement des actualités...</span>
          </div>
        )}

        {/* Featured article */}
        {!loading && featured && (
          <div className="mb-16">
            <div className="group relative bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-teal-200 transition-all duration-700 hover:shadow-3xl hover:-translate-y-2 hover:border-teal-300">
              <div className="absolute top-6 left-6 z-20">
                <div className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-full shadow-lg border border-red-400 animate-pulse">
                  <Sparkles size={16} className="mr-2" />
                  À LA UNE
                </div>
              </div>

              <Link to={`/news/${featured.slug}`} className="block">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-80 lg:h-96 overflow-hidden">
                    <img src={getImage(featured)} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center text-teal-600">
                          <Calendar size={18} className="mr-3" />
                          <span className="font-semibold text-base">{getDate(featured)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <span className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md">
                        {featured.category}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 group-hover:text-teal-600 transition-colors duration-300 leading-tight">
                      {featured.title}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {featured.excerpt}
                    </p>
                    <div className="inline-flex items-center text-teal-600 font-semibold text-lg hover:text-teal-700 transition-all duration-300 transform group-hover:translate-x-2">
                      <span className="mr-3">Lire l'article complet</span>
                      <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] pointer-events-none" />
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-teal-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        )}

        {/* Other articles */}
        {!loading && others.length > 0 && (
          <>
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                Autres actualités
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {others.map((item, index) => (
                <NewsCard key={item.objectId} article={item} index={index + 1} />
              ))}
            </div>
          </>
        )}

        <div className="mt-12 text-center lg:hidden">
          <div className="relative group inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300" />
            <Button
              variant="outline"
              to="/news"
              className="relative bg-white/90 backdrop-blur-sm text-teal-600 border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-300 rounded-xl py-4 px-8 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
              icon={<ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />}
            >
              Voir toutes les actualités
            </Button>
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="text-gray-800 font-semibold text-lg">Restez informé de nos actions</p>
                <p className="text-gray-600 text-sm">Suivez l'actualité de l'ASFO en temps réel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;
