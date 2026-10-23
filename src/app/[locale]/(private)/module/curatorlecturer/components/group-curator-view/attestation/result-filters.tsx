'use client';

import { useTranslations } from 'next-intl';

import { FilterSelect } from '@/components/ui/filter-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CuratorFilters, CuratorOption } from '@/app/[locale]/(private)/module/curatorlecturer/types';

interface Props {
  filters: CuratorFilters;
  yearId: string;
  semester: string | null;
  resultId: string | null;
  resultOptions: CuratorOption[];
  resultPlaceholder: string;
  onYearChange: (value: string) => void;
  onSemesterChange: (value: string | null) => void;
  onResultChange: (value: string | null) => void;
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
  const t = useTranslations('private.curatorlecturer');

  return (
    <div className="flex flex-wrap items-center gap-5">
      <FilterSelect
        value={resultId}
        onValueChange={onResultChange}
        placeholder={resultPlaceholder}
        className="w-auto shrink-0 gap-2 whitespace-nowrap [&>span]:line-clamp-none"
        options={resultOptions.map((option) => ({ value: option.id.toString(), label: option.name }))}
      />
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-500">{t('filters.year')}</span>
        <Select value={yearId} onValueChange={onYearChange}>
          <SelectTrigger className="w-auto shrink-0 gap-2 whitespace-nowrap [&>span]:line-clamp-none" variant="small">
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
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-500">{t('filters.half-year')}</span>
        <Tabs value={semester ?? ''} onValueChange={(value) => onSemesterChange(value || null)}>
          <TabsList size="small" className="inline-grid w-max grid-cols-3 bg-white">
            <TabsTrigger value="">{t('filters.all')}</TabsTrigger>
            <TabsTrigger value="1">{t('filters.first-semester')}</TabsTrigger>
            <TabsTrigger value="2">{t('filters.second-semester')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
