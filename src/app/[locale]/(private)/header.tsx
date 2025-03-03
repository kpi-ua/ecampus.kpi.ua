'use client';

import React, { FC } from 'react';
import { LocaleSwitch } from '@/components/ui/locale-switch';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { useIsMobile } from '@/hooks/use-mobile';
import { Show } from '@/components/utils/show';
import { cn } from '@/lib/utils';
import { User } from '@/types/models/user';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/auth.actions';
import { useTranslations } from 'next-intl';
import { SignOut } from '@/app/images';
import { Paragraph } from '@/components/typography/paragraph';
import { USER_CATEGORIES } from '@/lib/constants/user-category';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsClient } from '@/hooks/use-is-client';

interface Props {
  user: User | null;
}

export const Header: FC<Props> = ({ user }) => {
  const isClient = useIsClient();
  const isMobile = useIsMobile();

  const t = useTranslations('private.profile');
  const tUserCategory = useTranslations('global.user-category');

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header
      className={cn('sticky top-0 flex h-[80px] items-center justify-between bg-basic-white px-6', {
        'justify-end': !isMobile,
      })}
    >
      <Show when={isMobile}>
        <SidebarTrigger />
      </Show>
      <div className="flex items-center gap-8">
        <LocaleSwitch />
        <div className="flex items-center gap-3">
          <ProfilePicture size="sm" src={user?.photo || ''} />
          <div className="hidden flex-col md:flex">
            <Show when={isClient}>
              <Paragraph className="m-0 text-base font-medium">{user?.username}</Paragraph>
              {user?.userCategories.map((category) => (
                <Paragraph className="m-0 text-base font-semibold" key={category}>
                  {tUserCategory(USER_CATEGORIES[category])}
                </Paragraph>
              ))}
            </Show>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" icon={<SignOut />} onClick={handleLogout} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('button.logout')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};
