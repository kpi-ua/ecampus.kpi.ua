import { EmploymentType } from './employment-type';

interface Subdivision {
  id: number;
  name: string;
}

export interface EmployeePosition {
  name: string;
  subdivision: Subdivision;
  employment: EmploymentType;
}

export interface EmployeeProfile {
  positions: EmployeePosition[];
  academicDegree: string;
  academicStatus: string;
}
