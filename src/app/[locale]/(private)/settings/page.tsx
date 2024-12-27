import { Heading1 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { SettingsForm } from '@/app/[locale]/(private)/settings/settings-form';
import { Paragraph } from '@/components/typography/paragraph';

const INTL_NAMESPACE = 'private.settings';

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function SettingsPage() {
  const t = useTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-neutral-700">{t('subtitle')}</Paragraph>
        <SettingsForm />
      </div>
    </SubLayout>
  );
}
