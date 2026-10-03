'use server';

import queryString from 'query-string';
import { revalidatePath } from 'next/cache';

import {
  CuratorGroup,
  CuratorStudentCredentials,
  CuratorFilters,
  CuratorSurveyRow,
  CuratorSurveyParams,
} from '@/app/[locale]/(private)/module/kurator/types';
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

export const getCuratorGroups = async (): Promise<CuratorGroup[]> => {
  const response = await campusFetch<CuratorGroup[]>('/curator-lecturer/groups');

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

export const getCuratorStudents = async (groupId: number): Promise<CuratorStudentCredentials[]> => {
  const response = await campusFetch<CuratorStudentCredentials[]>(`/curator-lecturer/groups/${groupId}/students`);

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

export const getCuratorFilters = async (yearId?: number): Promise<CuratorFilters> => {
  const response = await campusFetch<CuratorFilters>(
    `/curator-lecturer/filters?${queryString.stringify({ yearId }, { skipEmptyString: true, skipNull: true })}`,
  );

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

export const getCuratorSurveys = async (
  groupId: number,
  params: CuratorSurveyParams = {},
): Promise<CuratorSurveyRow[]> => {
  const response = await campusFetch<CuratorSurveyRow[]>(
    `/curator/groups/${groupId}/surveys?${queryString.stringify({ ...params }, { skipEmptyString: true, skipNull: true })}`,
  );

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

export const assignGroupLeader = async (groupId: number, studentId: number) => {
  const response = await campusFetch(`/curator-lecturer/groups/${groupId}/leader`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  revalidatePath('/module/kurator');
};
