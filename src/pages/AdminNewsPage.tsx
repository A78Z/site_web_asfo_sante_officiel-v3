import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  Search,
  Plus,
  Loader2,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  X,
  Save,
  ImageIcon,
  Calendar,
  Tag,
  Star,
  FileText,
  Archive,
  CheckCircle,
  Clock,
  Send,
  XCircle,
  Newspaper,
} from 'lucide-react';
import { queryObjects, createObject, updateObject, deleteObject, uploadFile } from '../lib/parse';

const CLASS_NAME = 'News';

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
  status: 'Brouillon' | 'Publié' | 'Archivé';
  publishedAt?: { __type: 'Date'; iso: string } | string;
  createdAt: string;
}

type Status = 'Brouillon' | 'Publié' | 'Archivé';

const statusConfig: Record<Status, { bg: string; icon: typeof Clock }> = {
  Brouillon: { bg: 'border-amber-200 bg-amber-50 text-amber-700', icon: Clock },
  'Publié': { bg: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: CheckCircle },
  'Archivé': { bg: 'border-gray-200 bg-gray-50 text-gray-600', icon: Archive },
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const cfg = statusConfig[status] ?? statusConfig.Brouillon;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.bg}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

const getImageUrl = (a: NewsArticle) =>
  a.coverImage?.url || a.imageUrl || '';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    ['blockquote', 'link', 'image'],
    ['clean'],
  ],
};

/* ═══════════════════════════════════════════════════════ Page */
const AdminNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'Tous'>('Tous');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [preview, setPreview] = useState<NewsArticle | null>(null);
  const [saving, setSaving] = useState(false);

  /* form state */
  const [fTitle, setFTitle] = useState('');
  const [fSlug, setFSlug] = useState('');
  const [fExcerpt, setFExcerpt] = useState('');
  const [fContent, setFContent] = useState('');
  const [fCategory, setFCategory] = useState('');
  const [fTags, setFTags] = useState('');
  const [fAuthor, setFAuthor] = useState('');
  const [fStatus, setFStatus] = useState<Status>('Brouillon');
  const [fFeatured, setFFeatured] = useState(false);
  const [fDate, setFDate] = useState('');
  const [fImageFile, setFImageFile] = useState<File | null>(null);
  const [fImagePreview, setFImagePreview] = useState('');

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await queryObjects<NewsArticle>(CLASS_NAME, {
        order: '-createdAt',
        limit: 500,
      });
      setArticles(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  /* ── filters ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return articles.filter((a) => {
      const matchSearch =
        !q ||
        a.title?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q) ||
        a.tags?.some((t: string) => t.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'Tous' || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [articles, search, statusFilter]);

  const stats = useMemo(() => {
    const total = articles.length;
    const publie = articles.filter((a) => a.status === 'Publié').length;
    const brouillon = articles.filter((a) => a.status === 'Brouillon').length;
    const archive = articles.filter((a) => a.status === 'Archivé').length;
    return { total, publie, brouillon, archive };
  }, [articles]);

  /* ── form helpers ── */
  const resetForm = () => {
    setFTitle('');
    setFSlug('');
    setFExcerpt('');
    setFContent('');
    setFCategory('');
    setFTags('');
    setFAuthor('');
    setFStatus('Brouillon');
    setFFeatured(false);
    setFDate('');
    setFImageFile(null);
    setFImagePreview('');
  };

  const openNewForm = () => {
    resetForm();
    setEditing(null);
    setShowForm(true);
  };

  const openEditForm = (a: NewsArticle) => {
    setFTitle(a.title || '');
    setFSlug(a.slug || '');
    setFExcerpt(a.excerpt || '');
    setFContent(a.content || '');
    setFCategory(a.category || '');
    setFTags(a.tags?.join(', ') || '');
    setFAuthor(a.author || '');
    setFStatus(a.status || 'Brouillon');
    setFFeatured(a.isFeatured || false);
    const pubAt =
      typeof a.publishedAt === 'object' && a.publishedAt !== null
        ? (a.publishedAt as { iso: string }).iso?.split('T')[0]
        : typeof a.publishedAt === 'string'
          ? a.publishedAt.split('T')[0]
          : '';
    setFDate(pubAt);
    setFImageFile(null);
    setFImagePreview(getImageUrl(a));
    setEditing(a);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!fTitle) return;
    setSaving(true);

    const data: Record<string, unknown> = {
      title: fTitle,
      slug: fSlug || slugify(fTitle),
      excerpt: fExcerpt,
      content: fContent,
      category: fCategory,
      tags: fTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      author: fAuthor,
      status: fStatus,
      isFeatured: fFeatured,
    };

    if (fDate) {
      data.publishedAt = { __type: 'Date', iso: new Date(fDate).toISOString() };
    } else if (fStatus === 'Publié') {
      data.publishedAt = { __type: 'Date', iso: new Date().toISOString() };
    }

    if (fImageFile) {
      try {
        const uploaded = await uploadFile(fImageFile.name, fImageFile);
        data.coverImage = uploaded;
        data.imageUrl = uploaded.url;
      } catch (err) {
        console.error('Image upload failed', err);
        alert('Erreur lors de l\'upload de l\'image. Vérifiez votre connexion et réessayez.');
        setSaving(false);
        return;
      }
    }

    try {
      if (editing) {
        await updateObject(CLASS_NAME, editing.objectId, data);
      } else {
        await createObject(CLASS_NAME, data);
      }
      setShowForm(false);
      resetForm();
      setEditing(null);
      fetchArticles();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Status) => {
    try {
      const data: Record<string, unknown> = { status: newStatus };
      if (newStatus === 'Publié') {
        data.publishedAt = { __type: 'Date', iso: new Date().toISOString() };
      }
      await updateObject(CLASS_NAME, id, data);
      setArticles((prev) =>
        prev.map((a) => (a.objectId === id ? { ...a, status: newStatus } : a)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    try {
      await deleteObject(CLASS_NAME, id);
      setArticles((prev) => prev.filter((a) => a.objectId !== id));
      setPreview(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFImageFile(file);
    setFImagePreview(URL.createObjectURL(file));
  };

  /* ── stat cards ── */
  const statCards = [
    { label: 'Total articles', value: stats.total, icon: Newspaper, light: 'bg-teal-50 text-teal-700' },
    { label: 'Publiés', value: stats.publie, icon: CheckCircle, light: 'bg-emerald-50 text-emerald-700' },
    { label: 'Brouillons', value: stats.brouillon, icon: Clock, light: 'bg-amber-50 text-amber-700' },
    { label: 'Archivés', value: stats.archive, icon: Archive, light: 'bg-gray-100 text-gray-600' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Actualités</h1>
          <p className="mt-1 text-sm text-gray-500">Publiez et gérez les articles ASFO</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchArticles} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openNewForm} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700">
            <Plus className="h-4 w-4" />
            Nouvelle actualité
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }} className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.light}`}>
                <Icon className="h-[18px] w-[18px]" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Rechercher par titre, catégorie, tag..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1">
            {(['Tous', 'Publié', 'Brouillon', 'Archivé'] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${statusFilter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <span className="ml-3 text-sm text-gray-500">Chargement des articles...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Image</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Titre</th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">Catégorie</th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 lg:table-cell">Tags</th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 sm:table-cell">Date</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Statut</th>
                  <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filtered.map((a) => (
                    <motion.tr key={a.objectId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group transition-colors hover:bg-teal-50/30">
                      {/* Image */}
                      <td className="px-5 py-3">
                        <div className="h-12 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                          {getImageUrl(a) ? (
                            <img src={getImageUrl(a)} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center"><ImageIcon className="h-4 w-4 text-gray-300" /></div>
                          )}
                        </div>
                      </td>
                      {/* Title */}
                      <td className="max-w-[200px] px-5 py-3">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-1">{a.title}</p>
                          {a.isFeatured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{a.slug}</p>
                      </td>
                      {/* Category */}
                      <td className="hidden px-5 py-3 md:table-cell">
                        <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700">{a.category || '—'}</span>
                      </td>
                      {/* Tags */}
                      <td className="hidden px-5 py-3 lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(a.tags || []).slice(0, 2).map((t, i) => (
                            <span key={i} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">{t}</span>
                          ))}
                          {(a.tags || []).length > 2 && (
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">+{a.tags.length - 2}</span>
                          )}
                        </div>
                      </td>
                      {/* Date */}
                      <td className="hidden px-5 py-3 sm:table-cell">
                        <span className="text-sm text-gray-500">{fmt(a.createdAt)}</span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-3">
                        <StatusBadge status={a.status} />
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setPreview(a)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600" title="Voir">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => openEditForm(a)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600" title="Modifier">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          {a.status !== 'Publié' && (
                            <button onClick={() => handleStatusChange(a.objectId, 'Publié')} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-600" title="Publier">
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {a.status === 'Publié' && (
                            <button onClick={() => handleStatusChange(a.objectId, 'Archivé')} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-amber-50 hover:text-amber-600" title="Archiver">
                              <Archive className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(a.objectId)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600" title="Supprimer">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && !loading && (
            <div className="py-16 text-center">
              <Newspaper className="mx-auto mb-4 h-10 w-10 text-gray-300" />
              <p className="font-medium text-gray-500">
                {articles.length === 0 ? 'Aucun article' : 'Aucun résultat'}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {articles.length === 0
                  ? 'Publiez votre première actualité'
                  : 'Essayez de modifier vos filtres'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ═══════ Preview Drawer ═══════ */}
      <AnimatePresence>
        {preview && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setPreview(null)} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Aperçu article</h2>
                <button onClick={() => setPreview(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-5">
                {getImageUrl(preview) && (
                  <img src={getImageUrl(preview)} alt="" className="h-48 w-full rounded-xl object-cover" />
                )}
                <div className="flex items-center gap-2">
                  <StatusBadge status={preview.status} />
                  {preview.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                      <Star className="h-3 w-3 fill-amber-400" /> À la Une
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{preview.title}</h3>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{fmt(preview.createdAt)}</span>
                  {preview.author && <span>par {preview.author}</span>}
                </div>
                {preview.excerpt && <p className="text-sm text-gray-600 italic">{preview.excerpt}</p>}
                <div className="prose prose-sm max-w-none rounded-lg border border-gray-100 bg-gray-50 p-4" dangerouslySetInnerHTML={{ __html: preview.content || '' }} />
                <div className="flex flex-wrap gap-1.5">
                  {(preview.tags || []).map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                      <Tag className="h-3 w-3" />{t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => { openEditForm(preview); setPreview(null); }} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700">
                    <Pencil className="h-4 w-4" /> Modifier
                  </button>
                  <button onClick={() => handleDelete(preview.objectId)} className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═══════ Create / Edit Drawer ═══════ */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null); }} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-xl">
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">{editing ? 'Modifier l\'article' : 'Nouvelle actualité'}</h2>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Titre *</label>
                    <input value={fTitle} onChange={(e) => { setFTitle(e.target.value); if (!editing) setFSlug(slugify(e.target.value)); }} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" placeholder="Titre de l'article" />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Slug (URL)</label>
                    <input value={fSlug} onChange={(e) => setFSlug(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 font-mono text-sm text-gray-500 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
                  </div>

                  {/* Category + Author */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">Catégorie</label>
                      <input value={fCategory} onChange={(e) => setFCategory(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" placeholder="ex: À la Une" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">Auteur</label>
                      <input value={fAuthor} onChange={(e) => setFAuthor(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" placeholder="ex: ASFO Santé" />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Tags (séparés par des virgules)</label>
                    <input value={fTags} onChange={(e) => setFTags(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" placeholder="ex: santé, caravane, Matam" />
                  </div>

                  {/* Cover image */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Image de couverture</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100" />
                    {fImagePreview && (
                      <img src={fImagePreview} alt="Preview" className="mt-3 h-36 w-full rounded-lg object-cover border border-gray-200" />
                    )}
                  </div>

                  {/* Date + Status + Featured */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">Date publication</label>
                      <input type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">Statut</label>
                      <select value={fStatus} onChange={(e) => setFStatus(e.target.value as Status)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100">
                        <option>Brouillon</option>
                        <option>Publié</option>
                        <option>Archivé</option>
                      </select>
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={fFeatured} onChange={(e) => setFFeatured(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <Star className="h-4 w-4 text-amber-400" />
                        À la Une
                      </label>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Résumé</label>
                    <textarea value={fExcerpt} onChange={(e) => setFExcerpt(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" placeholder="Court résumé de l'article..." />
                  </div>

                  {/* Rich text editor */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Contenu de l'article</label>
                    <div className="rounded-lg border border-gray-200 overflow-hidden [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 [&_.ql-toolbar]:bg-gray-50 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[250px] [&_.ql-editor]:text-sm">
                      <ReactQuill theme="snow" value={fContent} onChange={setFContent} modules={quillModules} placeholder="Rédigez votre article ici..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-gray-200 px-6 py-4">
                <div className="flex gap-3">
                  <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                    Annuler
                  </button>
                  <button onClick={handleSave} disabled={saving || !fTitle} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {editing ? 'Enregistrer' : 'Publier'}
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNewsPage;
