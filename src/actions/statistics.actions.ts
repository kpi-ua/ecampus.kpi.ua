'use server';

import { campusFetch } from '@/lib/client';
import { SurveyParticipation } from '@/types/models/statistics';

export const getSurveyParticipation = async (): Promise<SurveyParticipation[]> => {
  const response = await campusFetch<SurveyParticipation[]>('/statistics/surveys');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};
