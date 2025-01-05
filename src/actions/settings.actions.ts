'use server';

import { campusFetch } from '@/lib/client';
import { getUserDetails } from '@/actions/auth.actions';
import { fileUpload } from '@/lib/file-upload';

export async function changeEmail(email: string) {
  const response = await campusFetch('settings/email', {
    method: 'PUT',
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return getUserDetails();
}

export async function changePhoto(formData: FormData) {
  await fileUpload('profile/photo', formData);
}

export async function changePassword(password: string, currentPassword: string, passwordRepeat: string) {
  const response = await campusFetch('settings/password', {
    method: 'PUT',
    body: JSON.stringify({ password, currentPassword, passwordRepeat }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
}
