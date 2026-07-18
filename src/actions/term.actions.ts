'use server';

import queryString from 'query-string';

import { campusFetch } from '@/lib/client';
import { Term } from '@/types/models/term';

export async function getTerm(semesterId?: string) {
  const url = queryString.stringifyUrl({ url: '/term', query: { semesterId } });
  const response = await campusFetch<Term>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}

export async function getTermSemesters() {
  const response = await campusFetch<number[]>('/term/semesters');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}
