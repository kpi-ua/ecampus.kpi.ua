'use server';

import { campusFetch } from '@/lib/client';
import { Term } from '@/types/models/term';

export async function getTerm() {
  const response = await campusFetch<Term>('/term');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}
