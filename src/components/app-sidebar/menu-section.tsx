import React from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from '../ui/sidebar';

export function MenuSection({ children }: { children: React.ReactNode }) {
  return (
    <SidebarGroup className="pb-6 not-first:pt-6">
      <SidebarGroupContent>
        <SidebarMenu>{children}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
