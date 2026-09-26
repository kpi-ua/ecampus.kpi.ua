'use server';

import queryString from 'query-string';
import { revalidatePath } from 'next/cache';

import {
  CuratorAttestationParams,
  CuratorAttestationStudent,
  CuratorAssignment,
  CuratorDepartment,
  CuratorFilters,
  CuratorGroup,
  CuratorLecturer,
  CuratorPeriodParams,
  CuratorStudent,
  CuratorStudentCredentials,
  CuratorSurveyParams,
  CuratorSurveyRow,
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

export const getCuratorSurveys = async (
  groupId: number,
  params: CuratorSurveyParams = {},
): Promise<CuratorSurveyRow[]> => getJson(`/curator/groups/${groupId}/surveys?${buildQuery({ ...params })}`);

export const getCuratorAttestations = async (
  groupId: number,
  params: CuratorAttestationParams = {},
): Promise<CuratorAttestationStudent[]> =>
  getJson(`/curator/groups/${groupId}/attestations?${buildQuery({ ...params })}`);

export const getCuratorDepartments = async (): Promise<CuratorDepartment[]> => {
  const response = await campusFetch<CuratorDepartment[]>('/curator/admin/departments');

  if (response.status === 403) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

export const getCuratorAdminGroups = async (departmentId?: number): Promise<CuratorGroup[]> =>
  getJson(`/curator/admin/groups?${buildQuery({ departmentId })}`);

export const getCuratorLecturers = async (departmentId?: number): Promise<CuratorLecturer[]> =>
  getJson(`/curator/admin/lecturers?${buildQuery({ departmentId })}`);

export const getCuratorAssignments = async (groupId: number): Promise<CuratorAssignment[]> =>
  getJson(`/curator/admin/groups/${groupId}/curators`);

export const assignGroupCurator = async (groupId: number, employeeId: number, startDate: string, endDate: string) => {
  const response = await campusFetch(`/curator/admin/groups/${groupId}/curator`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, startDate, endDate }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  revalidatePath('/module/kurator');
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
