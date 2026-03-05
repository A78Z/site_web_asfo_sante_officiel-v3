import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/common/SectionTitle';
import { Search, Calendar, ArrowRight, Tag, Filter, ChevronRight, Loader2 } from 'lucide-react';
import { queryObjects } from '../lib/parse';

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
  const d = typeof a.publishedAt === 'object' && a.publishedAt !== null
    ? (a.publishedAt as { iso: string }).iso
    : typeof a.publishedAt === 'string'
      ? a.publishedAt
      : a.createdAt;
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const NewsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Actualités | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const { results } = await queryObjects<NewsArticle>('News', {
          where: { status: 'Publié' },
          order: '-createdAt',
          limit: 100,
        });
        setArticles(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean))).sort();

  const filtered = articles.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filtered.find((a) => a.isFeatured);
  const rest = featured ? filtered.filter((a) => a.objectId !== featured.objectId) : filtered;

  return (
    <div>
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
        <div className="absolute inset-0 z-0">
          <img src="/asfo-news-barre.jpg" alt="ASFO news" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/60" />
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Calendar className="mr-2 text-white/80" size={16} />
              <span>Restez informé de nos actions</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">Actualités</h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Restez informé des dernières activités, événements et réalisations d'ASFO au Sénégal.
            </p>
          </div>
        </div>
      </div>

      {/* News Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6">
              <Calendar className="text-teal-600 mr-3 animate-pulse" size={20} />
              <span className="text-teal-700 font-semibold">Nos Dernières Actualités</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6 leading-tight">
              Découvrez nos actualités
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Suivez les dernières nouvelles et activités d'ASFO au Sénégal
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-grow group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300" />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500" size={20} />
              <input
                type="text"
                placeholder="Rechercher dans les actualités..."
                className="relative w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-64 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300" />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500"><Filter size={20} /></div>
              <select
                className="relative w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-300 appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
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
                    À LA UNE
                  </div>
                </div>
                <Link to={`/news/${featured.slug}`} className="block">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="relative h-80 lg:h-96 overflow-hidden">
                      <img src={getImage(featured)} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                          <div className="flex items-center text-teal-600">
                            <Calendar size={18} className="mr-3" />
                            <span className="font-semibold text-base">{getDate(featured)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="mb-6">
                        <span className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md">{featured.category}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 group-hover:text-teal-600 transition-colors duration-300 leading-tight">{featured.title}</h3>
                      <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed line-clamp-3">{featured.excerpt}</p>
                      <div className="inline-flex items-center text-teal-600 font-semibold text-lg">
                        <span className="mr-3">Lire l'article complet</span>
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* News Grid */}
          {!loading && rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {rest.map((item) => (
                <div key={item.objectId} className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] border border-gray-100">
                  <Link to={`/news/${item.slug}`} className="block">
                    <div className="relative h-52 md:h-56 overflow-hidden">
                      <img src={getImage(item)} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-bold rounded-full shadow-lg border border-teal-400">
                        {item.category}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex items-center text-teal-600">
                            <Calendar size={16} className="mr-2" />
                            <span className="font-medium text-sm">{getDate(item)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="p-5 md:p-6">
                    <Link to={`/news/${item.slug}`} className="block">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors duration-300 leading-tight line-clamp-2">{item.title}</h3>
                    </Link>
                    <p className="text-gray-600 mb-5 leading-relaxed line-clamp-3">{item.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {(item.tags || []).map((tag, i) => (
                        <span key={i} className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium">
                          <Tag size={12} className="inline mr-1" /> {tag}
                        </span>
                      ))}
                    </div>
                    <Link to={`/news/${item.slug}`} className="group/btn inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-all duration-300 transform hover:translate-x-1">
                      Lire plus
                      <ChevronRight size={18} className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Aucune actualité trouvée</h3>
              <p className="text-lg text-gray-600 mb-6">
                Aucune actualité ne correspond à votre recherche.<br />
                Essayez avec d'autres termes ou filtres.
              </p>
              <button
                onClick={() => { setSelectedCategory(''); setSearchTerm(''); }}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}

          {/* Bottom decorative */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
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
    </div>
  );
};

export default NewsPage;
