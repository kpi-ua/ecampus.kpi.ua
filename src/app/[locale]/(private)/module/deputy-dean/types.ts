import { DeputyDeanView } from './constants';

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

export interface DeputyDeanDepartment {
  id: number;
  name: string;
  faculty: string;
}
