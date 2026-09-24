'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import qs from 'query-string';
import { useEffect } from 'react';

import { getBibliotekaEmployees } from '@/actions/biblioteka.actions';
import { Description, Heading3, Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

import { EmployeesTable } from '../../components/employees-table';
import { BIBLIOTEKA_STALE_TIME, bibliotekaQueryKeys } from '../../query-keys';

const LETTERS = [...'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ'];

export const AlphabetBrowser = () => {
  const t = useTranslations('private.biblioteka');
  const { errorToast } = useServerErrorToast();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedLetter = searchParams.get('letter')?.toUpperCase();
  const letter = requestedLetter && LETTERS.includes(requestedLetter) ? requestedLetter : undefined;
  const {
    data: employees = [],
    isFetching,
    error,
  } = useQuery({
    queryKey: bibliotekaQueryKeys.employees({ letter }),
    queryFn: () => getBibliotekaEmployees({ letter }),
    enabled: letter !== undefined,
    staleTime: BIBLIOTEKA_STALE_TIME,
  });
  useEffect(() => {
    if (error) {
      errorToast();
    }
  }, [error, errorToast]);

  const handleLetterChange = (value: string) => {
    const params = qs.parse(searchParams.toString());
    params.letter = value;
    delete params.page;
    router.replace(qs.stringifyUrl({ url: pathname, query: params }), { scroll: false });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Heading3 className="leading-xl text-2xl lg:leading-xl lg:text-2xl">{t('alphabet.title')}</Heading3>
        <Description className="p-0 text-sm leading-6">{t('alphabet.description')}</Description>
      </div>
      <div className="border-neutral-divider flex flex-wrap gap-3 rounded-lg border bg-white p-5 shadow-none sm:p-6">
        {LETTERS.map((item) => (
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
          <EmployeesTable employees={employees} exportLabel={letter} letter={letter} />
        ) : (
          <Paragraph className="m-0 py-10 text-center text-sm text-neutral-500">{t('empty')}</Paragraph>
        ))}
    </div>
  );
};
