export enum DeputyDeanView {
  Groups = 'groups',
  Results = 'results',
  MonitoringGroups = 'monitoring-groups',
  DepartmentGroups = 'department-groups',
  DepartmentEmployees = 'department-employees',
  GroupLoad = 'group-load',
  Sheets = 'sheets',
  Sheet = 'sheet',
  Employees = 'employees',
  EmployeeLoad = 'employee-load',
  Statistics = 'statistics',
  OutwardStatistics = 'outward-statistics',
  Summary = 'summary',
}
export const DEPUTY_DEAN_PATH = '/module/deputy-dean';

export enum DeputyDeanExamStatus {
  Editing = 'Editing',
  Submitted = 'Submitted',
  Closed = 'Closed',
  Pending = 'Pending',
}

export enum DeputyDeanMarkStatus {
  Missing = 'Missing',
  Graded = 'Graded',
  NotAdmitted = 'NotAdmitted',
  NotGraded = 'NotGraded',
}
