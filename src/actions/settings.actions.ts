'use server';

import { campusFetch } from '@/lib/client';
import { logout } from '@/actions/auth.actions';

export async function changeEmail(email: string) {
  let response;
  try {
    response = await campusFetch('settings/email', {
      method: 'PUT',
      body: JSON.stringify({ email }),
    });
  } catch (error) {
    throw new Error('Error changing email.');
  }

  response.ok && (await logout());
}

export async function changePhoto(formData: FormData) {
  try {
    await campusFetch('profile/photo', {
      method: 'PUT',
      body: formData,
    });
  } catch (error) {
    throw new Error('Error changing photo.');
  }
}

export async function changePassword(password: string, currentPassword: string, passwordRepeat: string) {
  let response;
  try {
    response = await campusFetch('settings/password', {
      method: 'PUT',
      body: JSON.stringify({ password, currentPassword, passwordRepeat }),
    });
  } catch (error) {
    throw new Error('Error changing password.');
  }

  response.ok && (await logout());
}
