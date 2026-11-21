export interface SessionSheet {
  id: string;
  retake: number;
  number: string;
  group: string;
  discipline: string;
  assessment: string;
  educationForm: string;
  educationFormId: string;
  employeeId: string;
  lecturer: string | null;
  course: number;
  opensAt: string | null;
  examAt: string | null;
  closesAt: string | null;
  status: 'open' | 'upcoming' | 'closed' | 'unscheduled';
}

export interface SessionSheetDetails {
  sheet: SessionSheet;
  students: { id: string; name: string; mark: string | null; attendance: string | null; notes: string | null }[];
}

export interface SessionMark {
  discipline: string;
  assessment: string;
  mark: string;
}

export interface SessionStudentMarks {
  name: string;
  marks: SessionMark[];
}
