import { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Undo2, X } from 'lucide-react';
import type { ToastMessage } from './useToasts';

export type { ToastAction, ToastMessage } from './useToasts';

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}) {
  const isSuccess = toast.variant === 'success';

  useEffect(() => {
    if (!toast.durationMs) return undefined;
    const timer = window.setTimeout(() => onDismiss(toast.id), toast.durationMs);
    return () => window.clearTimeout(timer);
  }, [toast.id, toast.durationMs, onDismiss]);

  return (
    <div
      // `alert` pour un échec (interrompt le lecteur d’écran), `status` pour un
      // succès (annoncé sans couper la lecture en cours).
      role={isSuccess ? 'status' : 'alert'}
      className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${
        isSuccess
          ? 'border-teal-100 bg-white text-slate-800'
          : 'border-red-100 bg-white text-red-700'
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
      )}
      <p className="text-sm font-medium">{toast.message}</p>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action?.onClick();
            onDismiss(toast.id);
          }}
          className="ml-1 inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <Undo2 className="h-3.5 w-3.5" />
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fermer la notification"
        className="ml-auto shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export default ToastStack;
