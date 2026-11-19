'use server';

import qs from 'query-string';

import { type ExamResultSortColumn } from '@/app/[locale]/(private)/module/deputy-dean/student-results-search-params';
import {
  DeputyDeanGroup,
  DeputyDeanAgreement,
  DeputyDeanExamResultPage,
  DeputyDeanDepartment,
} from '@/app/[locale]/(private)/module/deputy-dean/types';
import { campusFetch } from '@/lib/client';

export const getDeputyDeanGroups = async (): Promise<DeputyDeanGroup[]> => {
  const response = await campusFetch<DeputyDeanGroup[]>('/deputy-dean/groups');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getDeputyDeanAgreements = async (groupId: number): Promise<DeputyDeanAgreement[]> => {
  const url = qs.stringifyUrl({ url: '/deputy-dean/agreements', query: { groupId } });
  const response = await campusFetch<DeputyDeanAgreement[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getDeputyDeanStudentResults = async ({
  studentId,
  ...query
}: {
  studentId: number;
  groupId: number;
  page: number;
  pageSize: number;
  sort: ExamResultSortColumn | null;
  descending: boolean;
}): Promise<DeputyDeanExamResultPage> => {
  const url = qs.stringifyUrl({ url: `/deputy-dean/students/${studentId}/results/page`, query }, { skipNull: true });
  const response = await campusFetch<DeputyDeanExamResultPage>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getDeputyDeanDepartments = async (): Promise<DeputyDeanDepartment[]> => {
  const response = await campusFetch<DeputyDeanDepartment[]>('/deputy-dean/monitoring/departments');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};
