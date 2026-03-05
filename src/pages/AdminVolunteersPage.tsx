import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  HeartHandshake,
  Phone,
  Mail,
  MapPin,
  User,
  Download,
  FileDown,
  Trash2,
  X,
  Briefcase,
  Users,
  Loader2,
  RefreshCw,
  CalendarDays,
  Stethoscope,
  MessageSquareText,
} from 'lucide-react';
import {
  queryObjects,
  updateObject,
  deleteObject,
} from '../lib/parse';
import jsPDF from 'jspdf';

const CLASS_NAME = 'VolunteerRequests';

type Statut = 'En attente' | 'Accepté' | 'Refusé';

interface VolunteerRequest {
  objectId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profile: string;
  speciality: string;
  experience: string;
  motivation: string;
  availability: string;
  workplace: string;
  status: Statut;
  createdAt: string;
}

/* ================================================================
   Label helpers
   ================================================================ */
const profileLabels: Record<string, string> = {
  medical: 'Professionnel de santé',
  student: 'Étudiant en médecine',
  logistics: 'Logistique & Administration',
  'non-medical': 'Bénévole non médical',
  other: 'Autre',
};

const availabilityLabels: Record<string, string> = {
  week: '1 semaine',
  'two-weeks': '2 semaines',
  month: '1 mois',
  more: "Plus d'un mois",
  remote: 'Travail à distance',
  'grand-campagnes': 'Grandes Campagnes',
  'strat-campagnes': 'Strat-Campagnes',
  pedagogique: 'Assistance pédagogique',
  sensibilisation: 'Sensibilisation',
  other: 'Autre',
};

function profileLabel(v: string) {
  return profileLabels[v] ?? v;
}
function availabilityLabel(v: string) {
  return availabilityLabels[v] ?? v;
}

/* ─── Export CSV ─── */
function exportCSV(data: VolunteerRequest[]) {
  const rows = [['Prénom', 'Nom', 'Email', 'Téléphone', 'Profil', 'Spécialité', 'Disponibilité', 'Lieu', 'Statut', 'Date']];
  data.forEach((v) => {
    rows.push([
      v.firstName, v.lastName, v.email, v.phone,
      profileLabel(v.profile), v.speciality || '', availabilityLabel(v.availability),
      v.workplace || '', v.status, new Date(v.createdAt).toLocaleDateString('fr-FR'),
    ]);
  });
  const csv = rows.map((r) => r.join(';')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'benevoles_asfo.csv';
  a.click();
}

/* ─── Export PDF list ─── */
function exportPDFList(data: VolunteerRequest[]) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 297, 22, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('ASFO — Liste des Bénévoles', 148.5, 10, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')} — ${data.length} bénévole(s)`, 148.5, 17, { align: 'center' });

  const headers = ['#', 'Nom', 'Email', 'Tél', 'Profil', 'Spécialité', 'Dispo', 'Lieu', 'Statut'];
  const colX = [8, 16, 62, 115, 152, 185, 220, 247, 275];
  let y = 32;

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  headers.forEach((h, i) => doc.text(h, colX[i], y));
  doc.setDrawColor(200, 200, 200);
  doc.line(8, y + 2, 290, y + 2);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(50, 50, 50);

  data.forEach((v, idx) => {
    if (y > 195) { doc.addPage(); y = 15; }
    doc.text(String(idx + 1), colX[0], y);
    doc.text(`${v.firstName} ${v.lastName}`.slice(0, 28), colX[1], y);
    doc.text((v.email || '').slice(0, 30), colX[2], y);
    doc.text(v.phone || '', colX[3], y);
    doc.text(profileLabel(v.profile).slice(0, 20), colX[4], y);
    doc.text((v.speciality || '—').slice(0, 20), colX[5], y);
    doc.text(availabilityLabel(v.availability).slice(0, 16), colX[6], y);
    doc.text((v.workplace || '—').slice(0, 16), colX[7], y);
    doc.text(v.status, colX[8], y);
    y += 6;
  });

  doc.save('benevoles-asfo.pdf');
}

/* ================================================================
   StatusBadge
   ================================================================ */
const statusConfig: Record<
  Statut,
  { bg: string; text: string; icon: typeof Clock }
> = {
  'En attente': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: Clock },
  Accepté: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: CheckCircle },
  Refusé: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: XCircle },
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
   Drawer (detail panel)
   ================================================================ */
const VolunteerDrawer: React.FC<{
  volunteer: VolunteerRequest | null;
  onClose: () => void;
  onStatusChange: (id: string, status: Statut) => void;
}> = ({ volunteer, onClose, onStatusChange }) => {
  if (!volunteer) return null;

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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-teal-50 to-teal-100 shadow-sm">
              <span className="text-sm font-bold text-teal-600">
                {volunteer.firstName?.[0]}
                {volunteer.lastName?.[0]}
              </span>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {volunteer.firstName} {volunteer.lastName}
              </p>
              <p className="text-sm text-gray-500">{profileLabel(volunteer.profile)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge statut={volunteer.status} />
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
          {/* Contact */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
              <User className="h-4 w-4 text-teal-600" />
              Informations personnelles
            </h4>
            <div className="divide-y divide-gray-200">
              <InfoRow label="Nom" value={`${volunteer.firstName} ${volunteer.lastName}`} />
              <div className="flex items-center gap-1.5 py-2.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-sm font-medium text-teal-700">{volunteer.email}</span>
              </div>
              <div className="flex items-center gap-1.5 py-2.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{volunteer.phone}</span>
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
              <Briefcase className="h-4 w-4 text-teal-600" />
              Profil & compétences
            </h4>
            <div className="divide-y divide-gray-200">
              <InfoRow label="Profil" value={profileLabel(volunteer.profile)} />
              <InfoRow label="Spécialité" value={volunteer.speciality || '—'} />
              <InfoRow label="Disponibilité" value={availabilityLabel(volunteer.availability)} />
              <InfoRow label="Lieu d'exercice" value={volunteer.workplace || '—'} />
            </div>
          </div>

          {/* Experience */}
          {volunteer.experience && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                <Stethoscope className="h-4 w-4 text-teal-600" />
                Expérience humanitaire
              </h4>
              <p className="text-sm leading-relaxed text-gray-600">{volunteer.experience}</p>
            </div>
          )}

          {/* Motivation */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
              <MessageSquareText className="h-4 w-4 text-teal-600" />
              Motivation
            </h4>
            <p className="text-sm leading-relaxed text-gray-600">
              {volunteer.motivation || '—'}
            </p>
          </div>

          {/* Meta */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
              <CalendarDays className="h-4 w-4 text-teal-600" />
              Informations demande
            </h4>
            <div className="divide-y divide-gray-200">
              <InfoRow
                label="Date demande"
                value={new Date(volunteer.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onStatusChange(volunteer.objectId, 'Accepté')}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <CheckCircle className="h-4 w-4" />
              Accepter la candidature
            </button>
            <button
              onClick={() => onStatusChange(volunteer.objectId, 'Refusé')}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <XCircle className="h-4 w-4" />
              Refuser
            </button>
          </div>
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
const AdminVolunteersPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<VolunteerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Statut | 'Tous'>('Tous');
  const [selected, setSelected] = useState<VolunteerRequest | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchVolunteers = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await queryObjects<VolunteerRequest>(CLASS_NAME, {
        order: '-createdAt',
        limit: 500,
      });
      setVolunteers(results);
    } catch (err) {
      console.error('Failed to fetch volunteer requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return volunteers.filter((v) => {
      const fullName = `${v.firstName} ${v.lastName}`.toLowerCase();
      const matchSearch =
        !q ||
        fullName.includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.phone.toLowerCase().includes(q) ||
        (v.profile ?? '').toLowerCase().includes(q) ||
        profileLabel(v.profile).toLowerCase().includes(q);
      const matchStatus = statusFilter === 'Tous' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [volunteers, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = useMemo(() => {
    const total = volunteers.length;
    const enAttente = volunteers.filter((v) => v.status === 'En attente').length;
    const accepte = volunteers.filter((v) => v.status === 'Accepté').length;
    const refuse = volunteers.filter((v) => v.status === 'Refusé').length;
    return { total, enAttente, accepte, refuse };
  }, [volunteers]);

  const handleStatusChange = async (id: string, status: Statut) => {
    try {
      await updateObject(CLASS_NAME, id, { status });
      setVolunteers((prev) =>
        prev.map((v) => (v.objectId === id ? { ...v, status } : v)),
      );
      if (selected?.objectId === id) {
        setSelected((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette candidature bénévole ?')) return;
    try {
      await deleteObject(CLASS_NAME, id);
      setVolunteers((prev) => prev.filter((v) => v.objectId !== id));
      if (selected?.objectId === id) setSelected(null);
    } catch (err) {
      console.error('Delete failed:', err);
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
      label: 'Total candidatures',
      value: stats.total,
      icon: HeartHandshake,
      light: 'bg-teal-50 text-teal-700',
    },
    {
      label: 'En attente',
      value: stats.enAttente,
      icon: Clock,
      light: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Acceptées',
      value: stats.accepte,
      icon: CheckCircle,
      light: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Refusées',
      value: stats.refuse,
      icon: XCircle,
      light: 'bg-red-50 text-red-700',
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demandes bénévoles</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les candidatures de bénévoles ASFO
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchVolunteers}
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
              placeholder="Rechercher par nom, email, profil, téléphone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1">
            {(['Tous', 'En attente', 'Accepté', 'Refusé'] as const).map((s) => (
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
          <span className="ml-3 text-sm text-gray-500">Chargement des candidatures...</span>
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
                    Nom complet
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">
                    Email
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 lg:table-cell">
                    Téléphone
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">
                    Profil
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 xl:table-cell">
                    Spécialité
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 lg:table-cell">
                    Disponibilité
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 xl:table-cell">
                    Lieu
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
                  {paginated.map((v) => (
                    <motion.tr
                      key={v.objectId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group transition-colors hover:bg-teal-50/30"
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 border border-gray-200">
                            <span className="text-xs font-bold text-teal-600">
                              {v.firstName?.[0]}
                              {v.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {v.firstName} {v.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Email */}
                      <td className="hidden px-5 py-4 md:table-cell">
                        <span className="text-sm text-gray-600">{v.email}</span>
                      </td>
                      {/* Phone */}
                      <td className="hidden px-5 py-4 lg:table-cell">
                        <span className="text-sm text-gray-600">{v.phone}</span>
                      </td>
                      {/* Profile */}
                      <td className="hidden px-5 py-4 md:table-cell">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          <Briefcase className="h-3 w-3 text-teal-500" />
                          {profileLabel(v.profile)}
                        </span>
                      </td>
                      {/* Speciality */}
                      <td className="hidden px-5 py-4 xl:table-cell">
                        <p className="max-w-[140px] truncate text-sm text-gray-600">
                          {v.speciality || '—'}
                        </p>
                      </td>
                      {/* Availability */}
                      <td className="hidden px-5 py-4 lg:table-cell">
                        <span className="text-sm text-gray-600">
                          {availabilityLabel(v.availability)}
                        </span>
                      </td>
                      {/* Workplace */}
                      <td className="hidden px-5 py-4 xl:table-cell">
                        <p className="max-w-[140px] truncate text-sm text-gray-600">
                          {v.workplace || '—'}
                        </p>
                      </td>
                      {/* Date */}
                      <td className="hidden px-5 py-4 sm:table-cell">
                        <span className="text-sm text-gray-500">{fmt(v.createdAt)}</span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge statut={v.status} />
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelected(v)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Profil
                          </button>
                          {v.status === 'En attente' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(v.objectId, 'Accepté')}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                title="Accepter"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(v.objectId, 'Refusé')}
                                className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                                title="Refuser"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(v.objectId)}
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
              {volunteers.length === 0 ? (
                <>
                  <Users className="mx-auto mb-4 h-10 w-10 text-gray-300" />
                  <p className="font-medium text-gray-500">Aucune candidature reçue</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Les candidatures bénévoles apparaîtront ici
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
          <VolunteerDrawer
            volunteer={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminVolunteersPage;
