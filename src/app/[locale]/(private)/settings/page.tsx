import { Description, Heading2 } from '@/components/typography';
import { SubLayout } from '../sub-layout';
import { getTranslations } from 'next-intl/server';
import { SettingsForm } from '@/app/[locale]/(private)/settings/settings-form';
import { getUserDetails } from '@/actions/auth.actions';
import { notFound } from 'next/navigation';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'private.settings';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function SettingsPage() {
  const t = await getTranslations(INTL_NAMESPACE);
  const user = await getUserDetails();

  if (!user) {
    notFound();
  }

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>
        <SettingsForm user={user} />
      </div>
    </SubLayout>
  );
}
