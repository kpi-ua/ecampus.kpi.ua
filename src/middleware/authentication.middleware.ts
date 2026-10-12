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

export const authenticationMiddleware = (request: NextRequest) => {
  const userAuthenticated = isAuthenticated(request);

  if (userAuthenticated) {
    return codeOfHonorMiddleware(request);
  }

  // A state already in the cookie is still unused (the callback deletes it), so it is reused rather than replaced.
  if (matchesUrl(request, LOGIN_PATH) && !request.cookies.has(KPIID_STATE_COOKIE_NAME)) {
    return withKPIIDState(intlMiddleware(request));
  }

  if (matchesAnyUrl(request, PUBLIC_PATHS, false)) {
    return intlMiddleware(request);
  }

  return gotoLogin(request);
};
