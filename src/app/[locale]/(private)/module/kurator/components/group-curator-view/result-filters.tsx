'use client';

import { useTranslations } from 'next-intl';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { CuratorFilters, CuratorOption } from '../../types';

interface Props {
  filters: CuratorFilters;
  yearId: string;
  semester: string;
  resultId: string;
  resultOptions: CuratorOption[];
  resultPlaceholder: string;
  onYearChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onResultChange: (value: string) => void;
}

export const ResultFilters = ({
  filters,
  yearId,
  semester,
  resultId,
  resultOptions,
  resultPlaceholder,
  onYearChange,
  onSemesterChange,
  onResultChange,
}: Props) => {
  const t = useTranslations('private.curator.lecturer');

  return (
    <div className="flex flex-wrap gap-3">
      <Select value={resultId} onValueChange={onResultChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder={resultPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {resultOptions.map((option) => (
            <SelectItem key={option.id} value={option.id.toString()}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={yearId} onValueChange={onYearChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder={t('filters.year')} />
        </SelectTrigger>
        <SelectContent>
          {filters.years.map((year) => (
            <SelectItem key={year.id} value={year.id.toString()}>
              {year.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={semester} onValueChange={onSemesterChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('filters.all-semesters')}</SelectItem>
          <SelectItem value="1">{t('filters.semester', { number: 1 })}</SelectItem>
          <SelectItem value="2">{t('filters.semester', { number: 2 })}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
