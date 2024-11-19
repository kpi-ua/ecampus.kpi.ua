'use client';

import { Heading2 } from '@/components/typography/headers';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function PasswordRestoreSuccess() {
  const t = useTranslations('auth.passwordReset.success');
  const username = useSearchParams().get('username');
  const router = useRouter();

  const redirectToLogin = () => router.replace('/');

  return (
    <>
      <Heading2>{t('header')}</Heading2>
      <p className="py-4 text-neutral-600">{t('description', { username })}</p>
      <Button size="big" className="w-[100%] my-4" onClick={redirectToLogin}>
        {t('button')}
      </Button>
      <p className="text-neutral-600">
        {t.rich('retryMessage', {
          link: (chunks) => <Link href={{ pathname: '/password-reset', query: { username }}}>{chunks}</Link>
        })}
      </p>
    </>
  );
}
