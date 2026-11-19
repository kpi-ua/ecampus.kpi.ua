'use server';

import qs from 'query-string';

import { type ExamResultSortColumn } from '@/app/[locale]/(private)/module/deputy-dean/student-results-search-params';
import {
  DeputyDeanGroup,
  DeputyDeanAgreement,
  DeputyDeanExamResultPage,
  DeputyDeanMonitoringGroup,
  DeputyDeanGroupDiscipline,
  DeputyDeanMonitoringSheet,
  DeputyDeanSheetMark,
  DeputyDeanEmployee,
  DeputyDeanEmployeeDiscipline,
  DeputyDeanEmployeeActivity,
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

export const getDeputyDeanMonitoringGroups = async (departmentId: number): Promise<DeputyDeanMonitoringGroup[]> => {
  const url = qs.stringifyUrl({ url: '/deputy-dean/monitoring/groups', query: { departmentId } });
  const response = await campusFetch<DeputyDeanMonitoringGroup[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getDeputyDeanGroupDisciplines = async (groupId: number): Promise<DeputyDeanGroupDiscipline[]> => {
  const response = await campusFetch<DeputyDeanGroupDiscipline[]>(
    `/deputy-dean/monitoring/groups/${groupId}/disciplines`,
  );
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getDeputyDeanSheets = async (
  groupId: number,
  disciplineId: number,
  employeeId?: number,
): Promise<DeputyDeanMonitoringSheet[]> => {
  const url = qs.stringifyUrl({
    url: '/deputy-dean/monitoring/sheets',
    query: { groupId, disciplineId, employeeId },
  });
  const response = await campusFetch<DeputyDeanMonitoringSheet[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getDeputyDeanSheetMarks = async (monitoringId: number): Promise<DeputyDeanSheetMark[]> => {
  const response = await campusFetch<DeputyDeanSheetMark[]>(`/deputy-dean/monitoring/sheets/${monitoringId}/marks`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getDeputyDeanEmployees = async (departmentId: number): Promise<DeputyDeanEmployee[]> => {
  const url = qs.stringifyUrl({ url: '/deputy-dean/monitoring/employees', query: { departmentId } });
  const response = await campusFetch<DeputyDeanEmployee[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getDeputyDeanEmployeeDisciplines = async (employeeId: number): Promise<DeputyDeanEmployeeDiscipline[]> => {
  const response = await campusFetch<DeputyDeanEmployeeDiscipline[]>(
    `/deputy-dean/monitoring/employees/${employeeId}/disciplines`,
  );
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getDeputyDeanEmployeeActivity = async (employeeId: number): Promise<DeputyDeanEmployeeActivity[]> => {
  const response = await campusFetch<DeputyDeanEmployeeActivity[]>(
    `/deputy-dean/monitoring/employees/${employeeId}/activity`,
  );
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
