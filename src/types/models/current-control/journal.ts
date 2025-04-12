import { Lecturer } from '@/types/models/current-control/lecturer';

export interface Journal {
  date: string;
  presence: boolean;
  score?: number;
  controlType: string;
  lecturer: Lecturer;
  note: string;
}
