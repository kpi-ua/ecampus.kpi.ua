'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { confirmPasswordReset } from '@/actions/auth.actions';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { Link } from '@/i18n/routing';
import { LOGIN_PATH } from '@/proxy/contants';
import { PasswordResetConfirmation } from '@/types/models/link-confirmation';

interface Props {
  recoveryKey: string;
}

export const PasswordResetConfirm = ({ recoveryKey }: Props) => {
  const t = useTranslations('auth.passwordResetConfirm');
  const { errorToast } = useServerErrorToast();
  const [result, setResult] = useState<PasswordResetConfirmation>();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const confirmation = await confirmPasswordReset(recoveryKey);
    setLoading(false);

    if (confirmation === 'error') {
      errorToast();
      return;
    }

    setResult(confirmation);
  };

  if (result === 'success') {
    return (
      <>
        <Paragraph className="text-base text-neutral-600">{t('success.description')}</Paragraph>
        <Button size="big" className="my-4 w-full" asChild>
          <Link href={LOGIN_PATH}>{t('success.button')}</Link>
        </Button>
      </>
    );
  }

  if (result === 'expired') {
    return (
      <>
        <Paragraph className="text-base text-neutral-600">{t('expired.description')}</Paragraph>
        <Button size="big" className="my-4 w-full" asChild>
          <Link href="/password-reset">{t('expired.button')}</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <Paragraph className="text-base text-neutral-600">{t('description')}</Paragraph>
      <Button size="big" className="my-4 w-full" loading={loading} onClick={handleConfirm}>
        {t('button')}
      </Button>
    </>
  );
};
