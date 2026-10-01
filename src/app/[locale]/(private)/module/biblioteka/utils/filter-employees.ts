import { LibraryEmployee } from '@/types/models/library';

export interface LibraryEmployeeFilters {
  name: string;
  orcid: string;
  scopus: string;
  researcher: string;
  scholar: string;
}

export const filterEmployees = (employees: LibraryEmployee[], filters: LibraryEmployeeFilters) => {
  const includes = (value: string | null, query: string) => (value ?? '').toLowerCase().includes(query.toLowerCase());

  return employees.filter(
    (employee) =>
      includes(`${employee.surname} ${employee.name} ${employee.patronymic}`, filters.name) &&
      includes(employee.orcid, filters.orcid) &&
      includes(employee.scopusId, filters.scopus) &&
      includes(employee.researcherId, filters.researcher) &&
      includes(employee.googleScholarId, filters.scholar),
  );
};
