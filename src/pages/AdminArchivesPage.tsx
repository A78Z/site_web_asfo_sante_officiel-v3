import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Archive,
  MapPin,
  Calendar,
  Users,
  Eye,
  Pencil,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  ImageIcon,
  FileText,
  Heart,
  ChevronDown,
  Save,
} from 'lucide-react';
import { queryObjects, createObject, updateObject, deleteObject, uploadFile } from '../lib/parse';

const CLASS_NAME = 'Missions';

interface Mission {
  objectId: string;
  title: string;
  date: string;
  villages: string;
  description: string;
  photos: { __type: 'File'; name: string; url: string }[];
  patientsCount: number;
  doctorsCount: number;
  specialities: string;
  status: 'Planifiée' | 'En cours' | 'Terminée';
  createdAt: string;
}

const statusColors: Record<string, string> = {
  'Planifiée': 'border-blue-200 bg-blue-50 text-blue-700',
  'En cours': 'border-amber-200 bg-amber-50 text-amber-700',
  'Terminée': 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

/* ─────────────────────── page ─────────────────────── */
const AdminArchivesPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Tous');
  const [selected, setSelected] = useState<Mission | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchMissions = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await queryObjects<Mission>(CLASS_NAME, {
        order: '-date',
        limit: 500,
      });
      setMissions(results);
    } catch (err) {
      console.error('Fetch missions error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return missions.filter((m) => {
      const matchSearch =
        !q ||
        m.title?.toLowerCase().includes(q) ||
        m.villages?.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'Tous' || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [missions, search, statusFilter]);

  const stats = useMemo(() => {
    const total = missions.length;
    const planifiees = missions.filter((m) => m.status === 'Planifiée').length;
    const enCours = missions.filter((m) => m.status === 'En cours').length;
    const terminees = missions.filter((m) => m.status === 'Terminée').length;
    return { total, planifiees, enCours, terminees };
  }, [missions]);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette mission ?')) return;
    try {
      await deleteObject(CLASS_NAME, id);
      setMissions((prev) => prev.filter((m) => m.objectId !== id));
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      title: fd.get('title') as string,
      date: fd.get('date') as string,
      villages: fd.get('villages') as string,
      description: fd.get('description') as string,
      patientsCount: Number(fd.get('patientsCount')) || 0,
      doctorsCount: Number(fd.get('doctorsCount')) || 0,
      specialities: fd.get('specialities') as string,
      status: fd.get('status') as string,
    };

    const photoFiles = (fd.getAll('photos') as File[]).filter((f) => f.size > 0);
    if (photoFiles.length > 0) {
      const uploaded = await Promise.all(photoFiles.map((f) => uploadFile(f.name, f)));
      data.photos = uploaded;
    }

    try {
      if (editingMission) {
        await updateObject(CLASS_NAME, editingMission.objectId, data);
      } else {
        await createObject(CLASS_NAME, data);
      }
      setShowForm(false);
      setEditingMission(null);
      fetchMissions();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (m: Mission) => {
    setEditingMission(m);
    setShowForm(true);
  };

  const statCards = [
    { label: 'Total missions', value: stats.total, icon: Archive, light: 'bg-teal-50 text-teal-700' },
    { label: 'Planifiées', value: stats.planifiees, icon: Calendar, light: 'bg-blue-50 text-blue-700' },
    { label: 'En cours', value: stats.enCours, icon: Heart, light: 'bg-amber-50 text-amber-700' },
    { label: 'Terminées', value: stats.terminees, icon: FileText, light: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Archives missions</h1>
          <p className="mt-1 text-sm text-gray-500">Gérez les caravanes médicales ASFO</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchMissions}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => { setEditingMission(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Ajouter mission
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
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
            <input
              type="text"
              placeholder="Rechercher par titre, village..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1">
            {['Tous', 'Planifiée', 'En cours', 'Terminée'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === s
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
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
          <span className="ml-3 text-sm text-gray-500">Chargement des missions...</span>
        </div>
      )}

      {/* Missions Grid */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((m, i) => (
              <motion.div
                key={m.objectId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
              >
                {/* Photo area */}
                <div className="relative h-40 bg-gradient-to-br from-teal-50 to-teal-100">
                  {m.photos && m.photos.length > 0 ? (
                    <img src={m.photos[0].url} alt={m.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-teal-300" />
                    </div>
                  )}
                  <div className="absolute left-3 top-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusColors[m.status] ?? statusColors['Terminée']}`}>
                      {m.status || 'Terminée'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="mb-1 text-sm font-bold text-gray-900 line-clamp-1">{m.title}</h3>
                  <div className="mb-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{m.date ? fmt(m.date) : '—'}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{m.villages || '—'}</span>
                  </div>
                  <p className="mb-3 text-xs text-gray-500 line-clamp-2">{m.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {m.patientsCount > 0 && (
                      <span className="rounded bg-teal-50 px-2 py-0.5 font-medium text-teal-700">{m.patientsCount} patients</span>
                    )}
                    {m.doctorsCount > 0 && (
                      <span className="rounded bg-blue-50 px-2 py-0.5 font-medium text-blue-700">{m.doctorsCount} médecins</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-gray-100">
                  <button onClick={() => setSelected(m)} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
                    <Eye className="h-3.5 w-3.5" /> Détails
                  </button>
                  <div className="w-px bg-gray-100" />
                  <button onClick={() => openEdit(m)} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
                    <Pencil className="h-3.5 w-3.5" /> Modifier
                  </button>
                  <div className="w-px bg-gray-100" />
                  <button onClick={() => handleDelete(m.objectId)} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 transition hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="py-16 text-center">
          <Archive className="mx-auto mb-4 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-500">Aucune mission trouvée</p>
          <p className="mt-1 text-sm text-gray-400">
            {missions.length === 0 ? 'Commencez par ajouter votre première mission' : 'Essayez de modifier vos filtres'}
          </p>
        </div>
      )}

      {/* ───── Detail Drawer ───── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Détails de la mission</h2>
                <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-6">
                {selected.photos && selected.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {selected.photos.map((p, i) => (
                      <img key={i} src={p.url} alt="" className="rounded-lg object-cover h-32 w-full" />
                    ))}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selected.title}</h3>
                  <span className={`mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusColors[selected.status] ?? statusColors['Terminée']}`}>{selected.status || 'Terminée'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Date</p><p className="text-sm font-medium">{selected.date ? fmt(selected.date) : '—'}</p></div></div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Villages</p><p className="text-sm font-medium">{selected.villages || '—'}</p></div></div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Patients</p><p className="text-sm font-medium">{selected.patientsCount || 0}</p></div></div>
                  <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Médecins</p><p className="text-sm font-medium">{selected.doctorsCount || 0}</p></div></div>
                </div>
                {selected.specialities && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Spécialités</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.specialities.split(',').map((s, i) => (
                        <span key={i} className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Description</p>
                  <p className="text-sm leading-relaxed text-gray-700">{selected.description || 'Aucune description'}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { openEdit(selected); setSelected(null); }} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700">
                    <Pencil className="h-4 w-4" /> Modifier
                  </button>
                  <button onClick={() => handleDelete(selected.objectId)} className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ───── Add / Edit Form Drawer ───── */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditingMission(null); }} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">{editingMission ? 'Modifier la mission' : 'Nouvelle mission'}</h2>
                <button onClick={() => { setShowForm(false); setEditingMission(null); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4 p-6">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Titre mission *</label>
                  <input name="title" defaultValue={editingMission?.title ?? ''} required className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Date</label>
                    <input name="date" type="date" defaultValue={editingMission?.date?.split('T')[0] ?? ''} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Statut</label>
                    <select name="status" defaultValue={editingMission?.status ?? 'Planifiée'} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100">
                      <option>Planifiée</option>
                      <option>En cours</option>
                      <option>Terminée</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Villages</label>
                  <input name="villages" defaultValue={editingMission?.villages ?? ''} placeholder="ex: Taïba, Ganguel, Padalal" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Description</label>
                  <textarea name="description" rows={4} defaultValue={editingMission?.description ?? ''} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Patients</label>
                    <input name="patientsCount" type="number" min={0} defaultValue={editingMission?.patientsCount ?? 0} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Médecins</label>
                    <input name="doctorsCount" type="number" min={0} defaultValue={editingMission?.doctorsCount ?? 0} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Spécialités</label>
                  <input name="specialities" defaultValue={editingMission?.specialities ?? ''} placeholder="ex: Cardiologie, Ophtalmologie" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Photos</label>
                  <input name="photos" type="file" accept="image/*" multiple className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100" />
                </div>
                <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {editingMission ? 'Enregistrer les modifications' : 'Créer la mission'}
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminArchivesPage;
