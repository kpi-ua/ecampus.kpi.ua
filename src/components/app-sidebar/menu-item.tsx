'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar';
import { menuIcon } from './menu-icon';
import { ArrowSquareOutRegular, Question } from '@/app/images';
import { Show } from '../utils/show';

interface MenuItemProps {
  name: string;
  title: string;
  url: string;
  isExternal?: boolean;
}

export const MenuItem = ({ name, title, url, isExternal = false }: MenuItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const sidebar = useSidebar();

  const Icon = menuIcon.get(name) || Question;

  const handleNavigate = () => {
    if (isExternal) {
      window.open(url, '_blank');
      return;
    }

    sidebar.setOpenMobile(false);
    router.push(url);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={pathname === url} className="flex justify-between" onClick={handleNavigate}>
        <span className="flex w-full items-center gap-2 font-semibold [&>svg]:size-[24px] [&>svg]:shrink-0">
          <Icon />
          {title}
        </span>
          <span className="[&>svg]:size-[18px]">
            <Show when={isExternal}>
              <ArrowSquareOutRegular />
            </Show>
          </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
