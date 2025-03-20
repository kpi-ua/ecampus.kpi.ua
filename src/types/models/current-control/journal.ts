import { Teacher } from '@/types/models/current-control/teacher';

export interface Journal {
  date: string;
  score: number;
  controlType: string;
  teacher: Teacher;
  note: string;
}
