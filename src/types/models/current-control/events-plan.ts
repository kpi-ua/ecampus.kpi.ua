import { Teacher } from '@/types/models/current-control/teacher';

export interface EventsPlan {
  date: string;
  controlType: string;
  lecturer: Teacher;
  note: string;
}
