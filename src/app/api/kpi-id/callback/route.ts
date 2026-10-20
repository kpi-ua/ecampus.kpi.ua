import { exchangeKPIIDCode, setLoginCookies } from '@/actions/auth.actions';
import { redirect } from '@/i18n/routing';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';
import { getLocale } from 'next-intl/server';
import * as oauth from 'oauth4webapi';
import {
  KPIID_ACCOUNTS_COOKIE_NAME,
  KPIID_COOKIE_MAX_AGE_SECONDS,
  KPIID_TRANSACTION_COOKIE_NAME,
  parseKPIIDTransaction,
  validateKPIIDCallback,
} from '@/lib/kpi-id';
import { KPIID_CALLBACK_PATH, KPIID_FAILED_PATH } from '@/proxy/contants';
import { KPIIDAccountSlim, KPIIDFailure } from '@/types/models/kpi-id-account';

// The browser lands here straight from KPI ID (the redirect URI), so every failure goes to a page, never a raw JSON
// error. The code is a one-time credential: it is never logged nor put into a redirect URL.
const fail = ({ reason, status }: KPIIDFailure, locale: string, details?: unknown) => {
  console.error('KPI ID login failed:', { reason, status, details });

  const query = status === undefined ? { reason } : { reason, status };

  redirect({ href: { pathname: KPIID_FAILED_PATH, query }, locale });
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = await getLocale();
  const resolvedCookies = await cookies();
  const transaction = parseKPIIDTransaction(resolvedCookies.get(KPIID_TRANSACTION_COOKIE_NAME)?.value);
  const deleteTransaction = () =>
    resolvedCookies.delete({ name: KPIID_TRANSACTION_COOKIE_NAME, path: KPIID_CALLBACK_PATH });

  // No sign-in was started in this browser, or it was started longer ago than the cookie lives.
  if (!transaction) {
    fail({ reason: 'session-expired' }, locale);
    return;
  }

  let parameters: URLSearchParams;

  try {
    parameters = await validateKPIIDCallback(searchParams, transaction);
  } catch (error) {
    if (error instanceof oauth.AuthorizationResponseError) {
      deleteTransaction();
      fail({ reason: error.error === 'access_denied' ? 'access-denied' : 'kpi-id-error' }, locale, error.error);
      return;
    }

    // Checked first: the code is single-use, so a foreign one must not be spent. The cookie stays: a forged callback
    // must not cancel this browser's own sign-in. Only the message is logged, the error carries the code.
    if (error instanceof oauth.OperationProcessingError || error instanceof oauth.UnsupportedOperationError) {
      fail({ reason: 'invalid-response' }, locale, error.message);
      return;
    }

    // The discovery document could not be fetched.
    fail({ reason: 'network' }, locale, error);
    return;
  }

  // One transaction per sign-in.
  deleteTransaction();

  const code = parameters.get('code');

  if (!code) {
    fail({ reason: 'missing-code' }, locale);
    return;
  }

  const result = await exchangeKPIIDCode({
    code,
    codeVerifier: transaction.codeVerifier,
    redirectUri: transaction.redirectUri,
    nonce: transaction.nonce,
  });

  if (!result.ok) {
    fail(result, locale);
    return;
  }

  const { accounts } = result;
  const { username } = transaction;
  const account = accounts.length === 1 ? accounts[0] : accounts.find((acc) => username && acc.username === username);

  if (account) {
    resolvedCookies.delete(KPIID_ACCOUNTS_COOKIE_NAME);

    await setLoginCookies(account.access_token, account.sessionId, true);
    redirect({ href: '/', locale });
    return;
  }

  if (username) {
    fail({ reason: 'username-mismatch' }, locale);
    return;
  }

  // Several accounts: the picker lists them and starts a new sign-in for the chosen one, which KPI ID answers without
  // asking the user again (SSO). Only the public part of the accounts is kept; the Campus tokens are dropped.
  const slimAccounts: KPIIDAccountSlim[] = accounts.map(({ username, photo, full_name }) => ({
    username,
    photo,
    full_name,
  }));

  resolvedCookies.set(KPIID_ACCOUNTS_COOKIE_NAME, JSON.stringify(slimAccounts), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: KPIID_COOKIE_MAX_AGE_SECONDS,
    path: '/',
  });

  redirect({ href: '/login/kpi-id', locale });
}
