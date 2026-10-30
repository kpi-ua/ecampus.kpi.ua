import { getTranslations } from 'next-intl/server';

import { Heading5 } from '@/components/typography/headers';
import RichText from '@/components/typography/rich-text';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { LOGIN_PATH } from '@/proxy/contants';
import { LocaleProps } from '@/types/locale-props';
import { KPIID_FAILURE_REASONS } from '@/types/models/kpi-id-account';

import { AuthNavLayout } from '../../../auth-nav-layout';

const INTL_NAMESPACE = 'auth.kpi-id-failed';

const AUDIENCES = ['student', 'employee'] as const;

interface Props extends LocaleProps {
  searchParams: Promise<{ reason?: string | string[]; status?: string | string[] }>;
}

// Only echo values the KPI ID route produces, so the URL cannot put arbitrary text on the page.
const getErrorCode = (reason: unknown, status: unknown) => {
  if (typeof reason !== 'string' || !(KPIID_FAILURE_REASONS as readonly string[]).includes(reason)) {
    return undefined;
  }

  const statusCode = Number(status);
  const isHttpStatus = Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599;

  return isHttpStatus ? `${reason}-${statusCode}` : reason;
};

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default async function KPIIDFailedPage({ searchParams }: Props) {
  const { reason, status } = await searchParams;
  const t = await getTranslations(INTL_NAMESPACE);
  const errorCode = getErrorCode(reason, status);

  return (
    <AuthNavLayout header={t('header')} description={t('description')}>
      {AUDIENCES.map((audience) => (
        <section key={audience} className="mb-4 text-neutral-600">
          <Heading5 className="mb-2 text-neutral-900">{t(`${audience}.title`)}</Heading5>
          <RichText>
            {(tags) =>
              t.rich(`${audience}.text`, {
                ...tags,
                guide: (chunks) => (
                  <Link
                    href={process.env.NEXT_PUBLIC_CAMPUS_ACCOUNT_NOT_FOUND_URL!}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </Link>
                ),
              })
            }
          </RichText>
        </section>
      ))}
      <Button size="big" className="my-4 w-full" asChild>
        <Link href={LOGIN_PATH}>{t('retry')}</Link>
      </Button>
      {errorCode && <p className="text-sm text-neutral-500">{t('error-code', { code: errorCode })}</p>}
    </AuthNavLayout>
  );
}
