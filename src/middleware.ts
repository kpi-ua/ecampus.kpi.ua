import { NextRequest } from 'next/server';
import { isRoot } from './middleware/utils';
import { authenticationMiddleware } from './middleware/authentication.middleware';
import { intlMiddleware } from './middleware/intl.middleware';

export const config = {
  matcher: ['/', `/(uk|en)/:path*`],
};

export async function middleware(request: NextRequest) {
  // If it's a root path — process it with i18n middleware first
  if (isRoot(request)) {
    console.log('is root');
    return intlMiddleware(request);
  }

  return authenticationMiddleware(request);
}
