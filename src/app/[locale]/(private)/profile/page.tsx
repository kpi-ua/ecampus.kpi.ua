import { getContacts, getContactTypes } from '@/actions/profile.actions';
import { getTranslations } from 'next-intl/server';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { getUserDetails } from '@/actions/auth.actions';
import { Heading1, Description } from '@/components/typography';
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

  if (!user) {
    return null;
  }

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12">
        <Heading1>{t('title')}</Heading1>
        <Description>{t('subtitle')}</Description>
        <div className="flex flex-col gap-5 xl:flex-row">
          <InfoBlock user={user} className="h-fit w-full" />
          <Card className="h-fit w-full">
            <CardContent className="flex flex-col gap-6 space-y-1.5 p-9">
              <Contacts contacts={contacts} contactTypes={contactTypes} />
              <Show when={isEmployee}>
                <IntellectAgreement user={user} />
                <IntellectPublicationInfo user={user} />
              </Show>
              <CodeOfHonor user={user} />
            </CardContent>
          </Card>
        </div>
      </div>
    </SubLayout>
  );
}
