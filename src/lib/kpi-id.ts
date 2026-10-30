import { type NextRequest } from 'next/server';
import * as oauth from 'oauth4webapi';
import * as client from 'openid-client';

import { KPIID_CALLBACK_PATH } from '@/proxy/contants';
import { KPIIDAccountSlim } from '@/types/models/kpi-id-account';

// KPI ID OpenID Connect client: the site starts the sign-in (state, nonce and the PKCE verifier stay in an httpOnly
// cookie), the Campus API redeems the code with the client secret. See https://auth.kpi.ua/uk/integration.

export const KPIID_URL =
  process.env.NEXT_PUBLIC_ENV === 'production' ? 'https://auth.kpi.ua' : 'https://auth.cloud.kpi.ua';

export const KPIID_TRANSACTION_COOKIE_NAME = 'kpi-id-transaction';
export const KPIID_ACCOUNTS_COOKIE_NAME = 'kpi-id-accounts';

// The authorization code lives 5 minutes; this leaves the user time to sign in on KPI ID.
export const KPIID_COOKIE_MAX_AGE_SECONDS = 15 * 60;

const SCOPE = 'openid student_ids employee_ids';

/**
 * Values one sign-in is bound to, kept between the authorization request and the callback.
 */
export interface KPIIDTransaction {
  state: string;
  nonce: string;
  codeVerifier: string;
  // Sent with the authorization request and again with the code, so the callback must not rebuild it.
  redirectUri: string;
  // Set when the user picked one of several accounts: the callback signs in to it without asking again.
  username?: string;
}

// The origin the browser sees, which may differ from the one the server listens on behind a proxy.
const getPublicOrigin = (request: NextRequest) => {
  const host = request.headers.get('x-forwarded-host')?.split(',')[0].trim() || request.nextUrl.host;
  const protocol =
    request.headers.get('x-forwarded-proto')?.split(',')[0].trim() || request.nextUrl.protocol.slice(0, -1);

  return `${protocol}://${host}`;
};

export const createKPIIDTransaction = (request: NextRequest, username?: string): KPIIDTransaction => ({
  state: client.randomState(),
  nonce: client.randomNonce(),
  codeVerifier: client.randomPKCECodeVerifier(),
  redirectUri: new URL(KPIID_CALLBACK_PATH, getPublicOrigin(request)).href,
  username,
});

export const serializeKPIIDTransaction = (transaction: KPIIDTransaction) => JSON.stringify(transaction);

export const parseKPIIDTransaction = (value: string | undefined): KPIIDTransaction | null => {
  if (!value) {
    return null;
  }

  try {
    const { state, nonce, codeVerifier, redirectUri, username } = JSON.parse(value);
    const isValid = [state, nonce, codeVerifier, redirectUri].every((item) => typeof item === 'string' && item);

    if (!isValid) {
      return null;
    }

    return { state, nonce, codeVerifier, redirectUri, username: typeof username === 'string' ? username : undefined };
  } catch {
    return null;
  }
};

export const parseKPIIDAccounts = (value: string | undefined): KPIIDAccountSlim[] => {
  if (!value) {
    return [];
  }

  try {
    const accounts = JSON.parse(value);

    return Array.isArray(accounts) ? accounts.filter((account) => typeof account?.username === 'string') : [];
  } catch {
    return [];
  }
};

// The discovery document names the endpoints and changes rarely: fetched once per process, again after a failure.
let configuration: Promise<client.Configuration> | undefined;

const getConfiguration = () => {
  configuration ??= client.discovery(new URL(KPIID_URL), process.env.NEXT_PUBLIC_KPI_ID_APP_ID!).catch((error) => {
    configuration = undefined;
    throw error;
  });

  return configuration;
};

export async function getKPIIDAuthorizationUrl({ state, nonce, codeVerifier, redirectUri }: KPIIDTransaction) {
  return client.buildAuthorizationUrl(await getConfiguration(), {
    redirect_uri: redirectUri,
    scope: SCOPE,
    state,
    nonce,
    code_challenge: await client.calculatePKCECodeChallenge(codeVerifier),
    code_challenge_method: 'S256',
  });
}

/**
 * Checks what KPI ID brought the browser back with against the sign-in it started: the issuer (RFC 9207), the state
 * and an OAuth error. Returns the parameters to read the code from.
 *
 * @throws {oauth.AuthorizationResponseError} KPI ID answered this sign-in with an error.
 * @throws {oauth.OperationProcessingError} The response does not belong to this sign-in (issuer or state).
 */
export async function validateKPIIDCallback(parameters: URLSearchParams, { state }: KPIIDTransaction) {
  const configuration = await getConfiguration();

  return oauth.validateAuthResponse(configuration.serverMetadata(), configuration.clientMetadata(), parameters, state);
}
