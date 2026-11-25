export const dnvrSheetKinds = ['exam', 'practice'] as const;
export type DnvrSheetKind = (typeof dnvrSheetKinds)[number];

export interface DnvrSheetFacultyCount {
  facultyId: number;
  faculty: string;
  assessment: string | null;
  createdCount: number;
  blockedCount: number;
}

export interface DnvrSheetSummary {
  id: number;
  facultyId: number;
  faculty: string;
  groupName: string;
  course: number;
  semester: number | null;
  parentId: number | null;
  part: string | null;
  assessment: string;
  discipline: string | null;
  lecturer: string;
  createdBy: string | null;
  startsAt: string | null;
  examAt: string | null;
  locksAt: string | null;
  isBlocked: boolean;
  isDeleted: boolean;
  isSentToDean: boolean;
  isUpcoming: boolean;
  isExpired: boolean;
  markCount: number;
}

export interface DnvrSheetDetails {
  sheet: DnvrSheetSummary;
  students: {
    id: number;
    name: string;
    status: string | null;
    mark: number | null;
    nationalScale: string | null;
    ects: string | null;
  }[];
  history: {
    date: string;
    changedBy: string | null;
    description: string | null;
  }[];
}

export interface DnvrSheetSchedule {
  startsAt: string;
  examAt: string;
  locksAt: string;
  isBlocked: boolean;
  isDeleted: boolean;
  reason: string;
}
