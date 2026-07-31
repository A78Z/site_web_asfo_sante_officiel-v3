import { useEffect, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Loader2, MapPin } from 'lucide-react';
import { CARD_STATES, type CardState } from '../../../api/_lib/card-lifecycle.js';
import { AdminActionError, updateCardState } from '../../lib/adminReminders';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Demandes concernées par le changement d’état. */
  objectIds: string[];
  /** Villages représentés, rappelés pour éviter de mélanger les points de retrait. */
  villages: string[];
  onDone: () => void;
}

/**
 * Applique un état de carte à une sélection.
 *
 * Le passage à `Disponible` exige lieu, date et horaires : ce sont les
 * informations que le SMS portera. Le lieu est enregistré **sur chaque membre**,
 * ce qui garantit qu’un membre de Ndioum ne recevra jamais l’adresse de
 * Diamniadio — d’où le rappel des villages sélectionnés ci-dessous.
 */
export function CardStateDialog({
  open,
  onOpenChange,
  objectIds,
  villages,
  onDone,
}: Props) {
  const [state, setState] = useState<CardState>(CARD_STATES.AVAILABLE);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) setError('');
  }, [open]);

  const needsPickup = state === CARD_STATES.AVAILABLE;
  const canSubmit =
    objectIds.length > 0 &&
    (!needsPickup || (location.trim().length >= 3 && date && hours.trim().length >= 3));

  const apply = async () => {
    setBusy(true);
    setError('');
    try {
      await updateCardState(objectIds, state, { location, date, hours });
      onDone();
      onOpenChange(false);
    } catch (actionError) {
      setError(
        actionError instanceof AdminActionError
          ? actionError.message
          : 'La mise à jour a échoué.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
          <DialogPrimitive.Title className="text-lg font-black text-slate-900">
            État des cartes
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-1 text-sm text-slate-500">
            {objectIds.length} demande{objectIds.length > 1 ? 's' : ''} sélectionnée
            {objectIds.length > 1 ? 's' : ''}.
          </DialogPrimitive.Description>

          {villages.length > 1 && needsPickup && (
            <div className="mt-3 flex gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                La sélection couvre {villages.length} villages ({villages.join(', ')}).
                Le même lieu de retrait leur sera appliqué. Pour un point par
                village, traitez un village à la fois.
              </span>
            </div>
          )}

          <label className="mt-4 block text-sm font-bold text-slate-700">
            Nouvel état
            <select
              value={state}
              onChange={(event) => setState(event.target.value as CardState)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal"
            >
              {Object.values(CARD_STATES).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          {needsPickup && (
            <div className="mt-3 space-y-3">
              <label className="block text-sm font-bold text-slate-700">
                Lieu de retrait
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Ex. Poste de santé de Ndioum"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal"
                />
              </label>
              <label className="block text-sm font-bold text-slate-700">
                Date de disponibilité
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal"
                />
              </label>
              <label className="block text-sm font-bold text-slate-700">
                Horaires
                <input
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  placeholder="Ex. 9h-16h du lundi au vendredi"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal"
                />
              </label>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <div className="mt-6 flex gap-2">
            <DialogPrimitive.Close className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
              Annuler
            </DialogPrimitive.Close>
            <button
              type="button"
              onClick={() => void apply()}
              disabled={!canSubmit || busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Appliquer
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export default CardStateDialog;
