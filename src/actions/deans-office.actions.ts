'use server';

import { revalidatePath } from 'next/cache';
import qs from 'query-string';

import { campusFetch } from '@/lib/client';
import {
  type DeansOfficeDiscipline,
  type DeansOfficeGroupCount,
  type DeansOfficeOption,
  type DeansOfficeOptions,
  type DeansOfficeReportRow,
  type DeansOfficeStudentSearchResult,
} from '@/types/models/deans-office';

type Filters = Record<string, number | string | null>;

async function read<T>(path: string, query: Filters) {
  const url = qs.stringifyUrl({ url: `/deans-office/${path}`, query }, { skipNull: true });
  const response = await campusFetch<T>(url);
  if (!response.ok) {
    throw new Error(`DeansOffice request failed: ${response.status}`);
  }
  return response.json();
}

export async function getDeansOfficeOptions(facultyId: number | null) {
  return read<DeansOfficeOptions>('options', { facultyId });
}

export async function getDeansOfficeGroups(facultyId: number | null, departmentId: number, course: number) {
  return read<DeansOfficeOption[]>('groups', { facultyId, departmentId, course });
}

export async function getDeansOfficeStudents(facultyId: number | null, groupId: number) {
  return read<DeansOfficeOption[]>(`groups/${groupId}/students`, { facultyId });
}

export async function searchDeansOfficeStudents(facultyId: number | null, search: string) {
  return read<DeansOfficeStudentSearchResult[]>('students', { facultyId, search });
}

export async function getDeansOfficePrograms(facultyId: number | null, departmentId: number) {
  return read<DeansOfficeOption[]>('programs', { facultyId, departmentId });
}

export async function getDeansOfficeDisciplines(filters: {
  facultyId: number | null;
  departmentId: number;
  yearId: number;
  programId: number;
  semester: number | null;
  periodTypeId: number | null;
}) {
  return read<DeansOfficeDiscipline[]>('disciplines', filters);
}

export async function getDeansOfficeGroupCounts(facultyId: number | null, yearId: number) {
  return read<DeansOfficeGroupCount[]>('group-counts', { facultyId, yearId });
}

export async function getDeansOfficeReport(
  facultyId: number | null,
  yearId: number,
  semester: number,
  periodTypeId: number,
) {
  return read<DeansOfficeReportRow[]>('reports', { facultyId, yearId, semester, periodTypeId });
}

export async function setDeansOfficeStudentGroup(studentId: number, groupId: number | null, currentGroupId: number | null) {
  const response = await campusFetch(`/deans-office/students/${studentId}/group`, {
    method: 'PUT',
    body: JSON.stringify({ groupId, currentGroupId }),
  });
  if (response.ok) {
    revalidatePath('/[locale]/module/deans-office', 'layout');
  }
  return response.ok;
}

export async function setDeansOfficeAttestationSemester(disciplineId: number, semester: number | null) {
  const response = await campusFetch(`/deans-office/disciplines/${disciplineId}/attestation-semester`, {
    method: 'PUT',
    body: JSON.stringify({ semester }),
  });
  if (response.ok) {
    revalidatePath('/[locale]/module/deans-office', 'layout');
  }
  return response.ok;
}
