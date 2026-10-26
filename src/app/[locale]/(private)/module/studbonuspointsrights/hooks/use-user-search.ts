'use client';

import { useQuery } from '@tanstack/react-query';

import { searchSbpUsers } from '@/actions/sbp-rights.actions';

import { USER_SEARCH_MIN_CHARS } from '../constants';

const USER_SEARCH_STALE_TIME = 60 * 1000;

export const useUserSearch = (query: string) => {
  const trimmed = query.trim();
  const isTooShort = trimmed.length < USER_SEARCH_MIN_CHARS;
  const { data: users = [], isFetching } = useQuery({
    queryKey: ['sbp-rights', 'users', trimmed],
    queryFn: () => searchSbpUsers(trimmed),
    enabled: !isTooShort,
    staleTime: USER_SEARCH_STALE_TIME,
  });

  return { users, isFetching, isTooShort };
};
