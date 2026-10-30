'use server';

import { campusFetch } from '@/lib/client';
import { CreditModule } from '@/types/models/current-control/credit-module';
import { Sheet } from '@/types/models/current-control/sheet';

export async function getMonitoring() {
  const response = await campusFetch<Sheet>('monitoring');

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}

export async function getMonitoringById(id: string) {
  const response = await campusFetch<CreditModule>(`monitoring/${id}`);

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}
