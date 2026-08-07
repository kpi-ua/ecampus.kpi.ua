export interface CertificateOperatorCreateRequest {
  studentUserAccountId: number;
  type: string;
  purpose: string;
  notes?: string;
  originalRequired: boolean;
  includeOrderInfo?: boolean;
}

export interface StudentSearchResult {
  userAccountId: number;
  fullName: string;
  studyGroupName: string;
  courseId: number;
  facultyId: number;
  facultyName: string;
}
