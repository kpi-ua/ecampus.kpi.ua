import { DeputyDeanExamStatus, DeputyDeanMarkStatus, DeputyDeanView } from './constants';

export type DeputyDeanSection = 'groups' | 'monitoring';

type DepartmentRoute = { departmentId: number };
type DisciplineRoute = DepartmentRoute & { groupId: number; disciplineId: number; employeeId?: number };

export type DeputyDeanQuery =
  | { view: DeputyDeanView.Groups | DeputyDeanView.MonitoringGroups | DeputyDeanView.Employees }
  | { view: DeputyDeanView.Results; groupId: number; studentId: number }
  | (DepartmentRoute & {
      view:
        | DeputyDeanView.DepartmentGroups
        | DeputyDeanView.DepartmentEmployees
        | DeputyDeanView.Statistics
        | DeputyDeanView.OutwardStatistics;
    })
  | (DepartmentRoute & { view: DeputyDeanView.GroupLoad; groupId: number })
  | (DepartmentRoute & { view: DeputyDeanView.EmployeeLoad; employeeId: number })
  | (DisciplineRoute & { view: DeputyDeanView.Sheets })
  | (DisciplineRoute & { view: DeputyDeanView.Sheet; monitoringId: number })
  | { view: DeputyDeanView.Summary; departmentId?: number };

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

export interface DeputyDeanExamResultPage {
  items: DeputyDeanExamResult[];
  totalCount: number;
  pageSize: number;
}

export interface DeputyDeanDepartment {
  id: number;
  name: string;
  faculty: string;
}
