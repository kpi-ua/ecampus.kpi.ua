import { DeputyDeanExamStatus, DeputyDeanMarkStatus, DeputyDeanView } from './constants';

export type DeputyDeanSection = 'groups' | 'monitoring';

export interface DeputyDeanQuery {
  view: DeputyDeanView;
  groupId?: number;
  studentId?: number;
  employeeId?: number;
  disciplineId?: number;
  monitoringId?: number;
  departmentId?: number;
}

export interface DeputyDeanGroup {
  groupId: number;
  course: number;
  group: string;
  curator: string;
  department: string;
}

export interface DeputyDeanAgreement {
  studentId: number;
  fullName: string;
  status: string;
  groupId: number;
  group: string;
  department: string;
  hasAgreement: boolean;
  acceptedAt: string | null;
}

export interface DeputyDeanExamResult {
  discipline: string;
  controlForm: string;
  examiner: string;
  part: number;
  status: DeputyDeanExamStatus;
  eventDate: string | null;
  opensAt: string | null;
  closesAt: string | null;
  mark: number | null;
  markStatus: DeputyDeanMarkStatus;
  nationalScale: string | null;
}

export interface DeputyDeanDepartment {
  id: number;
  name: string;
  faculty: string;
}
