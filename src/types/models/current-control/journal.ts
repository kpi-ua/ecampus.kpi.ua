import { Lecturer } from '@/types/models/lecturer';

interface JournalDiscipline {
  date: string;
  presence: boolean;
  score?: number;
  controlType: string;
  lecturer: Lecturer;
  note: string;
}

export interface Journal {
  disciplines: JournalDiscipline[];
  totalScore: number;
}
