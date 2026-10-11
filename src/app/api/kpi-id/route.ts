import { getKPIIDAccounts, setLoginCookies } from '@/actions/auth.actions';
import { redirect } from '@/i18n/routing';
import { type NextRequest } from 'next/server';
import { getLocale } from 'next-intl/server';
import { KPIID_FAILED_PATH } from '@/middleware/contants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = await getLocale();
  const ticketId = searchParams.get('ticketId');
  const username = searchParams.get('username');

  // The browser lands here straight from KPI ID, so every failure goes to a page, never a raw JSON error.
  if (!ticketId) {
    redirect({ href: KPIID_FAILED_PATH, locale });
    return;
  }

  const accounts = await getKPIIDAccounts(ticketId);

  if (!accounts?.length) {
    redirect({ href: KPIID_FAILED_PATH, locale });
    return;
  }

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
    redirect({ href: KPIID_FAILED_PATH, locale });
    return;
  }

  await setLoginCookies(account.access_token, account.sessionId, true);
  redirect({ href: '/', locale });
  return;
}
