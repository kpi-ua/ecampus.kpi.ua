'use server';

import qs from 'query-string';

import {
  DeputyDeanGroup,
  DeputyDeanAgreement,
  DeputyDeanExamResult,
  DeputyDeanMonitoringGroup,
  DeputyDeanGroupDiscipline,
  DeputyDeanMonitoringSheet,
  DeputyDeanSheetMark,
  DeputyDeanEmployee,
  DeputyDeanEmployeeDiscipline,
  DeputyDeanEmployeeActivity,
  DeputyDeanDepartmentStatistics,
  DeputyDeanDepartmentSummary,
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

export const getDeputyDeanStudentResults = async (
  studentId: number,
  groupId: number,
): Promise<DeputyDeanExamResult[]> => {
  const url = qs.stringifyUrl({ url: `/deputy-dean/students/${studentId}/results`, query: { groupId } });
  const response = await campusFetch<DeputyDeanExamResult[]>(url);
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

export const getDeputyDeanDepartmentStatistics = async (
  departmentId: number,
): Promise<DeputyDeanDepartmentStatistics[]> => {
  const url = qs.stringifyUrl({ url: '/deputy-dean/department-statistics', query: { departmentId } });
  const response = await campusFetch<DeputyDeanDepartmentStatistics[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getDeputyDeanDepartmentSummary = async (departmentId?: number): Promise<DeputyDeanDepartmentSummary> => {
  const url = qs.stringifyUrl({ url: '/deputy-dean/department-summary', query: { departmentId } });
  const response = await campusFetch<DeputyDeanDepartmentSummary>(url);
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

export const getDeputyDeanOtherDepartmentStatistics = async (
  departmentId: number,
): Promise<DeputyDeanDepartmentStatistics[]> => {
  const url = qs.stringifyUrl({ url: '/deputy-dean/department-statistics/other', query: { departmentId } });
  const response = await campusFetch<DeputyDeanDepartmentStatistics[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};
