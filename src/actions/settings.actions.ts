'use server';

import { campusFetch } from '@/lib/client';

export async function changeEmail(email: string) {
  try {
    await campusFetch('settings/email', {
      method: 'PUT',
      body: JSON.stringify({ email }),
    });
  } catch (error) {
    throw new Error('Error changing email.');
  }
}

export async function changePhoto(file: FormData) {
  try {
    await campusFetch('profile/photo', {
      method: 'POST',
      body: file,
    });
  } catch (error) {
    throw new Error('Error changing photo.');
  }
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
