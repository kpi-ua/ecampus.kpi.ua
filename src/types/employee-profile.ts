import { EMPLOYMENT_TYPE } from '@/types/constants';

interface Subdivision {
  id: number;
  name: string;
}

interface EmployeePosition {
  name: string;
  subdivision: Subdivision;
  employment: keyof typeof EMPLOYMENT_TYPE;
}

export interface EmployeeProfile {
  positions: EmployeePosition[];
  academicDegree: string;
  academicStatus: string;
}
