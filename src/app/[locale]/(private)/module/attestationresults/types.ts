import { CuratorOption } from '@/app/[locale]/(private)/module/curatorlecturer/types';

export interface AttestationDepartment extends CuratorOption {
  facultyId: number;
  facultyName: string;
}

export interface AttestationReportOptions {
  currentYearId: number;
  years: CuratorOption[];
  attestations: CuratorOption[];
  departments: AttestationDepartment[];
}

export interface AttestationReportQuery {
  departmentId: number;
  yearId: number;
  semester: number;
  attestationId: number;
  groupId?: number;
  course?: number;
  studentId?: number;
}

export interface AttestationReportGroup {
  id: number;
  course: number;
  name: string;
  curator: string;
  details: string;
}

export interface AttestationReportStudent {
  studentId: number;
  groupId: number;
  fullName: string;
}

export interface AttestationReportResult {
  groupId: number;
  studentId: number;
  disciplineId: number;
  discipline: string;
  employeeId: number;
  lecturer: string;
  result: string | null;
}

export interface AttestationReport {
  groups: AttestationReportGroup[];
  students: AttestationReportStudent[];
  results: AttestationReportResult[];
}
