import { LOCALES, routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

import JWT from 'jsonwebtoken';
import createMiddleware from 'next-intl/middleware';
import dayjs from 'dayjs';
import { trim } from 'radash';
import { getUserDetails } from '@/actions/auth.actions';

const intlMiddleware = createMiddleware(routing);

export const config = {
  matcher: ['/', `/(uk|en)/:path*`],
};

const composePathsRegExp = (paths: string[]) => RegExp(`^(/(${LOCALES.join('|')}))?(${paths.join('|')})/?$`, 'i');

const rootRegExp = new RegExp('^\/?$', 'i');

const honorPageRegExp = composePathsRegExp(['/accept-honor']);

const authPathRegExp = composePathsRegExp(['/login', '/password-reset/success', '/password-reset']);

const publicPathRegExp = composePathsRegExp([
  '/',
  '/login',
  '/password-reset',
  '/password-reset/success',
  '/curator-search',
  '/complaints',
  '/support',
  '/faq',
]);

const isRoot = (request: NextRequest) => rootRegExp.test(request.nextUrl.pathname);
const isPublicPath = (request: NextRequest) => publicPathRegExp.test(request.nextUrl.pathname);
const isAuthPath = (request: NextRequest) => authPathRegExp.test(request.nextUrl.pathname);
const isAcceptHonorPath = (request: NextRequest) => honorPageRegExp.test(request.nextUrl.pathname);

const isAuthenticated = (request: NextRequest) => {
  const cookie = request.cookies.get('token');

  const token = cookie?.value;

  if (!token) {
    return false;
  }

  try {
    const payload = JWT.decode(token, { json: true });

    if (!payload) {
      return false;
    }

    return payload.exp && payload.exp > dayjs().unix();
  } catch (error) {
    return false;
  }
};

const redirectWithIntl = (request: NextRequest, path: string) => {
  const url = request.nextUrl.clone();

  const [, locale] = url.pathname.split('/');

  url.pathname = `/${locale}/${trim(path, '/')}`;
  return NextResponse.redirect(url);
};

const authMiddleware = (request: NextRequest) => {
  if (!isAuthenticated(request)) {
    return redirectWithIntl(request, '/login');
  }

  if (isAuthPath(request)) {
    return redirectWithIntl(request, '/');
  }

  return intlMiddleware(request);
};

const CoHMiddleware = async (request: NextRequest) => {
  const user = await getUserDetails();
  const hasAcceptedCoH = Boolean(user?.codeOfHonorSignDate && user?.studentProfile);

  if (!hasAcceptedCoH && !isAcceptHonorPath(request)) {
    return redirectWithIntl(request, '/accept-honor');
  }

  if (hasAcceptedCoH && isAcceptHonorPath(request)) {
    return redirectWithIntl(request, '/');
  }

  return null;
};

export async function middleware(request: NextRequest) {
  // If it's a root path — process it with i18n middleware first
  if (isRoot(request)) {
    return intlMiddleware(request);
  }

  if (isPublicPath(request)) {
    if (isAuthPath(request) && isAuthenticated(request)) {
      return redirectWithIntl(request, '/');
    }

    return intlMiddleware(request);
  }

  const honorRedirect = await CoHMiddleware(request);
  if (honorRedirect) {
    return honorRedirect;
  }

  return (authMiddleware as any)(request);
}
