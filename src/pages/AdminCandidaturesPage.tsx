import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Users,
  Mail,
  Phone,
  BarChart3,
  Download,
  FileDown,
  CalendarDays,
  Building2,
  X,
  Loader2,
  RefreshCw,
  Trash2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { queryObjects, updateObject, deleteObject } from '../lib/parse';

const CLASS_NAME = 'Candidatures';

type Statut = 'En attente' | 'Validé' | 'Refusé';

interface Candidature {
  objectId: string;
  numeroDossier: string;
  nomVillage: string;
  commune: string;
  departement: string;
  region: string;
  population: string;
  nomAmicale: string;
  universite: string;
  nomContact: string;
  email: string;
  telephone: string;
  description: string;
  statut: Statut;
  createdAt: string;
  documents?: unknown[];
  dossierPDF?: { __type: string; name: string; url: string };
}

const statusConfig: Record<Statut, { bg: string; text: string; icon: typeof Clock }> = {
  'En attente': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: Clock },
  Validé: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: CheckCircle },
  Refusé: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: XCircle },
};

const StatusBadge: React.FC<{ statut: Statut }> = ({ statut }) => {
  const cfg = statusConfig[statut] ?? statusConfig['En attente'];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <Icon className="h-3 w-3" />
      {statut}
    </span>
  );
};

/* ─── Drawer ─── */
const CandidatureDrawer: React.FC<{
  candidature: Candidature | null;
  onClose: () => void;
  onStatusChange: (id: string, statut: Statut) => void;
}> = ({ candidature, onClose, onStatusChange }) => {
  if (!candidature) return null;
  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p className="text-xs font-medium text-gray-500">Dossier</p>
            <p className="text-lg font-bold text-gray-900 font-mono">{candidature.numeroDossier}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge statut={candidature.statut} />
            <button onClick={onClose} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
              <MapPin className="h-4 w-4 text-teal-600" /> Informations du village
            </h4>
            <div className="divide-y divide-gray-200">
              <InfoRow label="Village" value={candidature.nomVillage} />
              <InfoRow label="Région" value={candidature.region} />
              <InfoRow label="Département" value={candidature.departement || '—'} />
              <InfoRow label="Commune" value={candidature.commune} />
              <InfoRow label="Population" value={candidature.population || '—'} />
            </div>
          </div>
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
              <Users className="h-4 w-4 text-teal-600" /> Informations de l'amicale
            </h4>
            <div className="divide-y divide-gray-200">
              <InfoRow label="Amicale" value={candidature.nomAmicale} />
              <InfoRow label="Université" value={candidature.universite || '—'} />
              <InfoRow label="Contact" value={candidature.nomContact} />
              <div className="flex items-center gap-1.5 py-2.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-sm font-medium text-teal-700">{candidature.email}</span>
              </div>
              <div className="flex items-center gap-1.5 py-2.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{candidature.telephone}</span>
              </div>
            </div>
          </div>
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-bold text-gray-800">Description sanitaire</h4>
            <p className="text-sm leading-relaxed text-gray-600">{candidature.description}</p>
          </div>
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
              <FileDown className="h-4 w-4 text-teal-600" /> Documents du candidat
            </h4>
            {candidature.dossierPDF ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-red-500 rounded-md">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Dossier complet (PDF)</p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]" title={candidature.dossierPDF.name}>{candidature.dossierPDF.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={candidature.dossierPDF.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-md transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> Voir
                  </a>
                  <a
                    href={candidature.dossierPDF.url}
                    download
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-md transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Télécharger
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg text-sm font-medium border border-amber-100">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                ⚠ Aucun document téléversé
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => onStatusChange(candidature.objectId, 'Validé')} className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600">
              <CheckCircle className="h-4 w-4" /> Valider
            </button>
            <button onClick={() => onStatusChange(candidature.objectId, 'Refusé')} className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600">
              <XCircle className="h-4 w-4" /> Refuser
            </button>
            <button onClick={() => onStatusChange(candidature.objectId, 'En attente')} className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600">
              <Clock className="h-4 w-4" /> Attente
            </button>
          </div>
          <button onClick={onClose} className="mt-3 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Fermer</button>
        </div>
      </motion.aside>
    </motion.div>
  );
};

/* ─── Page ─── */
const AdminCandidaturesPage: React.FC = () => {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Statut | 'Tous'>('Tous');
  const [selected, setSelected] = useState<Candidature | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await queryObjects<Candidature>(CLASS_NAME, { order: '-createdAt', limit: 500 });
      setCandidatures(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return candidatures.filter((c) => {
      const matchSearch = !q ||
        (c.nomVillage || '').toLowerCase().includes(q) ||
        (c.numeroDossier || '').toLowerCase().includes(q) ||
        (c.nomAmicale || '').toLowerCase().includes(q) ||
        (c.nomContact || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.region || '').toLowerCase().includes(q) ||
        (c.departement || '').toLowerCase().includes(q) ||
        (c.commune || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'Tous' || c.statut === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [candidatures, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = useMemo(() => {
    const total = candidatures.length;
    const enAttente = candidatures.filter((c) => c.statut === 'En attente').length;
    const valide = candidatures.filter((c) => c.statut === 'Validé').length;
    const refuse = candidatures.filter((c) => c.statut === 'Refusé').length;
    const regions = new Set(candidatures.map((c) => c.region)).size;
    return { total, enAttente, valide, refuse, regions };
  }, [candidatures]);

  const handleStatusChange = async (id: string, statut: Statut) => {
    try {
      await updateObject(CLASS_NAME, id, { statut });
      setCandidatures((prev) => prev.map((c) => (c.objectId === id ? { ...c, statut } : c)));
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette candidature ?')) return;
    try {
      await deleteObject(CLASS_NAME, id);
      setCandidatures((prev) => prev.filter((c) => c.objectId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const rows = [['N°Dossier', 'Village', 'Région', 'Département', 'Commune', 'Amicale', 'Contact', 'Email', 'Tél', 'Statut', 'Date']];
    filtered.forEach((c) => rows.push([c.numeroDossier, c.nomVillage, c.region, c.departement || '', c.commune, c.nomAmicale, c.nomContact, c.email, c.telephone, c.statut, new Date(c.createdAt).toLocaleDateString('fr-FR')]));
    const csv = rows.map((r) => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'candidatures_asfo.csv';
    a.click();
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  const statCards = [
    { label: 'Total candidatures', value: stats.total, icon: BarChart3, light: 'bg-teal-50 text-teal-700' },
    { label: 'En attente', value: stats.enAttente, icon: Clock, light: 'bg-amber-50 text-amber-700' },
    { label: 'Validées', value: stats.valide, icon: CheckCircle, light: 'bg-emerald-50 text-emerald-700' },
    { label: 'Refusées', value: stats.refuse, icon: XCircle, light: 'bg-red-50 text-red-700' },
    { label: 'Missions programmées', value: stats.valide, icon: CalendarDays, light: 'bg-blue-50 text-blue-700' },
    { label: 'Régions couvertes', value: stats.regions, icon: Building2, light: 'bg-violet-50 text-violet-700' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        <span className="ml-3 text-sm text-gray-500">Chargement des candidatures...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidatures</h1>
          <p className="mt-1 text-sm text-gray-500">Gérez les candidatures de la Caravane de Santé ASFO</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" /> Actualiser
          </button>
          <button onClick={exportCSV} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <FileDown className="h-4 w-4" /> Exporter CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
            <input type="text" placeholder="Rechercher par village, numéro, amicale, contact, région..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1">
            {(['Tous', 'En attente', 'Validé', 'Refusé'] as const).map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${statusFilter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{s}</button>
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
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">N° Dossier</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Village</th>
                <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">Amicale</th>
                <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 lg:table-cell">Contact</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Statut</th>
                <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 xl:table-cell">Dossier</th>
                <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 sm:table-cell">Date</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {paginated.map((c) => (
                  <motion.tr key={c.objectId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group transition-colors hover:bg-teal-50/30">
                    <td className="px-5 py-4"><span className="font-mono text-sm font-bold text-teal-700">{c.numeroDossier || '—'}</span></td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900">{c.nomVillage}</p>
                      <p className="text-xs text-gray-400">{c.region}</p>
                    </td>
                    <td className="hidden px-5 py-4 md:table-cell"><p className="max-w-[200px] truncate text-sm text-gray-600">{c.nomAmicale}</p></td>
                    <td className="hidden px-5 py-4 lg:table-cell">
                      <p className="text-sm text-gray-800">{c.nomContact}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="px-5 py-4"><StatusBadge statut={c.statut} /></td>
                    <td className="hidden px-5 py-4 xl:table-cell">
                      {c.dossierPDF ? (
                        <div className="flex flex-col gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit border border-emerald-100">
                            📄 Document dispo
                          </span>
                          <div className="flex items-center gap-2">
                            <a href={c.dossierPDF.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 hover:underline text-xs flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Voir
                            </a>
                            <a href={c.dossierPDF.url} download className="text-blue-600 hover:text-blue-800 hover:underline text-xs flex items-center gap-1">
                              <Download className="w-3 h-3" /> Télécharger
                            </a>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                          ⚠ Aucun document
                        </span>
                      )}
                    </td>
                    <td className="hidden px-5 py-4 sm:table-cell"><span className="text-sm text-gray-500">{fmt(c.createdAt)}</span></td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setSelected(c)} className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100">
                          <Eye className="h-3.5 w-3.5" /> Détails
                        </button>
                        <button onClick={() => handleDelete(c.objectId)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600">
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
            <Search className="mx-auto mb-4 h-10 w-10 text-gray-300" />
            <p className="font-medium text-gray-500">Aucune candidature trouvée</p>
            <p className="mt-1 text-sm text-gray-400">Essayez de modifier vos filtres</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3">
            <p className="text-sm text-gray-500">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</p>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-40">Précédent</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${p === page ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{p}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-40">Suivant</button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {selected && <CandidatureDrawer candidature={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminCandidaturesPage;
