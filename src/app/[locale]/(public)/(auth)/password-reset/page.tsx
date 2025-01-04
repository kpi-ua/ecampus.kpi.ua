import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PasswordResetForm from './password-reset-form';
import { AuthNavLayout } from '../../auth-nav-layout';

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: 'auth.passwordReset' });

  return {
    title: t('header'),
  };
}

export default function PasswordResetPage({ searchParams }: { searchParams: { username: string } }) {
  const t = useTranslations('auth.passwordReset');
  const username = searchParams.username;

  return (
    <AuthNavLayout header={t('header')} description={t('description')}>
      <PasswordResetForm username={username} />
    </AuthNavLayout>
  );
}
