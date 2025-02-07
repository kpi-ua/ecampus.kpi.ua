import { getContacts, getContactTypes } from '@/actions/profile.actions';
import { getTranslations } from 'next-intl/server';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { getUserDetails } from '@/actions/auth.actions';
import { Heading1 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { InfoBlock } from '@/app/[locale]/(private)/profile/components/info-block';
import { Card, CardContent } from '@/components/ui/card';
import { Contacts } from '@/app/[locale]/(private)/profile/components/contacts';
import { Show } from '@/components/utils/show';
import { IntellectAgreement } from '@/app/[locale]/(private)/profile/components/intellect-agreement';
import { IntellectPublicationInfo } from '@/app/[locale]/(private)/profile/components/intellect-publication-info';
import { CodeOfHonor } from '@/app/[locale]/(private)/profile/components/code-of-honor';

const INTL_NAMESPACE = 'private.profile';

export async function generateMetadata() {
  const t = await getTranslations(INTL_NAMESPACE);

  return {
    title: t('title'),
  };
}

export default async function Page() {
  const t = await getTranslations(INTL_NAMESPACE);

  const user = await getUserDetails();

  const contacts = await getContacts();
  const contactTypes = await getContactTypes();

  const isEmployee = !!user?.employeeProfile;

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
              <Show when={isEmployee}>
                <IntellectAgreement />
                <IntellectPublicationInfo />
              </Show>
              <CodeOfHonor />
            </CardContent>
          </Card>
        </div>
      </div>
    </SubLayout>
  );
}
