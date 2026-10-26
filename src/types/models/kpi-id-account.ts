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
  'session-expired',
  'invalid-response',
  'access-denied',
  'kpi-id-error',
  'missing-code',
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

// What the callback hands the Campus API to redeem the KPI ID authorization code.
export interface KPIIDAuthorization {
  code: string;
  codeVerifier: string;
  redirectUri: string;
  nonce: string;
}

export type KPIIDCodeExchange = { ok: true; accounts: KPIIDAccount[] } | ({ ok: false } & KPIIDFailure);
