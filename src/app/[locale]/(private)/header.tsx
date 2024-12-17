'use client';

import { LocaleSwitch } from '@/components/ui/locale-switch';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ProfilePicture } from './profile-picture';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 flex h-[80px] items-center justify-between bg-basic-white px-6">
      <div>{isMobile && <SidebarTrigger />}</div>
      <div className="flex items-center gap-8">
        <LocaleSwitch />
        <ProfilePicture />
      </div>
    </header>
  );
};
