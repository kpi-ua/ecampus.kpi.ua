import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

import { ZamdekanView } from '@/app/[locale]/(private)/module/zamdekan/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/routing';

import { ZamdekanSection } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';

interface Props {
  section: ZamdekanSection;
  children: ReactNode;
}

export const ZamdekanTabs = async ({ section, children }: Props) => {
  const t = await getTranslations('private.zamdekan');

  return (
    <Tabs value={section} activationMode="manual">
      <TabsList aria-label={t('title')}>
        <TabsTrigger value="groups" asChild>
          <Link href={getZamdekanReportPath({ view: ZamdekanView.Groups })}>{t('sections.groups')}</Link>
        </TabsTrigger>
        <TabsTrigger value="monitoring" asChild>
          <Link href={getZamdekanReportPath({ view: ZamdekanView.MonitoringGroups })}>{t('sections.monitoring')}</Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value={section} className="mt-8">
        <div className="flex flex-col gap-8">{children}</div>
      </TabsContent>
    </Tabs>
  );
};
