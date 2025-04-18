import { Heading1 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { getTranslations } from 'next-intl/server';
import { SettingsForm } from '@/app/[locale]/(private)/settings/settings-form';
import { Paragraph } from '@/components/typography/paragraph';
import { getUserDetails } from '@/actions/auth.actions';

const INTL_NAMESPACE = 'private.settings';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function SettingsPage() {
  const t = await getTranslations(INTL_NAMESPACE);
  const user = await getUserDetails();

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-neutral-700">{t('subtitle')}</Paragraph>
        <SettingsForm user={user} />
      </div>
    </SubLayout>
  );
}
