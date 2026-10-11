import { getTranslations } from 'next-intl/server';
import { AuthNavLayout } from '../../../auth-nav-layout';
import { Heading5 } from '@/components/typography/headers';
import RichText from '@/components/typography/rich-text';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { LOGIN_PATH } from '@/middleware/contants';
import { KPIIDRole } from '@/types/models/kpi-id-account';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'auth.kpi-id-failed';

const STUDENT_GUIDE_URL = 'https://kbis.kpi.ua/blog/campus-account-not-found';

const ALL_ROLES: KPIIDRole[] = ['student', 'employee'];

interface Props extends LocaleProps {
  searchParams: Promise<{ reason?: string | string[]; roles?: string | string[] }>;
}

const isAccountNotFound = (reason?: string | string[]) => reason === 'account-not-found';

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const { reason } = await searchParams;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t(isAccountNotFound(reason) ? 'account-not-found.header' : 'error.header'),
  };
}

const parseRoles = (roles?: string | string[]) => {
  const requested = String(roles ?? '').split(',');
  const parsed = ALL_ROLES.filter((role) => requested.includes(role));

  // KPI ID did not say who the person is, so show both routes.
  return parsed.length ? parsed : ALL_ROLES;
};

const AccountNotFound = async ({ roles }: { roles: KPIIDRole[] }) => {
  const t = await getTranslations(`${INTL_NAMESPACE}.account-not-found`);

  return (
    <AuthNavLayout header={t('header')} description={t('description')}>
      {roles.map((role) => (
        <section key={role} className="mb-4 text-neutral-600">
          <Heading5 className="mb-2 text-neutral-900">{t(`${role}.title`)}</Heading5>
          <RichText>
            {(tags) =>
              t.rich(`${role}.text`, {
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
};

const GenericError = async () => {
  const t = await getTranslations(`${INTL_NAMESPACE}.error`);

  return (
    <AuthNavLayout header={t('header')} description={t('description')}>
      <Button size="big" className="my-4 w-full" asChild>
        <Link href={LOGIN_PATH}>{t('retry')}</Link>
      </Button>
    </AuthNavLayout>
  );
};

export default async function KPIIDFailedPage({ searchParams }: Props) {
  const { reason, roles } = await searchParams;

  if (isAccountNotFound(reason)) {
    return <AccountNotFound roles={parseRoles(roles)} />;
  }

  return <GenericError />;
}
