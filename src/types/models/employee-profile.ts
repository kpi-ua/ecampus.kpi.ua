import { AcademicDegree } from '../enums/academic-degree';
import { AcademicStatus } from '../enums/academic-status';
import { EmploymentType } from '../enums/employment-type';

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
  academicDegree: AcademicDegree;
  academicStatus: AcademicStatus;
}
