'use server';

import { revalidatePath } from 'next/cache';

import { campusFetch } from '@/lib/client';
import {
  SaveVoteCriterionRequest,
  SaveVoteTermRequest,
  VoteCriteriaAdministration,
  VoteCriteriaAdministrationData,
  VoteAdminCriterion,
} from '@/types/models/vote/administration';

export const getVoteCriteriaAdministration = async (): Promise<VoteCriteriaAdministrationData> => {
  const response = await campusFetch<VoteCriteriaAdministration>('/vote/admin');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  const data: VoteCriteriaAdministration = await response.json();
  const currentCriteria: VoteAdminCriterion[] = [];
  const archivedCriteria: VoteAdminCriterion[] = [];

  for (const criterion of data.criteria) {
    if (criterion.isActive) {
      currentCriteria.push(criterion);
    } else {
      archivedCriteria.push(criterion);
    }
  }

  return {
    isVotingOpen: data.isVotingOpen,
    currentCriteria,
    archivedCriteria,
    terms: data.terms.filter((term) => term.isActive),
  };
};

export const createVoteCriterion = async (request: SaveVoteCriterionRequest) => {
  const response = await campusFetch('/vote/admin/criteria', {
    method: 'POST',
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  revalidatePath('/module/adminvote');
};

export const updateVoteCriterion = async (id: number, request: SaveVoteCriterionRequest) => {
  const response = await campusFetch(`/vote/admin/criteria/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  revalidatePath('/module/adminvote');
};

export const archiveVoteCriterion = async (id: number) => {
  const response = await campusFetch(`/vote/admin/criteria/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  revalidatePath('/module/adminvote');
};

export const createVoteTerm = async (request: SaveVoteTermRequest): Promise<void> => {
  const response = await campusFetch('/vote/admin/terms', { method: 'POST', body: JSON.stringify(request) });
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  revalidatePath('/module/adminvote');
};

export const updateVoteTerm = async (id: number, request: SaveVoteTermRequest): Promise<void> => {
  const response = await campusFetch(`/vote/admin/terms/${id}`, { method: 'PUT', body: JSON.stringify(request) });
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  revalidatePath('/module/adminvote');
};

export const deleteVoteTerm = async (id: number): Promise<void> => {
  const response = await campusFetch(`/vote/admin/terms/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  revalidatePath('/module/adminvote');
};
