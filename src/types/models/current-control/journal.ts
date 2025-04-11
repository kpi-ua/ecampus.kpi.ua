import { Teacher } from '@/types/models/current-control/teacher';

export interface Journal {
  date: string;
  score: number | null;
  presence: boolean;
  controlType: string;
  lecturer: Teacher;
  note: string;
}
