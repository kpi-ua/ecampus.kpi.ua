import { MONITORING_VIEWS, REPORT_VIEWS } from './constants';

export type ZamdekanView = (typeof REPORT_VIEWS)[number];
export type ZamdekanMonitoringView = (typeof MONITORING_VIEWS)[number];

export type ZamdekanSection = 'groups' | 'monitoring';

export interface ZamdekanQuery {
  view: ZamdekanView;
  groupId?: number;
  studentId?: number;
  employeeId?: number;
  disciplineId?: number;
  monitoringId?: number;
  departmentId?: number;
}

export interface ZamdekanGroup {
  groupId: number;
  course: number;
  group: string;
  curator: string;
  department: string;
}

export interface ZamdekanAgreement {
  studentId: number;
  fullName: string;
  status: string;
  groupId: number;
  group: string;
  department: string;
  hasAgreement: boolean;
  acceptedAt: string | null;
}

export interface ZamdekanExamResult {
  discipline: string;
  controlForm: string;
  examiner: string;
  part: number;
  status: number;
  eventDate: string | null;
  opensAt: string | null;
  closesAt: string | null;
  mark: number | null;
  nationalScale: string | null;
}

export interface ZamdekanDepartment {
  id: number;
  name: string;
  faculty: string;
}
