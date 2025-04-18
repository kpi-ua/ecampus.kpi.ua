import { Heading2 } from '@/components/typography/headers';
import { CredentialsLogin } from './credentials-login';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Show } from '@/components/utils/show';
import { TextDivider } from '@/components/ui/text-divider';
import { KPIIDLogin } from './kpi-id-login';

const INTL_NAMESPACE = 'auth.login';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  const t = useTranslations(INTL_NAMESPACE);
  const showKpiIdButton = process.env.NEXT_PUBLIC_KPI_ID_BUTTON === 'true';

  return (
    <>
      <Heading2>{t('header')}</Heading2>
      <p className="py-4 text-neutral-600">{t('description')}</p>
      <CredentialsLogin />
      <Show when={showKpiIdButton}>
        <TextDivider>{t('or')}</TextDivider>
        <KPIIDLogin />
      </Show>
    </>
  );
}
