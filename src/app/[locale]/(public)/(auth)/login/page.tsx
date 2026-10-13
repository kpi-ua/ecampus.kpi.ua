import { Description, Heading2 } from '@/components/typography';
import { CredentialsLogin } from './credentials-login';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TextDivider } from '@/components/ui/text-divider';
import { KPIIDLogin } from './kpi-id-login';
import { KPIID_CONTINUE_PARAM, KPIID_STATE_COOKIE_NAME } from '@/lib/constants/common';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'auth.login';

interface Props extends LocaleProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations(INTL_NAMESPACE);
  const kpiIdState = (await cookies()).get(KPIID_STATE_COOKIE_NAME)?.value;
  // Set by the KPI ID callback when it could not check the state and needs the user to start the login from here.
  const continueKPIID = KPIID_CONTINUE_PARAM in (await searchParams);

  return (
    <div>
      <div className="flex flex-col gap-[12px]">
        <Heading2 className="leading-2xl lg:leading-4xl mx-auto max-w-[400px] text-center text-3xl lg:text-4xl">
          {t('header')}
        </Heading2>
        <Description className="p-0 text-center">{t('description')}</Description>
      </div>
      <div className="mt-[28px]">
        {continueKPIID && (
          <Alert className="mb-4">
            <AlertDescription>{t('kpi-id-continue')}</AlertDescription>
          </Alert>
        )}
        <KPIIDLogin state={kpiIdState} />
        <div className="my-[24px]">
          <TextDivider>{t('or')}</TextDivider>
        </div>
        <CredentialsLogin />
      </div>
    </div>
  );
}
