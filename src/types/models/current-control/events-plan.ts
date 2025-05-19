import { Lecturer } from '@/types/models/lecturer';

export interface EventsPlan {
  date: string;
  controlType: string;
  lecturer: Lecturer;
  note: string;
}
