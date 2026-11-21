'use server';

import { DeputyDeanDepartment } from '@/app/[locale]/(private)/module/deputy-dean/types';
import { campusFetch } from '@/lib/client';

export const getDeputyDeanDepartments = async (): Promise<DeputyDeanDepartment[]> => {
  const response = await campusFetch<DeputyDeanDepartment[]>('/deputy-dean/monitoring/departments');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};
