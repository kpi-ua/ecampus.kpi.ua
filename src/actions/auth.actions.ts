'use server';

import JWT from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import qs from 'query-string';

import { campusFetch } from '@/lib/client';
import { SID_COOKIE_NAME, TOKEN_COOKIE_NAME, USER_PROFILE_CACHE_TAG } from '@/lib/constants/common';
import { AuthResponse } from '@/types/models/auth-response';
import { UserCategory } from '@/types/enums/user-category';
import { KPIIDAccount, KPIIDAuthorization, KPIIDCodeExchange } from '@/types/models/kpi-id-account';
import { User } from '@/types/models/user';

const MAIN_COOKIE_DOMAIN = process.env.MAIN_COOKIE_DOMAIN;
const ROOT_COOKIE_DOMAIN = process.env.ROOT_COOKIE_DOMAIN;

export async function setLoginCookies(token: string, sessionId: string, rememberMe: boolean) {
  const tokenData = JWT.decode(token) as { exp: number };
  // exp is in seconds, Date expects milliseconds
  const tokenExpiresAt = new Date(tokenData.exp * 1000);

  const expires = rememberMe ? tokenExpiresAt : undefined;
  const resolvedCookies = await cookies();

  resolvedCookies.set(SID_COOKIE_NAME, sessionId, { domain: ROOT_COOKIE_DOMAIN, httpOnly: true, expires });
  resolvedCookies.set(TOKEN_COOKIE_NAME, token, { domain: MAIN_COOKIE_DOMAIN, httpOnly: true, expires });
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
  const resolvedCookies = await cookies();

  resolvedCookies.delete({ domain: ROOT_COOKIE_DOMAIN, name: SID_COOKIE_NAME });
  resolvedCookies.delete({ domain: MAIN_COOKIE_DOMAIN, name: TOKEN_COOKIE_NAME });

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
  const userResponse = await campusFetch<User>('profile', {
    next: { tags: [USER_PROFILE_CACHE_TAG] },
  });

  if (!userResponse.ok) {
    return null;
  }

  const user: User = await userResponse.json();

  // TODO(KBX-1526): drop once kpi-ua/api.campus.kpi.ua#979 is deployed; until then the API sends "Lecturer"
  const userCategories = user.userCategories.map((category) =>
    (category as string) === 'Lecturer' ? UserCategory.AcademicStaff : category,
  );

  return { ...user, userCategories };
}

export async function exchangeKPIIDCode(authorization: KPIIDAuthorization): Promise<KPIIDCodeExchange> {
  try {
    const response = await campusFetch<KPIIDAccount[]>('/auth/kpi-id', {
      method: 'POST',
      body: JSON.stringify(authorization),
    });

    if (!response.ok) {
      return { ok: false, reason: 'api', status: response.status };
    }

    const accounts: KPIIDAccount[] = await response.json();

    return accounts.length ? { ok: true, accounts } : { ok: false, reason: 'no-accounts' };
  } catch (error) {
    console.error('KPI ID code exchange failed:', error);

    return { ok: false, reason: 'network' };
  }
}
