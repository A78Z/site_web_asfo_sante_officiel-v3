import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Megaphone,
  Loader2,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  X,
  Calendar,
  Plus,
  CheckCircle,
  XCircle,
  RefreshCw,
  Save,
  Upload,
  Phone,
  Link2,
  FileText,
  ImageIcon,
} from 'lucide-react';
import { queryObjects, createObject, updateObject, deleteObject, uploadFile } from '../lib/parse';
import jsPDF from 'jspdf';

const CLASS_NAME = 'OfficialAnnouncements';

interface Announcement {
  objectId: string;
  title: string;
  description: string;
  image?: { __type: string; name: string; url: string };
  buttonText: string;
  buttonLink: string;
  contactPhone: string;
  contactDeposit: string;
  startDate?: { __type: string; iso: string };
  endDate?: { __type: string; iso: string };
  active: boolean;
  createdAt: string;
}

const StatusBadge: React.FC<{ active: boolean }> = ({ active }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
    {active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
    {active ? 'Active' : 'Inactive'}
  </span>
);

const fmt = (d?: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const fmtIso = (d?: { iso: string }) => d?.iso ? fmt(d.iso) : '—';

const inputCls = 'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100';

const AdminAnnouncementsPage: React.FC = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Tous' | 'Active' | 'Inactive'>('Tous');
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);

  const [fTitle, setFTitle] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [fBtnText, setFBtnText] = useState('Déposer une candidature');
  const [fBtnLink, setFBtnLink] = useState('/candidature');
  const [fPhone, setFPhone] = useState('');
  const [fDeposit, setFDeposit] = useState('');
  const [fStartDate, setFStartDate] = useState('');
  const [fEndDate, setFEndDate] = useState('');
  const [fActive, setFActive] = useState(true);
  const [fImageFile, setFImageFile] = useState<File | null>(null);
  const [fImagePreview, setFImagePreview] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await queryObjects<Announcement>(CLASS_NAME, { order: '-createdAt', limit: 100 });
      setItems(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((a) => {
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'Tous' || (statusFilter === 'Active' ? a.active : !a.active);
      return matchSearch && matchStatus;
    });
  }, [items, search, statusFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: items.length,
      active: items.filter((a) => a.active).length,
      expired: items.filter((a) => a.endDate?.iso && new Date(a.endDate.iso) < now).length,
    };
  }, [items]);

  const resetForm = () => {
    setFTitle(''); setFDesc(''); setFBtnText('Déposer une candidature'); setFBtnLink('/candidature');
    setFPhone(''); setFDeposit(''); setFStartDate(''); setFEndDate('');
    setFActive(true); setFImageFile(null); setFImagePreview('');
    setEditing(null);
  };

  const openFormForEdit = (a: Announcement) => {
    setEditing(a);
    setFTitle(a.title);
    setFDesc(a.description);
    setFBtnText(a.buttonText || '');
    setFBtnLink(a.buttonLink || '');
    setFPhone(a.contactPhone || '');
    setFDeposit(a.contactDeposit || '');
    setFStartDate(a.startDate?.iso ? a.startDate.iso.slice(0, 10) : '');
    setFEndDate(a.endDate?.iso ? a.endDate.iso.slice(0, 10) : '');
    setFActive(a.active);
    setFImagePreview(a.image?.url || '');
    setFImageFile(null);
    setShowForm(true);
    setOpenMenu(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFImageFile(file);
    setFImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!fTitle) return;
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        title: fTitle,
        description: fDesc,
        buttonText: fBtnText,
        buttonLink: fBtnLink,
        contactPhone: fPhone,
        contactDeposit: fDeposit,
        active: fActive,
      };
      if (fStartDate) data.startDate = { __type: 'Date', iso: new Date(fStartDate).toISOString() };
      if (fEndDate) data.endDate = { __type: 'Date', iso: new Date(fEndDate).toISOString() };

      if (fImageFile) {
        const uploaded = await uploadFile(fImageFile.name, fImageFile);
        data.image = uploaded;
      }

      if (editing) {
        await updateObject(CLASS_NAME, editing.objectId, data);
      } else {
        await createObject(CLASS_NAME, data);
      }

      setShowForm(false);
      resetForm();
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette annonce ?')) return;
    try {
      await deleteObject(CLASS_NAME, id);
      setItems((prev) => prev.filter((a) => a.objectId !== id));
      setOpenMenu(null);
      if (selected?.objectId === id) setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (a: Announcement) => {
    try {
      await updateObject(CLASS_NAME, a.objectId, { active: !a.active });
      setItems((prev) => prev.map((x) => x.objectId === a.objectId ? { ...x, active: !x.active } : x));
      if (selected?.objectId === a.objectId) setSelected((p) => p ? { ...p, active: !p.active } : p);
      setOpenMenu(null);
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const rows = filtered.map((a) => [a.title, a.description, a.active ? 'Active' : 'Inactive', fmtIso(a.startDate), fmtIso(a.endDate), a.contactPhone, fmt(a.createdAt)].join(';'));
    const csv = '\uFEFF' + ['Titre;Description;Statut;Début;Fin;Téléphone;Créé le', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'annonces-officielles.csv'; link.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text('Annonces Officielles ASFO', 14, 20);
    doc.setFontSize(10); doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);
    let y = 38;
    filtered.forEach((a, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(11); doc.text(`${i + 1}. ${a.title}`, 14, y);
      doc.setFontSize(9);
      doc.text(`Statut: ${a.active ? 'Active' : 'Inactive'} | Du ${fmtIso(a.startDate)} au ${fmtIso(a.endDate)}`, 14, y + 6);
      doc.text(`Tél: ${a.contactPhone || '—'}`, 14, y + 11);
      y += 20;
    });
    doc.save('annonces-officielles.pdf');
  };

  const statCards = [
    { label: 'Total annonces', value: stats.total, icon: Megaphone, light: 'bg-teal-50 text-teal-700' },
    { label: 'Annonces actives', value: stats.active, icon: CheckCircle, light: 'bg-emerald-50 text-emerald-700' },
    { label: 'Annonces expirées', value: stats.expired, icon: XCircle, light: 'bg-amber-50 text-amber-700' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        <span className="ml-3 text-sm text-gray-500">Chargement des annonces...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Annonces officielles</h1>
          <p className="mt-1 text-sm text-gray-500">Gérez les campagnes, annonces et événements ASFO</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={fetchItems} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" /> Actualiser
          </button>
          <button onClick={exportCSV} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <FileText className="h-4 w-4" /> Exporter Excel
          </button>
          <button onClick={exportPDF} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <FileText className="h-4 w-4" /> Exporter PDF
          </button>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700">
            <Plus className="h-4 w-4" /> Nouvelle annonce
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }} className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.light}`}><Icon className="h-[18px] w-[18px]" /></div>
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
            <input type="text" placeholder="Rechercher par titre, description..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1">
            {(['Tous', 'Active', 'Inactive'] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${statusFilter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Image</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Titre</th>
                <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">Date début</th>
                <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">Date fin</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Statut</th>
                <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 sm:table-cell">Créé le</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filtered.map((a) => (
                  <motion.tr key={a.objectId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group transition-colors hover:bg-teal-50/30">
                    <td className="px-5 py-3">
                      {a.image?.url ? (
                        <img src={a.image.url} alt={a.title} className="h-12 w-12 rounded-lg border border-gray-200 object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                          <ImageIcon className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{a.description}</p>
                    </td>
                    <td className="hidden px-5 py-3 md:table-cell"><span className="text-sm text-gray-500">{fmtIso(a.startDate)}</span></td>
                    <td className="hidden px-5 py-3 md:table-cell"><span className="text-sm text-gray-500">{fmtIso(a.endDate)}</span></td>
                    <td className="px-5 py-3"><StatusBadge active={a.active} /></td>
                    <td className="hidden px-5 py-3 sm:table-cell"><span className="text-sm text-gray-500">{fmt(a.createdAt)}</span></td>
                    <td className="px-5 py-3 text-right">
                      <div className="relative inline-block">
                        <button onClick={() => setOpenMenu(openMenu === a.objectId ? null : a.objectId)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {openMenu === a.objectId && (
                          <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                            <button onClick={() => { setSelected(a); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50">
                              <Eye className="h-3.5 w-3.5" /> Voir détails
                            </button>
                            <button onClick={() => openFormForEdit(a)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50">
                              <Pencil className="h-3.5 w-3.5" /> Modifier
                            </button>
                            <button onClick={() => handleToggle(a)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50">
                              {a.active ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                              {a.active ? 'Désactiver' : 'Activer'}
                            </button>
                            <div className="my-1 border-t border-gray-100" />
                            <button onClick={() => handleDelete(a.objectId)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50">
                              <Trash2 className="h-3.5 w-3.5" /> Supprimer
                            </button>
                          </div>
                        )}
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
            <Megaphone className="mx-auto mb-4 h-10 w-10 text-gray-300" />
            <p className="font-medium text-gray-500">Aucune annonce trouvée</p>
            <p className="mt-1 text-sm text-gray-400">Créez votre première annonce officielle</p>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Détails annonce</h2>
                <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6">
                {selected.image?.url && (
                  <img src={selected.image.url} alt={selected.title} className="mb-6 w-full rounded-xl border border-gray-200 object-cover" />
                )}
                <h3 className="mb-2 text-xl font-bold text-gray-900">{selected.title}</h3>
                <StatusBadge active={selected.active} />
                <p className="mt-4 text-sm leading-relaxed text-gray-600">{selected.description}</p>

                <div className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <Link2 className="h-4 w-4 text-gray-400" />
                    <div><p className="text-xs text-gray-500">Bouton</p><p className="text-sm font-medium text-gray-900">{selected.buttonText || '—'} → {selected.buttonLink || '—'}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div><p className="text-xs text-gray-500">Renseignements</p><p className="text-sm font-medium text-gray-900">{selected.contactPhone || '—'}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div><p className="text-xs text-gray-500">Dépôt</p><p className="text-sm font-medium text-gray-900">{selected.contactDeposit || '—'}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div><p className="text-xs text-gray-500">Période</p><p className="text-sm font-medium text-gray-900">{fmtIso(selected.startDate)} → {fmtIso(selected.endDate)}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div><p className="text-xs text-gray-500">Créé le</p><p className="text-sm font-medium text-gray-900">{fmt(selected.createdAt)}</p></div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button onClick={() => openFormForEdit(selected)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700">
                    <Pencil className="h-4 w-4" /> Modifier
                  </button>
                  <button onClick={() => handleToggle(selected)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                    {selected.active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    {selected.active ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Create / Edit Drawer */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => { setShowForm(false); resetForm(); }} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">{editing ? 'Modifier l\'annonce' : 'Nouvelle annonce officielle'}</h2>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-5 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">Titre *</label>
                  <input value={fTitle} onChange={(e) => setFTitle(e.target.value)} className={inputCls} placeholder="Ex: Campagne Médicale ASFO 2026" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">Description</label>
                  <textarea value={fDesc} onChange={(e) => setFDesc(e.target.value)} rows={4} className={inputCls} placeholder="Description de l'annonce..." />
                </div>

                {/* Image upload */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">Image / Poster</label>
                  {fImagePreview && (
                    <img src={fImagePreview} alt="Aperçu" className="mb-3 h-48 w-full rounded-xl border border-gray-200 object-cover" />
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500 transition hover:border-teal-300 hover:bg-teal-50/30">
                    <Upload className="h-4 w-4" />
                    {fImageFile ? fImageFile.name : 'Choisir une image'}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Texte du bouton</label>
                    <input value={fBtnText} onChange={(e) => setFBtnText(e.target.value)} className={inputCls} placeholder="Déposer une candidature" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Lien du bouton</label>
                    <input value={fBtnLink} onChange={(e) => setFBtnLink(e.target.value)} className={inputCls} placeholder="/candidature" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Tél. renseignements</label>
                    <input value={fPhone} onChange={(e) => setFPhone(e.target.value)} className={inputCls} placeholder="+221 77 879 20 62" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Tél. dépôt</label>
                    <input value={fDeposit} onChange={(e) => setFDeposit(e.target.value)} className={inputCls} placeholder="+221 77 090 88 49" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Date début</label>
                    <input type="date" value={fStartDate} onChange={(e) => setFStartDate(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Date fin</label>
                    <input type="date" value={fEndDate} onChange={(e) => setFEndDate(e.target.value)} className={inputCls} />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setFActive(!fActive)} className={`relative h-6 w-11 rounded-full transition-colors ${fActive ? 'bg-teal-600' : 'bg-gray-300'}`}>
                    <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${fActive ? 'translate-x-5' : ''}`} />
                  </button>
                  <span className="text-sm font-medium text-gray-700">{fActive ? 'Active' : 'Inactive'}</span>
                </div>

                <button onClick={handleSave} disabled={saving || !fTitle} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer l\'annonce'}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAnnouncementsPage;
