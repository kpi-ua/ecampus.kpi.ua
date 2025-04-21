'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import { sleep, uid } from 'radash';
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

interface Props {
  user: User;
}

export const Header: FC<Props> = ({ user }) => {
  const isMobile = useIsMobile();

  const t = useTranslations('private.profile');
  const tUserCategory = useTranslations('global.user-category');
  const [profilePhoto, setProfilePhoto] = useState('');
  const firstRender = useRef(true);

  // This is to update profile picture when it's been uploaded in profile settings.
  // Photo is cached on CDN level, but the link to it is always the same.
  // We need to wait several seconds after image upload. During this time the cache is purged.
  // Then we re-render component with an updated link with a random parameter, which is
  // propagated to CDN url via campus backend.
  useEffect(() => {
    const setProfilePhotoUrl = () => setProfilePhoto(`${user.photo}?v=${uid(8)}`);

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
          <ProfilePicture size="sm" src={profilePhoto} />
          <div className="hidden flex-col md:flex">
            <Paragraph className="m-0 text-base font-medium">{user?.username}</Paragraph>
            {user?.userCategories.map((category) => (
              <Paragraph className="m-0 text-base font-semibold" key={category}>
                {tUserCategory(USER_CATEGORIES[category])}
              </Paragraph>
            ))}
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
