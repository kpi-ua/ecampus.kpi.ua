'use server';

import qs from 'query-string';
import JWT from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { campusFetch } from '@/lib/client';
import { User } from '@/types/models/user';
import { AuthResponse } from '@/types/models/auth-response';
import { KPIIDAccount } from '@/types/models/kpi-id-account';
import { SID_COOKIE_NAME, TOKEN_COOKIE_NAME } from '@/lib/constants/cookies';

const MAIN_COOKIE_DOMAIN = process.env.MAIN_COOKIE_DOMAIN;
const ROOT_COOKIE_DOMAIN = process.env.ROOT_COOKIE_DOMAIN;

export async function setLoginCookies(token: string, sessionId: string, rememberMe: boolean) {
  const tokenData = JWT.decode(token) as { exp: number };
  // exp is in seconds, Date expects milliseconds
  const tokenExpiresAt = new Date(tokenData.exp * 1000);

  const expires = rememberMe ? tokenExpiresAt : undefined;

  cookies().set(SID_COOKIE_NAME, sessionId, { domain: ROOT_COOKIE_DOMAIN, httpOnly: true, expires });
  cookies().set(TOKEN_COOKIE_NAME, token, { domain: MAIN_COOKIE_DOMAIN, httpOnly: true, expires });
}

export async function loginWithCredentials(username: string, password: string, rememberMe: boolean) {
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
  return true;
}

export async function logout() {
  cookies().delete({ domain: ROOT_COOKIE_DOMAIN, name: SID_COOKIE_NAME });
  cookies().delete({ domain: MAIN_COOKIE_DOMAIN, name: TOKEN_COOKIE_NAME });

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
