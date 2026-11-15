'use client';

import { useTranslations } from 'next-intl';

import { Description, Heading3, Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utils/show';
import { UKRAINIAN_ALPHABET } from '@/lib/constants/common';

import { EmployeesTable } from '../../components/employees-table';
import { useAlphabetBrowser } from '../../hooks/use-alphabet-browser';

export const AlphabetBrowser = () => {
  const t = useTranslations('private.library');
  const { employees, isFetching, letter, selectLetter } = useAlphabetBrowser();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Heading3 className="text-2xl leading-xl lg:text-2xl lg:leading-xl">{t('alphabet.title')}</Heading3>
        <Description className="p-0 text-sm leading-6">{t('alphabet.description')}</Description>
      </div>
      <div className="flex flex-wrap gap-3 rounded-lg border border-neutral-divider bg-white p-5 shadow-none sm:p-6">
        {[...UKRAINIAN_ALPHABET].map((item) => (
          <Button
            key={item}
            variant={letter === item ? 'primary' : 'secondary'}
            size="small"
            disabled={isFetching}
            onClick={() => selectLetter(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <Show when={isFetching}>
        <Paragraph className="m-0 py-10 text-center text-sm text-neutral-500">{t('loading')}</Paragraph>
      </Show>
      <Show when={!!letter && !isFetching && employees.length === 0}>
        <Paragraph className="m-0 py-10 text-center text-sm text-neutral-500">{t('empty')}</Paragraph>
      </Show>
      <Show when={!!letter && !isFetching && employees.length > 0}>
        <EmployeesTable employees={employees} letter={letter} />
      </Show>
    </div>
  );
};
