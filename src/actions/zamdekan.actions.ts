'use server';

import {
  ZamdekanAgreement,
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
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};

export const getZamdekanAgreements = async (groupId: number): Promise<ZamdekanAgreement[]> => {
  const response = await campusFetch<ZamdekanAgreement[]>(`/zamdekan/agreements?groupId=${groupId}`);
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};

export const getZamdekanStudentResults = async (studentId: number, groupId: number): Promise<ZamdekanExamResult[]> => {
  const response = await campusFetch<ZamdekanExamResult[]>(
    `/zamdekan/students/${studentId}/results?groupId=${groupId}`,
  );
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};

export const getZamdekanMonitoringGroups = async (): Promise<ZamdekanMonitoringGroup[]> => {
  const response = await campusFetch<ZamdekanMonitoringGroup[]>('/zamdekan/monitoring/groups');
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};

export const getZamdekanGroupDisciplines = async (groupId: number): Promise<ZamdekanGroupDiscipline[]> => {
  const response = await campusFetch<ZamdekanGroupDiscipline[]>(`/zamdekan/monitoring/groups/${groupId}/disciplines`);
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};

export const getZamdekanSheets = async (
  groupId: number,
  disciplineId: number,
  employeeId?: number,
): Promise<ZamdekanMonitoringSheet[]> => {
  const params = new URLSearchParams({ groupId: String(groupId), disciplineId: String(disciplineId) });
  if (employeeId !== undefined) params.set('employeeId', String(employeeId));
  const response = await campusFetch<ZamdekanMonitoringSheet[]>(`/zamdekan/monitoring/sheets?${params}`);
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};

export const getZamdekanSheetMarks = async (monitoringId: number): Promise<ZamdekanSheetMark[]> => {
  const response = await campusFetch<ZamdekanSheetMark[]>(`/zamdekan/monitoring/sheets/${monitoringId}/marks`);
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};

export const getZamdekanEmployees = async (): Promise<ZamdekanEmployee[]> => {
  const response = await campusFetch<ZamdekanEmployee[]>('/zamdekan/monitoring/employees');
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};

export const getZamdekanEmployeeDisciplines = async (employeeId: number): Promise<ZamdekanEmployeeDiscipline[]> => {
  const response = await campusFetch<ZamdekanEmployeeDiscipline[]>(
    `/zamdekan/monitoring/employees/${employeeId}/disciplines`,
  );
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};

export const getZamdekanEmployeeActivity = async (employeeId: number): Promise<ZamdekanEmployeeActivity[]> => {
  const response = await campusFetch<ZamdekanEmployeeActivity[]>(
    `/zamdekan/monitoring/employees/${employeeId}/activity`,
  );
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};

export const getZamdekanDepartmentStatistics = async (
  departmentId: number,
): Promise<ZamdekanDepartmentStatistics[]> => {
  const response = await campusFetch<ZamdekanDepartmentStatistics[]>(
    `/zamdekan/department-statistics?departmentId=${departmentId}`,
  );
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};

export const getZamdekanOutwardTeachingStatistics = async (
  cathedraId: number,
): Promise<ZamdekanDepartmentStatistics[]> => {
  const response = await campusFetch<ZamdekanDepartmentStatistics[]>(
    `/zamdekan/department-statistics/outward-teaching?cathedraId=${cathedraId}`,
  );
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};

export const getZamdekanDepartmentSummary = async (): Promise<ZamdekanDepartmentSummary> => {
  const response = await campusFetch<ZamdekanDepartmentSummary>('/zamdekan/department-summary');
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};
