'use server';

import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

import { campusFetch } from '@/lib/client';
import {
  type DnvrSheetDetails,
  type DnvrSheetFacultyCount,
  type DnvrSheetKind,
  type DnvrSheetSchedule,
  type DnvrSheetSummary,
} from '@/types/models/dnvr-sheets';

async function getSheetData<T>(path: string) {
  const response = await campusFetch<T>('/dnvr-reporting/sheets/' + path);
  if (response.status === 404 || response.status === 403) {
    notFound();
  }
  if (!response.ok) {
    throw new Error(`DNVR sheet request failed: ${response.status}`);
  }

  return response.json();
}

export async function getDnvrSheetFaculties(kind: DnvrSheetKind) {
  return getSheetData<DnvrSheetFacultyCount[]>(`${kind}/faculties`);
}

export async function getDnvrFacultySheets(kind: DnvrSheetKind, id: number) {
  return getSheetData<DnvrSheetSummary[]>(`${kind}/faculties/${id}`);
}

export async function getDnvrSheet(kind: DnvrSheetKind, id: number) {
  return getSheetData<DnvrSheetDetails>(`${kind}/${id}`);
}

export async function updateDnvrSheetSchedule(kind: DnvrSheetKind, id: number, schedule: DnvrSheetSchedule) {
  const response = await campusFetch(`/dnvr-reporting/sheets/${kind}/${id}/schedule`, {
    method: 'PUT',
    body: JSON.stringify(schedule),
  });

  if (response.ok) {
    revalidatePath('/[locale]/module/hignyak/sheets', 'layout');
  }

  return response.ok;
}
