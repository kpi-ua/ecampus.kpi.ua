import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Client = (basePath: string) => {
  return async (url: string | URL, options: RequestInit = {}) => {
    const { headers, ...otherOptions } = options;
    const jwt = cookies().get('token')?.value;

    const input = new URL(url, basePath).href;

    const response = await fetch(input, {
      cache: 'no-cache',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt ? `Bearer ${cookies().get('token')?.value}` : '',
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
