'use server';

import qs from 'query-string';

import {
  ZamdekanGroup,
  ZamdekanAgreement,
  ZamdekanExamResult,
  ZamdekanDepartment,
} from '@/app/[locale]/(private)/module/zamdekan/types';
import { campusFetch } from '@/lib/client';

export const getZamdekanGroups = async (): Promise<ZamdekanGroup[]> => {
  const response = await campusFetch<ZamdekanGroup[]>('/zamdekan/groups');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getZamdekanAgreements = async (groupId: number): Promise<ZamdekanAgreement[]> => {
  const url = qs.stringifyUrl({ url: '/zamdekan/agreements', query: { groupId } });
  const response = await campusFetch<ZamdekanAgreement[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getZamdekanStudentResults = async (studentId: number, groupId: number): Promise<ZamdekanExamResult[]> => {
  const url = qs.stringifyUrl({ url: `/zamdekan/students/${studentId}/results`, query: { groupId } });
  const response = await campusFetch<ZamdekanExamResult[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getZamdekanDepartments = async (): Promise<ZamdekanDepartment[]> => {
  const response = await campusFetch<ZamdekanDepartment[]>('/zamdekan/monitoring/departments');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};
