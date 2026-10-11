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
export const KPIID_FAILURE_TYPES = ['missing-ticket', 'no-accounts', 'username-mismatch', 'network'] as const;

export type KPIIDFailureReason = (typeof KPIID_FAILURE_TYPES)[number] | `api-${number}`;

export type KPIIDTicketExchange = { ok: true; accounts: KPIIDAccount[] } | { ok: false; reason: KPIIDFailureReason };
