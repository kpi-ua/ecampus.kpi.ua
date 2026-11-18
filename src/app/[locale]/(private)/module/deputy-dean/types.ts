import { DeputyDeanView } from './constants';

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

export interface DeputyDeanDepartment {
  id: number;
  name: string;
  faculty: string;
}
