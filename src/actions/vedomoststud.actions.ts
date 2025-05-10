import { campusFetch } from '@/lib/client';
import { Session } from '@/types/models/session';

export async function getVedomostStud() {
  const response = await campusFetch<Session[]>('vedomoststud');

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}
