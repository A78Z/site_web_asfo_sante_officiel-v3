import { useCallback, useRef, useState } from 'react';
import ConfirmDialog, { type ConfirmDialogProps } from './ConfirmDialog';

/** Options d’une confirmation ponctuelle, hors état d’ouverture et callbacks. */
export type ConfirmOptions = Omit<
  ConfirmDialogProps,
  'open' | 'onOpenChange' | 'onConfirm' | 'loading' | 'error'
>;

/**
 * Remplace `window.confirm()` par la boîte de dialogue maison, avec la même
 * ergonomie d’appel : `if (!(await confirm({ … }))) return;`.
 *
 * Le modal se ferme dès la confirmation, puis l’action s’exécute. Pour montrer
 * un état de chargement et une erreur *dans* le modal, utilisez directement
 * `ConfirmDialog` en composant contrôlé (voir la suppression des demandes de
 * carte membre).
 */
export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((confirmed: boolean) => void) | null>(null);

  const settle = useCallback((confirmed: boolean) => {
    resolver.current?.(confirmed);
    resolver.current = null;
    setOptions(null);
  }, []);

  const confirm = useCallback(
    (nextOptions: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        // Une demande encore ouverte est considérée comme abandonnée.
        resolver.current?.(false);
        resolver.current = resolve;
        setOptions(nextOptions);
      }),
    [],
  );

  const confirmDialog = (
    <ConfirmDialog
      open={options !== null}
      onOpenChange={(open) => {
        if (!open) settle(false);
      }}
      title={options?.title ?? ''}
      confirmLabel={options?.confirmLabel ?? 'Confirmer'}
      description={options?.description}
      record={options?.record}
      warning={options?.warning}
      cancelLabel={options?.cancelLabel}
      variant={options?.variant}
      requireTyping={options?.requireTyping}
      onConfirm={() => settle(true)}
    />
  );

  return { confirm, confirmDialog };
}

export default useConfirm;
