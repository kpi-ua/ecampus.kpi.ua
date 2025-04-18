import { Lecturer } from '@/types/models/current-control/lecturer';

export interface EventsPlan {
  date: string;
  controlType: string;
  lecturer: Lecturer;
  note: string;
}
