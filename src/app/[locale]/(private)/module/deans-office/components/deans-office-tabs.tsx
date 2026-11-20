'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { useQueryStates } from 'nuqs';
import qs from 'query-string';
import { type ReactNode } from 'react';

import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { useRouter } from '@/i18n/routing';

import { deansOfficeSearchParams } from '../search-params';

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
  const [filters] = useQueryStates(deansOfficeSearchParams);
  const active = segment ?? 'index';

  return (
    <Tabs
      value={active}
      activationMode="manual"
      onValueChange={(tab) => {
        const url = tab === 'index' ? basePath : `${basePath}/${tab}`;
        router.push(qs.stringifyUrl({ url, query: filters }, { skipNull: true }));
      }}
    >
      <div className="overflow-x-auto">
        <TabsList aria-label={label} size="small">
          {triggers}
        </TabsList>
      </div>
      <TabsContent value={active} className="space-y-5">
        {children}
      </TabsContent>
    </Tabs>
  );
}
