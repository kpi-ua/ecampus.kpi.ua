export interface Department {
  id: number;
  name: string;
  faculty: string;
  abbreviation: string;
}

export interface Employee {
  id: number;
  fullName: string;
  departmentId: number;
  department: string;
  position: string;
  employment: string;
  status: string;
}

export interface StudentDirectoryEntry {
  id: number;
  fullName: string;
  groupName: string;
  course: number;
  educationLevel: string;
}

export interface Responsibility {
  id: number;
  userAccountId: number | null;
  name: string;
  department: string;
  responsiblePerson: string | null;
}

export interface StudentSurvey {
  studyYear: string;
  survey: string;
  lecturer: string;
  submittedAt: string | null;
}

export interface StudentAttestation {
  studyYear: string;
  semester: number;
  discipline: string;
  lecturer: string;
  assessment: string;
  result: 'attested' | 'notAttested' | 'notStudying' | null;
}

export interface StudentMonitoringResult {
  sheetId: number;
  studyYear: string;
  semester: number;
  discipline: string;
  lecturer: string;
  assessment: string;
  assessmentDate: string | null;
  mark: number | null;
}

export interface StudentRecord {
  fullName: string;
  surveys: StudentSurvey[];
  attestations: StudentAttestation[];
  monitoring: StudentMonitoringResult[];
}

export interface SessionResult {
  disciplineName: string;
  studyTypeName: string;
  employeeName: string;
  examDate: string | null;
  mark: string;
}

export interface LecturerSurvey {
  employeeId: number;
  lecturer: string;
  studyYear: string;
  survey: string;
  course: number;
  criterion: string;
  responses: number;
  average: number | null;
  weightedAverage: number | null;
}

export interface LecturerSurveySummary extends Pick<
  LecturerSurvey,
  'employeeId' | 'lecturer' | 'responses' | 'average' | 'weightedAverage'
> {
  details: LecturerSurvey[];
}

export interface PersonnelEmployment {
  fullName: string;
  documentNumber: string | null;
  documentDate: string | null;
  position: string | null;
  positionDateStart: string | null;
  positionDateEnd: string | null;
  workOrgForm: string | null;
  stake: string | null;
}

export interface EmployeeContacts {
  employeeId: number;
  fullName: string;
  workplace: string;
  position: string;
  status: string;
  contractEnd: string | null;
  contacts: { contactTypeId: number; value: string }[];
}

export interface DeanContactDirectory {
  teachingStaff: EmployeeContacts[];
  otherStaff: EmployeeContacts[];
  researchStaff: EmployeeContacts[];
  supportStaff: EmployeeContacts[];
}
