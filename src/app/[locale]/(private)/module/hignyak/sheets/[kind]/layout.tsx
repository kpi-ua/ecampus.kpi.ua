import { getTranslations } from 'next-intl/server';
import { type ReactNode } from 'react';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Card } from '@/components/ui/card';
import { dnvrSheetKinds } from '@/types/models/dnvr-sheets';

import { DnvrNavigation } from '../../components/dnvr-navigation';
import { DnvrTabs } from '../../components/dnvr-tabs';
import { getDnvrSheetsPath, getSheetKind } from '../sheet-routes';

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ kind: string }> }) {
  const kind = getSheetKind((await params).kind);
  const t = await getTranslations('private.dnvr-reporting');

  return (
    <SubLayout pageTitle={t('sheets')}>
      <Card className="col-span-full flex min-w-0 flex-col gap-4 p-4 sm:p-6">
        <DnvrNavigation activeTab="sheets" />
        <DnvrTabs
          activeTab={kind}
          tabs={dnvrSheetKinds.map((value) => ({
            value,
            label: t(value === 'exam' ? 'examSheets' : 'practiceSheets'),
            href: getDnvrSheetsPath(value),
          }))}
        />
        {children}
      </Card>
    </SubLayout>
  );
}
