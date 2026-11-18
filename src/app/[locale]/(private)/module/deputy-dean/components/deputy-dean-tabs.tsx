import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/routing';

import { DeputyDeanSection } from '../types';
import { getDeputyDeanReportPath } from '../utils/report-path';

interface Props {
  section: DeputyDeanSection;
  children: ReactNode;
}

export const DeputyDeanTabs = async ({ section, children }: Props) => {
  const t = await getTranslations('private.deputy-dean');

  return (
    <Tabs value={section} activationMode="manual">
      <TabsList aria-label={t('title')}>
        <TabsTrigger value="groups" asChild>
          <Link href={getDeputyDeanReportPath({ view: DeputyDeanView.Groups })}>{t('sections.groups')}</Link>
        </TabsTrigger>
        <TabsTrigger value="monitoring" asChild>
          <Link href={getDeputyDeanReportPath({ view: DeputyDeanView.MonitoringGroups })}>{t('sections.monitoring')}</Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value={section} className="mt-8">
        <div className="flex flex-col gap-8">{children}</div>
      </TabsContent>
    </Tabs>
  );
};
