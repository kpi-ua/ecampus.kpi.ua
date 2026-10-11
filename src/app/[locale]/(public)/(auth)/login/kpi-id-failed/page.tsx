import { getTranslations } from 'next-intl/server';
import { AuthNavLayout } from '../../../auth-nav-layout';
import { Heading5 } from '@/components/typography/headers';
import RichText from '@/components/typography/rich-text';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { LOGIN_PATH } from '@/middleware/contants';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'auth.kpi-id-failed';

const STUDENT_GUIDE_URL = 'https://kbis.kpi.ua/blog/campus-account-not-found';

const AUDIENCES = ['student', 'employee'] as const;

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default async function KPIIDFailedPage() {
  const t = await getTranslations(INTL_NAMESPACE);

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
                  <Link href={STUDENT_GUIDE_URL} target="_blank" rel="noopener noreferrer">
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
    </AuthNavLayout>
  );
}
