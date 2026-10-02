'use server';

import { ZamdekanQuery, ZamdekanReport } from '@/app/[locale]/(private)/module/zamdekan/types';
import { campusFetch } from '@/lib/client';

export const getZamdekanReport = async (query: ZamdekanQuery): Promise<ZamdekanReport> => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });
  const response = await campusFetch<ZamdekanReport>(`/zamdekan?${params}`);
  if (!response.ok) throw new Error(`${response.status} Error`);
  return response.json();
};
