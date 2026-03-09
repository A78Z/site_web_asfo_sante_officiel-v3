import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Eye,
  Clock,
  CheckCircle,
  Mail,
  MailOpen,
  MessageSquare,
  User,
  Download,
  FileDown,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  CalendarDays,
  Inbox,
} from 'lucide-react';
import { queryObjects, updateObject, deleteObject } from '../lib/parse';
import jsPDF from 'jspdf';

const CLASS_NAME = 'ContactMessages';

type Statut = 'Nouveau' | 'Lu' | 'Traité';

interface ContactMessage {
  objectId: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: Statut;
  createdAt: string;
}

/* ================================================================
   Subject label helper
   ================================================================ */
const subjectLabels: Record<string, string> = {
  information: "Demande d'informations",
  benevole: 'Devenir bénévole',
  partenariat: 'Proposition de partenariat',
  don: 'Faire un don',
  autre: 'Autre',
};

function subjectLabel(v: string) {
  return subjectLabels[v] ?? (v || '—');
}

/* ─── Export CSV ─── */
function exportCSV(data: ContactMessage[]) {
  const rows = [['Nom', 'Email', 'Téléphone', 'Sujet', 'Message', 'Statut', 'Date']];
  data.forEach((m) => {
    rows.push([
      m.name,
      m.email,
      m.phone || '',
      subjectLabel(m.subject),
      m.message.replace(/[\r\n]+/g, ' '),
      m.status,
      new Date(m.createdAt).toLocaleDateString('fr-FR'),
    ]);
  });
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(';')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'messages_asfo.csv';
  a.click();
}

/* ─── Export PDF list ─── */
function exportPDFList(data: ContactMessage[]) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 297, 22, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('ASFO — Messages reçus', 148.5, 10, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Exporté le ${new Date().toLocaleDateString('fr-FR')} — ${data.length} message(s)`,
    148.5,
    17,
    { align: 'center' },
  );

  const headers = ['#', 'Nom', 'Email', 'Sujet', 'Aperçu message', 'Statut', 'Date'];
  const colX = [8, 16, 60, 115, 160, 255, 275];
  let y = 32;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  headers.forEach((h, i) => doc.text(h, colX[i], y));
  doc.setDrawColor(200, 200, 200);
  doc.line(8, y + 2, 290, y + 2);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(50, 50, 50);

  data.forEach((m, idx) => {
    if (y > 195) {
      doc.addPage();
      y = 15;
    }
    doc.text(String(idx + 1), colX[0], y);
    doc.text(m.name.slice(0, 26), colX[1], y);
    doc.text((m.email || '').slice(0, 32), colX[2], y);
    doc.text(subjectLabel(m.subject).slice(0, 26), colX[3], y);
    doc.text(m.message.replace(/[\r\n]+/g, ' ').slice(0, 55), colX[4], y);
    doc.text(m.status, colX[5], y);
    doc.text(new Date(m.createdAt).toLocaleDateString('fr-FR'), colX[6], y);
    y += 6;
  });

  doc.save('messages-asfo.pdf');
}

/* ================================================================
   StatusBadge
   ================================================================ */
const statusConfig: Record<
  Statut,
  { bg: string; text: string; icon: typeof Clock }
> = {
  Nouveau: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: Mail },
  Lu: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: MailOpen },
  Traité: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: CheckCircle },
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
   Drawer (message detail)
   ================================================================ */
const MessageDrawer: React.FC<{
  msg: ContactMessage | null;
  onClose: () => void;
  onStatusChange: (id: string, status: Statut) => void;
}> = ({ msg, onClose, onStatusChange }) => {
  if (!msg) return null;

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-medium text-gray-900">{value}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{msg.name}</p>
              <p className="text-sm text-gray-500">{msg.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge statut={msg.status} />
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Contact info */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
              <User className="h-4 w-4 text-teal-600" />
              Expéditeur
            </h4>
            <div className="divide-y divide-gray-200">
              <InfoRow label="Nom" value={msg.name} />
              <div className="flex items-center gap-1.5 py-2.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-sm font-medium text-teal-700">{msg.email}</span>
              </div>
              {msg.phone && <InfoRow label="Téléphone" value={msg.phone} />}
              <InfoRow label="Sujet" value={subjectLabel(msg.subject)} />
              <InfoRow
                label="Date"
                value={new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
            </div>
          </div>

          {/* Message body */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
              <MessageSquare className="h-4 w-4 text-teal-600" />
              Message
            </h4>
            <div className="rounded-lg bg-white border border-gray-100 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {msg.message}
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onStatusChange(msg.objectId, 'Lu')}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              <MailOpen className="h-4 w-4" />
              Marquer comme lu
            </button>
            <button
              onClick={() => onStatusChange(msg.objectId, 'Traité')}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <CheckCircle className="h-4 w-4" />
              Marquer comme traité
            </button>
          </div>
          <a
            href={`mailto:${msg.email}?subject=Re: ${subjectLabel(msg.subject)}`}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <Mail className="h-4 w-4" />
            Répondre par email
          </a>
          <button
            onClick={onClose}
            className="mt-3 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Fermer
          </button>
        </div>
      </motion.aside>
    </motion.div>
  );
};

/* ================================================================
   Main Page
   ================================================================ */
const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Statut | 'Tous'>('Tous');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await queryObjects<ContactMessage>(CLASS_NAME, {
        order: '-createdAt',
        limit: 500,
      });
      setMessages(results);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return messages.filter((m) => {
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.phone ?? '').toLowerCase().includes(q) ||
        (m.subject ?? '').toLowerCase().includes(q) ||
        subjectLabel(m.subject).toLowerCase().includes(q);
      const matchStatus = statusFilter === 'Tous' || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [messages, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = useMemo(() => {
    const total = messages.length;
    const nouveau = messages.filter((m) => m.status === 'Nouveau').length;
    const lu = messages.filter((m) => m.status === 'Lu').length;
    const traite = messages.filter((m) => m.status === 'Traité').length;
    return { total, nouveau, lu, traite };
  }, [messages]);

  const handleStatusChange = async (id: string, status: Statut) => {
    try {
      await updateObject(CLASS_NAME, id, { status });
      setMessages((prev) =>
        prev.map((m) => (m.objectId === id ? { ...m, status } : m)),
      );
      if (selected?.objectId === id) {
        setSelected((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce message ?')) return;
    try {
      await deleteObject(CLASS_NAME, id);
      setMessages((prev) => prev.filter((m) => m.objectId !== id));
      if (selected?.objectId === id) setSelected(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleOpen = (m: ContactMessage) => {
    setSelected(m);
    if (m.status === 'Nouveau') {
      handleStatusChange(m.objectId, 'Lu');
    }
  };

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const statCards = [
    {
      label: 'Total messages',
      value: stats.total,
      icon: Inbox,
      light: 'bg-teal-50 text-teal-700',
    },
    {
      label: 'Nouveaux',
      value: stats.nouveau,
      icon: Mail,
      light: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Lus',
      value: stats.lu,
      icon: MailOpen,
      light: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Traités',
      value: stats.traite,
      icon: CheckCircle,
      light: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages reçus</h1>
          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les messages envoyés via le formulaire de contact
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchMessages}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button onClick={() => exportCSV(filtered)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <FileDown className="h-4 w-4" />
            Exporter Excel
          </button>
          <button onClick={() => exportPDFList(filtered)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Exporter PDF
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
              placeholder="Rechercher par nom, email, sujet..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1">
            {(['Tous', 'Nouveau', 'Lu', 'Traité'] as const).map((s) => (
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
          <span className="ml-3 text-sm text-gray-500">Chargement des messages...</span>
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
                    Nom
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">
                    Email
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 lg:table-cell">
                    Sujet
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">
                    Message
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 sm:table-cell">
                    Date
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
                  {paginated.map((m) => (
                    <motion.tr
                      key={m.objectId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`group transition-colors hover:bg-teal-50/30 ${
                        m.status === 'Nouveau' ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100">
                            {m.status === 'Nouveau' ? (
                              <Mail className="h-4 w-4 text-blue-600" />
                            ) : (
                              <MailOpen className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className={`text-sm text-gray-900 ${m.status === 'Nouveau' ? 'font-bold' : 'font-semibold'}`}>
                              {m.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Email */}
                      <td className="hidden px-5 py-4 md:table-cell">
                        <span className="text-sm text-gray-600">{m.email}</span>
                      </td>
                      {/* Subject */}
                      <td className="hidden px-5 py-4 lg:table-cell">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {subjectLabel(m.subject)}
                        </span>
                      </td>
                      {/* Message preview */}
                      <td className="hidden px-5 py-4 md:table-cell">
                        <p className="max-w-[220px] truncate text-sm text-gray-500">
                          {m.message}
                        </p>
                      </td>
                      {/* Date */}
                      <td className="hidden px-5 py-4 sm:table-cell">
                        <span className="text-sm text-gray-500">{fmt(m.createdAt)}</span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge statut={m.status} />
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpen(m)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Lire
                          </button>
                          {m.status !== 'Traité' && (
                            <button
                              onClick={() => handleStatusChange(m.objectId, 'Traité')}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                              title="Marquer comme traité"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(m.objectId)}
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
              {messages.length === 0 ? (
                <>
                  <Inbox className="mx-auto mb-4 h-10 w-10 text-gray-300" />
                  <p className="font-medium text-gray-500">Aucun message reçu</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Les messages du formulaire de contact apparaîtront ici
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

      {/* Drawer */}
      <AnimatePresence>
        {selected && (
          <MessageDrawer
            msg={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessagesPage;
