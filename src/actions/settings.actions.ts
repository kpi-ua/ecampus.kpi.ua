'use server';

import { campusFetch } from '@/lib/client';
import { logout } from '@/actions/auth.actions';

export async function changeEmail(email: string) {
  try {
    const response = await campusFetch('settings/email', {
      method: 'PUT',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Bad request');
    }

    await logout();
  } catch (error) {
    throw new Error('Error changing email.');
  }
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
  try {
    const response = await campusFetch('settings/password', {
      method: 'PUT',
      body: JSON.stringify({ password, currentPassword, passwordRepeat }),
    });

    if (!response.ok) {
      throw new Error('Bad request');
    }

    await logout();
  } catch (error) {
    throw new Error('Error changing password.');
  }
}
