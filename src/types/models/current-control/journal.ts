import { Lecturer } from '@/types/models/current-control/lecturer';

export interface Journal {
  date: string;
  score: number | null;
  presence: boolean;
  controlType: string;
  lecturer: Lecturer;
  note: string;
}
