import { NextResponse } from 'next/server';
import { createKPIIDState, setKPIIDStateCookie } from '@/lib/kpi-id-state';

// The KPI ID widget bakes data-state into its link when the login page renders, so the state has to exist before
// the page does. The callback compares it with the cookie and deletes the cookie, giving one value per login.
// See https://auth.kpi.ua/uk/integration, "Параметр state".
export const withKPIIDState = (response: NextResponse) => {
  setKPIIDStateCookie(response.cookies, createKPIIDState());

  return response;
};
