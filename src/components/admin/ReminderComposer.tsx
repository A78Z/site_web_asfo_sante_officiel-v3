import { useEffect, useMemo, useRef, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Save,
  Send,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  MESSAGE_VARIABLES,
  analyseTemplate,
  renderReminder,
  messageMetrics,
  DEFAULT_SEGMENT_CAP,
} from '../../../api/_lib/reminder-message.js';
import {
  EXCLUSION_LABELS,
  buildAudience,
} from '../../../api/_lib/reminder-audience.js';
import {
  AdminActionError,
  currentActor,
  listTemplates,
  saveTemplate,
  sendReminderBatch,
  type ReminderRecipient,
  type SendResult,
  type StoredTemplate,
} from '../../lib/adminReminders';

/**
 * Modèles *proposés* à la première ouverture — aucun n’est imposé ni
 * pré-enregistré : l’administrateur les valide et les modifie avant usage.
 */
const SUGGESTED_TEMPLATES = [
  {
    name: 'Carte disponible',
    body:
      "Bonjour {prenom}, votre carte de membre est disponible.\n" +
      "Retrait a {lieu_retrait}, {village}, a partir du {date_disponibilite}.\n" +
      "Horaires : {horaires}.\n" +
      "Merci de vous munir d'une piece d'identite.",
  },
  {
    name: 'Rappel de retrait',
    body:
      "Bonjour {prenom}, votre carte de membre vous attend toujours\n" +
      "a {lieu_retrait} ({village}). Merci de passer la retirer.",
  },
  {
    name: 'Demande validée',
    body:
      "Bonjour {prenom}, votre demande de carte de membre est validee.\n" +
      "Vous serez informe des que la carte sera disponible.",
  },
];

/** Taille d’un lot : limite la charge sur l’API et permet la progression. */
const BATCH_SIZE = 10;
const BATCH_PAUSE_MS = 900;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: ReminderRecipient[];
  onSent: () => void;
}

export function ReminderComposer({ open, onOpenChange, members, onSent }: Props) {
  const [template, setTemplate] = useState(SUGGESTED_TEMPLATES[0].body);
  const [segmentCap, setSegmentCap] = useState(DEFAULT_SEGMENT_CAP);
  const [skipAlreadyNotified, setSkipAlreadyNotified] = useState(true);
  const [includeTestAccounts, setIncludeTestAccounts] = useState(false);
  const [allowUnavailableCards, setAllowUnavailableCards] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [stored, setStored] = useState<StoredTemplate[]>([]);
  const [testPhone, setTestPhone] = useState('');
  const [busy, setBusy] = useState<'idle' | 'test' | 'sending'>('idle');
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState<SendResult[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const abortRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const audience = useMemo(
    () =>
      buildAudience(members, {
        skipAlreadyNotified,
        includeTestAccounts,
        allowUnavailableCards,
      }),
    [members, skipAlreadyNotified, includeTestAccounts, allowUnavailableCards],
  );

  const analysis = useMemo(
    () => analyseTemplate(template, audience.recipients),
    [template, audience.recipients],
  );

  const previewMember = audience.recipients[previewIndex] ?? null;
  const previewText = previewMember ? renderReminder(template, previewMember) : '';
  const previewMetrics = messageMetrics(previewText);
  const overCap = (analysis.worstCase?.segments ?? 0) > segmentCap;

  useEffect(() => {
    if (!open) return;
    setResults([]);
    setError('');
    setNotice('');
    setProgress({ done: 0, total: 0 });
    setPreviewIndex(0);
    listTemplates()
      .then((r) => setStored(r.templates ?? []))
      .catch(() => setStored([]));
  }, [open]);

  useEffect(() => {
    if (previewIndex >= audience.recipients.length) setPreviewIndex(0);
  }, [audience.recipients.length, previewIndex]);

  /** Insère une variable à la position du curseur. */
  const insertVariable = (token: string) => {
    const field = textareaRef.current;
    if (!field) {
      setTemplate((current) => `${current}${token}`);
      return;
    }
    const start = field.selectionStart ?? template.length;
    const end = field.selectionEnd ?? template.length;
    const next = `${template.slice(0, start)}${token}${template.slice(end)}`;
    setTemplate(next);
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const runSend = async (mode: 'live' | 'test') => {
    if (!previewMember) return;
    setError('');
    setNotice('');
    setResults([]);
    abortRef.current = false;

    if (mode === 'test') {
      setBusy('test');
      try {
        const response = await sendReminderBatch({
          template,
          recipients: [previewMember],
          segmentCap,
          mode: 'test',
          testPhone,
        });
        const outcome = response.results[0];
        setNotice(
          outcome?.status === 'accepted_by_provider'
            ? `Test remis à l’opérateur pour ${testPhone}. Vérifiez votre téléphone avant l’envoi complet.`
            : `Le test n’est pas parti : ${outcome?.detail ?? 'raison inconnue'}.`,
        );
      } catch (sendError) {
        setError(
          sendError instanceof AdminActionError
            ? sendError.message
            : 'Le test a échoué.',
        );
      } finally {
        setBusy('idle');
      }
      return;
    }

    const targets = audience.recipients;
    setBusy('sending');
    setProgress({ done: 0, total: targets.length });
    const collected: SendResult[] = [];

    for (let index = 0; index < targets.length; index += BATCH_SIZE) {
      if (abortRef.current) break;
      const batch = targets.slice(index, index + BATCH_SIZE);
      try {
        const response = await sendReminderBatch({
          template,
          recipients: batch,
          segmentCap,
          campaignId: `campagne-${progress.total}-${targets.length}`,
        });
        collected.push(...response.results);
      } catch (sendError) {
        // Un lot en échec n’interrompt pas les suivants : il est consigné.
        collected.push(
          ...batch.map((member) => ({
            objectId: member.objectId,
            name: `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim(),
            status: 'failed' as const,
            detail:
              sendError instanceof AdminActionError
                ? sendError.message
                : 'Lot en échec.',
          })),
        );
      }
      setResults([...collected]);
      setProgress({ done: Math.min(index + BATCH_SIZE, targets.length), total: targets.length });
      if (index + BATCH_SIZE < targets.length && !abortRef.current) {
        await new Promise((resolve) => window.setTimeout(resolve, BATCH_PAUSE_MS));
      }
    }

    setBusy('idle');
    onSent();
  };

  const accepted = results.filter((r) => r.status === 'accepted_by_provider').length;

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (busy === 'sending') return;
        onOpenChange(next);
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[92vh] w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
            <div>
              <DialogPrimitive.Title className="text-lg font-black text-slate-900">
                Envoyer un rappel
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-1 text-sm text-slate-500">
                {audience.recipients.length} destinataire
                {audience.recipients.length > 1 ? 's' : ''} retenu
                {audience.recipients.length > 1 ? 's' : ''} ·{' '}
                {audience.excluded.length} exclu{audience.excluded.length > 1 ? 's' : ''}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </header>

          <div className="grid flex-1 gap-6 overflow-y-auto px-6 py-5 lg:grid-cols-2">
            <section>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Message
              </h3>

              {stored.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {stored.map((item) => (
                    <button
                      key={item.objectId}
                      type="button"
                      onClick={() => setTemplate(item.body)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SUGGESTED_TEMPLATES.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setTemplate(item.body)}
                    className="rounded-lg border border-dashed border-teal-300 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                  >
                    {item.name} <span className="text-slate-400">(proposé)</span>
                  </button>
                ))}
              </div>

              <textarea
                ref={textareaRef}
                value={template}
                onChange={(event) => setTemplate(event.target.value)}
                rows={8}
                className="mt-3 w-full rounded-xl border border-slate-200 p-3 font-mono text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-50"
              />

              <div className="mt-2 flex flex-wrap gap-1.5">
                {MESSAGE_VARIABLES.map((variable: { token: string; label: string }) => (
                  <button
                    key={variable.token}
                    type="button"
                    onClick={() => insertVariable(variable.token)}
                    title={variable.label}
                    className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-700 hover:bg-slate-200"
                  >
                    {variable.token}
                  </button>
                ))}
              </div>

              {analysis.unknownTokens.length > 0 && (
                <p className="mt-2 text-xs font-semibold text-amber-700">
                  Variables inconnues, envoyées telles quelles :{' '}
                  {analysis.unknownTokens.join(', ')}
                </p>
              )}

              <div className="mt-4 flex items-center gap-2 text-sm">
                <label htmlFor="cap" className="text-slate-600">
                  Plafond de segments :
                </label>
                <input
                  id="cap"
                  type="number"
                  min={1}
                  max={6}
                  value={segmentCap}
                  onChange={(event) => setSegmentCap(Number(event.target.value) || 1)}
                  className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-center"
                />
              </div>

              <fieldset className="mt-4 space-y-2 text-sm text-slate-700">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={skipAlreadyNotified}
                    onChange={(e) => setSkipAlreadyNotified(e.target.checked)}
                  />
                  Ne pas renvoyer à ceux déjà notifiés
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeTestAccounts}
                    onChange={(e) => setIncludeTestAccounts(e.target.checked)}
                  />
                  Réintégrer les comptes de test
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allowUnavailableCards}
                    onChange={(e) => setAllowUnavailableCards(e.target.checked)}
                  />
                  Autoriser les cartes non disponibles
                </label>
              </fieldset>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Aperçu réel
              </h3>
              {previewMember ? (
                <>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewIndex((i) => Math.max(0, i - 1))}
                      disabled={previewIndex === 0}
                      className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"
                      aria-label="Destinataire précédent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <p className="truncate text-sm font-bold text-slate-800">
                      {previewMember.firstName} {previewMember.lastName}
                      <span className="ml-1 font-normal text-slate-400">
                        ({previewIndex + 1}/{audience.recipients.length})
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewIndex((i) =>
                          Math.min(audience.recipients.length - 1, i + 1),
                        )
                      }
                      disabled={previewIndex >= audience.recipients.length - 1}
                      className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"
                      aria-label="Destinataire suivant"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-900 p-3.5 font-mono text-[13px] leading-5 text-slate-100">
                    {previewText}
                  </pre>
                  <p className="mt-2 text-xs text-slate-500">
                    Texte sans accents · {previewMetrics.characters} caractères ·{' '}
                    {previewMetrics.segments} segment
                    {previewMetrics.segments > 1 ? 's' : ''}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  Aucun destinataire retenu : ajustez la sélection ou les options.
                </p>
              )}

              <div className="mt-4 rounded-xl border border-slate-200 p-3.5 text-sm">
                <p className="font-bold text-slate-800">
                  {audience.recipients.length} destinataires ·{' '}
                  {analysis.totalSegments} segments SMS · {audience.excluded.length} exclus
                </p>
                {analysis.worstCase && (
                  <p className={`mt-1 text-xs ${overCap ? 'font-bold text-red-600' : 'text-slate-500'}`}>
                    Pire cas : {analysis.worstCase.characters} caractères,{' '}
                    {analysis.worstCase.segments} segments
                    {overCap && ' — au-delà du plafond, envoi bloqué'}
                  </p>
                )}
              </div>

              {audience.excluded.length > 0 && (
                <details className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <summary className="cursor-pointer text-sm font-bold text-amber-800">
                    {audience.excluded.length} exclus — voir le détail
                  </summary>
                  <ul className="mt-2 space-y-1 text-xs text-amber-900">
                    {audience.excluded.map(
                      (item: { objectId: string; name: string; reason: string; detail?: string }) => (
                        <li key={`${item.objectId}-${item.reason}`}>
                          <strong>{item.name}</strong> —{' '}
                          {EXCLUSION_LABELS[item.reason] ?? item.reason}
                          {item.detail ? ` (${item.detail})` : ''}
                        </li>
                      ),
                    )}
                  </ul>
                </details>
              )}
            </section>
          </div>

          <footer className="border-t border-slate-200 px-6 py-4">
            {error && (
              <p role="alert" className="mb-2 text-sm font-medium text-red-600">
                {error}
              </p>
            )}
            {notice && (
              <p className="mb-2 flex items-start gap-1.5 text-sm text-teal-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {notice}
              </p>
            )}

            {busy === 'sending' && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>
                    {progress.done} / {progress.total} envoyés
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      abortRef.current = true;
                    }}
                    className="rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-50"
                  >
                    Interrompre
                  </button>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-teal-600 transition-all"
                    style={{
                      width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {results.length > 0 && busy !== 'sending' && (
              <p className="mb-3 text-sm text-slate-700">
                {accepted} remis à l’opérateur · {results.length - accepted} en échec.
                <span className="ml-1 text-slate-400">
                  Aucun accusé de réception ni de lecture n’existe.
                </span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="tel"
                value={testPhone}
                onChange={(event) => setTestPhone(event.target.value)}
                placeholder="Votre numéro pour le test"
                className="w-56 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600"
              />
              <button
                type="button"
                onClick={() => void runSend('test')}
                disabled={busy !== 'idle' || !previewMember || testPhone.trim().length < 9}
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-600 px-4 py-2.5 text-sm font-bold text-teal-700 hover:bg-teal-50 disabled:opacity-50"
              >
                {busy === 'test' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Envoyer un test
              </button>

              <button
                type="button"
                onClick={() => {
                  const name = window.prompt('Nom du modèle ?');
                  if (!name) return;
                  saveTemplate(name, template)
                    .then(() => listTemplates())
                    .then((r) => {
                      setStored(r.templates ?? []);
                      setNotice('Modèle enregistré.');
                    })
                    .catch((e) => setError(e.message));
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Save className="h-4 w-4" /> Enregistrer le modèle
              </button>

              <button
                type="button"
                onClick={() => void runSend('live')}
                disabled={
                  busy !== 'idle' || audience.recipients.length === 0 || overCap
                }
                className="ml-auto inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                title={overCap ? 'Message trop long : réduisez-le ou relevez le plafond.' : undefined}
              >
                {busy === 'sending' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Envoyer à {audience.recipients.length} membre
                {audience.recipients.length > 1 ? 's' : ''}
              </button>
            </div>

            {overCap && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                Envoi bloqué : le message dépasse {segmentCap} segments. Aucune
                troncature n’est appliquée.
              </p>
            )}
            {!currentActor() && (
              <p className="mt-2 text-xs text-red-600">
                Session administrateur introuvable — reconnectez-vous.
              </p>
            )}
          </footer>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export default ReminderComposer;
