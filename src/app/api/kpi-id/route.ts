import { getKPIIDAccounts, setLoginCookies } from '@/actions/auth.actions';
import { redirect } from '@/i18n/routing';
import { type NextRequest } from 'next/server';
import { badRequestResponse, notFoundResponse } from '../responses';
import { getLocale } from 'next-intl/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = await getLocale();
  const ticketId = searchParams.get('ticketId');
  const username = searchParams.get('username');

  if (!ticketId) {
    return badRequestResponse('ticketId is required');
  }

  const accounts = await getKPIIDAccounts(ticketId);

  if (!accounts?.length) {
    return notFoundResponse('No accounts found');
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
    return notFoundResponse('Account not found');
  }

  await setLoginCookies(account.access_token, account.sessionId, true);
  redirect({ href: '/', locale });
  return;
}
