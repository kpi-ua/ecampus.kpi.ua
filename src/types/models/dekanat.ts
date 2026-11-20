export interface DekanatOption {
  id: number;
  name: string;
}

export interface DekanatStudentSearchResult extends DekanatOption {
  groupId: number | null;
}

export interface DekanatOptions {
  faculties: DekanatOption[];
  departments: DekanatOption[];
  years: DekanatOption[];
  periodTypes: DekanatOption[];
}

export interface DekanatGroupCount {
  groupName: string;
  department: string;
  course: number;
  studentCount: number;
}

export interface DekanatDiscipline {
  id: number;
  name: string;
  attestationSemester: number | null;
  lecturers: string | null;
  groupNames: string | null;
}

export interface DekanatReportRow {
  course: number;
  educationLevel: string;
  groupCount: number;
  studentCount: number;
  attestedCount: number;
  notAttestedCount: number;
  oneOrTwoFailuresCount: number;
  threeOrMoreFailuresCount: number;
}
