import { Heading2, Description } from '@/components/typography';
import { CredentialsLogin } from './credentials-login';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TextDivider } from '@/components/ui/text-divider';
import { KPIIDLogin } from './kpi-id-login';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'auth.login';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default async function LoginPage({ params }: LocaleProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <>
      <Heading2>{t('header')}</Heading2>
      <Description>{t('description')}</Description>
      <CredentialsLogin />
      <TextDivider>{t('or')}</TextDivider>
      {/*<KPIIDLogin />*/}
    </>
  );
}
