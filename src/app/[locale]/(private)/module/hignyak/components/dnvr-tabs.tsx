'use client';

import { type ComponentProps } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/routing';

interface Props {
  activeTab: string;
  tabs: {
    value: string;
    label: string;
    href: ComponentProps<typeof Link>['href'];
  }[];
}

export function DnvrTabs({ activeTab, tabs }: Props) {
  return (
    <Tabs value={activeTab}>
      <TabsList size="small" className="max-w-full flex-wrap justify-start">
        {tabs.map(({ value, label, href }) => (
          <TabsTrigger key={value} value={value} asChild>
            <Link href={href}>{label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
