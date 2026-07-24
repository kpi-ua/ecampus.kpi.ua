'use server';

import { campusFetch } from '@/lib/client';
import {
  K7_ACHIEVEMENT_WORK_TYPE,
  K7FormFilters,
  K7HtmlPreview,
  K7HtmlPreviewFlat,
  K7HtmlPreviewResponse,
  K7ReportRequest,
} from '@/types/models/k7-form';

const normalizeK7FormPreview = (response: K7HtmlPreviewResponse): K7HtmlPreview => {
  const flatResponse = response as K7HtmlPreviewFlat;

  const teachingDisciplines = flatResponse.teachingDisciplines ?? [];
  const otherEducationalActivities = flatResponse.otherEducationalActivities ?? [];
  const detailedAchievements = flatResponse.detailedAchievements ?? [];

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
    header: flatResponse.header,
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

export const getK7FormPreview = async (k7ReportRequestId: string): Promise<K7HtmlPreview> => {
  const response = await campusFetch<K7HtmlPreviewResponse>(`/k7-form/requests/${k7ReportRequestId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch K-7 preview: ${response.status} ${response.statusText}`);
  }

  return normalizeK7FormPreview(await response.json());
};
