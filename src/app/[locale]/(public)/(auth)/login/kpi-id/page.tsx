import { getTranslations } from 'next-intl/server';
import { AuthNavLayout } from '../../../auth-nav-layout';
import { AccountSelector } from '@/components/account-selector/account-selector';
import { notFound } from 'next/navigation';
import { getKPIIDAccounts } from '@/actions/auth.actions';
import { KPIIDAccountSlim } from '@/types/models/kpi-id-account';

const INTL_NAMESPACE = 'auth.kpi-id';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default async function KPIID({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = await getTranslations(INTL_NAMESPACE);

  const ticketId = searchParams.ticketId as string;

  if (!ticketId) {
    notFound();
  }

  const accounts = await getKPIIDAccounts(ticketId);

  // This page shouldn't be shown only with one account
  if (!accounts?.length || accounts.length < 2) {
    notFound();
  }

  const sanitizedAccounts: KPIIDAccountSlim[] = accounts.map(({ username, photo, full_name }) => ({
    username,
    photo,
    full_name,
  }));

  return (
    <AuthNavLayout header={t('header')} description={t('description')}>
      <AccountSelector accounts={sanitizedAccounts} ticketId={ticketId} className="my-4" />
    </AuthNavLayout>
  );
}
