'use server';

import { CuratorGroup } from '@/app/[locale]/(private)/module/kurator/types';
import { campusFetch } from '@/lib/client';
import { Curator } from '@/types/models/curator';

export async function getCurator(): Promise<Curator | null> {
  const response = await campusFetch<Curator>('/curator');
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}

export const getCuratorTeachingGroups = async (): Promise<CuratorGroup[]> => {
  const response = await campusFetch<CuratorGroup[]>('/curator-lecturer/teaching-groups');

  if (!response.ok) {
    throw new Error(`${response.statusText} ${response.status} Error`);
  }

  return response.json();
};
