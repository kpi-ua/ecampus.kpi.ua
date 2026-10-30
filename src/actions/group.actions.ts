'use server';

import queryString from 'query-string';

import { campusFetch } from '@/lib/client';
import { Group } from '@/types/models/group';

export async function searchByGroupName(search: string) {
  try {
    const query = queryString.stringify({ name: search });

    const response = await campusFetch<Group[]>(`group/find?${query}`);

    if (response.status < 200 || response.status >= 300) {
      return [];
    }

    return response.json();
  } catch (error) {
    throw new Error('Error loading groups');
  }
}
