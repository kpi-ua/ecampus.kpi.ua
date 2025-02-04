'use client';

import { Announcement } from '@/types/announcement';
import { Notice } from '@/app/[locale]/(private)/notice-board/notice';
import React, { useMemo, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import MagnifyingGlassRegular from '../../../images/icons/MagnifyingGlassRegular.svg';
import { debounce } from 'radash';
import { Paragraph } from '@/components/typography/paragraph';
import { Show } from '@/components/utils/show';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { usePaginationParams } from '@/hooks/use-pagination-params';

interface NoticeListProps {
  announcements: Announcement[];
}

const PAGE_SIZE = 5;

export function NoticeList({ announcements }: NoticeListProps) {
  const t = useTranslations('private.notice-board');
  const [search, setSearch] = useState('');

  const { start, end, page } = usePaginationParams(PAGE_SIZE);

  const sortedAnnouncements = useMemo(() => {
    return [...announcements].sort((a, b) => {
      return new Date(b.end || 0).getTime() - new Date(a.end || 0).getTime();
    });
  }, [announcements]);

  const filteredAnnouncements = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return sortedAnnouncements.filter((a) => a.title.toLowerCase().includes(lowerSearch));
  }, [search, sortedAnnouncements]);

  const paginatedAnnouncements = filteredAnnouncements.slice(start, end);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <Card className="col-span-full w-full p-9 xl:col-span-5">
      <Input
        placeholder={t('input.placeholder')}
        iconPosition="start"
        icon={<MagnifyingGlassRegular />}
        onChange={debounce({ delay: 200 }, handleChange)}
      />
      <div className="mt-6">
        {paginatedAnnouncements.length > 0 ? (
          paginatedAnnouncements.map((announcement) => (
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
