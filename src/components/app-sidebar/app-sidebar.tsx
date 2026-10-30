import { getTranslations } from 'next-intl/server';

import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';

import { Logo } from '../logo';
import { MenuItem } from './menu-item';
import { MenuSection } from './menu-section';
import { ModulesMenuItems } from './modules-menu-items';

export async function AppSidebar() {
  const t = await getTranslations('global.menu');

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarHeader className="px-[calc(16px+0.5rem)] py-[16px]">
          <Logo />
        </SidebarHeader>
        <SidebarContent className="gap-0">
          <MenuSection>
            <MenuItem name="main" url="/" title={t('main')} />
          </MenuSection>
          <MenuSection>
            <MenuItem name="profile" url="/profile" title={t('profile')} />
            <MenuItem name="notice-board" url="/notice-board" title={t('notice-board')} />
            <MenuItem name="settings" url="/settings" title={t('settings')} />
          </MenuSection>
          <MenuSection>
            <ModulesMenuItems />
          </MenuSection>
        </SidebarContent>
      </SidebarContent>
    </Sidebar>
  );
}
