export const VoteState = {
  Unavailable: 'Unavailable',
  Active: 'Active',
  ResultsPending: 'ResultsPending',
  ResultsPublished: 'ResultsPublished',
} as const;

export interface VoteTerm {
  id: number;
  studyYear: string;
  number: number;
  description: string | null;
  startsOn: string;
  endsOn: string;
  resultsPublishOn: string;
}

export interface VoteCriterion {
  id: number;
  name: string;
  coefficient: number;
}

export interface VoteScore {
  criterionId: number;
  mark: number;
}

export interface VoteLecturerResult {
  overallScore: number;
  courseScore: number | null;
  criterionScores: Record<number, number>;
}

export interface VoteLecturer {
  employeeId: number;
  userAccountId: number;
  fullName: string;
  photo: string;
  hasVoted: boolean;
  result: VoteLecturerResult | null;
}

export interface VoteData {
  state: (typeof VoteState)[keyof typeof VoteState];
  term: VoteTerm | null;
  criteria: VoteCriterion[];
  lecturers: VoteLecturer[];
}

export interface SubmitVoteRequest {
  employeeId: number;
  scores: VoteScore[];
}
