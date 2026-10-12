import dayjs from 'dayjs';
import { NextRequest } from 'next/server';
import { getAuthInfo, gotoLogin, matchesAnyUrl, matchesUrl } from './utils';
import { codeOfHonorMiddleware } from './code-of-honor.middleware';
import { LOGIN_PATH, PUBLIC_PATHS } from './contants';
import { intlMiddleware } from './intl.middleware';
import { withKPIIDState } from './kpi-id-state.middleware';
import { KPIID_STATE_COOKIE_NAME } from '@/lib/constants/common';

const isAuthenticated = (request: NextRequest) => {
  const payload = getAuthInfo(request);

  if (!payload) {
    return false;
  }

  return payload.exp && payload.exp > dayjs().unix();
};

const resolve = (request: NextRequest) => {
  if (isAuthenticated(request)) {
    return codeOfHonorMiddleware(request);
  }

  if (matchesAnyUrl(request, PUBLIC_PATHS, false)) {
    return intlMiddleware(request);
  }

  return gotoLogin(request);
};

export const authenticationMiddleware = async (request: NextRequest) => {
  const response = await resolve(request);

  // The login page is served to signed-in users as well (e.g. to switch accounts), so its KPI ID button needs a state
  // whatever the branch above chose. A state already in the cookie is still unused (the callback deletes it), so it
  // is reused rather than replaced.
  if (matchesUrl(request, LOGIN_PATH) && !request.cookies.has(KPIID_STATE_COOKIE_NAME)) {
    return withKPIIDState(response);
  }

  return response;
};
