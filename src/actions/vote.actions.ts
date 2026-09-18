'use server';

import { revalidatePath } from 'next/cache';

import { campusFetch } from '@/lib/client';
import { SubmitVoteRequest, VoteData } from '@/types/models/vote';

export const getVoteData = async (): Promise<VoteData> => {
  const response = await campusFetch<VoteData>('/vote');

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
};

export const submitVote = async (request: SubmitVoteRequest) => {
  const response = await campusFetch('/vote', {
    method: 'POST',
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  revalidatePath('/module/vote');
};
