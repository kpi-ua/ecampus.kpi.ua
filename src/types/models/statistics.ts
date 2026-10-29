export interface SurveyParticipation {
  id: number;
  studyYear: string;
  number: number;
  startsOn: string;
  endsOn: string;
  respondentCount: number;
}

export interface DailyVisits {
  date: string;
  lecturers: number;
  students: number;
}

export interface VisitTotals {
  lecturers: number;
  students: number;
}

export interface VisitStatistics {
  startsOn: string;
  endsBefore: string;
  items: DailyVisits[];
  weeklySummary: VisitTotals | null;
}
