'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const FileUpload = (basePath: string) => {
  return async (url: string | URL, formData: FormData) => {
    const jwt = cookies().get('token')?.value;

    if (!jwt) {
      redirect('/');
    }

    const input = new URL(url, basePath).href;

    const response = await fetch(input, {
      method: 'POST',
      cache: 'no-cache',
      body: formData,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (response.status === 401) {
      cookies().delete('token');
      redirect('/');
    }

    if (!response.ok) {
      throw new Error('Error uploading file.');
    }
  };
};

export const fileUpload = FileUpload(process.env.CAMPUS_API_BASE_PATH!);
