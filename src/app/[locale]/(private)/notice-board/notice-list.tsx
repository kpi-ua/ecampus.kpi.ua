'use client';

import { Announcement } from '@/types/announcement';
import { Notice } from '@/app/[locale]/(private)/notice-board/notice';
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import MagnifyingGlassRegular from '../../../images/icons/MagnifyingGlassRegular.svg';
import { debounce } from 'radash';
import { Paragraph } from '@/components/typography/paragraph';
import { Show } from '@/components/utils/show';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { useSearchParams } from 'next/navigation';

interface NoticeListProps {
  announcements: Announcement[];
}

const PAGE_SIZE = 2;

export function NoticeList({ announcements }: NoticeListProps) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');

  const t = useTranslations('private.notice-board');
  const [search, setSearch] = useState('');

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const filteredAnnouncements = announcements.filter((fa) => fa.title.toLowerCase().includes(search.toLowerCase()));

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
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
        {filteredAnnouncements.slice(start, end).map((announcement) => (
          <React.Fragment key={announcement.id}>
            <Notice announcement={announcement} />
            <Separator className="my-5" />
          </React.Fragment>
        ))}
        <Show when={!filteredAnnouncements.length}>
          <Paragraph className="text-neutral-600">{t('input.not-found')}</Paragraph>
        </Show>
      </div>
      <div className="mt-8">
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE} totalCount={filteredAnnouncements.length} />
      </div>
    </Card>
  );
}
