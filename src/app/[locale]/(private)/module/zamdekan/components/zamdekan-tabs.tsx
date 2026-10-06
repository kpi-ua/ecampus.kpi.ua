'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/routing';

import { MONITORING_VIEWS } from '../constants';
import { ZamdekanMonitoringView, ZamdekanSection } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';

interface Props {
  section: ZamdekanSection;
  monitoringView?: ZamdekanMonitoringView;
  children: ReactNode;
}

export const ZamdekanTabs = ({ section, monitoringView = 'monitoring-groups', children }: Props) => {
  const t = useTranslations('private.zamdekan');

  return (
    <Tabs value={section} activationMode="manual">
      <TabsList aria-label={t('title')}>
        <TabsTrigger value="groups" asChild>
          <Link href={getZamdekanReportPath({ view: 'groups' })}>{t('sections.groups')}</Link>
        </TabsTrigger>
        <TabsTrigger value="agreements" asChild>
          <Link href={getZamdekanReportPath({ view: 'agreements' })}>{t('sections.agreements')}</Link>
        </TabsTrigger>
        <TabsTrigger value="monitoring" asChild>
          <Link href={getZamdekanReportPath({ view: 'monitoring-groups' })}>{t('sections.monitoring')}</Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value={section} className="mt-6 space-y-6">
        {section === 'monitoring' ? (
          <Tabs value={monitoringView} activationMode="manual">
            <div className="overflow-x-auto">
              <TabsList aria-label={t('sections.monitoring')}>
                {MONITORING_VIEWS.map((view) => (
                  <TabsTrigger key={view} value={view} asChild>
                    <Link href={getZamdekanReportPath({ view })}>{t(`views.${view}`)}</Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value={monitoringView} className="mt-6 space-y-6">
              {children}
            </TabsContent>
          </Tabs>
        ) : (
          children
        )}
      </TabsContent>
    </Tabs>
  );
};
