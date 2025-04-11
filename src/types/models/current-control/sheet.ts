import { Cathedra } from '@/types/models/cathedra';
import { Lecturer } from '@/types/models/current-control/lecturer';

interface Discipline {
  id: string;
  name: string;
  studyYear: string; // "2021-2022"
  score: number;
  teachers: Lecturer[];
  semester: number;
  cathedra: Cathedra;
}

export interface Sheet {
  disciplines: Discipline[];
  studyYears: string[]; // ["2021-2022", "2022-2023", "2023-2024" ... ]
}
