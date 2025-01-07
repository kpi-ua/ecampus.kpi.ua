'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Client = (basePath: string) => {
  return async (url: string | URL, options: RequestInit = {}) => {
    const { headers = {}, ...otherOptions } = options;
    const jwt = cookies().get('token')?.value;

    const input = new URL(url, basePath).href;

    const contentType = new Headers(headers).get('Content-type') ?? 'application/json';

    const response = await fetch(input, {
      cache: 'no-cache',
      headers: {
        Accept: 'application/json',
        Authorization: jwt ? `Bearer ${jwt}` : '',
        'Content-Type': contentType,
        ...headers,
      },
      ...otherOptions,
    });

    if (response.status === 401) {
      cookies().delete('token');
      redirect('/');
    }

    return response;
  };
};

export const campusFetch = Client(process.env.CAMPUS_API_BASE_PATH!);
