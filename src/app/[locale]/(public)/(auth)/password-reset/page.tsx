import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PasswordResetForm from './password-reset-form';
import { AuthNavLayout } from '../../auth-nav-layout';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'auth.passwordReset' });

  return {
    title: t('header'),
  };
}

export default function PasswordResetPage({ searchParams }: Props) {
  const { username } = use(searchParams);
  const t = useTranslations('auth.passwordReset');

  return (
    <AuthNavLayout header={t('header')} description={t('description')}>
      <PasswordResetForm username={username} />
    </AuthNavLayout>
  );
}
