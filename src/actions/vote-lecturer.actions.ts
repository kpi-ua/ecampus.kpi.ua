'use server';

import { sift, sort, unique } from 'radash';

import { campusFetch } from '@/lib/client';
import { LecturerVoteResults, VoteLecturerData } from '@/types/models/vote/lecturer';

export const getLecturerVoteResults = async (): Promise<LecturerVoteResults> => {
  const response = await campusFetch<VoteLecturerData[]>('/votelecturer');

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  const periods: VoteLecturerData[] = await response.json();
  const terms = sift(periods.map(({ term }) => term));
  const studyYears = unique(terms.map(({ studyYear }) => studyYear));
  const periodNumbers = sort(unique(terms.map(({ number }) => number)), (number) => number);

  return { periods, studyYears, periodNumbers };
};
