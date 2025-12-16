'use server';

import { campusFetch } from '@/lib/client';
import { RatingData } from '@/types/models/rating';

export async function getRatingData(): Promise<RatingData> {
  const response = await campusFetch<RatingData>('/rating/data');

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}
