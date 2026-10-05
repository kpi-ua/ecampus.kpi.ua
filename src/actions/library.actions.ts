'use server';

import { revalidatePath } from 'next/cache';
import qs from 'query-string';

import { campusFetch } from '@/lib/client';
import { LibraryDepartment, LibraryEmployee, LibraryEmployeeDetails } from '@/types/models/library';

export const getLibraryDepartments = async (): Promise<LibraryDepartment[]> => {
  const response = await campusFetch<LibraryDepartment[]>('/library/departments');

  if (!response.ok) {
    throw new Error(`Failed to fetch Library departments: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getLibraryEmployees = async (filter: {
  departmentId?: number;
  letter?: string;
}): Promise<LibraryEmployee[]> => {
  const url = qs.stringifyUrl({ url: '/library/employees', query: filter });
  const response = await campusFetch<LibraryEmployee[]>(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch Library employees: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getLibraryEmployee = async (
  userAccountId: number | null,
  employeeId: number,
): Promise<LibraryEmployeeDetails> => {
  const url = qs.stringifyUrl({
    url: '/library/employees/details',
    query: { userAccountId: userAccountId ?? undefined, employeeId },
  });
  const response = await campusFetch<LibraryEmployeeDetails>(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch Library employee: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const updateLibraryIdentifier = async (userAccountId: number, contactTypeId: number, value: string) => {
  const response = await campusFetch(`/library/employees/${userAccountId}/identifiers/${contactTypeId}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update Library identifier: ${response.status} ${response.statusText}`);
  }

  revalidatePath('/module/biblioteka');
};
