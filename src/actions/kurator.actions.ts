import { campusFetch } from '@/lib/client';
import { Curator } from '@/types/models/curator';

export async function getCurator() {
  const response = await campusFetch<Curator>('/curator');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}
