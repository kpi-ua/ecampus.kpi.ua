'use client';

import { useTranslations } from 'next-intl';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useQueryState } from 'nuqs';
import queryString from 'query-string';
import { type ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from '@/i18n/routing';

import { departmentSearchParams } from '../../../search-params';

const paths = {
  staffDirectory: '/module/zdekan/employees',
  lecturerSurveys: '/module/zdekan/employees/lecturer-surveys',
  contacts: '/module/zdekan/employees/contacts',
} as const;
const views = Object.keys(paths) as (keyof typeof paths)[];

export function EmployeeTabs({ children }: { children: ReactNode }) {
  const t = useTranslations('private.dean-office');
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
  const active = segment === 'lecturer-surveys' ? 'lecturerSurveys' : (segment ?? 'staffDirectory');
  const [departmentId] = useQueryState('departmentId', departmentSearchParams.departmentId);
  return (
    <Tabs
      value={active}
      activationMode="manual"
      onValueChange={(view) =>
        router.push(
          queryString.stringifyUrl(
            { url: paths[view as keyof typeof paths], query: { departmentId } },
            { skipNull: true },
          ),
        )
      }
    >
      <Card className="overflow-x-auto rounded-none px-6 pt-4 shadow-none">
        <TabsList size="small" className="bg-white" aria-label={t('employees')}>
          {views.map((view) => (
            <TabsTrigger key={view} value={view}>
              {t(view)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Card>
      <TabsContent value={active} className="mt-0">
        {children}
      </TabsContent>
    </Tabs>
  );
}
