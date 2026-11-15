import dayjs from 'dayjs';
import { NextRequest } from 'next/server';

import { codeOfHonorProxy } from './code-of-honor.proxy';
import { PUBLIC_PATHS } from './contants';
import { intlProxy } from './intl.proxy';
import { getAuthInfo, gotoLogin, matchesAnyUrl } from './utils';

const isAuthenticated = (request: NextRequest) => {
  const payload = getAuthInfo(request);

  if (!payload) {
    return false;
  }

  return payload.exp && payload.exp > dayjs().unix();
};

export const authenticationProxy = (request: NextRequest) => {
  const userAuthenticated = isAuthenticated(request);

  if (userAuthenticated) {
    return codeOfHonorProxy(request);
  }

  if (matchesAnyUrl(request, PUBLIC_PATHS, false)) {
    return intlProxy(request);
  }

  return gotoLogin(request);
};
