export interface K7FormLecturerProfile {
  employeeId: number;
  departmentId: number;
  departmentName: string;
  position: string;
}

export interface K7FormLecturer {
  userAccountId: number;
  fullName: string;
}

export interface K7FormFilters {
  years: number[];
  profiles: K7FormLecturerProfile[];
  lecturers: K7FormLecturer[];
}
