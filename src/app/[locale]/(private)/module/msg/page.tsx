import { getTranslations } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import React from 'react';
import { Heading2, Paragraph } from '@/components/typography';
import { getMails, MailFilter } from '@/actions/msg.acitons';
import { MessageTranslationKeys } from './constants';
import { Card } from '@/components/ui/card';
import { TabSheetTrigger } from '@/components/ui/tabs';
import { Tabs, TabsList, TabsContent } from '@radix-ui/react-tabs';
import Compose from './components/compose';
import Sent from './components/sent';
import Inbox from './components/inbox';

const INTL_NAMESPACE = 'private.msg';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function MessagePage() {
  const t = await getTranslations(INTL_NAMESPACE);
  const incomingMails = await getMails(MailFilter.INCOMING);
  const sentMails = await getMails(MailFilter.OUTGOING);
  const importantMails = await getMails(MailFilter.IMPORTANT);

  const tTab = await getTranslations(`private.msg.tab`);

  const tabList = Object.values(MessageTranslationKeys);
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-7">
        <Heading2>{t('title')}</Heading2>
        <Paragraph className="leading-sm mt-3 mb-7 max-w-full text-sm font-normal text-neutral-700 sm:max-w-2xl">
          {t('subtitle')}
        </Paragraph>
        <div className="mt-8 flex flex-col">
          <Tabs defaultValue={MessageTranslationKeys.Inbox}>
            <TabsList className="rounded-none border-0 bg-transparent p-0">
              {tabList.map((item) => (
                <TabSheetTrigger key={item} value={item}>
                  {tTab(item)}
                </TabSheetTrigger>
              ))}
            </TabsList>
            <Card className="rounded-b-6 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
              <TabsContent value={MessageTranslationKeys.Sent}>
                <Sent mails={sentMails} />
              </TabsContent>
              <TabsContent value={MessageTranslationKeys.Inbox}>
                <Inbox mails={incomingMails} />
              </TabsContent>
              <TabsContent value={MessageTranslationKeys.Important}>
                <Inbox mails={importantMails} />
              </TabsContent>
              <TabsContent value={MessageTranslationKeys.Compose}>
                <Compose />
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </SubLayout>
  );
}
