'use server';

import { campusFetch } from '@/lib/client';
import { SurveyParticipation, VisitStatistics } from '@/types/models/statistics';

export const getSurveyParticipation = async (): Promise<SurveyParticipation[]> => {
  const response = await campusFetch<SurveyParticipation[]>('/statistics/surveys');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getVisitStatistics = async (days: number): Promise<VisitStatistics> => {
  const response = await campusFetch<VisitStatistics>(`/statistics/visits?days=${days}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};
