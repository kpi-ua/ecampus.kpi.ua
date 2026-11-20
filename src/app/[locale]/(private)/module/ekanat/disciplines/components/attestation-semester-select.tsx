'use client';

import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';

import { setDekanatAttestationSemester } from '@/actions/dekanat.actions';
import { Paragraph } from '@/components/typography';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Show } from '@/components/utils/show';

export function AttestationSemesterSelect({ id, semester }: { id: number; semester: number | null }) {
  const t = useTranslations('private.ekanat');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  return (
    <>
      <Select
        value={String(semester ?? 0)}
        disabled={pending}
        onValueChange={(value) => {
          startTransition(async () => {
            setError(false);
            try {
              setError(!(await setDekanatAttestationSemester(id, Number(value) || null)));
            } catch {
              setError(true);
            }
          });
        }}
      >
        <SelectTrigger aria-label={t('attestationSemester')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">{t('none')}</SelectItem>
          <SelectItem value="1">{t('firstSemester')}</SelectItem>
          <SelectItem value="2">{t('secondSemester')}</SelectItem>
          <SelectItem value="3">{t('bothSemesters')}</SelectItem>
        </SelectContent>
      </Select>
      <Show when={error}>
        <Paragraph role="alert">{t('requestFailed')}</Paragraph>
      </Show>
    </>
  );
}
