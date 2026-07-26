import { Description, Heading2 } from '@/components/typography';
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
    <div className="pt-2">
      <Heading2 className="leading-2xl lg:leading-3xl text-center text-3xl lg:text-4xl">{t('header')}</Heading2>
      <Description className="px-2 text-center">{t('description')}</Description>
      <KPIIDLogin />
      <TextDivider>{t('or')}</TextDivider>
      <CredentialsLogin />
    </div>
  );
}
