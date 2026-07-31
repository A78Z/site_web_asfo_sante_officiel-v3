/** Typage du module partagé `senegal-phone.js`, importé côté client comme serveur. */

export declare const SENEGAL_DIALLING_CODE: '+221';
export declare const SENEGAL_LOCAL_LENGTH: 9;
export declare const SENEGAL_MOBILE_PREFIXES: readonly string[];

/** Cause précise d’un refus, pour choisir le message affiché. */
export type SenegalPhoneIssue =
  | 'empty'
  | 'landline'
  | 'too_short'
  | 'too_long'
  | 'not_mobile';

export declare function extractSenegalLocalDigits(input: unknown): string;
export declare function normalizeSenegalPhone(input: unknown): string | null;
export declare function senegalPhoneIssue(input: unknown): SenegalPhoneIssue | null;
export declare function formatSenegalLocal(digits: unknown): string;
