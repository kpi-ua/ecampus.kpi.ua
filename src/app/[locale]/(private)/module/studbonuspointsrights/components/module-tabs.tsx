'use client';

import { useQueryState } from 'nuqs';
import { ReactNode } from 'react';

import { Tabs } from '@/components/ui/tabs';

import { SbpTab, tabSearchParam } from '../search-params';

/** The module's tabs with the open one kept in the URL, so a reload or a shared link opens the same tab. */
export function ModuleTabs({ children }: { children: ReactNode }) {
  const [tab, setTab] = useQueryState('tab', tabSearchParam);

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as SbpTab)} className="flex min-w-0 flex-col gap-6">
      {children}
    </Tabs>
  );
}
