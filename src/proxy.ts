import { NextRequest } from 'next/server';

import { authenticationProxy } from './proxy/authentication.middleware';
import { intlProxy } from './proxy/intl.proxy';
import { needsLocaleHandling } from './proxy/utils';

export const config = {
  matcher: ['/', `/(uk|en)/:path*`, '/((?!_next|api|favicon.ico|.*\\.[^/]+$).*)'],
};

export async function proxy(request: NextRequest) {
  // If the path needs locale handling, process it with i18n middleware first
  if (needsLocaleHandling(request)) {
    return intlProxy(request);
  }

  return authenticationProxy(request);
}
