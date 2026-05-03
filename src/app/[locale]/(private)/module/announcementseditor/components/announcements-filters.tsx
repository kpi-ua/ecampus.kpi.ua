'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { debounce } from 'radash';

import { MagnifyingGlassRegular } from '@/app/images';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { ANNOUNCEMENT_FILTER_LANGUAGES } from '../constants';

export const AnnouncementsFilters = () => {
  const t = useTranslations('private.announcementseditor.filters');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const rawLanguage = searchParams.get('language')?.toLowerCase();
  const language =
    ANNOUNCEMENT_FILTER_LANGUAGES.find((v) => v === rawLanguage) ?? 'all';

  const [searchValue, setSearchValue] = useState(search);
  
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  const commitSearchParams = (patch: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    patch(params);
    params.delete('page');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const updateSearchParam = (value: string) => {
    commitSearchParams((params) => {
      if (value.trim() !== '') {
        params.set('search', value);
      } else {
        params.delete('search');
      }
    });
  };

  const updateLanguageParam = (value: string) => {
    commitSearchParams((params) => {
      if (value === 'all') {
        params.delete('language');
      } else {
        params.set('language', value);
      }
    });
  };

  const updateSearchParamRef = useRef(updateSearchParam);
  updateSearchParamRef.current = updateSearchParam;
  const debouncedSearch = useMemo(
    () => debounce({ delay: 200 }, (value: string) => updateSearchParamRef.current(value)),
    [],
  );

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex-1">
        <Input
          placeholder={t('searchPlaceholder')}
          icon={<MagnifyingGlassRegular />}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />
      </div>
      <div className="md:w-56">
        <Select value={language} onValueChange={updateLanguageParam}>
          <SelectTrigger>
            <SelectValue placeholder={t('languageLabel')} />
          </SelectTrigger>
          <SelectContent>
            {ANNOUNCEMENT_FILTER_LANGUAGES.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`language.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
