'use server';

import { campusFetch } from '@/lib/client';
import { Group } from '@/types/group';
import queryString from 'query-string';

export async function searchByGroupName(search: string): Promise<Group[]> {
  try {
    const query = queryString.stringify({ name: search });

    const response = await campusFetch(`group/find?${query}`, {
      method: 'GET',
    });

    if (response.status < 200 || response.status >= 300) {
      return [];
    }

    return response.json();
  } catch (error) {
    throw new Error('Error loading groups');
  }
}