import { createLoader, parseAsInteger } from 'nuqs/server';

export const studentResultsSearchParams = {
  page: parseAsInteger.withDefault(1),
};

export const loadStudentResultsSearchParams = createLoader(studentResultsSearchParams);
