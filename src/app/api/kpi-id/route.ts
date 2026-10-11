import { exchangeKPIIDTicket, setLoginCookies } from '@/actions/auth.actions';
import { redirect } from '@/i18n/routing';
import { type NextRequest } from 'next/server';
import { getLocale } from 'next-intl/server';
import { KPIID_FAILED_PATH } from '@/middleware/contants';
import { KPIIDFailureReason } from '@/types/models/kpi-id-account';

// The browser lands here straight from KPI ID, so every failure goes to a page, never a raw JSON error.
// The ticket id is a one-time credential: it goes to the server log only, never into the redirect URL.
const fail = (reason: KPIIDFailureReason, locale: string, ticketId?: string | null) => {
  console.error('KPI ID login failed:', { reason, ticketId });

  redirect({ href: { pathname: KPIID_FAILED_PATH, query: { reason } }, locale });
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = await getLocale();
  const ticketId = searchParams.get('ticketId');
  const username = searchParams.get('username');

  if (!ticketId) {
    fail('missing-ticket', locale);
    return;
  }

  const result = await exchangeKPIIDTicket(ticketId);

  if (!result.ok) {
    fail(result.reason, locale, ticketId);
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
    redirect({ href: { pathname: '/login/kpi-id', query: { ticketId } }, locale });
    return;
  }

  const account = accounts.find((acc) => acc.username === username);

  if (!account) {
    fail('username-mismatch', locale, ticketId);
    return;
  }

  await setLoginCookies(account.access_token, account.sessionId, true);
  redirect({ href: '/', locale });
  return;
}
