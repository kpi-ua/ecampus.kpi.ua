import { getTranslations } from 'next-intl/server';

import { AuthNavLayout } from '../../../../auth-nav-layout';
import { PasswordResetConfirm } from './password-reset-confirm';

const INTL_NAMESPACE = 'auth.passwordResetConfirm';

interface Props {
  params: Promise<{ locale: string; key: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
    robots: { index: false, follow: false },
  };
}

export default async function PasswordResetConfirmPage({ params }: Props) {
  const { key } = await params;
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <AuthNavLayout header={t('header')} description={t('description')}>
      <PasswordResetConfirm recoveryKey={key} />
    </AuthNavLayout>
  );
}
