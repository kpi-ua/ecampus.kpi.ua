'use server';

import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { TOKEN_COOKIE_NAME } from './constants/cookies';
import { DEFAULT_LOCALE } from '@/i18n/routing';

const Client = (basePath: string) => {
  const getLocaleSafe = async () => {
    try {
      return getLocale();
    } catch (error) {
      return DEFAULT_LOCALE;
    }
  };

  return async <T>(url: string | URL, options: RequestInit = {}) => {
    const { headers = {}, ...otherOptions } = options;
    const jwt = cookies().get(TOKEN_COOKIE_NAME)?.value;
    const locale = await getLocaleSafe();

    const input = new URL(url, basePath).href;

    const contentType = new Headers(headers).get('Content-type') ?? 'application/json';

    const response = await fetch<T>(input, {
      cache: 'no-cache',
      headers: {
        Accept: 'application/json',
        Authorization: jwt ? `Bearer ${jwt}` : '',
        'Content-Type': contentType,
        'Accept-Language': locale,
        ...headers,
      },
      ...otherOptions,
    });

    return response;
  };
};

export const campusFetch = Client(process.env.CAMPUS_API_BASE_PATH!);
