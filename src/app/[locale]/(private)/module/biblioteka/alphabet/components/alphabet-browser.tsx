'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useEffect } from 'react';

import { getLibraryEmployees } from '@/actions/library.actions';
import { Description, Heading3, Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { UKRAINIAN_ALPHABET } from '@/lib/constants/alphabet';

import { EmployeesTable } from '../../components/employees-table';
import { LIBRARY_STALE_TIME, libraryQueryKeys } from '../../query-keys';

export const AlphabetBrowser = () => {
  const t = useTranslations('private.library');
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

  const handleLetterChange = (value: string) => {
    setBrowserParams({ letter: value, page: null });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Heading3 className="leading-xl lg:leading-xl text-2xl lg:text-2xl">{t('alphabet.title')}</Heading3>
        <Description className="p-0 text-sm leading-6">{t('alphabet.description')}</Description>
      </div>
      <div className="border-neutral-divider flex flex-wrap gap-3 rounded-lg border bg-white p-5 shadow-none sm:p-6">
        {[...UKRAINIAN_ALPHABET].map((item) => (
          <Button
            key={item}
            variant={letter === item ? 'primary' : 'secondary'}
            size="small"
            disabled={isFetching}
            onClick={() => handleLetterChange(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      {isFetching && <Paragraph className="m-0 py-10 text-center text-sm text-neutral-500">{t('loading')}</Paragraph>}
      {letter &&
        !isFetching &&
        (employees.length > 0 ? (
          <EmployeesTable employees={employees} letter={letter} />
        ) : (
          <Paragraph className="m-0 py-10 text-center text-sm text-neutral-500">{t('empty')}</Paragraph>
        ))}
    </div>
  );
};
