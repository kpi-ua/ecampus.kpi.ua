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

export type K7ReportRequestStatus = 'Pending' | 'InProgress' | 'Ready' | 'Error';

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

export interface K7TeachingDiscipline {
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

export interface K7OtherEducationalActivity {
  employeeCategory: string;
  employeeId: number;
  departmentId: number;
  position: string;
  salary: number;
  workType: string;
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

export interface K7DetailedAchievement {
  employeeCategory: string;
  employeeId: number;
  departmentId: number;
  position: string;
  salary: number;
  workType: string;
  workTypeDescription: string;
  sectionNumber?: number;
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
    position: string;
    totalEmploymentRate: number;
    employeeCategory: string;
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

export interface K7HtmlPreviewFlat {
  header: K7HtmlPreview['header'];
  teachingDisciplines: K7TeachingDiscipline[];
  otherEducationalActivities: K7OtherEducationalActivity[];
  detailedAchievements: K7DetailedAchievement[];
}

export type K7HtmlPreviewResponse = K7HtmlPreview | K7HtmlPreviewFlat;
