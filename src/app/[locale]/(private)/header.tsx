'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import { logout } from '@/actions/auth.actions';
import { SignOut } from '@/app/images';
import { Paragraph } from '@/components/typography/paragraph';
import { Button } from '@/components/ui/button';
import { LocaleSwitch } from '@/components/ui/locale-switch';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Show } from '@/components/utils/show';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { User } from '@/types/models/user';

interface Props {
  user: User;
}

export const Header: FC<Props> = ({ user }) => {
  const isMobile = useIsMobile();

  const t = useTranslations('private.profile');
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header
      className={cn('bg-basic-white sticky top-0 flex h-[80px] items-center justify-between px-6', {
        'justify-end': !isMobile,
      })}
    >
      <Show when={isMobile}>
        <SidebarTrigger />
      </Show>
      <div className="flex items-center gap-8">
        <LocaleSwitch />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/profile"
                aria-label={t('title')}
                className="rounded-full p-1 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden"
              >
                <ProfilePicture size="sm" src={user.photo} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <Paragraph className="m-0 text-sm leading-sm">{t('title')}</Paragraph>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" icon={<SignOut />} onClick={handleLogout} />
            </TooltipTrigger>
            <TooltipContent>
              <Paragraph className="m-0 text-sm leading-sm">{t('button.logout')}</Paragraph>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};
