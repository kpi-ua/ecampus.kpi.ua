import { getTranslations } from 'next-intl/server';
import { AuthNavLayout } from '../../../auth-nav-layout';
import { Heading5 } from '@/components/typography/headers';
import RichText from '@/components/typography/rich-text';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { LOGIN_PATH } from '@/middleware/contants';
import { KPIID_FAILURE_TYPES } from '@/types/models/kpi-id-account';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'auth.kpi-id-failed';

const AUDIENCES = ['student', 'employee'] as const;

// Only echo codes the KPI ID route produces, so the URL cannot put arbitrary text on the page.
const API_ERROR_CODE_PATTERN = /^api-\d{3}$/;

interface Props extends LocaleProps {
  searchParams: Promise<{ reason?: string | string[] }>;
}

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default async function KPIIDFailedPage({ searchParams }: Props) {
  const { reason } = await searchParams;
  const t = await getTranslations(INTL_NAMESPACE);
  const errorCode =
    typeof reason === 'string' &&
    (API_ERROR_CODE_PATTERN.test(reason) || (KPIID_FAILURE_TYPES as readonly string[]).includes(reason))
      ? reason
      : undefined;

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
