'use server';

import { revalidatePath } from 'next/cache';
import qs from 'query-string';

import { campusFetch } from '@/lib/client';
import { BibliotekaDepartment, BibliotekaEmployee, BibliotekaEmployeeDetails } from '@/types/models/biblioteka';

export const getBibliotekaDepartments = async (): Promise<BibliotekaDepartment[]> => {
  const response = await campusFetch<BibliotekaDepartment[]>('/biblioteka/departments');

  if (!response.ok) {
    throw new Error(`Failed to fetch Biblioteka departments: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getBibliotekaEmployees = async (filter: {
  departmentId?: number;
  letter?: string;
}): Promise<BibliotekaEmployee[]> => {
  const url = qs.stringifyUrl({ url: '/biblioteka/employees', query: filter });
  const response = await campusFetch<BibliotekaEmployee[]>(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch Biblioteka employees: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getBibliotekaEmployee = async (
  userAccountId: number | null,
  employeeId: number,
): Promise<BibliotekaEmployeeDetails> => {
  const url = qs.stringifyUrl({
    url: '/biblioteka/employees/details',
    query: { userAccountId: userAccountId ?? undefined, employeeId },
  });
  const response = await campusFetch<BibliotekaEmployeeDetails>(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch Biblioteka employee: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const updateBibliotekaIdentifier = async (userAccountId: number, contactTypeId: number, value: string) => {
  const response = await campusFetch(`/biblioteka/employees/${userAccountId}/identifiers/${contactTypeId}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update Biblioteka identifier: ${response.status} ${response.statusText}`);
  }

  revalidatePath('/module/biblioteka');
};
