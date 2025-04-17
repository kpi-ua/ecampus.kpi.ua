'use server';

import { campusFetch } from '@/lib/client';
import { Sheet } from '@/types/models/current-control/sheet';
import { CreditModule } from '@/types/models/current-control/credit-module';

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
