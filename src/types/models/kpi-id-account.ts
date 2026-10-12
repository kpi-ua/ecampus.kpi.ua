export interface KPIIDAccountSlim {
  username: string;
  full_name: string;
  photo: string;
}

export interface KPIIDAccount extends KPIIDAccountSlim {
  access_token: string;
  sessionId: string;
  token_type: string;
  expires_in: number;
}

// Shown to the user as an error code and logged, so support can tell KPI ID login failures apart.
export const KPIID_FAILURE_REASONS = [
  'missing-ticket',
  'state-mismatch',
  'no-state-cookie',
  'no-accounts',
  'username-mismatch',
  'network',
  'api',
] as const;

export type KPIIDFailureReason = (typeof KPIID_FAILURE_REASONS)[number];

export interface KPIIDFailure {
  reason: KPIIDFailureReason;
  // HTTP status of the Campus API response, set only for the 'api' reason.
  status?: number;
}

export type KPIIDTicketExchange = { ok: true; accounts: KPIIDAccount[] } | ({ ok: false } & KPIIDFailure);
