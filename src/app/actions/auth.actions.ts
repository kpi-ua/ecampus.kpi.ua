'use server';

import { cookies } from 'next/headers';
import qs from 'query-string';

export async function loginWithCredentials(username: string, password: string) {
  try {
    const payload = {
      username,
      password,
      grant_type: 'password',
    };
  
    console.log('body', qs.stringify(payload));

    const response = await fetch(`${process.env.API_ENDPOINT}oauth/token`, {
      method: 'POST',
      cache: 'no-cache',
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

    const userResponse = await fetch(`${process.env.API_ENDPOINT}account/info`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jsonResponse.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return ;
    }

    const user = await userResponse.json();

    cookies().set('SID', jsonResponse.session_id, { domain: 'localhost', httpOnly: true });
    cookies().set('token', jsonResponse.access_token, { domain: 'localhost', httpOnly: true });

    return user;
  } catch (error) {
    console.error('Authentication error', error);
    return null;
  }
}