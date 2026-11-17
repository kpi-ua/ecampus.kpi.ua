'use server';

import { ZamdekanDepartment } from '@/app/[locale]/(private)/module/zamdekan/types';
import { campusFetch } from '@/lib/client';

export const getZamdekanDepartments = async (): Promise<ZamdekanDepartment[]> => {
  const response = await campusFetch<ZamdekanDepartment[]>('/zamdekan/monitoring/departments');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};
