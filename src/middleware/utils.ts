import { LOCALES } from '@/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { trim } from 'radash';
import UrlPattern from 'url-pattern';
import { LOGIN_PATH, ROOT_PATH } from './contants';
import { getJWTPayload } from '@/lib/jwt';
import { CampusJwtPayload } from '@/types/campus-jwt-payload';

export const redirectWithIntl = (request: NextRequest, path: string) => {
  const url = request.nextUrl.clone();

  const [, locale] = url.pathname.split('/');

  url.pathname = `/${locale}/${trim(path, '/')}`;
  return NextResponse.redirect(url);
};

export const gotoRoot = (request: NextRequest) => redirectWithIntl(request, ROOT_PATH);
export const gotoLogin = (request: NextRequest) => redirectWithIntl(request, LOGIN_PATH);

export const isRoot = (request: NextRequest) => {
  const pattern = new UrlPattern('(/)');

  return !!pattern.match(request.nextUrl.pathname);
};

export const matchesUrl = (request: NextRequest, url: string, strict = false) => {
  const pattern = new UrlPattern(`/:locale${url}${strict ? '(/*)' : ''}`);

  const match = pattern.match(request.nextUrl.pathname);

  if (!match) {
    return false;
  }

  return LOCALES.includes(match.locale);
};

export const matchesAnyUrl = (request: NextRequest, urls: string[], strict = false) =>
  urls.some((url) => matchesUrl(request, url, strict));

export const getAuthInfo = (request: NextRequest) => {
  const cookie = request.cookies.get('token');

  const token = cookie?.value;

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
