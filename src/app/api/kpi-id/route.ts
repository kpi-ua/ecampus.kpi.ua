import { timingSafeEqual } from 'node:crypto';
import { exchangeKPIIDTicket, setLoginCookies } from '@/actions/auth.actions';
import { redirect } from '@/i18n/routing';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { getLocale } from 'next-intl/server';
import { KPIID_STATE_COOKIE_NAME } from '@/lib/constants/common';
import { createKPIIDState, getKPIIDLoginUrl, isRestartedKPIIDState, setKPIIDStateCookie } from '@/lib/kpi-id-state';
import { KPIID_FAILED_PATH } from '@/middleware/contants';
import { KPIIDFailure } from '@/types/models/kpi-id-account';

// The browser lands here straight from KPI ID, so every failure goes to a page, never a raw JSON error.
// The ticket id is a one-time credential: it goes to the server log only, never into the redirect URL.
const fail = ({ reason, status }: KPIIDFailure, locale: string, ticketId?: string | null) => {
  console.error('KPI ID login failed:', { reason, status, ticketId });

  const query = status === undefined ? { reason } : { reason, status };

  redirect({ href: { pathname: KPIID_FAILED_PATH, query }, locale });
};

// Starts a login of our own, bound to a fresh state. Thanks to SSO, KPI ID brings the user straight back with a
// ticket, so the user does not have to press the button again.
const restart = (locale: string) => {
  const state = createKPIIDState(true);
  const response = NextResponse.redirect(getKPIIDLoginUrl(state, locale));

  setKPIIDStateCookie(response.cookies, state);

  return response;
};

const isSameState = (actual: string, expected: string) => {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);

  // timingSafeEqual throws on buffers of different length, and equal string lengths do not imply equal byte lengths.
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = await getLocale();
  const resolvedCookies = await cookies();
  const ticketId = searchParams.get('ticketId');
  const username = searchParams.get('username');
  const state = searchParams.get('state');
  const expectedState = resolvedCookies.get(KPIID_STATE_COOKIE_NAME)?.value;

  if (!ticketId) {
    fail({ reason: 'missing-ticket' }, locale);
    return;
  }

  // A login started from the KPI ID catalogue carries no state, so this browser has nothing to compare it with.
  if (!state) {
    return restart(locale);
  }

  if (!expectedState) {
    // The restarted login came back without its cookie as well: the browser is not keeping cookies.
    if (isRestartedKPIIDState(state)) {
      fail({ reason: 'no-state-cookie' }, locale, ticketId);
      return;
    }

    // The login page outlived its cookie (it lives KPIID_STATE_MAX_AGE_SECONDS); nothing to compare with either.
    return restart(locale);
  }

  if (!isSameState(state, expectedState)) {
    resolvedCookies.delete(KPIID_STATE_COOKIE_NAME);
    fail({ reason: 'state-mismatch' }, locale, ticketId);
    return;
  }

  const result = await exchangeKPIIDTicket(ticketId);

  if (!result.ok) {
    resolvedCookies.delete(KPIID_STATE_COOKIE_NAME);
    fail(result, locale, ticketId);
    return;
  }

  const { accounts } = result;

  if (accounts.length === 1) {
    const [account] = accounts;

    resolvedCookies.delete(KPIID_STATE_COOKIE_NAME);
    await setLoginCookies(account.access_token, account.sessionId, true);
    redirect({ href: '/', locale });
    return;
  }

  // The account picker sends the user back here with a username, so the state stays until that hop is verified too.
  if (!username) {
    redirect({ href: { pathname: '/login/kpi-id', query: { ticketId, state } }, locale });
    return;
  }

  const account = accounts.find((acc) => acc.username === username);

  if (!account) {
    resolvedCookies.delete(KPIID_STATE_COOKIE_NAME);
    fail({ reason: 'username-mismatch' }, locale, ticketId);
    return;
  }

  resolvedCookies.delete(KPIID_STATE_COOKIE_NAME);
  await setLoginCookies(account.access_token, account.sessionId, true);
  redirect({ href: '/', locale });
  return;
}
