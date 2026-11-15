import { createLoader, createParser, createSerializer, parseAsString } from 'nuqs/server';

// `parseAsInteger` reads '12abc' as 12; ids in the URL must be plain positive integers.
const parseAsId = createParser({
  parse: (value) => (/^[1-9]\d*$/.test(value) ? Number(value) : null),
  serialize: String,
});

export const rightsSearchParams = {
  search: parseAsString.withDefault(''),
  studyingYearId: parseAsId,
  subdivisionId: parseAsId,
  loadId: parseAsId,
  page: parseAsId.withDefault(1),
};

export const loadRightsSearchParams = createLoader(rightsSearchParams);
export const serializeRightsSearchParams = createSerializer(rightsSearchParams);
