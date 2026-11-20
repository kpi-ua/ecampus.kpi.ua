'use server';

import queryString from 'query-string';

import { campusFetch } from '@/lib/client';
import {
  type DeanContactDirectory,
  type Department,
  type Employee,
  type LecturerSurveySummary,
  type PersonnelEmployment,
  type Responsibility,
  type SessionResult,
  type StudentDirectoryEntry,
  type StudentRecord,
} from '@/types/models/dean';

export async function getDeanDepartments() {
  const response = await campusFetch<Department[]>('/dean/departments');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanEmployees(departmentId?: number) {
  const url = queryString.stringifyUrl({ url: '/dean/employees', query: { departmentId } }, { skipNull: true });
  const response = await campusFetch<Employee[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanStudent(studentId: number) {
  const response = await campusFetch<StudentRecord>(`/dean/students/${studentId}`);
  if (response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanSessionResults(studentId: number) {
  const response = await campusFetch<SessionResult[]>(`/dean/students/${studentId}/session-results`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanResponsibilities(departmentId?: number) {
  const url = queryString.stringifyUrl({ url: '/dean/responsibilities', query: { departmentId } });
  const response = await campusFetch<Responsibility[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanLecturerSurveys(filters: { page: number; departmentId?: number }) {
  const url = queryString.stringifyUrl(
    { url: '/dean/lecturer-surveys', query: filters },
    { skipEmptyString: true, skipNull: true },
  );
  const response = await campusFetch<{ surveys: LecturerSurveySummary[]; totalCount: number; pageSize: number }>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanPersonnel(departmentId: number) {
  const response = await campusFetch<PersonnelEmployment[]>(`/dean/departments/${departmentId}/personnel`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanGroups() {
  const response = await campusFetch<{ name: string; course: number; departmentId: number }[]>('/dean/groups');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanStudents(filters: {
  departmentId?: number;
  course?: number;
  group?: string;
  page?: number;
}) {
  const url = queryString.stringifyUrl(
    { url: '/dean/students', query: filters },
    { skipEmptyString: true, skipNull: true },
  );
  const response = await campusFetch<{ students: StudentDirectoryEntry[]; totalCount: number; pageSize: number }>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanContacts(departmentId?: number) {
  const url = queryString.stringifyUrl({ url: '/dean/contacts', query: { departmentId } });
  const response = await campusFetch<DeanContactDirectory>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}
