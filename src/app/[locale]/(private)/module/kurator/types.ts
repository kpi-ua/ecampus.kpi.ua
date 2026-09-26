export interface CuratorGroup {
  groupId: number;
  studyGroupId: number;
  name: string;
  course: number;
  yearId: number;
  departmentId: number;
  departmentName: string;
  departmentAbbreviation: string;
  description: string;
  studyForm: string;
  speciality: string;
  groupLeaderStudentId: number | null;
  groupLeaderName: string | null;
  curatorEmployeeId: number | null;
  curatorName: string | null;
}

export interface CuratorStudent {
  studentId: number;
  userAccountId: number;
  fullName: string;
  email: string | null;
  curatorContacts: string[];
}

export interface CuratorStudentCredentials extends CuratorStudent {
  login: string | null;
  initialPassword: string | null;
  passwordChanged: boolean;
  codeOfHonorSignDate: string | null;
}

export interface CuratorDepartment {
  id: number;
  name: string;
}

export interface CuratorLecturer {
  employeeId: number;
  userAccountId: number;
  fullName: string;
  departmentId: number;
  departmentName: string | null;
}

export interface CuratorAssignment {
  employeeId: number;
  curatorName: string;
  startDate: string;
  endDate: string | null;
}

export interface CuratorOption {
  id: number;
  name: string;
}

export interface CuratorFilters {
  years: CuratorOption[];
  surveyTerms: CuratorOption[];
  attestations: CuratorOption[];
}

export interface CuratorSurveyRow extends CuratorStudent {
  employeeId: number;
  lecturerName: string;
  disciplineId: number;
  disciplineName: string;
  termId: number;
  hasVoted: boolean;
}

export interface CuratorAttestationRow extends CuratorStudent {
  employeeId: number;
  lecturerName: string;
  disciplineId: number;
  disciplineName: string;
  semester: number;
  result: string | null;
}

export interface CuratorAttestationStudent extends CuratorStudent {
  attested: number;
  notAttested: number;
  notStudying: number;
  missing: number;
  results: CuratorAttestationRow[];
}

export interface CuratorPeriodParams {
  yearId?: number;
  semester?: number;
}

export interface CuratorSurveyParams extends CuratorPeriodParams {
  termId?: number;
  employeeId?: number;
}

export interface CuratorAttestationParams extends CuratorPeriodParams {
  attestationId?: number;
}
