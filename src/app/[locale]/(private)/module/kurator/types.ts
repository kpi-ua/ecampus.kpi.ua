import { Contact } from '@/types/models/colleague-contact';

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
  curatorContacts: Contact[];
}

export interface CuratorStudentCredentials extends CuratorStudent {
  login: string | null;
  initialPassword: string | null;
  passwordChanged: boolean;
  codeOfHonorSignDate: string | null;
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
  discipline: CuratorOption;
  termId: number;
  hasVoted: boolean;
}

export interface CuratorPeriodParams {
  yearId?: number;
  semester?: number;
}

export interface CuratorSurveyParams extends CuratorPeriodParams {
  termId?: number;
  employeeId?: number;
}
