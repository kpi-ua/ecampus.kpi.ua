'use server';

import queryString from 'query-string';
import { CuratorGroup, CuratorPeriodParams } from '@/app/[locale]/(private)/module/kurator/types';
import { campusFetch } from '@/lib/client';
import { Curator } from '@/types/models/curator';

const buildQuery = (params: Record<string, number | undefined>) =>
  queryString.stringify(params, { skipEmptyString: true, skipNull: true });

const getJson = async <T>(url: string): Promise<T> => {
  const response = await campusFetch<T>(url);

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

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

export const getCuratorTeachingGroups = async (params: CuratorPeriodParams = {}): Promise<CuratorGroup[]> =>
  getJson(`/curator/teaching-groups?${buildQuery({ ...params })}`);
