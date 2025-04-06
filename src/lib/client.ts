'use server';

import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';

const Client = (basePath: string) => {
  return async <T>(url: string | URL, options: RequestInit = {}) => {
    const { headers = {}, ...otherOptions } = options;
    const jwt = cookies().get('token')?.value;
    const locale = await getLocale();

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
