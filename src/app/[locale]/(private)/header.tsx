'use client';

import { useTranslations } from 'next-intl';
import { sleep } from 'radash';
import { FC, useEffect, useRef, useState } from 'react';

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
import { USER_CATEGORIES } from '@/lib/constants/common';
import { cn, getUniqueUserPhotoUrl } from '@/lib/utils';
import { User } from '@/types/models/user';

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
        <div className="flex items-center gap-3">
          <ProfilePicture size="sm" src={profilePhoto} />
          <div className="hidden flex-col md:flex">
            <Paragraph className="m-0 text-base font-medium">{user?.username}</Paragraph>
            {user?.roles.map((category) => (
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
