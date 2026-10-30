import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Description, Heading2 } from '@/components/typography';
import { TextDivider } from '@/components/ui/text-divider';
import { LocaleProps } from '@/types/locale-props';

import { CredentialsLogin } from './credentials-login';
import { KPIIDLogin } from './kpi-id-login';

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
    <div>
      <div className="flex flex-col gap-[12px]">
        <Heading2 className="mx-auto max-w-[400px] text-center text-3xl leading-2xl lg:text-4xl lg:leading-4xl">
          {t('header')}
        </Heading2>
        <Description className="p-0 text-center">{t('description')}</Description>
      </div>
      <div className="mt-[28px]">
        <KPIIDLogin />
        <div className="my-[24px]">
          <TextDivider>{t('or')}</TextDivider>
        </div>
        <CredentialsLogin />
      </div>
    </div>
  );
}
