import { createLoader, createParser, parseAsStringLiteral } from 'nuqs/server';

export const examResultSortColumns = [
  'part',
  'eventDate',
  'discipline',
  'controlForm',
  'examiner',
  'mark',
  'nationalScale',
  'status',
  'opensAt',
  'closesAt',
] as const;

export type ExamResultSortColumn = (typeof examResultSortColumns)[number];

const parseAsPage = createParser({
  parse(value) {
    const page = Number(value);
    return /^[1-9]\d*$/.test(value) && page <= 2147483647 ? page : null;
  },
  serialize: String,
});

export const studentResultsSearchParams = {
  page: parseAsPage.withDefault(1),
  sort: parseAsStringLiteral(examResultSortColumns),
  direction: parseAsStringLiteral(['asc', 'desc']).withDefault('desc'),
};

export const loadStudentResultsSearchParams = createLoader(studentResultsSearchParams);
