'use server';

import { campusFetch } from '@/lib/client';
import { fileUpload } from '@/lib/file-upload';
import { revalidatePath } from 'next/cache';

export async function changeEmail(email: string) {
  const response = await campusFetch('settings/email', {
    method: 'PUT',
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  revalidatePath('/settings');
}

export async function changePhoto(formData: FormData) {
  await fileUpload('profile/photo', formData);
  revalidatePath('/');
}

export async function changePassword(password: string, currentPassword: string) {
  const response = await campusFetch('settings/password', {
    method: 'PUT',
    body: JSON.stringify({ password, currentPassword }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
}
