import { NextRequest } from 'next/server';
import { MODULES_BASE_PATH } from './contants';
import { getAuthInfo, gotoNotFound, matchesUrl } from './utils';
import UrlPattern from 'url-pattern';
import { intlMiddleware } from './intl.middleware';

const isAuthorized = async (request: NextRequest) => {
  const payload = getAuthInfo(request);

  if (!payload) {
    return false;
  }

  const pattern = new UrlPattern('/:locale/module/:module(/*)');

  const match = pattern.match(request.nextUrl.pathname);

  if (!match) {
    return false;
  }

  const { module } = match;

  return payload.modules.includes(module);
};

export const authorizationMiddleware = async (request: NextRequest) => {
  // Skip authorization check for non-restricted pages
  if (!matchesUrl(request, MODULES_BASE_PATH, false)) {
    return intlMiddleware(request);
  }

  const authorized = await isAuthorized(request);

  if (!authorized) {
    return gotoNotFound(request);
  }

  return intlMiddleware(request);
};
