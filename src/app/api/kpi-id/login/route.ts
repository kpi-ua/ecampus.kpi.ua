import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getLocale } from 'next-intl/server';
import { KPIID_STATE_COOKIE_NAME } from '@/lib/constants/common';
import { createKPIIDState, getKPIIDLoginUrl, setKPIIDStateCookie } from '@/lib/kpi-id-state';

// Starts a KPI ID login bound to a state of this browser, without the widget. Entry point for the KPI ID catalogue
// (its login URL): thanks to SSO, KPI ID brings the user straight back with a ticket. A state already in the cookie is
// still unused (the callback deletes it), so it is reused: an open login page keeps working.
export async function GET() {
  const locale = await getLocale();
  const state = (await cookies()).get(KPIID_STATE_COOKIE_NAME)?.value || createKPIIDState();
  const response = NextResponse.redirect(getKPIIDLoginUrl(state, locale));

  setKPIIDStateCookie(response.cookies, state);

  return response;
}
