'use server';

import { campusFetch } from '@/lib/client';
import { cookies } from 'next/headers';
import qs from 'query-string';

// 30 Days
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

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

    const userResponse = await campusFetch('account/info', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jsonResponse.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return null;
    }

    const user = await userResponse.json();

    const maxAge = rememberMe ? COOKIE_MAX_AGE : undefined;

    cookies().set('SID', jsonResponse.session_id, { domain: 'localhost', httpOnly: true, maxAge });
    cookies().set('token', jsonResponse.access_token, { domain: 'localhost', httpOnly: true, maxAge });

    return user;
  } catch (error) {
    return null;
  }
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
      const t = await response.text();
      console.log(t);
      return null;
    }

    return null;
  } catch (error) {
    console.log(error);
    throw new Error('Bad request');
  }
}