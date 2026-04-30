'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/components/ui/multi-select';
import {
  SbpLoadCatalogItem,
  SbpStudyYearCatalogItem,
  SbpSubdivisionCatalogItem,
} from '@/types/models/sbp-rights';

const ALL_VALUE = 'all';

interface Props {
  loads: SbpLoadCatalogItem[];
  subdivisions: SbpSubdivisionCatalogItem[];
  years: SbpStudyYearCatalogItem[];
  /** Initial values pulled from the querystring on the server. */
  initial: {
    search?: string;
    studyingYearId?: number;
    subdivisionId?: number;
    loadId?: number;
  };
}

/**
 * Querystring-driven filter bar. Each change rewrites the URL via
 * `router.replace`; the page re-renders on the server and the table refreshes.
 * Search input is debounced 300ms; selects are immediate.
 */
export function RightsFilters({ loads, subdivisions, years, initial }: Props) {
  const t = useTranslations('private.studbonuspointsrights');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(initial.search ?? '');
  const debouncedSearch = useDebounce(search, 300);
  const initialSearch = useRef(initial.search ?? '');

  const pushParam = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (value) params.set(key, value);
    else params.delete(key);
    // Reset paging whenever a filter changes — current page may be out of range.
    params.delete('page');
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  useEffect(() => {
    if (debouncedSearch !== initialSearch.current) {
      pushParam('search', debouncedSearch || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const onSelectChange = (key: string) => (raw: string) => {
    pushParam(key, raw === ALL_VALUE ? undefined : raw);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('filters.searchPlaceholder')}
      />

      <Select value={initial.studyingYearId?.toString() ?? ALL_VALUE} onValueChange={onSelectChange('studyingYearId')}>
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

      <Select value={initial.subdivisionId?.toString() ?? ALL_VALUE} onValueChange={onSelectChange('subdivisionId')}>
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

      <Select value={initial.loadId?.toString() ?? ALL_VALUE} onValueChange={onSelectChange('loadId')}>
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
