'use server';

import { campusFetch } from '@/lib/client';
import { K7FormFilters } from '@/types/models/k7-form';

export const getK7FormFilters = async (targetAccountId?: number): Promise<K7FormFilters> => {
  const query = targetAccountId === undefined ? '' : `?targetAccountId=${targetAccountId}`;
  const response = await campusFetch<K7FormFilters>(`/k7-form/filters${query}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch K-7 filters: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
