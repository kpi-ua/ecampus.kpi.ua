'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { MessageTranslationKeys } from '@/app/[locale]/(private)/module/msg/constants';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { TableTabs } from '@/app/[locale]/(private)/module/studysheet/[id]/components';
import { Card } from '@/components/ui/card';
import Sent from '@/app/[locale]/(private)/module/msg/components/sent';
import Inbox from '@/app/[locale]/(private)/module/msg/components/inbox';
import Important from '@/app/[locale]/(private)/module/msg/components/important';
import Compose from '@/app/[locale]/(private)/module/msg/components/compose';
import React from 'react';

export default function MessagePageContent() {
  const t = useTranslations('private.msg');
  const searchParams = useSearchParams();

  const tab = searchParams.get('tab') || MessageTranslationKeys.Inbox;

  return (
    <div className="mt-8 flex flex-col">
      <TableTabs module="msg" sheetList={Object.values(MessageTranslationKeys)} />
      <Card className="rounded-b-6 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
        {tab === MessageTranslationKeys.Sent && <Sent />}
        {tab === MessageTranslationKeys.Inbox && <Inbox />}
        {tab === MessageTranslationKeys.Important && <Important />}
        {tab === MessageTranslationKeys.Compose && <Compose />}
      </Card>
    </div>
  );
}
