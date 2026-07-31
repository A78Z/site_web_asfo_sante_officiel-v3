import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Phone,
  MapPin,
  User,
  Download,
  FileDown,
  Trash2,
  X,
  Heart,
  Users,
  Loader2,
  RefreshCw,
  FileText,
  Wallet,
} from 'lucide-react';
import {
  queryObjects,
  updateObject,
  type ParseFile,
} from '../lib/parse';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ReminderComposer from '../components/admin/ReminderComposer';
import CardStateDialog from '../components/admin/CardStateDialog';
import { CARD_STATE_ORDER, CARD_STATES } from '../../api/_lib/card-lifecycle.js';
import { formatBirthDate } from '../../api/_lib/member-request-validation.js';
import { ToastStack } from '../components/ui/Toast';
import { useToasts } from '../components/ui/useToasts';
import {
  archiveMemberRequest,
  restoreMemberRequest,
} from '../lib/memberRequestArchive';
import jsPDF from 'jspdf';
import MemberCard from '../components/admin/MemberCard';
import MemberCardVerso from '../components/admin/MemberCardVerso';
import { generateMemberId } from '../utils/memberId';
import { MEMBER_PROFESSION_LABELS } from '../data/memberProfessions';

const CLASS_NAME = 'MemberRequests';

type Statut = 'En attente' | 'Validé' | 'Refusé';

/** Statut posé par l’archivage réversible ; ces demandes sont masquées. */
const ARCHIVED_STATUS = 'Supprimé';

interface MemberRequest {
  objectId: string;
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  professionAutre?: string;
  phone: string;
  village: string;
  /** Nouveaux champs d’état civil (demandes récentes uniquement). */
  lieuNaissance?: string;
  dateNaissance?: string;
  photo?: ParseFile;
  status: Statut;
  createdAt: string;
  /** Cycle de vie de la carte, distinct du statut de la demande. */
  cardState?: string | null;
  pickupLocation?: string;
  pickupDate?: string;
  pickupHours?: string;
  lastReminderAt?: string | { __type: 'Date'; iso: string };
  smsConfirmationStatus?:
    | 'pending'
    | 'sent'
    | 'failed'
    | 'non_envoye_numero_invalide';
  smsConfirmationSentAt?: string | { __type: 'Date'; iso: string };
  smsConfirmationError?: string;
  smsConfirmationProviderId?: string;
}

/* ─── StatusBadge ─── */
const statusConfig: Record<Statut, { bg: string; text: string; icon: typeof Clock }> = {
  'En attente': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: Clock },
  Validé: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: CheckCircle },
  Refusé: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: XCircle },
};

const StatusBadge: React.FC<{ statut: Statut }> = ({ statut }) => {
  const cfg = statusConfig[statut];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <Icon className="h-3 w-3" />
      {statut}
    </span>
  );
};

/* ─── Profession helper ─── */
function displayProfession(member: Pick<MemberRequest, 'profession' | 'professionAutre'>) {
  const profession = (member.profession ?? '').trim();
  if (profession.toLocaleLowerCase('fr') === 'autre') {
    return member.professionAutre?.trim() || 'Autre — non précisé';
  }
  return MEMBER_PROFESSION_LABELS[profession] ?? (profession || 'Non renseignée');
}

const smsStatusLabels: Record<
  NonNullable<MemberRequest['smsConfirmationStatus']>,
  string
> = {
  pending: 'En attente d’envoi',
  sent: 'Envoyé',
  failed: 'Échec de l’envoi',
  non_envoye_numero_invalide: 'Non envoyé — numéro invalide',
};

const formatSmsDate = (value?: MemberRequest['smsConfirmationSentAt']) => {
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

/* ─── Generate member card PDF via browser print (pixel-perfect) ─── */
function openPrintableCard(rectoEl: HTMLElement, versoEl: HTMLElement, memberName: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les popups pour générer le PDF.');
    return;
  }

  // Measure the card at screen size
  const srcW = rectoEl.offsetWidth;   // 428
  const srcH = rectoEl.offsetHeight;  // 270

  // Target: 85.6mm × 54mm in px at 96dpi → 323.7 × 204.1
  const targetW = 323.7;
  const targetH = 204.1;
  const scale = Math.min(targetW / srcW, targetH / srcH);

  // Collect all stylesheets from the current page
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((el) => el.outerHTML)
    .join('\n');

  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Carte Membre ASFO — ${memberName}</title>
${styles}
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; padding: 20px; background: #f0f0f0; font-family: 'Inter', sans-serif; }

  .print-label { text-align: center; font-size: 13px; color: #666; margin: 10px 0 5px; font-family: Arial, sans-serif; }
  .print-btn { display: block; margin: 30px auto; padding: 12px 48px; background: #0d9488; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; }
  .print-btn:hover { background: #0f766e; }

  .print-carte {
    width: 85.6mm;
    height: 54mm;
    margin: 10px auto;
    overflow: hidden;
    position: relative;
    border-radius: 3mm;
    border: 1px solid #ddd;
  }
  .print-carte-inner {
    transform: scale(${scale});
    transform-origin: top left;
    width: ${srcW}px;
    height: ${srcH}px;
  }

  @media print {
    @page { size: A4 portrait; margin: 15mm; }
    body { margin: 0; padding: 0; background: white; }
    .print-btn { display: none !important; }
    .print-label { font-size: 10px; color: #999; margin: 3mm 0 1mm; }
    .print-carte {
      border: 0.3mm solid #ddd;
      margin: 5mm auto !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .print-carte:first-of-type { margin-top: 10mm !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
  }
</style>
</head>
<body>
  <p class="print-label">— Recto —</p>
  <div class="print-carte"><div class="print-carte-inner">${rectoEl.outerHTML}</div></div>
  <p class="print-label">— Verso —</p>
  <div class="print-carte"><div class="print-carte-inner">${versoEl.outerHTML}</div></div>
  <button class="print-btn" onclick="window.print()">Imprimer / Enregistrer en PDF</button>
</body>
</html>`);
  printWindow.document.close();

  // Wait for images to load, then auto-trigger print
  printWindow.onload = () => {
    const imgs = printWindow.document.querySelectorAll('img');
    Promise.all(Array.from(imgs).map((img) =>
      img.complete ? Promise.resolve() : new Promise<void>((r) => { img.onload = () => r(); img.onerror = () => r(); })
    )).then(() => {
      setTimeout(() => printWindow.print(), 800);
    });
  };
}

/* ─── Export CSV ─── */
function exportCSV(data: MemberRequest[]) {
  const rows = [['Prénom', 'Nom', 'Profession', 'Téléphone', 'Email', 'Lieu de naissance / Village', 'Date de naissance', 'Statut', 'Date']];
  data.forEach((m) => {
    rows.push([
      m.firstName,
      m.lastName,
      displayProfession(m),
      m.phone,
      m.email || '',
      m.lieuNaissance || m.village || '',
      m.dateNaissance ? formatBirthDate(m.dateNaissance) : '',
      m.status,
      new Date(m.createdAt).toLocaleDateString('fr-FR'),
    ]);
  });
  const escapeCsvValue = (value: string) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(escapeCsvValue).join(';')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'membres_asfo.csv';
  a.click();
}

/* ─── Export PDF list ─── */
function exportPDFList(data: MemberRequest[]) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 210, 25, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('ASFO — Liste des Membres', 105, 12, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')} — ${data.length} membre(s)`, 105, 19, { align: 'center' });

  const headers = ['#', 'Nom', 'Profession', 'Tél', 'Naissance / Village', 'Statut'];
  const colX = [10, 20, 75, 120, 152, 185];

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  let y = 35;
  headers.forEach((h, i) => doc.text(h, colX[i], y));

  doc.setDrawColor(200, 200, 200);
  doc.line(10, y + 2, 200, y + 2);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(50, 50, 50);

  data.forEach((m, idx) => {
    if (y > 275) {
      doc.addPage();
      y = 15;
    }
    doc.text(String(idx + 1), colX[0], y);
    doc.text(`${m.firstName} ${m.lastName}`, colX[1], y);
    doc.text(displayProfession(m).slice(0, 27), colX[2], y);
    doc.text(m.phone || '', colX[3], y);
    doc.text((m.lieuNaissance || m.village || '').slice(0, 20), colX[4], y);
    doc.text(m.status, colX[5], y);
    y += 6;
  });

  doc.save('liste-membres-asfo.pdf');
}

/* ─── Drawer ─── */
const MemberDrawer: React.FC<{
  member: MemberRequest | null;
  allMembers: MemberRequest[];
  onClose: () => void;
  onStatusChange: (id: string, status: Statut) => void;
}> = ({ member, allMembers, onClose, onStatusChange }) => {
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'card'>('info');
  const [cardFace, setCardFace] = useState<'recto' | 'verso'>('recto');

  if (!member) return null;

  const ensureCardTab = async () => {
    if (activeTab !== 'card') {
      setActiveTab('card');
      await new Promise((r) => setTimeout(r, 500));
    }
  };

  const handleGenerateCard = async () => {
    await ensureCardTab();
    setCardFace('recto');
    await new Promise((r) => setTimeout(r, 400));
    setGenerating(true);
    try {
      const rectoEl = document.getElementById('member-card');
      const versoEl = document.getElementById('member-card-verso');
      if (!rectoEl || !versoEl) {
        alert('Impossible de trouver la carte. Vérifiez que l\'onglet "Aperçu carte" est ouvert.');
        return;
      }
      openPrintableCard(rectoEl, versoEl, `${member.firstName} ${member.lastName}`);
    } finally {
      setGenerating(false);
    }
  };

  const memberId = generateMemberId(member, allMembers);

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-sm text-gray-500">{label}</span>
      <span className="min-w-0 break-words text-right text-sm font-medium text-gray-900">{value}</span>
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
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            {member.photo?.url ? (
              <img src={member.photo.url} alt={`${member.firstName} ${member.lastName}`} className="h-12 w-12 rounded-xl border border-gray-200 object-cover shadow-sm" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-teal-50 to-teal-100 shadow-sm">
                <span className="text-sm font-bold text-teal-600">{member.firstName?.[0]}{member.lastName?.[0]}</span>
              </div>
            )}
            <div>
              <p className="text-lg font-bold text-gray-900">{member.firstName} {member.lastName}</p>
              <p className="text-sm text-gray-500">{displayProfession(member)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge statut={member.status} />
            <button onClick={onClose} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"><X className="h-5 w-5" /></button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition border-b-2 ${
              activeTab === 'info'
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="h-4 w-4" /> Informations
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition border-b-2 ${
              activeTab === 'card'
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Wallet className="h-4 w-4" /> Aperçu carte
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {activeTab === 'info' ? (
            <>
              {member.photo?.url ? (
                <div className="mb-6 flex justify-center">
                  <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg transition duration-300 hover:shadow-xl">
                    <img src={member.photo.url} alt={`${member.firstName} ${member.lastName}`} className="h-64 w-52 object-cover transition duration-300 hover:scale-105" />
                  </div>
                </div>
              ) : (
                <div className="mb-6 flex justify-center">
                  <div className="flex h-64 w-52 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-center">
                      <User className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-xs text-gray-400">Aucune photo</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800"><User className="h-4 w-4 text-teal-600" /> Informations personnelles</h4>
                <div className="divide-y divide-gray-200">
                  <InfoRow label="Prénom" value={member.firstName} />
                  <InfoRow label="Nom" value={member.lastName} />
                  <InfoRow label="Profession" value={displayProfession(member)} />
                  <div className="flex items-center gap-1.5 py-2.5"><Phone className="h-3.5 w-3.5 text-gray-400" /><span className="text-sm font-medium text-gray-900">{member.phone}</span></div>
                  {member.email && (
                    <div className="flex items-center gap-1.5 py-2.5"><span className="text-sm text-gray-500">Email</span><span className="ml-auto text-sm font-medium text-teal-700">{member.email}</span></div>
                  )}
                </div>
              </div>

              {member.village && (
                <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800"><MapPin className="h-4 w-4 text-teal-600" /> Localisation</h4>
                  <div className="divide-y divide-gray-200">
                    {member.dateNaissance && (
                      <InfoRow label="Date de naissance" value={formatBirthDate(member.dateNaissance)} />
                    )}
                    {/* Le libellé suit la donnée : les demandes anterieures
                        portaient une adresse de residence, les nouvelles un
                        lieu de naissance. Les confondre serait trompeur. */}
                    {member.lieuNaissance ? (
                      <InfoRow label="Lieu de naissance" value={member.lieuNaissance} />
                    ) : (
                      <InfoRow label="Village / Adresse" value={member.village} />
                    )}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800"><CreditCard className="h-4 w-4 text-teal-600" /> Informations demande</h4>
                <div className="divide-y divide-gray-200">
                  <InfoRow label="N° Membre" value={memberId} />
                  <InfoRow label="Date demande" value={new Date(member.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} />
                  <InfoRow label="Coût carte" value="2 500 F CFA" />
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <Phone className="h-4 w-4 text-teal-600" /> Notification SMS
                </h4>
                <div className="divide-y divide-gray-200">
                  <InfoRow
                    label="Statut"
                    value={
                      member.smsConfirmationStatus
                        ? smsStatusLabels[member.smsConfirmationStatus]
                        : 'Non disponible — ancien dossier'
                    }
                  />
                  <InfoRow
                    label="Date d’envoi"
                    value={formatSmsDate(member.smsConfirmationSentAt)}
                  />
                  {member.smsConfirmationProviderId && (
                    <InfoRow
                      label="Identifiant fournisseur"
                      value={member.smsConfirmationProviderId}
                    />
                  )}
                  {member.smsConfirmationStatus === 'failed' &&
                    member.smsConfirmationError && (
                      <InfoRow
                        label="Erreur"
                        value={member.smsConfirmationError}
                      />
                    )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-gray-500 text-center">
                Aperçu de la carte membre (cliquez pour retourner)
              </p>

              {/* Recto / Verso toggle buttons */}
              <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setCardFace('recto')}
                  className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${
                    cardFace === 'recto' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Recto
                </button>
                <button
                  onClick={() => setCardFace('verso')}
                  className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${
                    cardFace === 'verso' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Verso
                </button>
              </div>

              {/* Card flip container */}
              <div
                style={{ perspective: '1000px', width: '428px', height: '270px', cursor: 'pointer' }}
                onClick={() => setCardFace(cardFace === 'recto' ? 'verso' : 'recto')}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s ease',
                    transform: cardFace === 'verso' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Recto */}
                  <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' }}>
                    <MemberCard
                      name={`${member.firstName} ${member.lastName}`}
                      role={displayProfession(member)}
                      phone={member.phone}
                      city={member.lieuNaissance || member.village || 'Non renseigné'}
                      memberId={memberId}
                      photo={member.photo?.url}
                      email={member.email}
                      createdAt={member.createdAt}
                    />
                  </div>
                  {/* Verso */}
                  <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <MemberCardVerso
                      name={`${member.firstName} ${member.lastName}`}
                      memberId={memberId}
                      createdAt={member.createdAt}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs text-blue-700 text-center">
                  Le PDF contiendra le recto ET le verso (2 pages, format carte bancaire 85.6mm x 54mm).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onStatusChange(member.objectId, 'Validé')} className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600">
              <CheckCircle className="h-4 w-4" /> Valider la carte
            </button>
            <button onClick={() => onStatusChange(member.objectId, 'Refusé')} className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600">
              <XCircle className="h-4 w-4" /> Refuser
            </button>
          </div>
          {member.status === 'Validé' && (
            <>
              <button
                onClick={handleGenerateCard}
                disabled={generating}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
              >
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {generating ? 'Génération...' : 'Générer carte membre PDF'}
              </button>
            </>
          )}
          <button onClick={onClose} className="mt-3 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Fermer</button>
        </div>
      </motion.aside>
    </motion.div>
  );
};

/* ─── Main Page ─── */
const AdminMemberRequestsPage: React.FC = () => {
  const [members, setMembers] = useState<MemberRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Statut | 'Tous'>('Tous');
  const [selected, setSelected] = useState<MemberRequest | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  // Demande en attente de confirmation de suppression.
  const [cardFilter, setCardFilter] = useState<string>('Tous');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [composerOpen, setComposerOpen] = useState(false);
  const [cardStateOpen, setCardStateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<MemberRequest | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const { toasts, pushToast, dismissToast } = useToasts();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      // Les demandes archivées restent en base mais sortent de la liste.
      const { results } = await queryObjects<MemberRequest>(CLASS_NAME, {
        where: { status: { $ne: ARCHIVED_STATUS } },
        order: '-createdAt',
        limit: 500,
      });
      setMembers(results);
    } catch (err) {
      console.error('Failed to fetch member requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return members.filter((m) => {
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
      const matchSearch = !q || fullName.includes(q) || m.phone.toLowerCase().includes(q) || (m.village ?? '').toLowerCase().includes(q) || (m.lieuNaissance ?? '').toLowerCase().includes(q) || displayProfession(m).toLowerCase().includes(q) || (m.professionAutre ?? '').toLowerCase().includes(q) || (m.email ?? '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'Tous' || m.status === statusFilter;
      const matchCard =
        cardFilter === 'Tous' ||
        (cardFilter === 'Sans carte' ? !m.cardState : m.cardState === cardFilter);
      return matchSearch && matchStatus && matchCard;
    });
  }, [members, searchQuery, statusFilter, cardFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  /** Demandes cochées, résolues depuis la liste courante. */
  const selectedMembers = useMemo(
    () => members.filter((m) => selectedIds.has(m.objectId)),
    [members, selectedIds],
  );

  const toggleOne = (objectId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(objectId)) next.delete(objectId);
      else next.add(objectId);
      return next;
    });
  };

  /** Sélection assistée : cartes disponibles jamais notifiées. */
  const selectAvailableNotNotified = () => {
    setSelectedIds(
      new Set(
        members
          .filter((m) => m.cardState === CARD_STATES.AVAILABLE && !m.lastReminderAt)
          .map((m) => m.objectId),
      ),
    );
  };

  /** Sélection assistée : toutes les cartes disponibles d’un village. */
  const selectVillage = (village: string) => {
    setSelectedIds(
      new Set(
        members
          .filter((m) => m.cardState === CARD_STATES.AVAILABLE && m.village === village)
          .map((m) => m.objectId),
      ),
    );
  };

  /** Villages ayant au moins une carte disponible. */
  const villagesWithAvailableCards = useMemo(
    () =>
      [...new Set(
        members
          .filter((m) => m.cardState === CARD_STATES.AVAILABLE && m.village)
          .map((m) => m.village),
      )].sort(),
    [members],
  );

  const stats = useMemo(() => ({
    total: members.length,
    enAttente: members.filter((m) => m.status === 'En attente').length,
    valide: members.filter((m) => m.status === 'Validé').length,
    refuse: members.filter((m) => m.status === 'Refusé').length,
    cartesDisponibles: members.filter((m) => m.cardState === CARD_STATES.AVAILABLE).length,
  }), [members]);

  const handleStatusChange = async (id: string, status: Statut) => {
    try {
      await updateObject(CLASS_NAME, id, { status });
      setMembers((prev) => prev.map((m) => (m.objectId === id ? { ...m, status } : m)));
      if (selected?.objectId === id) setSelected((prev) => (prev ? { ...prev, status } : prev));
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  /** Ouvre la confirmation ; la suppression n’a lieu qu’après validation. */
  const handleDelete = (id: string) => {
    const target = members.find((m) => m.objectId === id) ?? null;
    if (!target) return;
    setDeleteError('');
    setPendingDelete(target);
  };

  /** Restaure une demande archivée et la remet dans la liste. */
  const handleRestore = useCallback(
    async (member: MemberRequest) => {
      try {
        await restoreMemberRequest(member.objectId);
        setMembers((prev) =>
          prev.some((m) => m.objectId === member.objectId)
            ? prev
            : [member, ...prev].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        );
        pushToast({ variant: 'success', message: 'Demande restaurée.' });
      } catch (error) {
        pushToast({
          variant: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'La demande n’a pas pu être restaurée.',
          durationMs: 8000,
        });
      }
    },
    [pushToast],
  );

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setDeleting(true);
    setDeleteError('');
    try {
      await archiveMemberRequest(target.objectId);
      setMembers((prev) => prev.filter((m) => m.objectId !== target.objectId));
      if (selected?.objectId === target.objectId) setSelected(null);
      setPendingDelete(null);
      // Fenêtre d’annulation : l’enregistrement est archivé, pas effacé.
      pushToast({
        variant: 'success',
        message: 'Demande supprimée.',
        durationMs: 8000,
        action: { label: 'Annuler', onClick: () => void handleRestore(target) },
      });
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : 'La demande n’a pas pu être supprimée.',
      );
    } finally {
      setDeleting(false);
    }
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  const statCards = [
    { label: 'Total demandes', value: stats.total, icon: CreditCard, light: 'bg-teal-50 text-teal-700' },
    { label: 'En attente', value: stats.enAttente, icon: Clock, light: 'bg-amber-50 text-amber-700' },
    { label: 'Validées', value: stats.valide, icon: CheckCircle, light: 'bg-emerald-50 text-emerald-700' },
    { label: 'Refusées', value: stats.refuse, icon: XCircle, light: 'bg-red-50 text-red-700' },
    { label: 'Cartes disponibles', value: stats.cartesDisponibles, icon: CreditCard, light: 'bg-teal-50 text-teal-700' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demandes carte membre</h1>
          <p className="mt-1 text-sm text-gray-500">Gérez les demandes de carte membre ASFO</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchMembers} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
          </button>
          <button onClick={() => exportCSV(filtered)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <FileDown className="h-4 w-4" /> Exporter Excel
          </button>
          <button onClick={() => exportPDFList(filtered)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <Download className="h-4 w-4" /> Exporter PDF
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
            <input type="text" placeholder="Rechercher par nom, téléphone, village, profession..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1">
            {(['Tous', 'En attente', 'Validé', 'Refusé'] as const).map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${statusFilter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{s}</button>
            ))}
          </div>
          {/* Filtre par état de carte, distinct du statut de la demande. */}
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1">
            {(['Tous', 'Sans carte', ...CARD_STATE_ORDER] as string[]).map((s) => (
              <button key={s} onClick={() => { setCardFilter(s); setPage(1); }} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${cardFilter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Sélection assistée */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-gray-500">Sélectionner :</span>
          <button onClick={selectAvailableNotNotified} className="rounded-lg border border-gray-200 px-2.5 py-1.5 font-semibold text-gray-700 hover:bg-gray-50">
            Cartes disponibles non notifiées
          </button>
          {villagesWithAvailableCards.map((village) => (
            <button key={village} onClick={() => selectVillage(village)} className="rounded-lg border border-gray-200 px-2.5 py-1.5 font-semibold text-gray-700 hover:bg-gray-50">
              {village}
            </button>
          ))}
          {selectedIds.size > 0 && (
            <button onClick={() => setSelectedIds(new Set())} className="rounded-lg px-2.5 py-1.5 font-semibold text-gray-400 hover:text-gray-600">
              Tout décocher
            </button>
          )}
        </div>
      </div>

      {/* Barre d'action, visible dès qu'un membre est coché */}
      {selectedIds.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3">
          <p className="text-sm font-bold text-teal-900">
            {selectedIds.size} membre{selectedIds.size > 1 ? 's' : ''} sélectionné{selectedIds.size > 1 ? 's' : ''}
          </p>
          <button onClick={() => setCardStateOpen(true)} className="rounded-lg border border-teal-600 bg-white px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-50">
            Marquer les cartes comme disponibles
          </button>
          <button onClick={() => setComposerOpen(true)} className="ml-auto rounded-lg bg-teal-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-teal-800">
            Envoyer un rappel
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <span className="ml-3 text-sm text-gray-500">Chargement des demandes...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label="Tout sélectionner"
                      checked={paginated.length > 0 && paginated.every((m) => selectedIds.has(m.objectId))}
                      onChange={(event) => {
                        setSelectedIds((current) => {
                          const next = new Set(current);
                          paginated.forEach((m) => (event.target.checked ? next.add(m.objectId) : next.delete(m.objectId)));
                          return next;
                        });
                      }}
                    />
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Photo</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Nom complet</th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">Profession</th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 lg:table-cell">Téléphone</th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">Naissance</th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 sm:table-cell">Date</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Statut</th>
                  <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 lg:table-cell">Carte</th>
                  <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {paginated.map((m) => (
                    <motion.tr key={m.objectId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group transition-colors hover:bg-teal-50/30">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          aria-label={`Sélectionner ${m.firstName} ${m.lastName}`}
                          checked={selectedIds.has(m.objectId)}
                          onChange={() => toggleOne(m.objectId)}
                        />
                      </td>
                      <td className="px-5 py-4">
                        {m.photo?.url ? (
                          <img src={m.photo.url} alt={`${m.firstName} ${m.lastName}`} className="h-12 w-12 rounded-xl border border-gray-200 object-cover shadow-sm transition duration-300 hover:scale-105 hover:shadow-md" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-teal-50 to-teal-100 shadow-sm">
                            <span className="text-sm font-bold text-teal-600">{m.firstName?.[0]}{m.lastName?.[0]}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900">{m.firstName} {m.lastName}</p>
                        <p className="text-xs text-gray-400">{m.email}</p>
                      </td>
                      <td className="hidden px-5 py-4 md:table-cell">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"><Heart className="h-3 w-3 text-teal-500" />{displayProfession(m)}</span>
                      </td>
                      <td className="hidden px-5 py-4 lg:table-cell"><span className="text-sm text-gray-600">{m.phone}</span></td>
                      <td className="hidden px-5 py-4 md:table-cell">
                        <p className="max-w-[160px] truncate text-sm text-gray-600">{m.lieuNaissance || m.village || '—'}</p>
                        {m.dateNaissance && (
                          <p className="text-[11px] text-gray-400">{formatBirthDate(m.dateNaissance)}</p>
                        )}
                      </td>
                      <td className="hidden px-5 py-4 sm:table-cell"><span className="text-sm text-gray-500">{fmt(m.createdAt)}</span></td>
                      <td className="px-5 py-4"><StatusBadge statut={m.status} /></td>
                      <td className="hidden px-5 py-4 lg:table-cell">
                        {m.cardState ? (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            m.cardState === CARD_STATES.AVAILABLE
                              ? 'bg-teal-50 text-teal-700'
                              : m.cardState === CARD_STATES.HANDED_OVER
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-amber-50 text-amber-700'
                          }`}>
                            {m.cardState}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                        {m.lastReminderAt && (
                          <p className="mt-1 text-[11px] text-gray-400">
                            Dernier rappel : {fmt(typeof m.lastReminderAt === 'string' ? m.lastReminderAt : m.lastReminderAt.iso)}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setSelected(m)} className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100">
                            <Eye className="h-3.5 w-3.5" /> Profil
                          </button>
                          {m.status === 'En attente' && (
                            <>
                              <button onClick={() => handleStatusChange(m.objectId, 'Validé')} className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100" title="Valider"><CheckCircle className="h-3.5 w-3.5" /></button>
                              <button onClick={() => handleStatusChange(m.objectId, 'Refusé')} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100" title="Refuser"><XCircle className="h-3.5 w-3.5" /></button>
                            </>
                          )}
                          <button onClick={() => handleDelete(m.objectId)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-gray-400 transition hover:bg-red-50 hover:text-red-600" title="Supprimer"><Trash2 className="h-3.5 w-3.5" /></button>
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
              {members.length === 0 ? (
                <><Users className="mx-auto mb-4 h-10 w-10 text-gray-300" /><p className="font-medium text-gray-500">Aucune demande reçue</p><p className="mt-1 text-sm text-gray-400">Les demandes de carte membre apparaîtront ici</p></>
              ) : (
                <><Search className="mx-auto mb-4 h-10 w-10 text-gray-300" /><p className="font-medium text-gray-500">Aucun résultat</p><p className="mt-1 text-sm text-gray-400">Essayez de modifier vos filtres</p></>
              )}
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
      )}

      {/* Drawer */}
      <AnimatePresence>
        {selected && <MemberDrawer member={selected} allMembers={members} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}
      </AnimatePresence>

      <CardStateDialog
        open={cardStateOpen}
        onOpenChange={setCardStateOpen}
        objectIds={selectedMembers.map((m) => m.objectId)}
        villages={[...new Set(selectedMembers.map((m) => m.village).filter(Boolean))]}
        onDone={() => { setSelectedIds(new Set()); void fetchMembers(); }}
      />

      <ReminderComposer
        open={composerOpen}
        onOpenChange={setComposerOpen}
        members={selectedMembers.map((m) => ({
          objectId: m.objectId,
          firstName: m.firstName,
          lastName: m.lastName,
          village: m.village,
          professionLabel: displayProfession(m),
          phone: m.phone,
          email: m.email,
          cardState: m.cardState ?? null,
          pickupLocation: m.pickupLocation,
          pickupDate: m.pickupDate,
          pickupHours: m.pickupHours,
          lastReminderAt:
            typeof m.lastReminderAt === 'string' ? m.lastReminderAt : m.lastReminderAt?.iso,
        }))}
        onSent={() => { void fetchMembers(); }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
            setDeleteError('');
          }
        }}
        variant="danger"
        title="Supprimer cette demande ?"
        description="Vous êtes sur le point de supprimer une demande de carte membre."
        record={
          pendingDelete
            ? {
                name: `${pendingDelete.firstName} ${pendingDelete.lastName}`.trim(),
                reference: pendingDelete.objectId,
                date: fmt(pendingDelete.createdAt),
                imageUrl: pendingDelete.photo?.url,
              }
            : undefined
        }
        warning={
          <>
            La demande sera <strong>retirée de la liste et archivée</strong>. Les
            informations du demandeur et sa photo sont conservées le temps qu’une
            restauration reste possible.
          </>
        }
        requireTyping="SUPPRIMER"
        confirmLabel="Supprimer définitivement"
        loading={deleting}
        error={deleteError}
        onConfirm={() => void confirmDelete()}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default AdminMemberRequestsPage;
