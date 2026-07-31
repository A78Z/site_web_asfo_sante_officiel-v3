import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckCircle,
  XCircle,
  Mail,
  Download,
  FileDown,
  Trash2,
  Copy,
  Users,
  UserCheck,
  UserX,
  Loader2,
  RefreshCw,
  Check,
} from 'lucide-react';
import { queryObjects, updateObject, deleteObject } from '../lib/parse';
import useConfirm from '../components/ui/useConfirm';

const CLASS_NAME = 'NewsletterSubscribers';

type Statut = 'Actif' | 'Désinscrit';

interface Subscriber {
  objectId: string;
  email: string;
  status: Statut;
  createdAt: string;
}

/* ================================================================
   StatusBadge
   ================================================================ */
const statusConfig: Record<
  Statut,
  { bg: string; text: string; icon: typeof CheckCircle }
> = {
  Actif: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: CheckCircle },
  Désinscrit: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: XCircle },
};

const StatusBadge: React.FC<{ statut: Statut }> = ({ statut }) => {
  const cfg = statusConfig[statut];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <Icon className="h-3 w-3" />
      {statut}
    </span>
  );
};

/* ================================================================
   Main Page
   ================================================================ */
const AdminNewsletterPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Statut | 'Tous'>('Tous');
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const perPage = 15;

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await queryObjects<Subscriber>(CLASS_NAME, {
        order: '-createdAt',
        limit: 1000,
      });
      setSubscribers(results);
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return subscribers.filter((s) => {
      const matchSearch = !q || s.email.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'Tous' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [subscribers, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = useMemo(() => {
    const total = subscribers.length;
    const actif = subscribers.filter((s) => s.status === 'Actif').length;
    const desinscrit = subscribers.filter((s) => s.status === 'Désinscrit').length;
    return { total, actif, desinscrit };
  }, [subscribers]);

  const handleDeactivate = async (id: string) => {
    try {
      await updateObject(CLASS_NAME, id, { status: 'Désinscrit' });
      setSubscribers((prev) =>
        prev.map((s) => (s.objectId === id ? { ...s, status: 'Désinscrit' as Statut } : s)),
      );
    } catch (err) {
      console.error('Deactivate failed:', err);
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      await updateObject(CLASS_NAME, id, { status: 'Actif' });
      setSubscribers((prev) =>
        prev.map((s) => (s.objectId === id ? { ...s, status: 'Actif' as Statut } : s)),
      );
    } catch (err) {
      console.error('Reactivate failed:', err);
    }
  };

  const { confirm, confirmDialog } = useConfirm();

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Supprimer cet abonné ?',
      variant: 'danger',
      warning: 'Cet abonné sera définitivement retiré de la liste de diffusion.',
      confirmLabel: 'Supprimer',
    });
    if (!confirmed) return;
    try {
      await deleteObject(CLASS_NAME, id);
      setSubscribers((prev) => prev.filter((s) => s.objectId !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleCopy = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const rows = ['email,date_inscription,statut']
      .concat(
        filtered.map(
          (s) =>
            `${s.email},${new Date(s.createdAt).toLocaleDateString('fr-FR')},${s.status}`,
        ),
      )
      .join('\n');
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `newsletter-asfo-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportExcel = () => {
    const header = ['Email', 'Date inscription', 'Statut'];
    const lines = filtered.map((s) => [
      s.email,
      new Date(s.createdAt).toLocaleDateString('fr-FR'),
      s.status,
    ]);
    const csv = [header, ...lines].map((r) => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `newsletter-asfo-${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
  };

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const statCards = [
    {
      label: 'Total abonnés',
      value: stats.total,
      icon: Users,
      light: 'bg-teal-50 text-teal-700',
    },
    {
      label: 'Abonnés actifs',
      value: stats.actif,
      icon: UserCheck,
      light: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Désinscrits',
      value: stats.desinscrit,
      icon: UserX,
      light: 'bg-red-50 text-red-700',
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les abonnés à la newsletter ASFO
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSubscribers}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <FileDown className="h-4 w-4" />
            Exporter CSV
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Exporter Excel
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-3 gap-4">
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
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.light}`}
              >
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
              placeholder="Rechercher par email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1">
            {(['Tous', 'Actif', 'Désinscrit'] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
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
          <span className="ml-3 text-sm text-gray-500">Chargement des abonnés...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 sm:table-cell">
                    Date d'inscription
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Statut
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {paginated.map((s) => (
                    <motion.tr
                      key={s.objectId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group transition-colors hover:bg-teal-50/30"
                    >
                      {/* Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gradient-to-br from-teal-50 to-teal-100">
                            <Mail className="h-4 w-4 text-teal-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{s.email}</span>
                        </div>
                      </td>
                      {/* Date */}
                      <td className="hidden px-5 py-4 sm:table-cell">
                        <span className="text-sm text-gray-500">{fmt(s.createdAt)}</span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge statut={s.status} />
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopy(s.email, s.objectId)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                            title="Copier email"
                          >
                            {copiedId === s.objectId ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-emerald-600">Copié</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                Copier
                              </>
                            )}
                          </button>
                          {s.status === 'Actif' ? (
                            <button
                              onClick={() => handleDeactivate(s.objectId)}
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                              title="Désactiver"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReactivate(s.objectId)}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                              title="Réactiver"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(s.objectId)}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                            title="Supprimer"
                          >
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

          {/* Empty state */}
          {filtered.length === 0 && !loading && (
            <div className="py-16 text-center">
              {subscribers.length === 0 ? (
                <>
                  <Mail className="mx-auto mb-4 h-10 w-10 text-gray-300" />
                  <p className="font-medium text-gray-500">Aucun abonné</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Les abonnés newsletter apparaîtront ici
                  </p>
                </>
              ) : (
                <>
                  <Search className="mx-auto mb-4 h-10 w-10 text-gray-300" />
                  <p className="font-medium text-gray-500">Aucun résultat</p>
                  <p className="mt-1 text-sm text-gray-400">Essayez de modifier vos filtres</p>
                </>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3">
              <p className="text-sm text-gray-500">
                {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      p === page
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {confirmDialog}
    </div>
  );
};

export default AdminNewsletterPage;
