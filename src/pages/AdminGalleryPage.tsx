import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Loader2,
  RefreshCw,
  Trash2,
  X,
  ImageIcon,
  FolderPlus,
  Tag,
  Calendar,
  ZoomIn,
  Upload,
  Save,
  Filter,
} from 'lucide-react';
import { queryObjects, createObject, deleteObject, uploadFile } from '../lib/parse';

const CLASS_NAME = 'GalleryImages';

interface GalleryImage {
  objectId: string;
  image: { __type: 'File'; name: string; url: string };
  title: string;
  album: string;
  mission: string;
  createdAt: string;
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

/* ───────────────────────── page ───────────────────────── */
const AdminGalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [albumFilter, setAlbumFilter] = useState('Tous');
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await queryObjects<GalleryImage>(CLASS_NAME, {
        order: '-createdAt',
        limit: 500,
      });
      setImages(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const albums = useMemo(() => {
    const set = new Set(images.map((img) => img.album).filter(Boolean));
    return ['Tous', ...Array.from(set)];
  }, [images]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return images.filter((img) => {
      const matchSearch =
        !q ||
        img.title?.toLowerCase().includes(q) ||
        img.album?.toLowerCase().includes(q) ||
        img.mission?.toLowerCase().includes(q);
      const matchAlbum = albumFilter === 'Tous' || img.album === albumFilter;
      return matchSearch && matchAlbum;
    });
  }, [images, search, albumFilter]);

  const stats = useMemo(() => {
    const total = images.length;
    const albumSet = new Set(images.map((i) => i.album).filter(Boolean));
    return { total, albums: albumSet.size };
  }, [images]);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette image ?')) return;
    try {
      await deleteObject(CLASS_NAME, id);
      setImages((prev) => prev.filter((i) => i.objectId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const fd = new FormData(e.currentTarget);
    const files = fd.getAll('files') as File[];
    const album = (fd.get('album') as string) || 'Sans album';
    const mission = (fd.get('mission') as string) || '';

    try {
      for (const file of files) {
        if (file.size === 0) continue;
        const uploaded = await uploadFile(file.name, file);
        await createObject(CLASS_NAME, {
          image: uploaded,
          title: file.name.replace(/\.[^/.]+$/, ''),
          album,
          mission,
        });
      }
      setShowUpload(false);
      fetchImages();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galerie</h1>
          <p className="mt-1 text-sm text-gray-500">Gérez la médiathèque ASFO</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchImages} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            <Upload className="h-4 w-4" />
            Uploader des images
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><ImageIcon className="h-[18px] w-[18px]" /></div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="mt-0.5 text-xs text-gray-500">Total images</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><FolderPlus className="h-[18px] w-[18px]" /></div>
          <p className="text-2xl font-bold text-gray-900">{stats.albums}</p>
          <p className="mt-0.5 text-xs text-gray-500">Albums</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, album, mission..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          {albums.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto rounded-lg bg-gray-100 p-1">
              {albums.map((a) => (
                <button
                  key={a}
                  onClick={() => setAlbumFilter(a)}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    albumFilter === a
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <span className="ml-3 text-sm text-gray-500">Chargement de la galerie...</span>
        </div>
      )}

      {/* Image Grid */}
      {!loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.objectId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.02 }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
              >
                {img.image?.url ? (
                  <img src={img.image.url} alt={img.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center"><ImageIcon className="h-10 w-10 text-gray-300" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-xs font-semibold text-white line-clamp-1">{img.title}</p>
                  {img.album && <p className="text-[11px] text-white/70">{img.album}</p>}
                  <div className="mt-2 flex gap-1.5">
                    <button onClick={() => setLightbox(img)} className="rounded-lg bg-white/20 p-1.5 text-white backdrop-blur-sm transition hover:bg-white/30"><ZoomIn className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(img.objectId)} className="rounded-lg bg-red-500/70 p-1.5 text-white backdrop-blur-sm transition hover:bg-red-600/80"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="py-16 text-center">
          <ImageIcon className="mx-auto mb-4 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-500">Aucune image</p>
          <p className="mt-1 text-sm text-gray-400">
            {images.length === 0 ? 'Commencez par uploader des images' : 'Essayez de modifier vos filtres'}
          </p>
        </div>
      )}

      {/* ───── Upload Drawer ───── */}
      <AnimatePresence>
        {showUpload && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setShowUpload(false)} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Uploader des images</h2>
                <button onClick={() => setShowUpload(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleUpload} className="space-y-5 p-6">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Images *</label>
                  <input name="files" type="file" accept="image/*" multiple required className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2.5 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Album</label>
                  <input name="album" placeholder="ex: Caravane Matam 2025" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Mission associée</label>
                  <input name="mission" placeholder="ex: 26e Caravane Médicale" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
                </div>
                <button type="submit" disabled={uploading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'Upload en cours...' : 'Uploader'}
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ───── Lightbox ───── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20" onClick={() => setLightbox(null)}>
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightbox.image?.url}
              alt={lightbox.title}
              className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              {lightbox.title} {lightbox.album && `— ${lightbox.album}`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGalleryPage;
