import { Heading2 } from '@/components/typography/headers';
import { CredentialsLogin } from './credentials-login';
import { PublicLinks } from './public-links';
import { useTranslations } from 'next-intl';

export default function Login() {
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
