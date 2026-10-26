'use client';

import { debounce, useQueryStates } from 'nuqs';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants/common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SbpLoadCatalogItem, SbpStudyYearCatalogItem, SbpSubdivisionCatalogItem } from '@/types/models/sbp-rights';
import { rightsSearchParams } from '../search-params';

const ALL_VALUE = 'all';

type SelectFilter = 'studyingYearId' | 'subdivisionId' | 'loadId';

interface Props {
  loads: SbpLoadCatalogItem[];
  subdivisions: SbpSubdivisionCatalogItem[];
  years: SbpStudyYearCatalogItem[];
}

/**
 * Querystring-driven filter bar. Filters live in the URL (nuqs, non-shallow),
 * so the page re-renders on the server and the table refreshes. Every change
 * drops `page`, since the current page may be out of range.
 */
export function RightsFilters({ loads, subdivisions, years }: Props) {
  const t = useTranslations('private.studbonuspointsrights');
  const [filters, setFilters] = useQueryStates(rightsSearchParams, { shallow: false, history: 'replace' });

  const onSearchChange = (value: string) => {
    setFilters({ search: value, page: null }, { limitUrlUpdates: value ? debounce(SEARCH_DEBOUNCE_MS) : undefined });
  };

  const onSelectChange = (key: SelectFilter) => (raw: string) => {
    setFilters({ [key]: raw === ALL_VALUE ? null : Number(raw), page: null });
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        value={filters.search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t('filters.searchPlaceholder')}
      />

      <Select value={filters.studyingYearId?.toString() ?? ALL_VALUE} onValueChange={onSelectChange('studyingYearId')}>
        <SelectTrigger>
          <SelectValue placeholder={t('filters.year')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t('filters.allYears')}</SelectItem>
          {years.map((y) => (
            <SelectItem key={y.id} value={String(y.id)}>
              {y.name}
              {y.isCurrent ? ` · ${t('filters.currentSuffix')}` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.subdivisionId?.toString() ?? ALL_VALUE} onValueChange={onSelectChange('subdivisionId')}>
        <SelectTrigger>
          <SelectValue placeholder={t('filters.subdivision')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t('filters.allSubdivisions')}</SelectItem>
          {subdivisions.map((s) => (
            <SelectItem key={s.id} value={String(s.id)}>
              {s.abbreviation ?? s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.loadId?.toString() ?? ALL_VALUE} onValueChange={onSelectChange('loadId')}>
        <SelectTrigger>
          <SelectValue placeholder={t('filters.load')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t('filters.allLoads')}</SelectItem>
          {loads.map((l) => (
            <SelectItem key={l.loadId} value={String(l.loadId)}>
              {l.subTreeNumber != null ? `${l.subTreeNumber}. ` : ''}
              {l.loadName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
