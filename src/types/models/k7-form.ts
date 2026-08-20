export interface K7FormLecturerProfile {
  employeeId: number;
  departmentId: number;
  departmentName: string;
  position: string;
}

export interface K7FormLecturer {
  userAccountId: number;
  fullName: string;
  /** Profiles the lecturer holds, sent with the directory so the dashboard needs no per-lecturer call. */
  profiles: K7FormLecturerProfile[];
}

export type K7FormLecturerProfileOption = Omit<K7FormLecturer, 'profiles'> & K7FormLecturerProfile;

export interface K7FormFilters {
  years: number[];
  profiles: K7FormLecturerProfile[];
  lecturers: K7FormLecturer[];
}

export const K7_REPORT_REQUEST_STATUS = {
  Pending: 'Pending',
  InProgress: 'InProgress',
  /** Source data is captured, so the report can be previewed while the file is still rendering. */
  DataReady: 'DataReady',
  Ready: 'Ready',
  Error: 'Error',
} as const;

export type K7ReportRequestStatus = (typeof K7_REPORT_REQUEST_STATUS)[keyof typeof K7_REPORT_REQUEST_STATUS];

export interface K7ReportRequest {
  k7ReportRequestId: string;
  initiatorUserAccountId: number;
  targetUserAccountId: number;
  targetFullName: string | null;
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

export type CreateK7FormRequestResult =
  | { outcome: 'created'; request: K7ReportRequest }
  | { outcome: 'throttled'; message: string | null; retryAfterSeconds: number | null };

export interface CreateK7ReportRequestInput {
  targetUserAccountId?: number;
  year: number;
  employeeId: number;
  departmentId: number;
  position: string;
}

export interface K7TeachingDiscipline {
  employeeCategory: K7EmployeeCategory;
  employeeId: number;
  departmentId: number;
  position: string;
  salary: number;
  subjectName: string;
  streamId: string;
  groupCodes: string;
  totalVolume: number;
  practiceGroupsCount: number;
  labGroupsCount: number;
  totalStudents: number;
  lectures: number;
  practical: number;
  labs: number;
  exams: number;
  credits: number;
  modularControls: number;
  individualTasks: number;
  courseworkChecking: number;
  courseworkDefense: number;
  consultations: number;
  year: number;
  semester: number;
}

export const K7_EMPLOYEE_CATEGORY = {
  ScientificPedagogical: 'ScientificPedagogical',
  Pedagogical: 'Pedagogical',
  Scientific: 'Scientific',
  Unknown: 'Unknown',
} as const;

export type K7EmployeeCategory = (typeof K7_EMPLOYEE_CATEGORY)[keyof typeof K7_EMPLOYEE_CATEGORY];

export const K7_EDUCATION_LEVEL = {
  Bachelor: 'Bachelor',
  MasterProfessional: 'MasterProfessional',
  MasterScientific: 'MasterScientific',
  PhD: 'PhD',
  Other: 'Other',
} as const;

export type K7EducationLevel = (typeof K7_EDUCATION_LEVEL)[keyof typeof K7_EDUCATION_LEVEL];

export interface K7OtherEducationalActivity {
  employeeCategory: K7EmployeeCategory;
  employeeId: number;
  departmentId: number;
  position: string;
  salary: number;
  workType: string;
  educationLevel: K7EducationLevel;
  course: number | null;
  groupCodesSem1: string | null;
  studentCountSem1: number;
  hoursSem1: number;
  groupCodesSem2: string | null;
  studentCountSem2: number;
  hoursSem2: number;
  grandTotal: number;
  year: number;
}

export const K7_ACHIEVEMENT_WORK_TYPE = {
  Scientific: 'Scientific',
  Methodical: 'Methodical',
  Organizational: 'Organizational',
  Other: 'Other',
  Syllabus: 'Syllabus',
  Article: 'Article',
} as const;

export type K7AchievementWorkType = (typeof K7_ACHIEVEMENT_WORK_TYPE)[keyof typeof K7_ACHIEVEMENT_WORK_TYPE];

export interface K7DetailedAchievement {
  employeeCategory: K7EmployeeCategory;
  employeeId: number;
  departmentId: number;
  position: string;
  salary: number;
  workType: K7AchievementWorkType;
  workTypeDescription: string;
  workDescription: string;
  hoursUsed: number;
  proofOfPerformance: string | null;
  responsibleDepartment: string | null;
  year: number;
  semester: number | null;
}

export interface K7HtmlPreview {
  header: {
    k7ReportRequestId: string;
    year: number;
    fullName: string;
    departmentName: string;
    /** Faculty or institute of the department. Empty when the department has no faculty and on older snapshots. */
    facultyName: string;
    position: string;
    totalEmploymentRate: number;
    employeeCategory: K7EmployeeCategory;
    /** When the K-7 data was read. Absent on reports captured before snapshots existed. */
    snapshotAt: string | null;
  };
  section1: {
    teachingDisciplines: K7TeachingDiscipline[];
    otherEducationalActivities: K7OtherEducationalActivity[];
  };
  section2: K7DetailedAchievement[];
  section3: K7DetailedAchievement[];
  section4: K7DetailedAchievement[];
  section5: K7DetailedAchievement[];
  section6: {
    educationalHours: number;
    scientificHours: number;
    methodicalHours: number;
    organizationalHours: number;
    otherHours: number;
    totalHours: number;
  };
}

export interface K7ReportRequestDetails {
  header: K7HtmlPreview['header'];
  teachingDisciplines: K7TeachingDiscipline[];
  otherEducationalActivities: K7OtherEducationalActivity[];
  detailedAchievements: K7DetailedAchievement[];
}
