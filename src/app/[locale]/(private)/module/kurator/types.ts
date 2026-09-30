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

export interface CuratorPeriodParams {
  yearId?: number;
  semester?: number;
}
