'use server';

import queryString from 'query-string';

import { campusFetch } from '@/lib/client';

interface Department {
  id: number;
  name: string;
  faculty: string;
  abbreviation: string;
}

interface Employee {
  id: number;
  fullName: string;
  departmentId: number;
  department: string;
  position: string;
  employment: string;
  status: string;
}

interface Directory {
  employees: Employee[];
  students: { id: number; fullName: string; groupName: string; course: number; educationLevel: string }[];
  contacts: {
    employeeId: number;
    sectorId: number | null;
    surname: string;
    firstName: string;
    patronymic: string;
    workplace: string;
    position: string;
    status: string;
    contractEnd: string | null;
    contactTypeId: 3 | 4 | 17 | 22 | null;
    value: string | null;
  }[];
  responsibilities: {
    id: number;
    userAccountId: number | null;
    name: string;
    department: string;
    responsiblePerson: string | null;
  }[];
}

export async function getDeanOfficeDepartments() {
  const response = await campusFetch<Department[]>('/dean-office/departments');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeEmployees(departmentId?: number) {
  const query = queryString.stringifyUrl(
    { url: '/dean-office/employees', query: { departmentId } },
    { skipNull: true },
  );
  const response = await campusFetch<Employee[]>(query);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeDirectory(departmentId: number) {
  const response = await campusFetch<Directory>(`/dean-office/departments/${departmentId}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

interface StudentRecord {
  fullName: string;
  surveys: { studyYear: string; survey: string; lecturer: string; submittedAt: string | null }[];
  attestations: {
    studyYear: string;
    semester: number;
    discipline: string;
    lecturer: string;
    assessment: string;
    result: 'attested' | 'notAttested' | 'notStudying' | null;
  }[];
  monitoring: {
    sheetId: number;
    studyYear: string;
    semester: number;
    discipline: string;
    lecturer: string;
    assessment: string;
    assessmentDate: string | null;
    mark: number | null;
  }[];
}

interface SessionResult {
  disciplineName: string;
  studyTypeName: string;
  employeeName: string;
  examDate: string | null;
  mark: string;
}

export async function getDeanOfficeStudent(studentId: number) {
  const response = await campusFetch<StudentRecord>(`/dean-office/students/${studentId}`);
  if (response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeSessionResults(studentId: number) {
  const response = await campusFetch<SessionResult[]>(`/dean-office/students/${studentId}/session-results`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeResponsibilities() {
  const response = await campusFetch<Directory['responsibilities']>('/dean-office/responsibilities');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

interface LecturerSurvey {
  employeeId: number;
  lecturer: string;
  studyYear: string;
  survey: string;
  course: number;
  criterion: string;
  responses: number;
  average: number | null;
  weightedAverage: number | null;
}

interface LecturerSurveySummary extends Pick<
  LecturerSurvey,
  'employeeId' | 'lecturer' | 'responses' | 'average' | 'weightedAverage'
> {
  details: LecturerSurvey[];
}

export async function getDeanOfficeLecturerSurveys(filters: {
  page: number;
  departmentId?: number;
  allAppointments: boolean;
  employeeId?: number;
  letter?: string;
}) {
  const query = queryString.stringify(filters, { skipEmptyString: true, skipNull: true });
  const response = await campusFetch<{ surveys: LecturerSurveySummary[]; totalCount: number; pageSize: number }>(
    `/dean-office/lecturer-surveys?${query}`,
  );
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

interface PersonnelEmployment {
  fullName: string;
  documentNumber: string | null;
  documentDate: string | null;
  position: string | null;
  positionDateStart: string | null;
  positionDateEnd: string | null;
  workOrgForm: string | null;
  stake: string | null;
}

export async function getDeanOfficePersonnel(departmentId: number) {
  const response = await campusFetch<PersonnelEmployment[]>(`/dean-office/departments/${departmentId}/personnel`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeFacultyDirectory(filters: {
  departmentId?: number;
  letter?: string;
  course?: number;
  group?: string;
}) {
  const query = queryString.stringify(filters, { skipEmptyString: true, skipNull: true });
  const response = await campusFetch<Directory>(`/dean-office/directory?${query}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeGroups() {
  const response = await campusFetch<{ name: string; course: number; departmentId: number }[]>('/dean-office/groups');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getDeanOfficeStudents(filters: {
  departmentId?: number;
  course?: number;
  group?: string;
  page?: number;
}) {
  const query = queryString.stringify(filters, { skipEmptyString: true, skipNull: true });
  const response = await campusFetch<{ students: Directory['students']; totalCount: number; pageSize: number }>(
    `/dean-office/students?${query}`,
  );
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

interface EmployeeContacts {
  employeeId: number;
  fullName: string;
  workplace: string;
  position: string;
  status: string;
  contractEnd: string | null;
  contacts: { contactTypeId: number; value: string }[];
}

export interface DeanOfficeContactDirectory {
  teachingStaff: EmployeeContacts[];
  otherStaff: EmployeeContacts[];
  researchStaff: EmployeeContacts[];
  supportStaff: EmployeeContacts[];
}

export async function getDeanOfficeContacts(departmentId?: number) {
  const url =
    departmentId === undefined ? '/dean-office/contacts' : `/dean-office/contacts?departmentId=${departmentId}`;
  const response = await campusFetch<DeanOfficeContactDirectory>(url);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}
