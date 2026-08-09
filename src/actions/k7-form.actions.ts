'use server';

import { revalidatePath } from 'next/cache';

import { campusFetch } from '@/lib/client';
import {
  CreateK7ReportRequestInput,
  K7_ACHIEVEMENT_WORK_TYPE,
  K7FormFilters,
  K7HtmlPreview,
  K7ReportRequest,
  K7ReportRequestDetails,
} from '@/types/models/k7-form';

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

  const educationalHours =
    teachingDisciplines.reduce((total, item) => total + item.totalVolume, 0) +
    otherEducationalActivities.reduce((total, item) => total + item.grandTotal, 0);
  const scientificHours = scientificAchievements.reduce((total, item) => total + item.hoursUsed, 0);
  const methodicalHours = methodicalAchievements.reduce((total, item) => total + item.hoursUsed, 0);
  const organizationalHours = organizationalAchievements.reduce((total, item) => total + item.hoursUsed, 0);
  const otherHours = otherAchievements.reduce((total, item) => total + item.hoursUsed, 0);

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
  };
};

export const getK7FormFilters = async (targetAccountId?: number): Promise<K7FormFilters> => {
  const query = targetAccountId === undefined ? '' : `?targetAccountId=${targetAccountId}`;
  const response = await campusFetch<K7FormFilters>(`/k7-form/filters${query}`);

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

export const createK7FormRequest = async (input: CreateK7ReportRequestInput): Promise<K7ReportRequest> => {
  const response = await campusFetch<K7ReportRequest>('/k7-form/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to create K-7 request: ${response.status} ${response.statusText}`);
  }

  const reportRequest = await response.json();
  revalidatePath('/k-7');

  return reportRequest;
};

export const getK7FormPreview = async (requestId: string): Promise<K7HtmlPreview> => {
  const response = await campusFetch<K7ReportRequestDetails>(`/k7-form/requests/${requestId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch K-7 preview: ${response.status} ${response.statusText}`);
  }

  return normalizeK7FormPreview(await response.json());
};

export const getK7FormPdf = async (requestId: string): Promise<Blob> => {
  const response = await campusFetch(`/k7-form/requests/${requestId}/pdf`, {
    headers: { Accept: 'application/pdf' },
  });

  if (!response.ok) {
    throw new Error(`Failed to download K-7 PDF: ${response.status} ${response.statusText}`);
  }

  return response.blob();
};
