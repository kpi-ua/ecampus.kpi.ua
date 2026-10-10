'use client';

import { useQuery } from '@tanstack/react-query';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useEffect } from 'react';

import { getLibraryEmployees } from '@/actions/library.actions';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { UKRAINIAN_ALPHABET } from '@/lib/constants/common';

import { LIBRARY_STALE_TIME, libraryQueryKeys } from '../query-keys';

export const useAlphabetBrowser = () => {
  const { errorToast } = useServerErrorToast();
  const [{ letter: letterParam }, setBrowserParams] = useQueryStates({
    letter: parseAsString,
    page: parseAsInteger,
  });
  const requestedLetter = letterParam?.toUpperCase();
  const letter = requestedLetter && UKRAINIAN_ALPHABET.includes(requestedLetter) ? requestedLetter : undefined;
  const {
    data: employees = [],
    isFetching,
    error,
  } = useQuery({
    queryKey: libraryQueryKeys.employees({ letter }),
    queryFn: () => getLibraryEmployees({ letter }),
    enabled: letter !== undefined,
    staleTime: LIBRARY_STALE_TIME,
  });

  useEffect(() => {
    if (error) {
      errorToast();
    }
  }, [error, errorToast]);

  const selectLetter = (nextLetter: string) => {
    void setBrowserParams({ letter: nextLetter, page: null });
  };

  return { employees, isFetching, letter, selectLetter };
};
