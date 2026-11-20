'use client';

import { useTranslations } from 'next-intl';
import { useSelectedLayoutSegment } from 'next/navigation';
import { ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from '@/i18n/routing';

const sections = ['employees', 'students', 'responsibilities'] as const;

export function DeanTabs({ children }: { children: ReactNode }) {
  const t = useTranslations('private.dean');
  const router = useRouter();
  const section = useSelectedLayoutSegment();

  return (
    <Tabs
      value={section ?? ''}
      activationMode="manual"
      onValueChange={(value) => router.push(`/module/dean/${value}`)}
    >
      <Card className="overflow-x-auto rounded-b-none px-6 pt-6 shadow-none">
        <TabsList className="bg-white" size="small" aria-label={t('title')}>
          {sections.map((item) => (
            <TabsTrigger key={item} value={item}>
              {t(item)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Card>
      <TabsContent value={section ?? ''} className="mt-0">
        {children}
      </TabsContent>
    </Tabs>
  );
}
