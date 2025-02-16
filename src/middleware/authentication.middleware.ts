import dayjs from 'dayjs';
import { NextRequest } from 'next/server';
import { getAuthInfo, gotoLogin, matchesAnyUrl } from './utils';
import { codeOfHonorMiddleware } from './code-of-honor.middleware';
import { PUBLIC_PATHS } from './contants';
import { intlMiddleware } from './intl.middleware';

const isAuthenticated = (request: NextRequest) => {
  const payload = getAuthInfo(request);

  if (!payload) {
    return false;
  }

  return payload.exp && payload.exp > dayjs().unix();
};

export const authenticationMiddleware = (request: NextRequest) => {
  const userAuthenticated = isAuthenticated(request);

  console.log('userAuthenticated', userAuthenticated);
  if (userAuthenticated) {
    return codeOfHonorMiddleware(request);
  }

  if (matchesAnyUrl(request, PUBLIC_PATHS, false)) {
    return intlMiddleware(request);
  }

  return gotoLogin(request);
};
