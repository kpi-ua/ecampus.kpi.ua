import { getTranslations } from 'next-intl/server';

import { getDeputyDeanMonitoringGroups } from '@/actions/deputy-dean.actions';
import { DeputyDeanMonitoringGroupsTable } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-monitoring-groups-table';
import { DeputyDeanTabs } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-tabs';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';
const INTL_NAMESPACE = 'private.deputy-dean';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ locale: string; departmentId: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('navigation.groups') };
}
export default async function MonitoringPage({ params }: Props) {
  const route = await params;
  const departmentId = Number(route.departmentId);
  const t = await getTranslations(INTL_NAMESPACE);
  const items = await getDeputyDeanMonitoringGroups(departmentId);
  return (
    <SubLayout
      pageTitle={t('navigation.groups')}
      breadcrumbs={[[getDeputyDeanReportPath({ view: DeputyDeanView.Groups }), t('title')]]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <DeputyDeanTabs section="monitoring">
          <Heading3>{t('navigation.groups')}</Heading3>
          <DeputyDeanMonitoringGroupsTable groups={items} departmentId={departmentId} />
        </DeputyDeanTabs>
      </div>
    </SubLayout>
  );
}
