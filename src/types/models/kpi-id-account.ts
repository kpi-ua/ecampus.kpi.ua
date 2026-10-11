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

// Who KPI ID says the person is, when no Campus account matched the ticket.
export type KPIIDRole = 'student' | 'employee';

export type KPIIDTicketExchange =
  | { accounts: KPIIDAccount[] }
  | { failure: 'account-not-found'; roles: KPIIDRole[] }
  | { failure: 'error' };
