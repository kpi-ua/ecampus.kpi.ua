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

export async function getDeansOfficeOptions(facultyId: number | null) {
  const url = qs.stringifyUrl({ url: '/deans-office/options', query: { facultyId } }, { skipNull: true });
  const response = await campusFetch<DeansOfficeOptions>(url);

  if (!response.ok) {
    throw new Error(`DeansOffice request failed: ${response.status}`);
  }

  return response.json();
}

export async function getDeansOfficeGroups(facultyId: number | null, departmentId: number, course: number) {
  const url = qs.stringifyUrl(
    { url: '/deans-office/groups', query: { facultyId, departmentId, course } },
    { skipNull: true },
  );
  const response = await campusFetch<DeansOfficeOption[]>(url);

  if (!response.ok) {
    throw new Error(`DeansOffice request failed: ${response.status}`);
  }

  return response.json();
}

export async function getDeansOfficeStudents(facultyId: number | null, groupId: number) {
  const url = qs.stringifyUrl(
    { url: `/deans-office/groups/${groupId}/students`, query: { facultyId } },
    { skipNull: true },
  );
  const response = await campusFetch<DeansOfficeOption[]>(url);

  if (!response.ok) {
    throw new Error(`DeansOffice request failed: ${response.status}`);
  }

  return response.json();
}

export async function searchDeansOfficeStudents(facultyId: number | null, search: string) {
  const url = qs.stringifyUrl({ url: '/deans-office/students', query: { facultyId, search } }, { skipNull: true });
  const response = await campusFetch<DeansOfficeStudentSearchResult[]>(url);

  if (!response.ok) {
    throw new Error(`DeansOffice request failed: ${response.status}`);
  }

  return response.json();
}

export async function getDeansOfficePrograms(facultyId: number | null, departmentId: number) {
  const url = qs.stringifyUrl(
    { url: '/deans-office/programs', query: { facultyId, departmentId } },
    { skipNull: true },
  );
  const response = await campusFetch<DeansOfficeOption[]>(url);

  if (!response.ok) {
    throw new Error(`DeansOffice request failed: ${response.status}`);
  }

  return response.json();
}

export async function getDeansOfficeDisciplines(filters: {
  facultyId: number | null;
  departmentId: number;
  programId: number;
  semester: number | null;
  periodTypeId: number | null;
}) {
  const url = qs.stringifyUrl({ url: '/deans-office/disciplines', query: filters }, { skipNull: true });
  const response = await campusFetch<DeansOfficeDiscipline[]>(url);

  if (!response.ok) {
    throw new Error(`DeansOffice request failed: ${response.status}`);
  }

  return response.json();
}

export async function getDeansOfficeGroupCounts() {
  const response = await campusFetch<DeansOfficeGroupCount[]>('/deans-office/group-counts');

  if (!response.ok) {
    throw new Error(`DeansOffice request failed: ${response.status}`);
  }

  return response.json();
}

export async function getDeansOfficeReport(facultyId: number | null, semester: number, periodTypeId: number) {
  const url = qs.stringifyUrl(
    { url: '/deans-office/reports', query: { facultyId, semester, periodTypeId } },
    { skipNull: true },
  );
  const response = await campusFetch<DeansOfficeReportRow[]>(url);

  if (!response.ok) {
    throw new Error(`DeansOffice request failed: ${response.status}`);
  }

  return response.json();
}

export async function setDeansOfficeStudentGroup(
  studentId: number,
  groupId: number | null,
  currentGroupId: number | null,
) {
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
