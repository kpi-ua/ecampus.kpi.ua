import { createLoader, createParser, createSerializer, parseAsString, parseAsStringLiteral } from 'nuqs/server';

// `parseAsInteger` reads '12abc' as 12; ids in the URL must be plain positive integers.
const parseAsId = createParser({
  parse: (value) => (/^[1-9]\d*$/.test(value) ? Number(value) : null),
  serialize: String,
});

export const rightsSearchParams = {
  search: parseAsString.withDefault(''),
  subdivisionId: parseAsId,
  loadId: parseAsId,
  page: parseAsId.withDefault(1),
};

export const SBP_TABS = ['rights', 'periods'] as const;
export type SbpTab = (typeof SBP_TABS)[number];

/** Kept apart from the rights filters: it never goes to the API and changing it does not reload the page. */
export const tabSearchParam = parseAsStringLiteral(SBP_TABS).withDefault('rights');

export const loadRightsSearchParams = createLoader(rightsSearchParams);
export const serializeRightsSearchParams = createSerializer(rightsSearchParams);
