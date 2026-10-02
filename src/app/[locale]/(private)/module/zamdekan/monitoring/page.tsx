import { getTranslations } from 'next-intl/server';

import { getZamdekanReport } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanReportTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-report-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { ZamdekanQuery } from '@/app/[locale]/(private)/module/zamdekan/types';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { Heading2, Heading3 } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'private.zamdekan';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.monitoring-groups') };
}

export default async function MonitoringGroupsPage() {
  const query: ZamdekanQuery = { view: 'monitoring-groups' };
  const [report, t] = await Promise.all([getZamdekanReport(query), getTranslations(INTL_NAMESPACE)]);

  return (
    <SubLayout
      pageTitle={t('views.monitoring-groups')}
      breadcrumbs={[[getZamdekanReportPath({ view: 'groups' }), t('title')]]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring" monitoringView="monitoring-groups">
          <Heading3>{t('views.monitoring-groups')}</Heading3>
          <ZamdekanReportTable key={getZamdekanReportPath(query)} report={report} query={query} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
