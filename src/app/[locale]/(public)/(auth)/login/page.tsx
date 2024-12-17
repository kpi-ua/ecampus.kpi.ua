import { Heading2 } from '@/components/typography/headers';
import { CredentialsLogin } from './credentials-login';
import { PublicLinks } from './public-links';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: 'auth.login' });

  return {
    title: t('header'),
  };
}

export default function LoginPage() {
  const t = useTranslations('auth.login');

  return (
    <>
      <Heading2>{t('header')}</Heading2>
      <p className="py-4 text-neutral-600">{t('description')}</p>
      <CredentialsLogin />
      <PublicLinks />
    </>
  );
}
