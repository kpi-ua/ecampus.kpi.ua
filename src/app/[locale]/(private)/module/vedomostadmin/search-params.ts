import { createLoader, createParser, parseAsString } from 'nuqs/server';
import { z } from 'zod';

const singleDigit = z.string().regex(/^\d$/).transform(Number);

const parseAsCourse = (minimum: number) => {
  const schema = singleDigit.pipe(z.number().min(minimum).max(8));

  return createParser({
    parse(value) {
      const result = schema.safeParse(value);
      return result.success ? result.data : null;
    },
    serialize: String,
  }).withDefault(1);
};

export const sessionAdministrationSearchParams = { course: parseAsCourse(1), employeeId: parseAsString };
export const loadSessionAdministrationSearchParams = createLoader(sessionAdministrationSearchParams);

export const loadSheetSearchParams = createLoader({ course: parseAsCourse(0) });
