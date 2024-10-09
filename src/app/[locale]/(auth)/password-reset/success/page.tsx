'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function PasswordRestoreSuccess() {
  const t = useTranslations('auth.passwordReset.success');

  const handleResendEmail = () => {

  };

  return (
    <>
      <h2>{t('header')}</h2>
      <p className="py-4 text-neutral-600">{t('description', { email: 'test@test.com' })}</p>
      <p className="text-neutral-600">{t.rich('retryMessage', {
        resendlink: (chunks) => <Link href="#" onClick={handleResendEmail}>{chunks}</Link>
      })}</p>
    </>
  );
}
