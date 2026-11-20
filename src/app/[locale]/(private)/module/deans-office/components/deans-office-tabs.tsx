'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { type ReactNode } from 'react';

import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { useRouter } from '@/i18n/routing';

export function DeansOfficeTabs({
  basePath,
  label,
  triggers,
  children,
}: {
  basePath: string;
  label: string;
  triggers: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
  const active = segment ?? 'index';

  return (
    <Tabs
      value={active}
      className="flex min-w-0 flex-col gap-4"
      activationMode="manual"
      onValueChange={(tab) => {
        const url = tab === 'index' ? basePath : `${basePath}/${tab}`;
        router.push(url);
      }}
    >
      <div className="overflow-x-auto">
        <TabsList aria-label={label} size="small">
          {triggers}
        </TabsList>
      </div>
      <TabsContent value={active} className="mt-0 min-w-0">
        {children}
      </TabsContent>
    </Tabs>
  );
}
