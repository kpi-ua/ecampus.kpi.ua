'use client';

import { Heading6 } from '@/components/typography/headers';
import { Separator } from '@/components/ui/separator';
import { Paragraph } from '@/components/typography/paragraph';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/user';
import { setIntellectAgreement } from '@/actions/profile.actions';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

export function IntellectAgreement() {
  const isMobile = useIsMobile();

  const t = useTranslations('private.profile');

  const { errorToast } = useServerErrorToast();

  const [user, setUser] = useLocalStorage<User>('user');

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await setIntellectAgreement(!user?.intellectProfileEnabled);
    if (!res) {
      errorToast();
      return;
    }
    setLoading(false);
    setUser(res);
  };

  return (
    <div className="flex flex-col gap-3">
      <Heading6>{t('intellect.agreement-title')}</Heading6>
      <Separator />
      <Paragraph className="m-0">
        {user?.intellectProfileEnabled
          ? t('intellect.intellectProfileEnabled')
          : t('intellect.intellectProfileDisabled')}
      </Paragraph>

      <Button className="ml-auto w-fit" loading={loading} onClick={handleClick} size={isMobile ? 'medium' : 'big'}>
        {user?.intellectProfileEnabled ? t('button.revoke-permission') : t('button.grant-permission')}
      </Button>
    </div>
  );
}
