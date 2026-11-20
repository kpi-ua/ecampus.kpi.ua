'use server';

import { revalidatePath } from 'next/cache';
import qs from 'query-string';

import { campusFetch } from '@/lib/client';
import {
  type DekanatDiscipline,
  type DekanatGroupCount,
  type DekanatOption,
  type DekanatOptions,
  type DekanatReportRow,
  type DekanatStudentSearchResult,
} from '@/types/models/dekanat';

type Filters = Record<string, number | string | null>;

async function read<T>(path: string, query: Filters) {
  const url = qs.stringifyUrl({ url: `/ekanat/${path}`, query }, { skipNull: true });
  const response = await campusFetch<T>(url);
  if (!response.ok) {
    throw new Error(`Dekanat request failed: ${response.status}`);
  }
  return response.json();
}

export async function getDekanatOptions(facultyId: number | null) {
  return read<DekanatOptions>('options', { facultyId });
}

export async function getDekanatGroups(facultyId: number | null, departmentId: number, course: number) {
  return read<DekanatOption[]>('groups', { facultyId, departmentId, course });
}

export async function getDekanatStudents(facultyId: number | null, groupId: number) {
  return read<DekanatOption[]>(`groups/${groupId}/students`, { facultyId });
}

export async function searchDekanatStudents(facultyId: number | null, search: string) {
  return read<DekanatStudentSearchResult[]>('students', { facultyId, search });
}

export async function getDekanatPrograms(facultyId: number | null, departmentId: number) {
  return read<DekanatOption[]>('programs', { facultyId, departmentId });
}

export async function getDekanatDisciplines(filters: {
  facultyId: number | null;
  departmentId: number;
  yearId: number;
  programId: number;
  semester: number | null;
  periodTypeId: number | null;
}) {
  return read<DekanatDiscipline[]>('disciplines', filters);
}

export async function getDekanatGroupCounts(facultyId: number | null, yearId: number) {
  return read<DekanatGroupCount[]>('group-counts', { facultyId, yearId });
}

export async function getDekanatReport(
  facultyId: number | null,
  yearId: number,
  semester: number,
  periodTypeId: number,
) {
  return read<DekanatReportRow[]>('reports', { facultyId, yearId, semester, periodTypeId });
}

export async function setDekanatStudentGroup(studentId: number, groupId: number | null, currentGroupId: number | null) {
  const response = await campusFetch(`/ekanat/students/${studentId}/group`, {
    method: 'PUT',
    body: JSON.stringify({ groupId, currentGroupId }),
  });
  if (response.ok) {
    revalidatePath('/[locale]/module/ekanat', 'layout');
  }
  return response.ok;
}

export async function setDekanatAttestationSemester(disciplineId: number, semester: number | null) {
  const response = await campusFetch(`/ekanat/disciplines/${disciplineId}/attestation-semester`, {
    method: 'PUT',
    body: JSON.stringify({ semester }),
  });
  if (response.ok) {
    revalidatePath('/[locale]/module/ekanat', 'layout');
  }
  return response.ok;
}
