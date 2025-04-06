import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import React from 'react';
import { Footer } from './footer';
import { MenuGroups } from './menu-groups';
import { Logo } from '../logo';

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarHeader className="px-[calc(16px_+_0.5rem)] py-[16px]">
          <Logo />
        </SidebarHeader>
        <SidebarContent className="gap-0">
          <MenuGroups />
        </SidebarContent>
      </SidebarContent>
      <Footer />
    </Sidebar>
  );
}
