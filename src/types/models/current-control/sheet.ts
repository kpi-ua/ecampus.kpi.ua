import { Cathedra } from '@/types/models/cathedra';
import { Teacher } from '@/types/models/current-control/teacher';

interface Discipline {
  id: string;
  name: string;
  studyYear: string; // "2021-2022"
  score: number;
  teachers: Teacher[];
  semester: number;
  cathedra: Cathedra;
}

export interface Sheet {
  disciplines: Discipline[];
  studyYears: string[]; // ["2021-2022", "2022-2023", "2023-2024" ... ]
}
