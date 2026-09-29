'use client';

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

const filterParsers = {
  year: parseAsInteger,
  facultyId: parseAsInteger,
  departmentId: parseAsInteger,
  profile: parseAsString,
};

export const useK7FilterParams = () => useQueryStates(filterParsers);
