'use client';

import { useTranslations } from 'next-intl';
import { useSelectedLayoutSegment } from 'next/navigation';
import { type ReactNode } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/routing';

import { INTL_NAMESPACE } from '../translations';

export default function DisciplinesLayout({ children }: { children: ReactNode }) {
  const t = useTranslations(INTL_NAMESPACE);
  const active = useSelectedLayoutSegment() ?? 'index';

  return (
    <Tabs value={active} className="flex min-w-0 flex-col gap-4" activationMode="manual">
      <div className="overflow-x-auto">
        <TabsList aria-label={t('disciplines')} size="small">
          <TabsTrigger asChild value="index">
            <Link href="/module/deans-office/disciplines">{t('disciplineSettings')}</Link>
          </TabsTrigger>
          <TabsTrigger asChild value="missing">
            <Link href="/module/deans-office/disciplines/missing">{t('missing')}</Link>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value={active} className="mt-0 min-w-0">
        {children}
      </TabsContent>
    </Tabs>
  );
}
