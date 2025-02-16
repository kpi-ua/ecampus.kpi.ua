import React from 'react';
import { MenuItem } from './menu-item';
import { getUserMenuGroups } from '@/actions/menu.actions';
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from '../ui/sidebar';

export async function MenuGroups() {
  const userMenuGroups = await getUserMenuGroups();

  return (
    <>
      {userMenuGroups.map((group, index) => (
        <SidebarGroup key={index} className="pb-6 [&:not(:first-child)]:pt-6">
          <SidebarGroupContent>
            <SidebarMenu>
              {group.map((item) => (
                <MenuItem
                  key={item.url}
                  name={item.name}
                  url={item.url}
                  title={item.title}
                  isExternal={item.isExternal}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
