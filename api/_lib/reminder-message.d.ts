/** Typage du module partagé `reminder-message.js`. */

export interface MessageVariable {
  token: string;
  label: string;
  field: string;
}

export interface MessageMetrics {
  characters: number;
  segments: number;
}

export interface TemplateAnalysis {
  totalSegments: number;
  recipientCount: number;
  worstCase: (MessageMetrics & { message: string; memberId: string }) | null;
  unknownTokens: string[];
}

export declare const MESSAGE_VARIABLES: MessageVariable[];
export declare const DEFAULT_SEGMENT_CAP: number;
export declare function stripAccents(value: unknown): string;
export declare function formatPickupDate(isoDate: unknown): string;
export declare function recipientVariables(member: unknown): Record<string, string>;
export declare function unknownTokens(template: unknown): string[];
export declare function renderReminder(template: unknown, member: unknown): string;
export declare function messageMetrics(message: string): MessageMetrics;
export declare function analyseTemplate(template: unknown, members: unknown[]): TemplateAnalysis;
