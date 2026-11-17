export interface PlanOption {
  id: number;
  name: string;
}

export interface PlanYear extends PlanOption {
  isCurrent: boolean;
}

export interface PlanWorkplace extends PlanOption {
  duties: string;
}

export interface PlanCurriculumRow extends PlanOption {
  department: string;
  program: string;
  studyForm: string;
}

export interface PlanLoad {
  id: number;
  workplaceId: number;
  workplace: string;
  curriculumRowId: number;
  curriculumRow: string;
  semester: number;
  groupId: number;
  group: string;
  loadTypeId: number;
  loadType: string;
  plannedHours: number;
  isResponsible: boolean;
}

export interface PlanCatalog {
  curriculumRows: PlanCurriculumRow[];
  loadTypes: PlanOption[];
}

export interface PlanCreateRequest {
  workplaceId: number;
  curriculumRowId: number;
  semester: number;
  loadTypeId: number;
  groupIds: number[];
  plannedHours: number;
}

export interface PlanCreateBatchRequest {
  loads: PlanCreateRequest[];
}

export interface PlanResponsibleTeacher {
  employeeId: number;
  name: string;
  isResponsible: boolean;
}

export interface PlanResponsibility {
  curriculumRowId: number;
  curriculumRow: string;
  semester: number;
  groupId: number;
  group: string;
  teachers: PlanResponsibleTeacher[];
}
