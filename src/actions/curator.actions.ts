'use server';

import queryString from 'query-string';
import { revalidatePath } from 'next/cache';

import {
  CuratorGroup,
  CuratorPeriodParams,
  CuratorStudent,
  CuratorStudentCredentials,
  CuratorFilters,
  CuratorSurveyRow,
  CuratorSurveyParams,
  CuratorAttestationStudent,
  CuratorAttestationParams,
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

export const getCuratorTeachingGroups = async (params: CuratorPeriodParams = {}): Promise<CuratorGroup[]> => {
  const response = await campusFetch<CuratorGroup[]>(
    `/curator/teaching-groups?${queryString.stringify({ ...params }, { skipEmptyString: true, skipNull: true })}`,
  );

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

export const getCuratorGroups = async (): Promise<CuratorGroup[]> => {
  const response = await campusFetch<CuratorGroup[]>('/curator/groups');

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

export const getCuratorStudents = async (groupId: number): Promise<CuratorStudent[]> => {
  const response = await campusFetch<CuratorStudent[]>(`/curator/groups/${groupId}/students`);

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

export const getCuratorStudentCredentials = async (groupId: number): Promise<CuratorStudentCredentials[]> => {
  const response = await campusFetch<CuratorStudentCredentials[]>(`/curator/groups/${groupId}/students/credentials`);

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

export const getCuratorFilters = async (yearId?: number): Promise<CuratorFilters> => {
  const response = await campusFetch<CuratorFilters>(
    `/curator/filters?${queryString.stringify({ yearId }, { skipEmptyString: true, skipNull: true })}`,
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

export const getCuratorAttestations = async (
  groupId: number,
  params: CuratorAttestationParams = {},
): Promise<CuratorAttestationStudent[]> => {
  const response = await campusFetch<CuratorAttestationStudent[]>(
    `/curator/groups/${groupId}/attestations?${queryString.stringify({ ...params }, { skipEmptyString: true, skipNull: true })}`,
  );

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

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
