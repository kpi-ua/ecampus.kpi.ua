import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { KPIID_STATE_COOKIE_NAME, KPIID_STATE_MAX_AGE_SECONDS, KPIID_URL } from '@/lib/constants/common';

// Marks a state minted by the callback while restarting a login. If such a state comes back without its cookie too,
// the browser is not keeping cookies and restarting once more would loop.
const RESTARTED_STATE_PREFIX = 'r.';

interface CookieJar {
  set(name: string, value: string, options?: Partial<ResponseCookie>): unknown;
}

// 128 bits of randomness as hex, per https://auth.kpi.ua/uk/integration, "Параметр state".
export const createKPIIDState = (restarted = false) => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const random = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

  return restarted ? `${RESTARTED_STATE_PREFIX}${random}` : random;
};

export const isRestartedKPIIDState = (state: string) => state.startsWith(RESTARTED_STATE_PREFIX);

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

// The address the widget's button leads to, built here when the callback has to start a login itself.
export const getKPIIDLoginUrl = (state: string, locale: string) => {
  const url = new URL(`/${locale}/`, KPIID_URL);

  url.searchParams.set('appId', process.env.NEXT_PUBLIC_KPI_ID_APP_ID!);
  url.searchParams.set('state', state);

  return url;
};
