import { EmployeePosition } from './employee-profile';

export interface LibraryDepartment {
  id: number;
  name: string;
  abbreviation: string;
  facultyId: number;
  facultyName: string;
  facultyAbbreviation: string;
}

export interface LibraryEmployee {
  userAccountId: number | null;
  employeeId: number;
  surname: string;
  name: string;
  patronymic: string;
  positions: EmployeePosition[];
  orcid: string | null;
  scopusId: string | null;
  researcherId: string | null;
  googleScholarId: string | null;
}

export interface LibraryEmployment {
  id: number;
  position: EmployeePosition;
  sectorName: string;
  status: string;
  contractEnd: string | null;
}

export interface LibraryIdentifier {
  contactTypeId: number;
  name: string;
  value: string | null;
  changedAt: string | null;
}

export interface LibraryEmployeeDetails {
  userAccountId: number | null;
  employeeId: number;
  fullName: string;
  employments: LibraryEmployment[];
  identifiers: LibraryIdentifier[];
}
