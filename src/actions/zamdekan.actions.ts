'use server';

import qs from 'query-string';

import {
  ZamdekanAgreement,
  ZamdekanDepartment,
  ZamdekanDepartmentStatistics,
  ZamdekanDepartmentSummary,
  ZamdekanEmployee,
  ZamdekanEmployeeActivity,
  ZamdekanEmployeeDiscipline,
  ZamdekanExamResult,
  ZamdekanGroup,
  ZamdekanGroupDiscipline,
  ZamdekanMonitoringGroup,
  ZamdekanMonitoringSheet,
  ZamdekanSheetMark,
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

export const getZamdekanMonitoringGroups = async (departmentId: number): Promise<ZamdekanMonitoringGroup[]> => {
  const url = qs.stringifyUrl({ url: '/zamdekan/monitoring/groups', query: { departmentId } });
  const response = await campusFetch<ZamdekanMonitoringGroup[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getZamdekanGroupDisciplines = async (groupId: number): Promise<ZamdekanGroupDiscipline[]> => {
  const response = await campusFetch<ZamdekanGroupDiscipline[]>(`/zamdekan/monitoring/groups/${groupId}/disciplines`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getZamdekanSheets = async (
  groupId: number,
  disciplineId: number,
  employeeId?: number,
): Promise<ZamdekanMonitoringSheet[]> => {
  const url = qs.stringifyUrl({
    url: '/zamdekan/monitoring/sheets',
    query: { groupId, disciplineId, employeeId },
  });
  const response = await campusFetch<ZamdekanMonitoringSheet[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getZamdekanSheetMarks = async (monitoringId: number): Promise<ZamdekanSheetMark[]> => {
  const response = await campusFetch<ZamdekanSheetMark[]>(`/zamdekan/monitoring/sheets/${monitoringId}/marks`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getZamdekanEmployees = async (departmentId: number): Promise<ZamdekanEmployee[]> => {
  const url = qs.stringifyUrl({ url: '/zamdekan/monitoring/employees', query: { departmentId } });
  const response = await campusFetch<ZamdekanEmployee[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getZamdekanEmployeeDisciplines = async (employeeId: number): Promise<ZamdekanEmployeeDiscipline[]> => {
  const response = await campusFetch<ZamdekanEmployeeDiscipline[]>(
    `/zamdekan/monitoring/employees/${employeeId}/disciplines`,
  );
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getZamdekanEmployeeActivity = async (employeeId: number): Promise<ZamdekanEmployeeActivity[]> => {
  const response = await campusFetch<ZamdekanEmployeeActivity[]>(
    `/zamdekan/monitoring/employees/${employeeId}/activity`,
  );
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getZamdekanDepartmentStatistics = async (
  departmentId: number,
): Promise<ZamdekanDepartmentStatistics[]> => {
  const url = qs.stringifyUrl({ url: '/zamdekan/department-statistics', query: { departmentId } });
  const response = await campusFetch<ZamdekanDepartmentStatistics[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getZamdekanDepartmentSummary = async (departmentId?: number): Promise<ZamdekanDepartmentSummary> => {
  const url = qs.stringifyUrl({ url: '/zamdekan/department-summary', query: { departmentId } });
  const response = await campusFetch<ZamdekanDepartmentSummary>(url);
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

export const getZamdekanOtherDepartmentStatistics = async (
  departmentId: number,
): Promise<ZamdekanDepartmentStatistics[]> => {
  const url = qs.stringifyUrl({ url: '/zamdekan/department-statistics/other', query: { departmentId } });
  const response = await campusFetch<ZamdekanDepartmentStatistics[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};
