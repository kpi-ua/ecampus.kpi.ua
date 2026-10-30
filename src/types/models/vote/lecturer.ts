import { VoteCriterion, VoteData, VoteTerm } from '@/types/models/vote';

export interface VoteCourseResult {
  course: number;
  score: number;
  respondentCount: number;
  criterionScores: Record<string, number>;
}

export interface VoteLecturerData {
  state: VoteData['state'];
  term: VoteTerm | null;
  criteria: VoteCriterion[];
  result: {
    overallScore: number;
    courses: VoteCourseResult[];
  } | null;
}

export interface LecturerVoteResults {
  periods: VoteLecturerData[];
  studyYears: string[];
  periodNumbers: number[];
}
