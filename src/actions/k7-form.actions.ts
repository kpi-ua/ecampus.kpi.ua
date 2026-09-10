'use server';

import { revalidatePath } from 'next/cache';
import qs from 'query-string';

import { campusFetch } from '@/lib/client';
import {
  CreateK7FormRequestResult,
  CreateK7ReportRequestInput,
  K7_ACHIEVEMENT_WORK_TYPE,
  K7DetailedAchievement,
  K7FormFilters,
  K7FormLecturer,
  K7HtmlPreview,
  K7ReportRequest,
  K7ReportRequestFilter,
  K7ReportRequestDetails,
} from '@/types/models/k7-form';

const TOO_MANY_REQUESTS = 429;

export const getK7FormLecturers = async (departmentId: number): Promise<K7FormLecturer[]> => {
  const url = qs.stringifyUrl({ url: '/k7-form/lecturers', query: { departmentId } });
  const response = await campusFetch<K7FormLecturer[]>(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch K-7 lecturers: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const normalizeK7FormPreview = (response: K7ReportRequestDetails): K7HtmlPreview => {
  const teachingDisciplines = response.teachingDisciplines ?? [];
  const otherEducationalActivities = response.otherEducationalActivities ?? [];
  const detailedAchievements = response.detailedAchievements ?? [];

  const achievementsByWorkType = Object.groupBy(detailedAchievements, ({ workType }) => workType);
  const scientificAchievements = [
    ...(achievementsByWorkType[K7_ACHIEVEMENT_WORK_TYPE.Scientific] ?? []),
    ...(achievementsByWorkType[K7_ACHIEVEMENT_WORK_TYPE.Article] ?? []),
  ];
  const methodicalAchievements = [
    ...(achievementsByWorkType[K7_ACHIEVEMENT_WORK_TYPE.Methodical] ?? []),
    ...(achievementsByWorkType[K7_ACHIEVEMENT_WORK_TYPE.Syllabus] ?? []),
  ];
  const organizationalAchievements = achievementsByWorkType[K7_ACHIEVEMENT_WORK_TYPE.Organizational] ?? [];
  const otherAchievements = achievementsByWorkType[K7_ACHIEVEMENT_WORK_TYPE.Other] ?? [];
  // Educational work recorded as an achievement belongs to section 1.2, the way the generated
  // document and the MyKPI workload both count it.
  const educationalAchievements = achievementsByWorkType[K7_ACHIEVEMENT_WORK_TYPE.Educational] ?? [];

  const sumHours = (rows: K7DetailedAchievement[]) => rows.reduce((total, item) => total + item.hoursUsed, 0);

  const educationalHours =
    teachingDisciplines.reduce((total, item) => total + item.totalVolume, 0) +
    otherEducationalActivities.reduce((total, item) => total + item.grandTotal, 0) +
    sumHours(educationalAchievements);
  const methodicalHours = sumHours(methodicalAchievements);
  const organizationalHours = sumHours(organizationalAchievements);

  // The reporting limits of the time norms trim the credited totals without touching the rows.
  // Reading them here is what keeps this preview and the generated document in agreement; before
  // it, the screen showed raw totals while the downloaded file showed capped ones.
  const scientificWorkCap = response.scientificWorkCap ?? null;
  const otherWorkCap = response.otherWorkCap ?? null;
  const scientificHours = sumHours(scientificAchievements) - (scientificWorkCap?.exceededHours ?? 0);
  const otherHours = otherWorkCap?.creditedHours ?? sumHours(otherAchievements);

  return {
    header: response.header,
    section1: { teachingDisciplines, otherEducationalActivities },
    section2: scientificAchievements,
    section3: methodicalAchievements,
    section4: organizationalAchievements,
    section5: otherAchievements,
    section6: {
      educationalHours,
      scientificHours,
      methodicalHours,
      organizationalHours,
      otherHours,
      totalHours: educationalHours + scientificHours + methodicalHours + organizationalHours + otherHours,
    },
    caps: {
      scientific: scientificWorkCap,
      otherDuties: otherWorkCap,
    },
  };
};

export const getK7FormFilters = async (targetAccountId?: number): Promise<K7FormFilters> => {
  const url = qs.stringifyUrl({ url: '/k7-form/filters', query: { targetAccountId } });
  const response = await campusFetch<K7FormFilters>(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch K-7 filters: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getK7FormRequests = async ({
  all = false,
  ...query
}: K7ReportRequestFilter & { all?: boolean }): Promise<K7ReportRequest[]> => {
  const url = qs.stringifyUrl({ url: `/k7-form/requests${all ? '/all' : ''}`, query });
  const response = await campusFetch<K7ReportRequest[]>(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch K-7 requests: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const createK7FormRequest = async (input: CreateK7ReportRequestInput): Promise<CreateK7FormRequestResult> => {
  const response = await campusFetch<K7ReportRequest>('/k7-form/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  // The backend allows one report per lecturer every few minutes; it answers 429 with a message
  // that is ready to show and a Retry-After header.
  if (response.status === TOO_MANY_REQUESTS) {
    const retryAfter = Number(response.headers.get('Retry-After'));
    const body = (await response.json().catch(() => null)) as { message?: string } | null;

    return {
      outcome: 'throttled',
      message: body?.message ?? null,
      retryAfterSeconds: Number.isFinite(retryAfter) ? retryAfter : null,
    };
  }

  if (!response.ok) {
    throw new Error(`Failed to create K-7 request: ${response.status} ${response.statusText}`);
  }

  const request = await response.json();
  // The dashboard scopes are separate pages under the same route layout.
  revalidatePath('/[locale]/(private)/module/k7-form', 'layout');

  return { outcome: 'created', request };
};

export const retryK7FormRequest = async (requestId: string): Promise<K7ReportRequest> => {
  const response = await campusFetch<K7ReportRequest>(`/k7-form/requests/${requestId}/retry`, { method: 'POST' });

  if (!response.ok) {
    throw new Error(`Failed to retry K-7 request: ${response.status} ${response.statusText}`);
  }

  const request = await response.json();
  // The dashboard scopes are separate pages under the same route layout.
  revalidatePath('/[locale]/(private)/module/k7-form', 'layout');

  return request;
};

export const getK7FormPreview = async (requestId: string): Promise<K7HtmlPreview> => {
  const response = await campusFetch<K7ReportRequestDetails>(`/k7-form/requests/${requestId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch K-7 preview: ${response.status} ${response.statusText}`);
  }

  return normalizeK7FormPreview(await response.json());
};

export const getK7FormPdf = async (requestId: string): Promise<Blob> => {
  // The endpoint serves the stored document as-is, so the format comes from the response rather
  // than being demanded up front.
  const response = await campusFetch(`/k7-form/requests/${requestId}/download`, {
    headers: { Accept: '*/*' },
  });

  if (!response.ok) {
    throw new Error(`Failed to download K-7 PDF: ${response.status} ${response.statusText}`);
  }

  return response.blob();
};
