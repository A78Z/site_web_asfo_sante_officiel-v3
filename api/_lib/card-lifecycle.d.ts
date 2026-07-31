/** Typage du module partagé `card-lifecycle.js`. */

export declare const CARD_STATES: {
  TO_PRINT: 'À éditer';
  PRINTED: 'Éditée';
  AVAILABLE: 'Disponible';
  HANDED_OVER: 'Remise';
};
export type CardState = (typeof CARD_STATES)[keyof typeof CARD_STATES];

export declare const CARD_STATE_ORDER: CardState[];
export declare const REMINDABLE_STATE: CardState;
export declare function isCardState(value: unknown): boolean;
export declare function defaultCardState(requestStatus: string): CardState | null;
export declare function validatePickupDetails(pickup: {
  location?: unknown;
  date?: unknown;
  hours?: unknown;
}): string | null;
export declare function cardStateFields(
  state: CardState,
  pickup?: Record<string, unknown>,
  actor?: Record<string, unknown>,
): Record<string, unknown>;
