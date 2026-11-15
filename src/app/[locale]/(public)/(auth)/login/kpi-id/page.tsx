import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { AccountSelector } from '@/components/account-selector/account-selector';
import { KPIID_ACCOUNTS_COOKIE_NAME, parseKPIIDAccounts } from '@/lib/kpi-id';
import { LocaleProps } from '@/types/locale-props';

import { AuthNavLayout } from '../../../auth-nav-layout';

type Props = LocaleProps;

const INTL_NAMESPACE = 'auth.kpi-id';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default async function KPIID() {
  const t = await getTranslations(INTL_NAMESPACE);

  // Left by the KPI ID callback when the person has several Campus accounts.
  const accounts = parseKPIIDAccounts((await cookies()).get(KPIID_ACCOUNTS_COOKIE_NAME)?.value);

  // This page shouldn't be shown only with one account
  if (accounts.length < 2) {
    notFound();
  }

  return (
    <AuthNavLayout header={t('header')} description={t('description')}>
      <AccountSelector accounts={accounts} className="my-4" />
    </AuthNavLayout>
  );
}
