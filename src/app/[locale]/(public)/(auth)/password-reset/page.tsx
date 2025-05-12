import { getTranslations } from 'next-intl/server';
import PasswordResetForm from './password-reset-form';
import { AuthNavLayout } from '../../auth-nav-layout';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'auth.passwordReset';

interface Props extends LocaleProps {
  searchParams: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default async function PasswordResetPage({ searchParams }: Props) {
  const { username } = await searchParams;
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <AuthNavLayout header={t('header')} description={t('description')}>
      <PasswordResetForm username={username} />
    </AuthNavLayout>
  );
}
