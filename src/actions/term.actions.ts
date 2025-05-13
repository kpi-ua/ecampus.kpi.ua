import { campusFetch } from '@/lib/client';
import { Session } from '@/types/models/session';

export async function getTerm() {
  const response = await campusFetch<Session[]>('/term');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}
