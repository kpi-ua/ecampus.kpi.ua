'use client';

import { useTranslations } from 'next-intl';
import { sleep } from 'radash';
import { FC, useEffect, useRef, useState } from 'react';

import { logout } from '@/actions/auth.actions';
import { SignOut } from '@/app/images';
import { Button } from '@/components/ui/button';
import { LocaleSwitch } from '@/components/ui/locale-switch';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Show } from '@/components/utils/show';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from '@/i18n/routing';
import { cn, getUniqueUserPhotoUrl } from '@/lib/utils';
import { User } from '@/types/models/user';

interface Props {
  user: User;
}

export const Header: FC<Props> = ({ user }) => {
  const isMobile = useIsMobile();

  const t = useTranslations('private.profile');
  const [profilePhoto, setProfilePhoto] = useState('');
  const firstRender = useRef(true);

  // This is to update profile picture when it's been uploaded in profile settings.
  // Photo is cached on CDN level, but the link to it is always the same.
  // We need to wait several seconds after image upload. During this time the cache is purged.
  // Then we re-render component with an updated link with a random parameter, which is
  // propagated to CDN url via campus backend.
  useEffect(() => {
    const setProfilePhotoUrl = () => setProfilePhoto(getUniqueUserPhotoUrl(user.photo));

    const deferProfileImageUpdate = async () => {
      await sleep(5000);
      setProfilePhotoUrl();
    };

    if (firstRender.current) {
      setProfilePhotoUrl();
      firstRender.current = false;
    } else {
      deferProfileImageUpdate();
    }
  }, [user]);

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
              {/* p-1 widens the 36px avatar to a 44px target; login and categories live on the profile page */}
              <Link
                href="/profile"
                aria-label={t('title')}
                className="rounded-full p-1 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden"
              >
                <ProfilePicture size="sm" src={profilePhoto} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('title')}</p>
            </TooltipContent>
          </Tooltip>
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
