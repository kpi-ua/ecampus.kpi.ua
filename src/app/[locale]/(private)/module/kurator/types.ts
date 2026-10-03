import { Contact } from '@/types/models/colleague-contact';

import { ATTESTATION_RESULT } from './constants';

export type CuratorAttestationResult = (typeof ATTESTATION_RESULT)[keyof typeof ATTESTATION_RESULT];

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

export interface CuratorStudentDetails extends CuratorStudent {
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
  disciplineId: number;
  disciplineName: string;
  termId: number;
  hasVoted: boolean;
}

export interface CuratorAttestationRow extends CuratorStudent {
  employeeId: number;
  lecturerName: string;
  discipline: CuratorOption;
  semester: number;
  result: CuratorAttestationResult;
  attestationId: number;
  notAttestedTwice: boolean;
}

export interface CuratorAttestationStudent extends CuratorStudent {
  attested: number;
  notAttested: number;
  notAttestedTwiceCount: number;
  notStudying: number;
  missing: number;
  results: CuratorAttestationRow[];
}

export interface CuratorAttestationSemester {
  semester: number;
  students: CuratorAttestationStudent[];
  disciplines: CuratorAttestationDiscipline[];
}

export interface CuratorAttestationDiscipline {
  disciplineId: number;
  employeeId: number;
  name: string;
  lecturerName: string;
  notAttestedTwiceCount: number;
  results: CuratorAttestationRow[];
  students: CuratorAttestationStudent[];
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
