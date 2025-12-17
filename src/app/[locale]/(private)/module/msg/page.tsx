import { getTranslations } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import { getMails } from '@/actions/msg.actions';
import { getUserDetails } from '@/actions/auth.actions';
import { MessageTranslationKeys } from './constants';
import { Card } from '@/components/ui/card';
import { TabSheetTrigger } from '@/components/ui/tabs';
import { Tabs, TabsList, TabsContent } from '@radix-ui/react-tabs';
import Inbox from './components/inbox';
import { MailFilter } from '@/types/enums/mail-filter';
import { ProfileArea } from '@/types/enums/profile-area';
import Compose from '@/app/[locale]/(private)/module/msg/components/compose';

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
  const [incomingMails, sentMails, importantMails, user] = await Promise.all([
    getMails(MailFilter.Incoming),
    getMails(MailFilter.Outgoing),
    getMails(MailFilter.Important),
    getUserDetails(),
  ]);
  const profileArea = user?.studentProfile ? ProfileArea.Student : ProfileArea.Employee;

  const tabList = Object.values(MessageTranslationKeys);
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-7">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>
        <div className="mt-8 flex flex-col">
          <Tabs defaultValue={MessageTranslationKeys.Inbox}>
            <TabsList className="rounded-none border-0 bg-transparent p-0">
              {tabList.map((item) => (
                <TabSheetTrigger key={item} value={item}>
                  {t(`tab.${item}`)}
                </TabSheetTrigger>
              ))}
            </TabsList>
            <Card className="rounded-b-6 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
              <TabsContent value={MessageTranslationKeys.Sent}>
                <Inbox mails={sentMails} filter={MailFilter.Outgoing} />
              </TabsContent>
              <TabsContent value={MessageTranslationKeys.Inbox}>
                <Inbox mails={incomingMails} filter={MailFilter.Incoming} />
              </TabsContent>
              <TabsContent value={MessageTranslationKeys.Important}>
                <Inbox mails={importantMails} filter={MailFilter.Important} />
              </TabsContent>
              <TabsContent value={MessageTranslationKeys.Compose}>
                <Compose profileArea={profileArea} />
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </SubLayout>
  );
}
