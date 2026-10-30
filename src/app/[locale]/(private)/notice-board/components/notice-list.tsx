'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'radash';
import { useMemo } from 'react';
import React from 'react';

import { Notice } from '@/app/[locale]/(private)/notice-board/components/notice';
import { Paragraph } from '@/components/typography/paragraph';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Separator } from '@/components/ui/separator';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { PAGE_SIZE_SMALL } from '@/lib/constants/common';
import { Announcement } from '@/types/models/announcement';

import MagnifyingGlassRegular from '../../../../images/icons/MagnifyingGlassRegular.svg';

interface NoticeListProps {
  announcements: Announcement[];
}

export function NoticeList({ announcements }: NoticeListProps) {
  const t = useTranslations('private.notice-board');
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get('search') || '';

  const filteredAnnouncements = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();
    return announcements.filter((announcement) => announcement.title.toLowerCase().includes(lowerSearch));
  }, [announcements, searchQuery]);

  const { paginatedItems, page } = usePagination(PAGE_SIZE_SMALL, filteredAnnouncements);

  const handleSearchChange = debounce({ delay: 200 }, (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (newSearch) {
      params.set('search', newSearch);
    } else {
      params.delete('search');
    }

    router.replace(`?${params.toString()}`);
  });

  return (
    <Card className="col-span-full w-full p-9 xl:col-span-5">
      <Input
        placeholder={t('input.placeholder')}
        icon={<MagnifyingGlassRegular />}
        defaultValue={searchQuery}
        onChange={handleSearchChange}
      />

      <div className="mt-6">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((announcement) => (
            <React.Fragment key={announcement.id}>
              <Notice announcement={announcement} />
              <Separator className="my-5" />
            </React.Fragment>
          ))
        ) : (
          <Show when={!filteredAnnouncements.length}>
            <Paragraph className="text-neutral-600">{t('input.not-found')}</Paragraph>
          </Show>
        )}
      </div>
      <Show when={!!filteredAnnouncements.length}>
        <div className="mt-8">
          <PaginationWithLinks page={page} pageSize={PAGE_SIZE_SMALL} totalCount={filteredAnnouncements.length} />
        </div>
      </Show>
    </Card>
  );
}
