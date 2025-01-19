'use client';

import { LocaleSwitch } from '@/components/ui/locale-switch';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { useIsMobile } from '@/hooks/use-mobile';
import { Show } from '@/components/utils/show';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/user';

export const Header = () => {
  const isMobile = useIsMobile();
  const [user] = useLocalStorage<User>('user');

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
        <LocaleSwitch className="flex items-center gap-[6px]" />
        <ProfilePicture src={user?.photo || ''} />
      </div>
    </header>
  );
};
