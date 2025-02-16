'use client';

import { Heading6 } from '@/components/typography/headers';
import { Separator } from '@/components/ui/separator';
import { Paragraph } from '@/components/typography/paragraph';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/models/user';
import { setIntellectAgreement } from '@/actions/profile.actions';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import Link from 'next/link';
import { Show } from '@/components/utils/show';

export function IntellectAgreement() {
  const isMobile = useIsMobile();

  const t = useTranslations('private.profile');

  const { errorToast } = useServerErrorToast();

  const [user, setUser] = useLocalStorage<User>('user');

  const [loading, setLoading] = useState(false);

  const handleIntellectAgreementClick = async () => {
    setLoading(true);
    const res = await setIntellectAgreement(!user?.intellectProfileEnabled);
    setLoading(false);
    if (!res) {
      errorToast();
      return;
    }
    setUser(res);
  };

  return (
    <div className="flex flex-col gap-3">
      <Heading6>{t('intellect.agreement-title')}</Heading6>
      <Separator />
      <Paragraph className="m-0">
        {user?.intellectProfileEnabled
          ? t('intellect.intellect-profile-enabled')
          : t('intellect.intellect-profile-disabled')}
      </Paragraph>
      <Show when={!!user?.intellectProfileEnabled}>
        <Link className="text-lg font-semibold" href={user?.intellectProfile || '/'}>
          {t('intellect.profile-link')}
        </Link>
      </Show>

      <Button
        className="ml-auto mt-2 w-fit"
        loading={loading}
        onClick={handleIntellectAgreementClick}
        size={isMobile ? 'medium' : 'big'}
      >
        {user?.intellectProfileEnabled ? t('button.revoke-permission') : t('button.grant-permission')}
      </Button>
    </div>
  );
}
