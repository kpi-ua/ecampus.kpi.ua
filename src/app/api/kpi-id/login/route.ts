import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { KPIID_STATE_COOKIE_NAME, KPIID_STATE_MAX_AGE_SECONDS } from '@/lib/constants/common';

// Starts a KPI ID login with a fresh state, so the callback can tell this browser's login from a planted one.
// See https://auth.kpi.ua/uk/integration, "Параметр state".
export async function GET() {
  const locale = await getLocale();
  const state = randomBytes(16).toString('hex');

  const resolvedCookies = await cookies();

  // Lax, because KPI ID brings the user back with a cross-site top-level redirect.
  resolvedCookies.set(KPIID_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: KPIID_STATE_MAX_AGE_SECONDS,
    path: '/',
  });

  const url = new URL(`/${locale}/`, process.env.KPI_ID_URL);
  url.searchParams.set('appId', process.env.NEXT_PUBLIC_KPI_ID_APP_ID!);
  url.searchParams.set('state', state);

  redirect(url.toString());
}
