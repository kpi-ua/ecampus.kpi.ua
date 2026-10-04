'use client';

import { useTranslations } from 'next-intl';

import { Show } from '@/components/utils/show';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CuratorFilters, CuratorOption } from '../../types';

interface Props {
  filters: CuratorFilters;
  includeAll?: boolean;
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
  includeAll = false,
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
      <Select value={resultId} onValueChange={onResultChange}>
        <SelectTrigger className="w-auto shrink-0 gap-2 whitespace-nowrap [&>span]:line-clamp-none" variant="small">
          <SelectValue placeholder={resultPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <Show when={includeAll}>
            <SelectItem value="all">{t('filters.all')}</SelectItem>
          </Show>
          {resultOptions.map((option) => (
            <SelectItem key={option.id} value={option.id.toString()}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
        <Tabs value={semester} onValueChange={onSemesterChange}>
          <TabsList size="small" className="inline-grid w-max grid-cols-3 bg-white">
            <TabsTrigger value="all">{t('filters.all')}</TabsTrigger>
            <TabsTrigger value="1">{t('filters.first-semester')}</TabsTrigger>
            <TabsTrigger value="2">{t('filters.second-semester')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
