'use server';

import qs from 'query-string';
import JWT from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { campusFetch } from '@/lib/client';
import { User } from '@/types/models/user';
import { AuthResponse } from '@/types/models/auth-response';
import { KPIIDAccount } from '@/types/models/kpi-id-account';

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;

export async function setLoginCookies(token: string, sessionId: string, rememberMe: boolean) {
  const tokenData = JWT.decode(token) as { exp: number };
  // exp is in seconds, Date expects milliseconds
  const tokenExpiresAt = new Date(tokenData.exp * 1000);

  const expires = rememberMe ? tokenExpiresAt : undefined;

  cookies().set('SID', sessionId, { domain: COOKIE_DOMAIN, httpOnly: true, expires });
  cookies().set('token', token, { domain: COOKIE_DOMAIN, httpOnly: true, expires });
}

export async function loginWithCredentials(username: string, password: string, rememberMe: boolean) {
  try {
    const payload = {
      username,
      password,
      grant_type: 'password',
    };

    const response = await campusFetch<AuthResponse>('oauth/token', {
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

    const { sessionId, access_token } = jsonResponse;

    await setLoginCookies(access_token, sessionId, rememberMe);
  } catch (error) {
    return null;
  }
  redirect('/');
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

export async function getUserDetails() {
  const userResponse = await campusFetch<User>('profile');

  if (!userResponse.ok) {
    return null;
  }

  return userResponse.json();
}

export async function redirectToEmploymentSystem() {
  const response = await campusFetch<string>('employment-system/auth');
  const url = await response.json();
  redirect(url);
}

export async function getKPIIDAccounts(ticketId: string) {
  const response = await campusFetch<KPIIDAccount[]>(`/auth/kpi-id?ticketId=${ticketId}`);

  if (!response.ok) {
    return null;
  }

  return response.json();
}
