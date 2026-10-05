'use server';

import queryString from 'query-string';
import { revalidatePath } from 'next/cache';

import {
  CuratorGroup,
  CuratorFilters,
  CuratorStudentDetails,
  CuratorSurveyRow,
  CuratorSurveyParams,
  CuratorStudentAttestationSemester,
  CuratorDisciplineAttestationSemester,
  CuratorAttestationParams,
  CuratorStudentAttestations,
  CuratorDisciplineAttestations,
} from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { campusFetch } from '@/lib/client';

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

export const getCuratorStudents = async (groupId: number): Promise<CuratorStudentDetails[]> => {
  const response = await campusFetch<CuratorStudentDetails[]>(`/curator-lecturer/groups/${groupId}/students`);

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
    `/curator-lecturer/groups/${groupId}/surveys?${queryString.stringify({ ...params }, { skipEmptyString: true, skipNull: true })}`,
  );

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

export const getCuratorStudentAttestations = async (
  groupId: number,
  params: CuratorAttestationParams = {},
): Promise<CuratorStudentAttestations> => {
  const response = await campusFetch<CuratorStudentAttestationSemester[]>(
    `/curator-lecturer/groups/${groupId}/attestations/students?${queryString.stringify({ ...params }, { skipEmptyString: true, skipNull: true })}`,
  );

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  const semesters = await response.json();

  return {
    semesters,
    summaryStudents: semesters.flatMap((term) => term.students),
  };
};

export const getCuratorDisciplineAttestations = async (
  groupId: number,
  params: CuratorAttestationParams = {},
): Promise<CuratorDisciplineAttestations> => {
  const response = await campusFetch<CuratorDisciplineAttestationSemester[]>(
    `/curator-lecturer/groups/${groupId}/attestations/disciplines?${queryString.stringify({ ...params }, { skipEmptyString: true, skipNull: true })}`,
  );

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  const semesters = await response.json();

  return {
    semesters,
    summaryStudents: semesters.flatMap((term) => term.disciplines.flatMap((discipline) => discipline.students)),
  };
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

  revalidatePath('/[locale]/module/curatorlecturer/groups', 'page');
};
