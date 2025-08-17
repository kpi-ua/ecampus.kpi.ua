import { NextRequest } from 'next/server';
import { needsLocaleHandling } from './middleware/utils';
import { authenticationMiddleware } from './middleware/authentication.middleware';
import { intlMiddleware } from './middleware/intl.middleware';

export const config = {
  matcher: ['/', `/(uk|en)/:path*`, '/((?!.*\\.).*)'],
};

export async function middleware(request: NextRequest) {
  // If the path needs locale handling, process it with i18n middleware first
  if (needsLocaleHandling(request)) {
    return intlMiddleware(request);
  }

  return authenticationMiddleware(request);
}
