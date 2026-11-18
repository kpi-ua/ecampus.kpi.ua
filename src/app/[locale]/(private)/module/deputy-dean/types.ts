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

export interface DeputyDeanMonitoringGroup {
  groupId: number;
  course: number;
  group: string;
  disciplineCount: number;
  sheetCount: number;
}

export interface DeputyDeanGroupDiscipline {
  groupId: number;
  course: number;
  group: string;
  disciplineId: number;
  discipline: string;
  teachingDepartment: string;
  sheetCount: number;
}

export interface DeputyDeanMonitoringSheet {
  course: number;
  sheetId: number;
  employeeSheetId: number;
  groupId: number;
  group: string;
  disciplineId: number;
  discipline: string;
  employeeId: number;
  employee: string;
  name: string;
  assessmentCount: number;
  markCount: number;
}

export interface DeputyDeanSheetMark {
  studentId: number;
  student: string;
  employeeSheetId: number;
  assessmentId: number | null;
  assessmentDescription: string | null;
  assessmentDate: string | null;
  sheetName: string;
  teacher: string;
  mark: number | null;
}

export interface DeputyDeanEmployee {
  employeeId: number;
  fullName: string;
  department: string;
  status: string | null;
  contractEnd: string | null;
  sheetCount: number;
}

export interface DeputyDeanEmployeeDiscipline {
  employeeId: number;
  employee: string;
  groupId: number;
  group: string;
  disciplineId: number;
  discipline: string;
  teachingTypes: string | null;
  sheetCount: number;
}

export interface DeputyDeanEmployeeActivity {
  employeeId: number;
  employee: string;
  department: string;
  date: string;
}

export interface DeputyDeanDepartmentStatistics {
  departmentId: number;
  groupId: number;
  group: string;
  disciplineId: number;
  discipline: string;
  teachingDepartmentId: number;
  teachingDepartment: string;
  recipientDepartment: string;
  lecturers: string | null;
  semester: number;
  markCount: number;
}

export interface DeputyDeanCourseIndicators {
  educationLevel: 'bachelor' | 'master' | 'phd';
  course: number;
  groupCount: number;
  moduleCount: number;
  sheetCount: number;
  filledSheetCount: number;
}

export interface DeputyDeanDepartmentIndicators {
  departmentId: number;
  faculty: string;
  department: string;
  curriculum: DeputyDeanCourseIndicators[];
  outwardTeaching: DeputyDeanCourseIndicators[];
}

export interface DeputyDeanDepartmentSummary {
  yearId: number;
  semester: number;
  departments: DeputyDeanDepartmentIndicators[];
}

export interface DeputyDeanDepartment {
  id: number;
  name: string;
  faculty: string;
}
