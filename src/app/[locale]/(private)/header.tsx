'use client';

import { LocaleSwitch } from '@/components/ui/locale-switch';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { useIsMobile } from '@/hooks/use-mobile';
import { Show } from '@/components/utils/show';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/auth.actions';
import { useTranslations } from 'next-intl';
import { SignOut } from '@/app/images';
import { Paragraph } from '@/components/typography/paragraph';

export const Header = () => {
  const isMobile = useIsMobile();
  const [user] = useLocalStorage<User>('user');
  const t = useTranslations('private.profile');

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
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="focus:outline-none focus:ring-0">
            <ProfilePicture src={user?.photo || ''} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-6 w-[240px] p-4">
            <DropdownMenuLabel className="flex items-center gap-2">
              <ProfilePicture size="sm" src={user?.photo || ''} />
              <Paragraph className="text-base font-medium leading-5">{user?.username}</Paragraph>
            </DropdownMenuLabel>
            <DropdownMenuItem className="focus:bg-accent-foreground-none">
              <Button
                variant="secondary"
                size="small"
                className="w-full"
                onClick={handleLogout}
                iconPosition="end"
                icon={<SignOut />}
              >
                {t('button.logout')}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
