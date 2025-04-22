import { use } from 'react';
import { Heading2, Description } from '@/components/typography';
import { CredentialsLogin } from './credentials-login';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Show } from '@/components/utils/show';
import { TextDivider } from '@/components/ui/text-divider';
import { KPIIDLogin } from './kpi-id-login';
import { LocaleProps } from '@/types/props';

const INTL_NAMESPACE = 'auth.login';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default function LoginPage({ params }: LocaleProps) {
  const { locale } = use(params);

  setRequestLocale(locale);

  const t = useTranslations(INTL_NAMESPACE);
  const showKpiIdButton = process.env.NEXT_PUBLIC_KPI_ID_BUTTON === 'true';

  return (
    <>
      <Heading2>{t('header')}</Heading2>
      <Description>{t('description')}</Description>
      <CredentialsLogin />
      <Show when={showKpiIdButton}>
        <TextDivider>{t('or')}</TextDivider>
        <KPIIDLogin />
      </Show>
    </>
  );
}
