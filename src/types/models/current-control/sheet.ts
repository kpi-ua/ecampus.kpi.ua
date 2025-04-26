import { Cathedra } from '@/types/models/cathedra';
import { Lecturer } from '@/types/models/current-control/lecturer';

export interface Discipline {
  id: string;
  name: string;
  studyYear: string; // "2021-2022"
  lecturers: Lecturer[];
  semester: number;
  cathedra: Cathedra;
  score?: number;
}

export interface Sheet {
  disciplines: Discipline[];
  studyYears: string[]; // ["2021-2022", "2022-2023", "2023-2024" ... ]
}
