'use server';

import qs from 'query-string';

import { campusFetch } from '@/lib/client';
import {
  type SessionStudentMarks,
  type SessionSheet,
  type SessionSheetDetails,
} from '@/types/models/session-administration';

export async function getSessionAdministrationSheets(course: number, employeeId?: string) {
  const url = qs.stringifyUrl({ url: '/session-administration/sheets', query: { course, employeeId } });
  const response = await campusFetch<SessionSheet[]>(url);
  if (!response.ok) {
    throw new Error(`Session Administration request failed: ${response.status}`);
  }
  return response.json();
}

export async function getSessionAdministrationSheet(course: number, sheetId: string, retake: number) {
  const url = qs.stringifyUrl({
    url: `/session-administration/sheets/${encodeURIComponent(sheetId)}/${retake}`,
    query: { course },
  });
  const response = await campusFetch<SessionSheetDetails>(url);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Session Administration request failed: ${response.status}`);
  }
  return response.json();
}

export async function getSessionAdministrationMarks(
  course: number,
  sheetId: string,
  retake: number,
  studentId: string,
) {
  const url = qs.stringifyUrl({
    url: `/session-administration/sheets/${encodeURIComponent(sheetId)}/${retake}/students/${encodeURIComponent(studentId)}`,
    query: { course },
  });
  const response = await campusFetch<SessionStudentMarks>(url);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Session Administration request failed: ${response.status}`);
  }
  return response.json();
}
