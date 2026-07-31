import { useEffect, useId, useState, type ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

/** Dossier rappelé dans la boîte de dialogue, pour éviter toute méprise. */
export interface ConfirmDialogRecord {
  /** Nom affiché en gras (demandeur, article, utilisateur…). */
  name: string;
  /** Référence technique, affichée telle qu’enregistrée. */
  reference?: string;
  /** Date déjà formatée pour l’affichage. */
  date?: string;
  /** Vignette ; à défaut les initiales du nom sont utilisées. */
  imageUrl?: string;
}

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  /** Rappel du dossier concerné. */
  record?: ConfirmDialogRecord;
  /** Encart d’avertissement, mis en avant pour les actions destructives. */
  warning?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  /**
   * Mot à saisir pour débloquer la confirmation (ex. « SUPPRIMER »).
   * Garde-fou contre le clic réflexe sur une action irréversible.
   */
  requireTyping?: string;
  loading?: boolean;
  /** Message d’échec affiché sans fermer la boîte de dialogue. */
  error?: string;
  onConfirm: () => void;
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

/**
 * Boîte de dialogue de confirmation réutilisable.
 *
 * L’accessibilité (rôle `dialog`, `aria-modal`, piège de focus, fermeture par
 * Échap, restitution du focus au déclencheur) est assurée par Radix Dialog
 * plutôt que réimplémentée à la main.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  record,
  warning,
  confirmLabel,
  cancelLabel = 'Annuler',
  variant = 'default',
  requireTyping,
  loading = false,
  error,
  onConfirm,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState('');
  const typingFieldId = useId();
  const isDanger = variant === 'danger';
  const typingSatisfied =
    !requireTyping || typed.trim().toUpperCase() === requireTyping.toUpperCase();
  const confirmDisabled = loading || !typingSatisfied;

  // Chaque ouverture repart d’un champ vide : la confirmation précédente ne
  // doit jamais déverrouiller la suivante.
  useEffect(() => {
    if (open) setTyped('');
  }, [open]);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        // Une fermeture pendant l’appel réseau laisserait l’action orpheline.
        if (loading) return;
        onOpenChange(next);
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-7">
          <div className="flex flex-col items-center text-center">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full ${
                isDanger ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-700'
              }`}
            >
              {isDanger ? (
                <Trash2 className="h-6 w-6" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
            </span>

            <DialogPrimitive.Title
              className="mt-4 font-poppins text-xl font-extrabold text-slate-900"
              style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
            >
              {title}
            </DialogPrimitive.Title>

            {description && (
              <DialogPrimitive.Description className="mt-2 text-sm leading-relaxed text-slate-500">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>

          {record && (
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3.5 text-left">
              {record.imageUrl ? (
                <img
                  src={record.imageUrl}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-sm font-bold text-teal-700">
                  {initialsOf(record.name)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{record.name}</p>
                {(record.reference || record.date) && (
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {/* Référence en chasse fixe : lève l’ambiguïté O/0 et I/l/1
                        quand elle doit être relue ou dictée. */}
                    {record.reference && (
                      <span className="font-mono">Réf. {record.reference}</span>
                    )}
                    {record.reference && record.date ? ' · ' : ''}
                    {record.date}
                  </p>
                )}
              </div>
            </div>
          )}

          {warning && (
            <div className="mt-4 flex gap-2.5 rounded-xl bg-red-50 p-3.5 text-left text-sm leading-relaxed text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>{warning}</div>
            </div>
          )}

          {requireTyping && (
            <div className="mt-4 text-left">
              <label
                htmlFor={typingFieldId}
                className="block text-sm text-slate-600"
              >
                Pour confirmer, tapez{' '}
                <span className="font-bold text-slate-900">{requireTyping}</span>{' '}
                ci-dessous :
              </label>
              <input
                id={typingFieldId}
                type="text"
                autoComplete="off"
                spellCheck={false}
                disabled={loading}
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                placeholder={requireTyping}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-50 disabled:bg-slate-50"
              />
            </div>
          )}

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelLabel}
              </button>
            </DialogPrimitive.Close>
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirmDisabled}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isDanger
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-teal-700 hover:bg-teal-800'
              }`}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                isDanger && <Trash2 className="h-4 w-4" />
              )}
              {confirmLabel}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export default ConfirmDialog;
