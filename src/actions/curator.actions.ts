'use server';

import queryString from 'query-string';
import { revalidatePath } from 'next/cache';

import {
  CuratorGroup,
  CuratorPeriodParams,
  CuratorStudent,
  CuratorStudentCredentials,
  CuratorFilters,
} from '@/app/[locale]/(private)/module/kurator/types';
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

export const getCuratorGroups = async (): Promise<CuratorGroup[]> => getJson('/curator/groups');

export const getCuratorStudents = async (groupId: number): Promise<CuratorStudent[]> =>
  getJson(`/curator/groups/${groupId}/students`);

export const getCuratorStudentCredentials = async (groupId: number): Promise<CuratorStudentCredentials[]> =>
  getJson(`/curator/groups/${groupId}/students/credentials`);

export const getCuratorFilters = async (yearId?: number): Promise<CuratorFilters> =>
  getJson(`/curator/filters?${buildQuery({ yearId })}`);

export const assignGroupLeader = async (groupId: number, studentId: number) => {
  const response = await campusFetch(`/curator/groups/${groupId}/leader`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  revalidatePath('/module/kurator');
};
