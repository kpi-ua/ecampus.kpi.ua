import Logo from '@/app/images/logo.svg';
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { Link } from '@/i18n/routing';
import React from 'react';
import { Footer } from './footer';
import { MenuGroups } from './menu-groups';

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarHeader className="px-[calc(16px_+_0.5rem)] py-[16px]">
          <Link href="/" className="flex max-h-[48px]">
            <Logo />
          </Link>
        </SidebarHeader>
        <SidebarContent className="gap-0">
          <MenuGroups />
        </SidebarContent>
      </SidebarContent>
      <Footer />
    </Sidebar>
  );
}
