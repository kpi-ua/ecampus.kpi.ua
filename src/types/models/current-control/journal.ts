import { Lecturer } from '@/types/models/lecturer';

export interface Journal {
  date: string;
  presence: boolean;
  score?: number;
  controlType: string;
  lecturer: Lecturer;
  note: string;
}
