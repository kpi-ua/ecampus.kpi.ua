import { exchangeKPIIDTicket, setLoginCookies } from '@/actions/auth.actions';
import { redirect } from '@/i18n/routing';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';
import { getLocale } from 'next-intl/server';
import { KPIID_STATE_COOKIE_NAME } from '@/lib/constants/common';
import { KPIID_FAILED_PATH, LOGIN_PATH } from '@/middleware/contants';
import { KPIIDFailure } from '@/types/models/kpi-id-account';

// The browser lands here straight from KPI ID, so every failure goes to a page, never a raw JSON error.
// The ticket id is a one-time credential: it goes to the server log only, never into the redirect URL.
const fail = ({ reason, status }: KPIIDFailure, locale: string, ticketId?: string | null) => {
  console.error('KPI ID login failed:', { reason, status, ticketId });

  const query = status === undefined ? { reason } : { reason, status };

  redirect({ href: { pathname: KPIID_FAILED_PATH, query }, locale });
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

  // A login started from the KPI ID catalogue carries no state, and a login page left open longer than the cookie
  // lives has nothing to compare it with. Either way the login page issues a fresh state, its button starts a login
  // of this browser's own, and SSO brings the user straight back with a ticket bound to it.
  if (!state || !expectedState) {
    redirect({ href: LOGIN_PATH, locale });
    return;
  }

  // Checked before the exchange: the ticket is single-use, so a foreign one must not be spent. The cookie stays:
  // a forged callback must not cancel this browser's own login.
  if (state !== expectedState) {
    fail({ reason: 'state-mismatch' }, locale, ticketId);
    return;
  }

  const result = await exchangeKPIIDTicket(ticketId);

  // One state per login. Only the account picker keeps it, since it sends the user back here with a username.
  if (!result.ok || result.accounts.length === 1 || username) {
    resolvedCookies.delete(KPIID_STATE_COOKIE_NAME);
  }

  if (!result.ok) {
    fail(result, locale, ticketId);
    return;
  }

  const { accounts } = result;

  if (accounts.length === 1) {
    const [account] = accounts;

    await setLoginCookies(account.access_token, account.sessionId, true);
    redirect({ href: '/', locale });
    return;
  }

  if (!username) {
    redirect({ href: { pathname: '/login/kpi-id', query: { ticketId, state } }, locale });
    return;
  }

  const account = accounts.find((acc) => acc.username === username);

  if (!account) {
    fail({ reason: 'username-mismatch' }, locale, ticketId);
    return;
  }

  await setLoginCookies(account.access_token, account.sessionId, true);
  redirect({ href: '/', locale });
  return;
}
