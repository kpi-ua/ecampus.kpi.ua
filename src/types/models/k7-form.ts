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

export type K7FormLecturerProfileOption = K7FormLecturer & K7FormLecturerProfile;

export interface K7FormFilters {
  years: number[];
  profiles: K7FormLecturerProfile[];
  lecturers: K7FormLecturer[];
}

export const K7_REPORT_REQUEST_STATUS = {
  Pending: 'Pending',
  InProgress: 'InProgress',
  Ready: 'Ready',
  Error: 'Error',
} as const;

export type K7ReportRequestStatus = (typeof K7_REPORT_REQUEST_STATUS)[keyof typeof K7_REPORT_REQUEST_STATUS];

export interface K7ReportRequest {
  k7ReportRequestId: string;
  initiatorUserAccountId: number;
  targetUserAccountId: number;
  employeeId: number;
  departmentId: number;
  position: string;
  year: number;
  status: K7ReportRequestStatus;
  errorMessage: string | null;
  s3StorageKey: string | null;
  requestedAt: string;
  completedAt: string | null;
}
