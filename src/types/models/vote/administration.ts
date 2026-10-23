import { VoteCriterion } from '@/types/models/vote';

export interface VoteAdminCriterion extends VoteCriterion {
  isActive: boolean;
}

export interface VoteCriteriaAdministration {
  isVotingOpen: boolean;
  criteria: VoteAdminCriterion[];
  terms: VoteAdminTerm[];
}

export interface VoteCriteriaAdministrationData {
  isVotingOpen: boolean;
  currentCriteria: VoteAdminCriterion[];
  archivedCriteria: VoteAdminCriterion[];
  terms: VoteAdminTerm[];
}

export interface SaveVoteTermRequest {
  studyYear: string;
  number: number;
  semester: number;
  startsOn: string;
  endsOn: string;
  resultsPublishOn: string;
}

export interface VoteAdminTerm extends SaveVoteTermRequest {
  id: number;
  isActive: boolean;
  respondentCount: number;
}

export interface SaveVoteCriterionRequest {
  name: string;
  coefficient: number;
}
