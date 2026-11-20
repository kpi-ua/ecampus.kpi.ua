import { getTranslations } from 'next-intl/server';

import { AuthNavLayout } from '../../../auth-nav-layout';
import { EmailConfirmation } from "./email-confirmation";

const INTL_NAMESPACE = 'auth.emailConfirmation';

interface Props {
  params: Promise<{ locale: string; code: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
    robots: { index: false, follow: false },
  };
}

export default async function EmailConfirmationPage({ params }: Props) {
  const { code } = await params;
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <AuthNavLayout header={t('header')} description={t('description')}>
      <EmailConfirmation code={code} />
    </AuthNavLayout>
  );
}
