'use server';

import { campusFetch } from '@/lib/client';
import { User } from '@/types/user';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import qs from 'query-string';

// 30 Days
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;

export async function loginWithCredentials(username: string, password: string, rememberMe: boolean) {
  try {
    const payload = {
      username,
      password,
      grant_type: 'password',
    };

    const response = await campusFetch('oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(payload),
    });

    if (response.status < 200 || response.status >= 300) {
      return null;
    }

    const jsonResponse = await response.json();

    if (!jsonResponse) {
      return null;
    }

    const userResponse = await campusFetch('profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jsonResponse.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return null;
    }

    const user: User = await userResponse.json();

    const maxAge = rememberMe ? COOKIE_MAX_AGE : undefined;

    cookies().set('SID', jsonResponse.sessionId, { domain: COOKIE_DOMAIN, httpOnly: true, maxAge });
    cookies().set('token', jsonResponse.access_token, { domain: COOKIE_DOMAIN, httpOnly: true, maxAge });

    return user;
  } catch (error) {
    return null;
  }
}

export async function logout() {
  cookies().delete({ domain: COOKIE_DOMAIN, name: 'SID' });
  cookies().delete({ domain: COOKIE_DOMAIN, name: 'token' });

  redirect('/');
}

export async function resetPassword(username: string, recaptchaToken: string) {
  try {
    const payload = {
      Captcha: recaptchaToken,
      UserIdentifier: username,
    };

    const response = await campusFetch('account/recovery', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`${response.status} Error`);
    }

    return null;
  } catch (error) {
    throw new Error('Bad request');
  }
}

export async function getUserDetails(): Promise<User | null> {
  const userResponse = await campusFetch('profile', {
    method: 'GET',
  });

  if (!userResponse.ok) {
    return null;
  }

  return userResponse.json();
}
