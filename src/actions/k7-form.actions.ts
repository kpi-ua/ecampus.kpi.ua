'use server';

import qs from 'query-string';

import { campusFetch } from '@/lib/client';
import { K7FormFilters, K7ReportRequest } from '@/types/models/k7-form';

export const getK7FormFilters = async (targetAccountId?: number): Promise<K7FormFilters> => {
  const url = qs.stringifyUrl({ url: '/k7-form/filters', query: { targetAccountId } });
  const response = await campusFetch<K7FormFilters>(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch K-7 filters: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getK7FormRequests = async (all = false): Promise<K7ReportRequest[]> => {
  const response = await campusFetch<K7ReportRequest[]>(`/k7-form/requests${all ? '/all' : ''}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch K-7 requests: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
