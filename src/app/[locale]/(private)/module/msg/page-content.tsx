'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { MessageTranslationKeys } from '@/app/[locale]/(private)/module/msg/constants';
import { Card } from '@/components/ui/card';
import Sent from '@/app/[locale]/(private)/module/msg/components/sent';
import Inbox from '@/app/[locale]/(private)/module/msg/components/inbox';
import Important from '@/app/[locale]/(private)/module/msg/components/important';
import Compose from '@/app/[locale]/(private)/module/msg/components/compose';
import React, { useState } from 'react';
import { Tabs, TabsList } from '@/components/ui/tabs';
import { TabSheetTrigger } from '@/components/ui/tabs';
import { Message } from './types';

interface Props {
  incomingMails: Message[];
  sentMails: Message[];
}

export default function MessagePageContent({ incomingMails, sentMails }: Props) {
  const t = useTranslations('private.msg');
  const [selectedTab, setSelectedTab] = useState(MessageTranslationKeys.Inbox);
  const tTab = useTranslations(`private.msg.tab`);

  const tabList = Object.values(MessageTranslationKeys);

  return (
    <div className="mt-8 flex flex-col">
          <Tabs value={selectedTab} onValueChange={(value: string) => setSelectedTab(value as MessageTranslationKeys)}>
            <TabsList className="rounded-none border-0 bg-transparent p-0">
              {tabList.map((item) => (
                <TabSheetTrigger key={item} value={item}>
                  {tTab(item)}
                </TabSheetTrigger>
              ))}
            </TabsList>
          </Tabs>
      <Card className="rounded-b-6 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
        {selectedTab === MessageTranslationKeys.Sent && <Sent mails={sentMails} />}
        {selectedTab === MessageTranslationKeys.Inbox && <Inbox mails={incomingMails} />}
        {selectedTab === MessageTranslationKeys.Important && <Important mails={mails} />}
        {selectedTab === MessageTranslationKeys.Compose && <Compose />}
      </Card>
    </div>
  );
}
