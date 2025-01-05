'use client';

import { Heading6 } from '@/components/typography/headers';
import { Separator } from '@/components/ui/separator';
import { Paragraph } from '@/components/typography/paragraph';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/user';
import { acceptCodeOfHonor } from '@/actions/profile.actions';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from '@/app/images';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { Link } from '@/i18n/routing';

export function CodeOfHonor() {
  const { errorToast } = useServerErrorToast();

  const isMobile = useIsMobile();

  const [user, setUser] = useLocalStorage<User>('user');

  const [loading, setLoading] = useState(false);

  const t = useTranslations('private.profile');

  const handleClick = async () => {
    setLoading(true);
    const res = await acceptCodeOfHonor();
    if (!res) {
      errorToast();
      return;
    }
    setUser(res);
    setLoading(false);
  };

  if (user?.studentProfile?.codeOfHonorSigned) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <Heading6>{t('codeOfHonor.title')}</Heading6>
      <Separator />
      {t.rich('codeOfHonor.content', {
        documentsLink: (chunks) => <Link href="/kpi-documents">{chunks}</Link>,
        paragraph: (chunks) => <Paragraph className="m-0 text-lg">{chunks}</Paragraph>,
      })}

      <Button
        className="ml-auto w-fit"
        loading={loading}
        onClick={handleClick}
        size={isMobile ? 'medium' : 'big'}
        icon={<Check />}
        iconPosition="end"
      >
        {t('button.agree')}
      </Button>
    </div>
  );
}
