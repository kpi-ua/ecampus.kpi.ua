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
