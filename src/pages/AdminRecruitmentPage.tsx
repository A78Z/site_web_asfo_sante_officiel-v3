import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Star,
  Users,
  X,
} from 'lucide-react';
import jsPDF from 'jspdf';
import {
  addApplicationComment,
  listApplications,
  listSpecialtySettings,
  notifyApplicant,
  setApplicationStatus,
  setSpecialtyOpen,
  type RecruitmentApplication,
  type RecruitmentSpecialtyState,
  type RecruitmentStats,
} from '../lib/adminRecruitment';
import {
  EMAIL_NOTIFICATIONS_ENABLED,
  RECRUITMENT_CAMPAIGN,
  RECRUITMENT_STATUSES,
  SELECTED_STATUSES,
  SPECIALTIES,
} from '../../api/_lib/recruitment.js';
import { ToastStack } from '../components/ui/Toast';
import { useToasts } from '../components/ui/useToasts';

type TabId = 'dashboard' | 'applications' | 'stats' | 'selected' | 'exports' | 'settings';

const TABS: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'applications', label: 'Candidatures', icon: ClipboardList },
  { id: 'stats', label: 'Statistiques', icon: BarChart3 },
  { id: 'selected', label: 'Professionnels retenus', icon: Star },
  { id: 'exports', label: 'Exports', icon: Download },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

const STATUS_STYLES: Record<string, string> = {
  'En attente': 'bg-amber-50 text-amber-700 border-amber-200',
  'Présélectionné': 'bg-sky-50 text-sky-700 border-sky-200',
  'Accepté': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Refusé': 'bg-red-50 text-red-700 border-red-200',
  'Liste d’attente': 'bg-slate-100 text-slate-600 border-slate-200',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
      STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600 border-slate-200'
    }`}
  >
    {status}
  </span>
);

const formatDate = (value?: string | { __type: 'Date'; iso: string }) => {
  const iso = typeof value === 'string' ? value : value?.iso;
  if (!iso) return '—';
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
};

const formatBirth = (iso?: string) => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '—';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
};

/* ─── Exports ─── */
const escapeCsv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

function exportCSV(rows: RecruitmentApplication[]) {
  const header = [
    'Référence', 'Nom', 'Prénom', 'Sexe', 'Date de naissance', 'Téléphone', 'Email',
    'Adresse', 'Région', 'Département', 'Profession', 'N° Ordre', 'Université',
    'Expérience', 'Employeur', 'Disponibilité', 'Statut', 'Déposée le',
  ];
  const lines = rows.map((row) => [
    row.reference, row.lastName, row.firstName, row.gender ?? '', formatBirth(row.birthDate),
    row.phone, row.email, row.address ?? '', row.region ?? '', row.department ?? '',
    row.profession, row.orderNumber ?? '', row.university ?? '', row.experience ?? '',
    row.employer ?? '', row.availability ?? '', row.status,
    new Date(row.createdAt).toLocaleDateString('fr-FR'),
  ]);
  const csv = [header, ...lines].map((line) => line.map(escapeCsv).join(';')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `recrutement-asfo-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportPDF(rows: RecruitmentApplication[], title: string) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 297, 22, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(`ASFO — ${title}`, 148, 11, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `${RECRUITMENT_CAMPAIGN} — exporté le ${new Date().toLocaleDateString('fr-FR')} — ${rows.length} dossier(s)`,
    148,
    17,
    { align: 'center' },
  );

  const columns = ['Réf.', 'Nom & prénom', 'Profession', 'Téléphone', 'Région', 'Exp.', 'Statut'];
  const positions = [10, 42, 105, 160, 195, 232, 248];

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  let y = 32;
  columns.forEach((column, index) => doc.text(column, positions[index], y));
  doc.setDrawColor(200, 200, 200);
  doc.line(10, y + 2, 287, y + 2);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  rows.forEach((row) => {
    if (y > 195) {
      doc.addPage();
      y = 18;
    }
    const cells = [
      row.reference ?? '',
      `${row.lastName ?? ''} ${row.firstName ?? ''}`.slice(0, 34),
      (row.profession ?? '').slice(0, 28),
      row.phone ?? '',
      (row.region ?? '').slice(0, 18),
      String(row.experience ?? ''),
      row.status ?? '',
    ];
    cells.forEach((cell, index) => doc.text(cell, positions[index], y));
    y += 6;
  });

  doc.save(`recrutement-asfo-${new Date().toISOString().slice(0, 10)}.pdf`);
}

/* ─── Cartes de statistiques ─── */
const StatCard: React.FC<{
  label: string;
  value: number | string;
  icon: React.ElementType;
  tone?: string;
}> = ({ label, value, icon: Icon, tone = 'bg-teal-50 text-teal-700' }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4">
    <div className="flex items-center justify-between">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
  </div>
);

/** Répartition simple, lisible sans dépendance graphique. */
const Distribution: React.FC<{ title: string; data: Record<string, number>; limit?: number }> = ({
  title,
  data,
  limit = 8,
}) => {
  const entries = Object.entries(data)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
  const max = Math.max(1, ...entries.map(([, count]) => count));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-gray-400">Aucune donnée pour le moment.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {entries.map(([label, count]) => (
            <li key={label}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="font-bold text-gray-900">{count}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-teal-500"
                  style={{ width: `${Math.round((count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ─── Fiche détaillée ─── */
const ApplicationDrawer: React.FC<{
  application: RecruitmentApplication;
  onClose: () => void;
  onChanged: () => void;
  notify: (tone: 'success' | 'error', text: string) => void;
}> = ({ application, onClose, onChanged, notify }) => {
  const [busy, setBusy] = useState('');
  const [comment, setComment] = useState(application.comments ?? '');

  const run = async (key: string, action: () => Promise<{ message: string }>) => {
    setBusy(key);
    try {
      const result = await action();
      notify('success', result.message);
      onChanged();
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'L’opération a échoué.');
    } finally {
      setBusy('');
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-sm text-gray-500">{label}</span>
      <span className="min-w-0 break-words text-right text-sm font-medium text-gray-900">
        {value || '—'}
      </span>
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
        transition={{ type: 'spring', damping: 30, stiffness: 260 }}
        onClick={(event) => event.stopPropagation()}
        className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-gray-200 px-6 py-5">
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold text-teal-700">{application.reference}</p>
            <h2 className="mt-1 truncate text-lg font-black text-gray-900">
              {application.firstName} {application.lastName}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={application.status} />
              <span className="text-xs text-gray-500">{application.profession}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer la fiche"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {application.photoFile?.url && (
            <div className="mb-6 flex justify-center">
              <img
                src={application.photoFile.url}
                alt={`${application.firstName} ${application.lastName}`}
                className="h-56 w-44 rounded-2xl border border-gray-200 object-cover shadow"
              />
            </div>
          )}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
              <Users className="h-4 w-4 text-teal-600" aria-hidden="true" /> Identité
            </h3>
            <div className="divide-y divide-gray-200">
              <InfoRow label="Sexe" value={application.gender} />
              <InfoRow label="Date de naissance" value={formatBirth(application.birthDate)} />
              <InfoRow label="Téléphone" value={application.phone} />
              <InfoRow label="Email" value={application.email} />
              <InfoRow label="Adresse" value={application.address} />
              <InfoRow
                label="Région / Département"
                value={[application.region, application.department].filter(Boolean).join(' · ')}
              />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
              <GraduationCap className="h-4 w-4 text-teal-600" aria-hidden="true" /> Profil professionnel
            </h3>
            <div className="divide-y divide-gray-200">
              <InfoRow label="Profession" value={application.profession} />
              <InfoRow label="N° Ordre" value={application.orderNumber} />
              <InfoRow label="Université" value={application.university} />
              <InfoRow label="Expérience" value={`${application.experience ?? 0} an(s)`} />
              <InfoRow label="Employeur" value={application.employer} />
              <InfoRow label="Disponibilité" value={application.availability} />
            </div>
          </div>

          {application.motivation && (
            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-bold text-gray-800">Motivation</h3>
              <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
                {application.motivation}
              </p>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-bold text-gray-800">Contact d’urgence</h3>
            <div className="divide-y divide-gray-200">
              <InfoRow label="Personne" value={application.emergencyContactName} />
              <InfoRow label="Téléphone" value={application.emergencyContactPhone} />
            </div>
          </div>

          {/* Pièces jointes */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { file: application.cvFile, label: 'CV', icon: FileText },
              { file: application.diplomaFile, label: 'Diplôme', icon: GraduationCap },
            ].map(({ file, label, icon: Icon }) => (
              <a
                key={label}
                href={file?.url ?? '#'}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!file?.url}
                className={`flex items-center gap-3 rounded-xl border p-4 transition ${
                  file?.url
                    ? 'border-teal-200 bg-teal-50/60 hover:bg-teal-50'
                    : 'pointer-events-none border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${file?.url ? 'text-teal-700' : 'text-gray-400'}`}
                  aria-hidden="true"
                />
                <span className="flex-1">
                  <span className="block text-sm font-bold text-gray-900">{label}</span>
                  {/* Les pièces sont facultatives au dépôt : l’absence doit se
                      lire d’un coup d’œil pour être réclamée à l’instruction. */}
                  {!file?.url && (
                    <span className="block text-xs font-semibold text-amber-600">
                      Non fourni — à réclamer
                    </span>
                  )}
                </span>
                {file?.url && (
                  <ExternalLink className="h-4 w-4 text-gray-400" aria-hidden="true" />
                )}
              </a>
            ))}
          </div>

          {!application.photoFile?.url && (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700">
              Photo d’identité non fournie — à réclamer avant l’édition du badge.
            </p>
          )}

          {/* Historique */}
          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-bold text-gray-800">Historique</h3>
            <ol className="space-y-2 text-xs text-gray-600">
              <li className="flex justify-between gap-3">
                <span>Candidature déposée</span>
                <span className="text-gray-400">{formatDate(application.createdAt)}</span>
              </li>
              {(application.history ?? []).slice().reverse().map((entry, index) => (
                <li key={`${entry.at}-${index}`} className="flex justify-between gap-3">
                  <span>
                    {entry.type === 'decision'
                      ? `Décision : ${entry.from || '—'} → ${entry.to}`
                      : entry.type === 'comment'
                        ? 'Commentaire ajouté'
                        : `Notification ${entry.type.replace('notify_', '')} — ${entry.result}`}
                    <span className="text-gray-400"> · {entry.by}</span>
                  </span>
                  <span className="shrink-0 text-gray-400">{formatDate(entry.at)}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Commentaire interne */}
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
            <label htmlFor="comment" className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
              <MessageSquare className="h-4 w-4 text-teal-600" aria-hidden="true" /> Commentaire interne
            </label>
            <textarea
              id="comment"
              rows={3}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Note de la commission — jamais envoyée au candidat."
              className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
            />
            <button
              type="button"
              disabled={busy === 'comment' || comment.trim().length < 2}
              onClick={() => run('comment', () => addApplicationComment(application.objectId, comment))}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              {busy === 'comment' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Enregistrer le commentaire
            </button>
          </div>
        </div>

        {/* Actions */}
        <footer className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Décision</p>
          <div className="flex flex-wrap gap-2">
            {RECRUITMENT_STATUSES.filter((status: string) => status !== application.status).map(
              (status: string) => (
                <button
                  key={status}
                  type="button"
                  disabled={busy === status}
                  onClick={() =>
                    run(status, () => setApplicationStatus(application.objectId, status))
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${
                    STATUS_STYLES[status] ?? 'border-gray-200 text-gray-700'
                  } hover:brightness-95`}
                >
                  {busy === status ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {status}
                </button>
              ),
            )}
          </div>

          <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide text-gray-500">
            Notifier le candidat
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy === 'sms'}
              onClick={() => run('sms', () => notifyApplicant(application.objectId, 'sms'))}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-teal-700 disabled:opacity-50"
            >
              {busy === 'sms' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Notifier par SMS
            </button>
            {EMAIL_NOTIFICATIONS_ENABLED ? (
              <button
                type="button"
                disabled={busy === 'email'}
                onClick={() => run('email', () => notifyApplicant(application.objectId, 'email'))}
                className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-white px-3 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-50 disabled:opacity-50"
              >
                {busy === 'email' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                Notifier par e-mail
              </button>
            ) : (
              // Le service d’envoi n’est pas encore configuré : le bouton est
              // désactivé plutôt que masqué, pour que la commission sache que
              // le canal existe et arrive.
              <span
                title="La notification par e-mail sera activée une fois le service d’envoi configuré."
                className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-400"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                E-mail — bientôt disponible
              </span>
            )}
            <button
              type="button"
              onClick={() => exportPDF([application], `Dossier ${application.reference}`)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" /> Télécharger le dossier
            </button>
          </div>
        </footer>
      </motion.aside>
    </motion.div>
  );
};

/* ─── Page ─── */
const AdminRecruitmentPage: React.FC = () => {
  const [tab, setTab] = useState<TabId>('dashboard');
  const [applications, setApplications] = useState<RecruitmentApplication[]>([]);
  const [stats, setStats] = useState<RecruitmentStats | null>(null);
  const [specialtyStates, setSpecialtyStates] = useState<RecruitmentSpecialtyState[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [specialtyFilter, setSpecialtyFilter] = useState('Toutes');
  const [regionFilter, setRegionFilter] = useState('Toutes');
  const [departmentFilter, setDepartmentFilter] = useState('Tous');
  const [selected, setSelected] = useState<RecruitmentApplication | null>(null);
  const [togglingSlug, setTogglingSlug] = useState('');
  const { toasts, pushToast, dismissToast } = useToasts();

  const notify = useCallback(
    (tone: 'success' | 'error', text: string) => {
      pushToast({ variant: tone, message: text });
    },
    [pushToast],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const result = await listApplications();
      setApplications(result.applications);
      setStats(result.stats);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : 'Les candidatures n’ont pas pu être chargées.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const result = await listSpecialtySettings();
      setSpecialtyStates(result.specialties);
    } catch {
      // Les paramètres restent affichés avec les valeurs par défaut du catalogue.
      setSpecialtyStates(
        SPECIALTIES.map((item: (typeof SPECIALTIES)[number]) => ({
          ...item,
          open: item.defaultOpen,
          updatedAt: null,
          updatedBy: null,
        })),
      );
    }
  }, []);

  useEffect(() => {
    document.title = 'Recrutement médical | Administration ASFO';
    void load();
    void loadSettings();
  }, [load, loadSettings]);

  // La fiche ouverte suit la liste rechargée : après une décision, elle montre
  // l’état réellement enregistré.
  useEffect(() => {
    setSelected((current) =>
      current
        ? applications.find((item) => item.objectId === current.objectId) ?? current
        : current,
    );
  }, [applications]);

  const regions = useMemo(
    () => [...new Set(applications.map((item) => item.region).filter(Boolean))].sort() as string[],
    [applications],
  );
  const departments = useMemo(
    () =>
      [...new Set(applications.map((item) => item.department).filter(Boolean))].sort() as string[],
    [applications],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return applications.filter((item) => {
      const haystack = [
        item.reference, item.firstName, item.lastName, item.phone, item.email,
        item.profession, item.region, item.department, item.orderNumber, item.university,
      ]
        .join(' ')
        .toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (statusFilter !== 'Tous' && item.status !== statusFilter) return false;
      if (specialtyFilter !== 'Toutes' && item.specialty !== specialtyFilter) return false;
      if (regionFilter !== 'Toutes' && item.region !== regionFilter) return false;
      if (departmentFilter !== 'Tous' && item.department !== departmentFilter) return false;
      return true;
    });
  }, [applications, search, statusFilter, specialtyFilter, regionFilter, departmentFilter]);

  const selectedProfessionals = useMemo(
    () => applications.filter((item) => SELECTED_STATUSES.includes(item.status)),
    [applications],
  );

  const toggleSpecialty = async (slug: string, open: boolean) => {
    setTogglingSlug(slug);
    try {
      const result = await setSpecialtyOpen(slug, open);
      setSpecialtyStates(result.specialties);
      notify('success', result.message);
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Le paramètre n’a pas pu être enregistré.');
    } finally {
      setTogglingSlug('');
    }
  };

  const ApplicationsTable: React.FC<{ rows: RecruitmentApplication[] }> = ({ rows }) => (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Référence</th>
            <th className="px-4 py-3 font-semibold">Candidat</th>
            <th className="px-4 py-3 font-semibold">Profession</th>
            <th className="px-4 py-3 font-semibold">Localisation</th>
            <th className="px-4 py-3 font-semibold">Déposée le</th>
            <th className="px-4 py-3 font-semibold">Statut</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.objectId} className="transition hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs font-bold text-teal-700">
                {row.reference}
              </td>
              <td className="px-4 py-3">
                <p className="font-semibold text-gray-900">
                  {row.lastName} {row.firstName}
                </p>
                <p className="text-xs text-gray-500">{row.phone}</p>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.profession}</td>
              <td className="px-4 py-3 text-xs text-gray-600">
                {[row.region, row.department].filter(Boolean).join(' · ') || '—'}
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">
                {new Date(row.createdAt).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => setSelected(row)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Ouvrir
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                Aucune candidature ne correspond à ces critères.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/60 p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              Recrutement médical
            </h1>
            <p className="mt-1 text-sm text-gray-500">{RECRUITMENT_CAMPAIGN}</p>
          </div>
          <button
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Actualiser
          </button>
        </div>

        <nav className="mt-5 flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              aria-current={tab === item.id ? 'page' : undefined}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                tab === item.id
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {loadError && (
        <p
          role="alert"
          className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {loadError}
        </p>
      )}

      {loading && applications.length === 0 ? (
        <p className="inline-flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Chargement des candidatures…
        </p>
      ) : (
        <>
          {/* ─── Tableau de bord ─── */}
          {tab === 'dashboard' && stats && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Candidatures" value={stats.total} icon={ClipboardList} />
                <StatCard label="Aujourd’hui" value={stats.today} icon={Clock} tone="bg-sky-50 text-sky-700" />
                <StatCard label="Cette semaine" value={stats.thisWeek} icon={Clock} tone="bg-indigo-50 text-indigo-700" />
                <StatCard label="Ce mois" value={stats.thisMonth} icon={Clock} tone="bg-violet-50 text-violet-700" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {RECRUITMENT_STATUSES.map((status: string) => (
                  <StatCard
                    key={status}
                    label={status}
                    value={stats.byStatus[status] ?? 0}
                    icon={status === 'Accepté' ? CheckCircle2 : Users}
                    tone={
                      status === 'Accepté'
                        ? 'bg-emerald-50 text-emerald-700'
                        : status === 'Refusé'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                    }
                  />
                ))}
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <Distribution title="Par spécialité" data={stats.bySpecialty} />
                <Distribution title="Par région" data={stats.byRegion} />
              </div>
            </div>
          )}

          {/* ─── Candidatures ─── */}
          {tab === 'applications' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[220px] flex-1">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Rechercher : nom, référence, téléphone, université…"
                      aria-label="Rechercher une candidature"
                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
                    />
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                    {filtered.length} / {applications.length}
                  </span>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <select
                    aria-label="Filtrer par statut"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option>Tous</option>
                    {RECRUITMENT_STATUSES.map((status: string) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <select
                    aria-label="Filtrer par profession"
                    value={specialtyFilter}
                    onChange={(event) => setSpecialtyFilter(event.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option value="Toutes">Toutes les professions</option>
                    {SPECIALTIES.map((item: (typeof SPECIALTIES)[number]) => (
                      <option key={item.slug} value={item.slug}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Filtrer par région"
                    value={regionFilter}
                    onChange={(event) => setRegionFilter(event.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option value="Toutes">Toutes les régions</option>
                    {regions.map((region) => (
                      <option key={region}>{region}</option>
                    ))}
                  </select>
                  <select
                    aria-label="Filtrer par département"
                    value={departmentFilter}
                    onChange={(event) => setDepartmentFilter(event.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option value="Tous">Tous les départements</option>
                    {departments.map((department) => (
                      <option key={department}>{department}</option>
                    ))}
                  </select>
                </div>
              </div>

              <ApplicationsTable rows={filtered} />
            </div>
          )}

          {/* ─── Statistiques ─── */}
          {tab === 'stats' && stats && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Distribution title="Par spécialité" data={stats.bySpecialty} limit={20} />
              <Distribution title="Par statut" data={stats.byStatus} limit={10} />
              <Distribution title="Par région" data={stats.byRegion} limit={14} />
              <Distribution title="Par département" data={stats.byDepartment} limit={14} />
            </div>
          )}

          {/* ─── Professionnels retenus ─── */}
          {tab === 'selected' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  {selectedProfessionals.length} professionnel(s) retenu(s)
                </p>
                <p className="mt-1 text-xs text-emerald-700">
                  Dossiers aux statuts « Accepté » et « Présélectionné ».
                </p>
              </div>
              <ApplicationsTable rows={selectedProfessionals} />
            </div>
          )}

          {/* ─── Exports ─── */}
          {tab === 'exports' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Toutes les candidatures',
                  rows: applications,
                  description: 'L’intégralité des dossiers reçus, tous statuts confondus.',
                },
                {
                  title: 'Sélection filtrée',
                  rows: filtered,
                  description: 'Les dossiers correspondant aux filtres de l’onglet Candidatures.',
                },
                {
                  title: 'Professionnels retenus',
                  rows: selectedProfessionals,
                  description: 'Les dossiers acceptés ou présélectionnés.',
                },
              ].map((block) => (
                <div key={block.title} className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-bold text-gray-900">{block.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{block.description}</p>
                  <p className="mt-3 text-2xl font-black text-gray-900">{block.rows.length}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => exportCSV(block.rows)}
                      disabled={block.rows.length === 0}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FileDown className="h-3.5 w-3.5" aria-hidden="true" /> Export Excel (CSV)
                    </button>
                    <button
                      onClick={() => exportPDF(block.rows, block.title)}
                      disabled={block.rows.length === 0}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Export PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Paramètres ─── */}
          {tab === 'settings' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="text-sm font-bold text-gray-900">
                  Ouverture des inscriptions par spécialité
                </h2>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  L’état est enregistré en base : ouvrir une spécialité la rend
                  immédiatement candidatable sur le site public, sans intervention
                  technique. Le serveur refuse toute candidature à une spécialité fermée.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {specialtyStates.map((item) => (
                  <div
                    key={item.slug}
                    className={`rounded-xl border p-4 transition ${
                      item.open ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span aria-hidden="true" className="text-xl">
                        {item.emoji}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                          item.open ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.open ? 'Ouvert' : 'Fermé'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-gray-900">{item.label}</p>
                    {item.updatedBy && (
                      <p className="mt-1 text-[11px] text-gray-400">
                        Modifié par {item.updatedBy}
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={togglingSlug === item.slug}
                      onClick={() => void toggleSpecialty(item.slug, !item.open)}
                      className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${
                        item.open
                          ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                          : 'bg-teal-600 text-white hover:bg-teal-700'
                      }`}
                    >
                      {togglingSlug === item.slug ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {item.open ? 'Fermer les inscriptions' : 'Ouvrir les inscriptions'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <MapPin className="h-4 w-4 text-teal-600" aria-hidden="true" /> Page publique
                </h3>
                <a
                  href="/recrutement-medical"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:underline"
                >
                  Voir la page de recrutement
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {selected && (
          <ApplicationDrawer
            application={selected}
            onClose={() => setSelected(null)}
            onChanged={() => void load()}
            notify={notify}
          />
        )}
      </AnimatePresence>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default AdminRecruitmentPage;
