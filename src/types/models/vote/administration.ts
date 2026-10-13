import { VoteCriterion } from '@/types/models/vote';

export interface VoteAdminCriterion extends VoteCriterion {
  isActive: boolean;
}

export interface VoteCriteriaAdministration {
  isVotingOpen: boolean;
  criteria: VoteAdminCriterion[];
}

export interface VoteCriteriaAdministrationData {
  isVotingOpen: boolean;
  currentCriteria: VoteAdminCriterion[];
  archivedCriteria: VoteAdminCriterion[];
}

export interface SaveVoteCriterionRequest {
  name: string;
  coefficient: number;
}
