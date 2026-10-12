import { NextResponse } from 'next/server';
import { KPIID_STATE_COOKIE_NAME, KPIID_STATE_MAX_AGE_SECONDS } from '@/lib/constants/common';

// The KPI ID widget bakes data-state into its link when the login page renders, so the state has to exist before
// the page does. The callback compares it with the cookie and deletes the cookie, giving one value per login.
// See https://auth.kpi.ua/uk/integration, "Параметр state".
export const withKPIIDState = (response: NextResponse) => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const state = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

  // Lax, because KPI ID brings the user back with a cross-site top-level redirect.
  response.cookies.set(KPIID_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: KPIID_STATE_MAX_AGE_SECONDS,
    path: '/',
  });

  return response;
};
