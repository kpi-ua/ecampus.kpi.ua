'use server';

import { campusFetch } from '@/lib/client';
import {
  K7DetailedAchievement,
  K7FormFilters,
  K7HtmlPreview,
  K7HtmlPreviewFlat,
  K7HtmlPreviewResponse,
  K7ReportRequest,
} from '@/types/models/k7-form';

const getAchievementSection = (achievement: K7DetailedAchievement): number => {
  if (achievement.sectionNumber) return achievement.sectionNumber;

  const workType = achievement.workType.trim().toLocaleLowerCase('uk-UA');

  if (workType.startsWith('Наукова')) return 2;
  if (workType.startsWith('Методична')) return 3;
  if (workType.startsWith('орган')) return 4;

  return 5;
};

const normalizeK7FormPreview = (response: K7HtmlPreviewResponse): K7HtmlPreview => {
  const flatResponse = response as K7HtmlPreviewFlat;

  const teachingDisciplines = flatResponse.teachingDisciplines ?? [];
  const otherEducationalActivities = flatResponse.otherEducationalActivities ?? [];
  const detailedAchievements = flatResponse.detailedAchievements ?? [];

  const section2 = detailedAchievements.filter((achievement) => getAchievementSection(achievement) === 2);
  const section3 = detailedAchievements.filter((achievement) => getAchievementSection(achievement) === 3);
  const section4 = detailedAchievements.filter((achievement) => getAchievementSection(achievement) === 4);
  const section5 = detailedAchievements.filter((achievement) => getAchievementSection(achievement) === 5);

  const educationalHours =
    teachingDisciplines.reduce((total, item) => total + item.totalVolume, 0) +
    otherEducationalActivities.reduce((total, item) => total + item.grandTotal, 0);
  const scientificHours = section2.reduce((total, item) => total + item.hoursUsed, 0);
  const methodicalHours = section3.reduce((total, item) => total + item.hoursUsed, 0);
  const organizationalHours = section4.reduce((total, item) => total + item.hoursUsed, 0);
  const otherHours = section5.reduce((total, item) => total + item.hoursUsed, 0);

  return {
    header: flatResponse.header,
    section1: { teachingDisciplines, otherEducationalActivities },
    section2,
    section3,
    section4,
    section5,
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
  const response = await campusFetch<K7HtmlPreviewResponse>(
    `/k7-form/requests/${k7ReportRequestId}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch K-7 preview: ${response.status} ${response.statusText}`);
  }

  return normalizeK7FormPreview(await response.json());
};
