'use client';

import { Link, usePathname } from '@/i18n/routing';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { menuIcon } from './menu-icon';
import { Question } from '@/app/images';

interface MenuItemProps {
  name: string;
  title: string;
  url: string;
  isExternal: boolean;
}

export const MenuItem = ({ name, title, url, isExternal }: MenuItemProps) => {
  const pathname = usePathname();

  const Icon = menuIcon.get(name) || Question;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={pathname === url} asChild>
        <Link href={url} target={isExternal ? '_blank' : '_self'}>
          <Icon />
          {title}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
