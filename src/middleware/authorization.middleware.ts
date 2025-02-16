import { NextRequest } from 'next/server';
import { MODULES_BASE_PATHS } from './contants';
import { getAuthInfo, gotoRoot, matchesAnyUrl } from './utils';
import UrlPattern from 'url-pattern';
import { getUserDetails } from '@/actions/auth.actions';
import { ProfileArea } from '@/types/enums/profile-area';
import { intlMiddleware } from './intl.middleware';

const isAuthorized = async (request: NextRequest) => {
  const payload = getAuthInfo(request);
  // TODO: Refactor to not use actions here
  const user = await getUserDetails();

  if (!payload || !user) {
    return false;
  }

  const pattern = new UrlPattern('/:locale/:profileArea/module/:module(/*)');

  const match = pattern.match(request.nextUrl.pathname);

  if (!match) {
    return false;
  }

  const { profileArea, module } = match;

  if (!!user.studentProfile && profileArea !== ProfileArea.Student) {
    return false;
  }

  return payload.modules.includes(module);
};

export const authorizationMiddleware = (request: NextRequest) => {
  // Skip authorization check for non-restricted pages
  if (!matchesAnyUrl(request, MODULES_BASE_PATHS, false)) {
    return intlMiddleware(request);
  }

  if (!isAuthorized(request)) {
    // Do we need a dedicated "Unauthorized" page?
    return gotoRoot(request);
  }

  return intlMiddleware(request);
};
