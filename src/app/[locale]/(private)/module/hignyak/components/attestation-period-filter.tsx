'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from '@/i18n/routing';
import { type DnvrAttestationReport } from '@/types/models/dnvr-reporting';

import { type AttestationPeriod, attestationPeriods, getAttestationPath } from '../routes';

export function AttestationPeriodFilter({
  period,
  report,
}: {
  period: AttestationPeriod | null;
  report?: DnvrAttestationReport;
}) {
  const t = useTranslations('private.dnvr-reporting');
  const router = useRouter();
  const id = useId();
  const handlePeriodChange = (value: string) => {
    router.push({
      pathname: getAttestationPath(report),
      query: { period: value },
    });
  };

  return (
    <div className="flex w-full flex-col gap-2 sm:w-fit">
      <Label htmlFor={id}>{t('periodFilter')}</Label>
      <Select value={period ?? ''} onValueChange={handlePeriodChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={t('periodFilter')} />
        </SelectTrigger>
        <SelectContent>
          {attestationPeriods.map((item) => (
            <SelectItem key={item} value={item}>
              {item === '3' ? t('combined') : t('period', { number: item })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
