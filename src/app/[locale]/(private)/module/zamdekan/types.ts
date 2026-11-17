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

export interface ZamdekanDepartment {
  id: number;
  name: string;
  faculty: string;
}
