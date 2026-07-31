/** Typage du module partagé `member-request-validation.js`. */

export declare function compactWhitespace(value: unknown): string;
export declare function isJunkText(value: unknown): boolean;
export declare function isDisposableEmail(value: unknown): boolean;

/** Renvoie un message d’erreur en français, ou `null` si la valeur est valide. */
export declare function validatePersonName(
  value: unknown,
  label: string,
): string | null;
export declare function validateEmail(value: unknown): string | null;
export declare function validateVillage(value: unknown): string | null;
export declare function validateProfessionAutre(value: unknown): string | null;

export declare function validateFieldDistinctness(fields: {
  firstName?: unknown;
  lastName?: unknown;
  village?: unknown;
  professionAutre?: unknown;
}): string | null;
