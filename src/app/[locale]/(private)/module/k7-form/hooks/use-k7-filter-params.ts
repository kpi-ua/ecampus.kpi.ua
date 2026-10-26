'use client';

import { parseAsInteger, useQueryStates } from 'nuqs';

import { parseAsProfileId } from '../utils/profile-query';

const filterParsers = {
  year: parseAsInteger,
  facultyId: parseAsInteger,
  departmentId: parseAsInteger,
  profile: parseAsProfileId,
};

export const useK7FilterParams = () => useQueryStates(filterParsers);
