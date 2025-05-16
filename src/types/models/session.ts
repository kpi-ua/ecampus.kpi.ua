import { Lecturer } from '@/types/models/current-control/lecturer';

export interface Session {
  name: string;
  mark?: number;
  assessmentType: string;
  recordType: string;
  date?: string;
  status: string;
  lecturer: Lecturer;
}
