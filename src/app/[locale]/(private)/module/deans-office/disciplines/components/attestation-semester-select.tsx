'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { setDeansOfficeAttestationSemester } from '@/actions/deans-office.actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

export function AttestationSemesterSelect({ id, semester }: { id: number; semester: number | null }) {
  const t = useTranslations('private.deans-office');
  const [pending, startTransition] = useTransition();
  const { errorToast } = useServerErrorToast();

  return (
    <Select
      value={semester === null ? 'unset' : String(semester)}
      disabled={pending}
      onValueChange={(value) => {
        startTransition(async () => {
          try {
            if (!(await setDeansOfficeAttestationSemester(id, value === '0' ? null : Number(value)))) {
              errorToast();
            }
          } catch {
            errorToast();
          }
        });
      }}
    >
      <SelectTrigger aria-label={t('attestationSemester')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unset" disabled>
          {t('chooseHalfYear')}
        </SelectItem>
        <SelectItem value="1">{t('firstSemester')}</SelectItem>
        <SelectItem value="2">{t('secondSemester')}</SelectItem>
        <SelectItem value="3">{t('bothSemesters')}</SelectItem>
        <SelectItem value="0">{t('none')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
