'use client';

import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '../ui/sidebar';
import { menuIcon } from './menu-icon';
import { CaretRightRegular, Question } from '@/app/images';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface CollapsibleMenuItemProps {
  title: string;
  name: string;
  children: React.ReactNode[];
}

export const CollapsibleMenuItem = ({ title, name, children }: CollapsibleMenuItemProps) => {
  const Icon = menuIcon.get(name) || Question;

  return (
    <Collapsible className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex justify-between">
            <span className="flex w-full items-center gap-2 font-semibold [&>svg]:size-[24px] [&>svg]:shrink-0">
              <Icon />
              {title}
            </span>
            <span className="[&>svg]:size-[18px]">
              <CaretRightRegular className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mx-0 border-none px-0 pl-2.5">{children}</SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
