/** Typage du module partagé `reminder-audience.js`. */

export interface ExcludedRecipient {
  objectId: string;
  name: string;
  reason: string;
  detail?: string;
}

export interface Audience<T = Record<string, unknown>> {
  recipients: (T & { name: string; phone: string })[];
  excluded: ExcludedRecipient[];
}

export declare const EXCLUSION_REASONS: Record<string, string>;
export declare const EXCLUSION_LABELS: Record<string, string>;
export declare function looksLikeTestAccount(member: unknown): boolean;
export declare function buildAudience<T>(
  members: T[],
  options?: {
    skipAlreadyNotified?: boolean;
    includeTestAccounts?: boolean;
    allowUnavailableCards?: boolean;
    requireAvailableCard?: boolean;
  },
): Audience<T>;
export declare function audienceSummary(
  audience: Audience,
  totalSegments: number,
): {
  recipientCount: number;
  excludedCount: number;
  totalSegments: number;
  excludedByReason: { reason: string; label: string; count: number }[];
};
