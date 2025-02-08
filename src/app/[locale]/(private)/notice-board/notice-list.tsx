'use client';

import { Announcement } from '@/types/announcement';
import { Notice } from '@/app/[locale]/(private)/notice-board/notice';
import React, { useMemo } from 'react';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import MagnifyingGlassRegular from '../../../images/icons/MagnifyingGlassRegular.svg';
import { Paragraph } from '@/components/typography/paragraph';
import { Show } from '@/components/utils/show';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { usePagination } from '@/hooks/use-pagination';
import { useSearchParams } from 'next/navigation';

interface NoticeListProps {
  announcements: Announcement[];
}

const PAGE_SIZE = 5;

export function NoticeList({ announcements }: NoticeListProps) {
  const t = useTranslations('private.notice-board');
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('search') || '';

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [announcements, searchQuery]);

  const { paginatedItems, page, handleInputChange } = usePagination(PAGE_SIZE, filteredAnnouncements);

  return (
    <Card className="col-span-full w-full p-9 xl:col-span-5">
      <Input
        placeholder={t('input.placeholder')}
        icon={<MagnifyingGlassRegular />}
        defaultValue={searchQuery}
        onChange={handleInputChange}
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
          <PaginationWithLinks page={page} pageSize={PAGE_SIZE} totalCount={filteredAnnouncements.length} />
        </div>
      </Show>
    </Card>
  );
}
