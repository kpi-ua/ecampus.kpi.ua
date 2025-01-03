'use client';

import { Heading1 } from '@/components/typography/headers';
import { useTranslations } from 'next-intl';
import { SubLayout } from '../sub-layout';
import { Paragraph } from '@/components/typography/paragraph';
import { InfoBlock } from '@/app/[locale]/(private)/profile/components/InfoBlock';
import { Contacts } from '@/app/[locale]/(private)/profile/components/Contacts';
import { Contact, ContactType } from '@/types/contact';
import { IntellectAgreement } from '@/app/[locale]/(private)/profile/components/IntellectAgreement';
import { Card, CardContent } from '@/components/ui/card';
import { IntellectPublicationInfo } from '@/app/[locale]/(private)/profile/components/IntellectPublicationInfo';
import { CodeOfHonor } from '@/app/[locale]/(private)/profile/components/CodeOfHonor';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/user';
import { useIsClient } from '@/hooks/use-is-client';

interface Props {
  contacts: Contact[];
  contactTypes: ContactType[];
}

export function Profile({ contacts, contactTypes }: Props) {
  const t = useTranslations('private.profile');

  const [user] = useLocalStorage<User>('user');

  const isClient = useIsClient();

  const isStudent = !!user?.studentProfile;

  if (!isClient) {
    return null;
  }

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-neutral-700">{t('subtitle')}</Paragraph>
        <div className="flex flex-col gap-5 xl:flex-row">
          <InfoBlock className="h-fit w-full" />
          <Card className="h-fit w-full">
            <CardContent className="flex flex-col gap-6 space-y-1.5 p-9">
              <Contacts contacts={contacts} contactTypes={contactTypes} />
              {!isStudent && <IntellectAgreement />}
              {!isStudent && <IntellectPublicationInfo />}
              {isStudent && <CodeOfHonor />}
            </CardContent>
          </Card>
        </div>
      </div>
    </SubLayout>
  );
}
