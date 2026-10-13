import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { KPIID_STATE_COOKIE_NAME, KPIID_STATE_MAX_AGE_SECONDS, KPIID_URL } from '@/lib/constants/common';

interface CookieJar {
  set(name: string, value: string, options?: Partial<ResponseCookie>): unknown;
}

// 128 bits of randomness as hex, per https://auth.kpi.ua/uk/integration, "Параметр state".
export const createKPIIDState = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const setKPIIDStateCookie = (cookies: CookieJar, state: string) => {
  // Lax, because KPI ID brings the user back with a cross-site top-level redirect.
  cookies.set(KPIID_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: KPIID_STATE_MAX_AGE_SECONDS,
    path: '/',
  });
};

// The address the widget's button leads to, built here for /api/kpi-id/login to start a login without the widget.
export const getKPIIDLoginUrl = (state: string, locale: string) => {
  const url = new URL(`/${locale}/`, KPIID_URL);

  url.searchParams.set('appId', process.env.NEXT_PUBLIC_KPI_ID_APP_ID!);
  url.searchParams.set('state', state);

  return url;
};
