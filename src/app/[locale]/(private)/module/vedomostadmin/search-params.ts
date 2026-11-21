import { createLoader, createParser, parseAsString } from 'nuqs/server';

const course = createParser({
  parse: (value) => (/^[1-8]$/.test(value) ? Number(value) : null),
  serialize: String,
});

export const sessionAdministrationSearchParams = { course: course.withDefault(1), employeeId: parseAsString };
export const loadSessionAdministrationSearchParams = createLoader(sessionAdministrationSearchParams);

export const loadSheetSearchParams = createLoader({
  course: createParser({
    parse: (value) => (/^[0-8]$/.test(value) ? Number(value) : null),
    serialize: String,
  }).withDefault(1),
});
