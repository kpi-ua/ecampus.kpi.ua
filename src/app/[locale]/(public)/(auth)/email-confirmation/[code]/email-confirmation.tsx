'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { confirmEmail } from '@/actions/settings.actions';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { Link } from '@/i18n/routing';
import { EmailConfirmation as EmailConfirmationResult } from '@/types/models/link-confirmation';

interface Props {
  code: string;
}

export const EmailConfirmation = ({ code }: Props) => {
  const t = useTranslations('auth.emailConfirmation');
  const { errorToast } = useServerErrorToast();
  const [result, setResult] = useState<EmailConfirmationResult>();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const confirmation = await confirmEmail(code);
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
          <Link href="/">{t('success.button')}</Link>
        </Button>
      </>
    );
  }

  if (result === 'invalid') {
    return (
      <>
        <Paragraph className="text-base text-neutral-600">{t('invalid.description')}</Paragraph>
        <Button size="big" className="my-4 w-full" asChild>
          <Link href="/settings">{t('invalid.button')}</Link>
        </Button>
      </>
    );
  }

  if (result === 'too-many-attempts') {
    return <Paragraph className="text-base text-neutral-600">{t('too-many-attempts')}</Paragraph>;
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
