import { LOCALES } from '@/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { trim } from 'radash';
import UrlPattern from 'url-pattern';
import { LOGIN_PATH, NOT_FOUND_PATH, ROOT_PATH } from './contants';
import { getJWTPayload } from '@/lib/jwt';
import { CampusJwtPayload } from '@/types/campus-jwt-payload';
import { TOKEN_COOKIE_NAME } from '@/lib/constants/cookies';

export const redirectWithIntl = (request: NextRequest, path: string) => {
  const url = request.nextUrl.clone();

  const [, locale] = url.pathname.split('/');

  url.pathname = `/${locale}/${trim(path, '/')}`;
  return NextResponse.redirect(url);
};

export const gotoRoot = (request: NextRequest) => redirectWithIntl(request, ROOT_PATH);
export const gotoLogin = (request: NextRequest) => redirectWithIntl(request, LOGIN_PATH);
export const gotoNotFound = (request: NextRequest) => NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url));

export const isRoot = (request: NextRequest) => {
  const pattern = new UrlPattern('(/)');

  return !!pattern.match(request.nextUrl.pathname);
};

export const needsLocaleHandling = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length > 0 && LOCALES.includes(pathSegments[0])) {
    return false;
  }

  return true;
};

export const matchesUrl = (request: NextRequest, url: string, strict = true) => {
  const pattern = new UrlPattern(`/:locale${url}${strict ? '' : '(/*)'}`);

  const match = pattern.match(request.nextUrl.pathname);

  if (!match) {
    return false;
  }

  return LOCALES.includes(match.locale);
};

export const matchesAnyUrl = (request: NextRequest, urls: string[], strict = true) =>
  urls.some((url) => matchesUrl(request, url, strict));

export const getAuthInfo = (request: NextRequest) => {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return undefined;
  }

  try {
    const payload = getJWTPayload<CampusJwtPayload>(token);

    return payload ?? undefined;
  } catch (error) {
    return undefined;
  }
};
