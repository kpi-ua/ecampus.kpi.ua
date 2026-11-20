export interface DeansOfficeOption {
  id: number;
  name: string;
}

export interface DeansOfficeStudentSearchResult extends DeansOfficeOption {
  groupId: number | null;
}

export interface DeansOfficeOptions {
  faculties: DeansOfficeOption[];
  departments: DeansOfficeOption[];
  years: DeansOfficeOption[];
  periodTypes: DeansOfficeOption[];
}

export interface DeansOfficeGroupCount {
  groupName: string;
  department: string;
  course: number;
  studentCount: number;
}

export interface DeansOfficeDiscipline {
  id: number;
  name: string;
  attestationSemester: number | null;
  lecturers: string | null;
  groupNames: string | null;
}

export interface DeansOfficeReportRow {
  course: number;
  educationLevel: string;
  groupCount: number;
  studentCount: number;
  attestedCount: number;
  notAttestedCount: number;
  oneOrTwoFailuresCount: number;
  threeOrMoreFailuresCount: number;
}
