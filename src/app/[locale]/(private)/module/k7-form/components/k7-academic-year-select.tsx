'use client';

import { useTranslations } from 'next-intl';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  id: string;
  years: number[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const K7AcademicYearSelect = ({ id, years, value, onValueChange, disabled }: Props) => {
  const t = useTranslations('private.k-7.filters');

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id}>{t('academicYear')}</Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} variant="small" className="border-neutral-300 text-sm text-neutral-900">
          <SelectValue placeholder={t('selectAcademicYear')} />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}-{year + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
