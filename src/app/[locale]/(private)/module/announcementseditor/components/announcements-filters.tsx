'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { debounce } from 'radash';

import { AdminAnnouncementsLanguage } from '@/actions/announcement.actions';
import { MagnifyingGlassRegular } from '@/app/images';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LANGUAGE_VALUES: AdminAnnouncementsLanguage[] = ['all', 'uk', 'en'];

export const AnnouncementsFilters = () => {
  const t = useTranslations('private.announcementseditor.filters');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') ?? '';
  // Mirror the page-level whitelist so an unknown ?language=… value can't
  // leave the Select with an empty / invalid selection. Lowercase to match
  // the server-side parser (otherwise ?language=EN would fetch English on
  // the server but show "All languages" in the trigger).
  const rawLanguage = searchParams.get('language')?.toLowerCase();
  const language: AdminAnnouncementsLanguage = LANGUAGE_VALUES.find((v) => v === rawLanguage) ?? 'all';

  // Keep the search input controlled and synced from the URL so back /
  // forward navigation (or any external param change) updates the field.
  // The debounced URL writer below reflects the user's typing in the
  // opposite direction; since they only fire 200ms after the last
  // keystroke the two never clobber each other mid-input.
  const [searchValue, setSearchValue] = useState(search);
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value.trim() !== '' && !(key === 'language' && value === 'all')) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Any filter change resets pagination to the first page.
    params.delete('page');
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Stash the latest updateParam in a ref so the memoised debounce always
  // dispatches against the freshest searchParams snapshot. Re-creating the
  // debounce per render would defeat its 200ms timer.
  const updateParamRef = useRef(updateParam);
  updateParamRef.current = updateParam;
  const debouncedSearch = useMemo(
    () => debounce({ delay: 200 }, (value: string) => updateParamRef.current('search', value)),
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
        <Select value={language} onValueChange={(value) => updateParam('language', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('languageLabel')} />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_VALUES.map((value) => (
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
