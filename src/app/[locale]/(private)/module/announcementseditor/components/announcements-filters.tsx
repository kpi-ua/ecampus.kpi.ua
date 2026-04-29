'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { debounce } from 'radash';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MagnifyingGlassRegular from '@/app/images/icons/MagnifyingGlassRegular.svg';
import { AdminAnnouncementsLanguage } from '@/actions/announcement.actions';

const LANGUAGE_VALUES: AdminAnnouncementsLanguage[] = ['all', 'uk', 'en'];

export function AnnouncementsFilters() {
  const t = useTranslations('private.announcementseditor.filters');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const rawLanguage = searchParams.get('language');
  // Mirror the page-level whitelist so an unknown ?language=… value can't
  // leave the Select with an empty / invalid selection.
  const language: AdminAnnouncementsLanguage =
    LANGUAGE_VALUES.find((v) => v === rawLanguage) ?? 'all';

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

  const handleSearchChange = debounce({ delay: 200 }, (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParam('search', e.target.value);
  });

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex-1">
        <Input
          placeholder={t('searchPlaceholder')}
          icon={<MagnifyingGlassRegular />}
          defaultValue={search}
          onChange={handleSearchChange}
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
}
