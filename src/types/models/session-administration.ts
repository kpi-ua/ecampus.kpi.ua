import { type StudyForm } from '@/types/enums/study-form';

export enum SessionSheetStatus {
  Open = 'open',
  Closed = 'closed',
  Upcoming = 'upcoming',
  Unscheduled = 'unscheduled',
}

export interface SessionSheet {
  id: string;
  retake: number;
  number: string;
  group: string;
  discipline: string;
  assessment: string;
  educationForm: StudyForm;
  educationFormId: string;
  employeeId: string;
  lecturer: string | null;
  course: number;
  opensAt: string | null;
  examAt: string | null;
  closesAt: string | null;
  status: SessionSheetStatus;
}

export enum ExaminationAttendanceStatus {
  Attended = 'Attended',
  Absent = 'Absent',
  NotAdmitted = 'NotAdmitted',
  Removed = 'Removed',
}

export interface SessionSheetDetails {
  sheet: SessionSheet;
  students: {
    id: string;
    name: string;
    mark: string | null;
    attendance: ExaminationAttendanceStatus | null;
    notes: string | null;
  }[];
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
