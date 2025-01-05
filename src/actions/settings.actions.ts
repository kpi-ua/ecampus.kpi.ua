'use server';

import { campusFetch } from '@/lib/client';
import { getUserDetails } from '@/actions/auth.actions';
import { fileUpload } from '@/lib/file-upload';

export async function changeEmail(email: string) {
  try {
    await campusFetch('settings/email', {
      method: 'PUT',
      body: JSON.stringify({ email }),
    });

    return await getUserDetails();
  } catch (error) {
    throw new Error('Error changing email.');
  }
}

export async function changePhoto(formData: FormData) {
  await fileUpload('profile/photo', formData);
}

export async function changePassword(password: string, currentPassword: string, passwordRepeat: string) {
  try {
    await campusFetch('settings/password', {
      method: 'PUT',
      body: JSON.stringify({ password, currentPassword, passwordRepeat }),
    });
  } catch (error) {
    throw new Error('Error changing password.');
  }
}
