'use server';

import qs from 'query-string';

import {
  DeputyDeanGroup,
  DeputyDeanAgreement,
  DeputyDeanExamResult,
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

export const getDeputyDeanStudentResults = async (studentId: number, groupId: number): Promise<DeputyDeanExamResult[]> => {
  const url = qs.stringifyUrl({ url: `/deputy-dean/students/${studentId}/results`, query: { groupId } });
  const response = await campusFetch<DeputyDeanExamResult[]>(url);
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
