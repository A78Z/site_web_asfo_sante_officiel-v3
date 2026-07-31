import { useCallback, useRef, useState } from 'react';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastMessage {
  id: number;
  message: string;
  variant: 'success' | 'error';
  /** Action facultative, typiquement l’annulation d’une suppression. */
  action?: ToastAction;
  /** Durée d’affichage ; 0 pour un message persistant. */
  durationMs: number;
}

/**
 * File de notifications locale à une page. Pas de contexte global : chaque
 * écran d’administration monte sa propre pile, ce qui évite d’introduire un
 * fournisseur à la racine de l’application.
 */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(1);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<ToastMessage, 'id' | 'durationMs'> & { durationMs?: number }) => {
      const id = nextId.current;
      nextId.current += 1;
      setToasts((current) => [
        ...current,
        { ...toast, id, durationMs: toast.durationMs ?? 5000 },
      ]);
      return id;
    },
    [],
  );

  return { toasts, pushToast, dismissToast };
}
