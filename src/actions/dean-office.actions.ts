'use server';

import queryString from 'query-string';

import { campusFetch } from '@/lib/client';
import {
  type DeanOfficeContactDirectory,
  type Department,
  type Employee,
  type LecturerSurveySummary,
  type PersonnelEmployment,
  type Responsibility,
  type SessionResult,
  type StudentDirectoryEntry,
  type StudentRecord,
} from '@/types/models/dean-office';

export async function getDeanOfficeDepartments() {
  const response = await campusFetch<Department[]>('/dean-office/departments');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeEmployees(departmentId?: number) {
  const url = queryString.stringifyUrl({ url: '/dean-office/employees', query: { departmentId } }, { skipNull: true });
  const response = await campusFetch<Employee[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeStudent(studentId: number) {
  const response = await campusFetch<StudentRecord>(`/dean-office/students/${studentId}`);
  if (response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeSessionResults(studentId: number) {
  const response = await campusFetch<SessionResult[]>(`/dean-office/students/${studentId}/session-results`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeResponsibilities(departmentId?: number) {
  const url = queryString.stringifyUrl({ url: '/dean-office/responsibilities', query: { departmentId } });
  const response = await campusFetch<Responsibility[]>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeLecturerSurveys(filters: { page: number; departmentId?: number }) {
  const url = queryString.stringifyUrl(
    { url: '/dean-office/lecturer-surveys', query: filters },
    { skipEmptyString: true, skipNull: true },
  );
  const response = await campusFetch<{ surveys: LecturerSurveySummary[]; totalCount: number; pageSize: number }>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficePersonnel(departmentId: number) {
  const response = await campusFetch<PersonnelEmployment[]>(`/dean-office/departments/${departmentId}/personnel`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeGroups() {
  const response = await campusFetch<{ name: string; course: number; departmentId: number }[]>('/dean-office/groups');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeStudents(filters: {
  departmentId?: number;
  course?: number;
  group?: string;
  page?: number;
}) {
  const url = queryString.stringifyUrl(
    { url: '/dean-office/students', query: filters },
    { skipEmptyString: true, skipNull: true },
  );
  const response = await campusFetch<{ students: StudentDirectoryEntry[]; totalCount: number; pageSize: number }>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeContacts(departmentId?: number) {
  const url = queryString.stringifyUrl({ url: '/dean-office/contacts', query: { departmentId } });
  const response = await campusFetch<DeanOfficeContactDirectory>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}
