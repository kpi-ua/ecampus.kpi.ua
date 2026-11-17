import { ZamdekanView } from './constants';

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

export interface ZamdekanMonitoringGroup {
  groupId: number;
  course: number;
  group: string;
  disciplineCount: number;
  sheetCount: number;
}

export interface ZamdekanGroupDiscipline {
  groupId: number;
  course: number;
  group: string;
  disciplineId: number;
  discipline: string;
  teachingDepartment: string;
  sheetCount: number;
}

export interface ZamdekanMonitoringSheet {
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

export interface ZamdekanSheetMark {
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

export interface ZamdekanEmployee {
  employeeId: number;
  fullName: string;
  department: string;
  status: string | null;
  contractEnd: string | null;
  sheetCount: number;
}

export interface ZamdekanEmployeeDiscipline {
  employeeId: number;
  employee: string;
  groupId: number;
  group: string;
  disciplineId: number;
  discipline: string;
  teachingTypes: string | null;
  sheetCount: number;
}

export interface ZamdekanEmployeeActivity {
  employeeId: number;
  employee: string;
  department: string;
  date: string;
}

export interface ZamdekanDepartment {
  id: number;
  name: string;
  faculty: string;
}
