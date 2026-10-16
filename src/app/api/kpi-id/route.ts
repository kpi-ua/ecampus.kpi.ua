import { redirect } from '@/i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';
import { getLocale } from 'next-intl/server';
import {
  createKPIIDTransaction,
  getKPIIDAuthorizationUrl,
  KPIID_COOKIE_MAX_AGE_SECONDS,
  KPIID_TRANSACTION_COOKIE_NAME,
  serializeKPIIDTransaction,
} from '@/lib/kpi-id';
import { KPIID_CALLBACK_PATH, KPIID_FAILED_PATH } from '@/middleware/contants';

// Starts a KPI ID sign-in: the "Sign in with KPI ID" button, the account picker and the KPI ID catalog (initiate login
// URI, with `iss` and `target_link_uri`, which are not needed) lead here. A `ticketId` left over from the ticket flow
// is ignored too: the user signs in through OpenID Connect instead.
export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username') || undefined;
  const transaction = createKPIIDTransaction(request, username);

  let authorizationUrl: URL;

  try {
    authorizationUrl = await getKPIIDAuthorizationUrl(transaction);
  } catch (error) {
    console.error('KPI ID login could not start:', error);

    const locale = await getLocale();

    redirect({ href: { pathname: KPIID_FAILED_PATH, query: { reason: 'network' } }, locale });
    return;
  }

  const response = NextResponse.redirect(authorizationUrl);

  // Lax, because KPI ID brings the user back with a cross-site top-level redirect.
  response.cookies.set(KPIID_TRANSACTION_COOKIE_NAME, serializeKPIIDTransaction(transaction), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: KPIID_COOKIE_MAX_AGE_SECONDS,
    path: KPIID_CALLBACK_PATH,
  });

  return response;
}
