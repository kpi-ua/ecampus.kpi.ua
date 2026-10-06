import { getTranslations } from 'next-intl/server';

import { getZamdekanDepartmentStatistics, getZamdekanDepartmentSummary } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanDepartmentSelect } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-department-select';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { ZamdekanDepartmentStatisticsTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-department-statistics-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { Heading2, Heading3 } from '@/components/typography';
interface Props {
  params: Promise<{ locale: string; departmentId: string }>;
}

const INTL_NAMESPACE = 'private.zamdekan';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.statistics') };
}

export default async function DepartmentStatisticsPage({ params }: Props) {
  const { departmentId: departmentIdParam } = await params;
  const departmentId = parseReportId(departmentIdParam);
  const [items, summary, t] = await Promise.all([
    getZamdekanDepartmentStatistics(departmentId),
    getZamdekanDepartmentSummary(),
    getTranslations(INTL_NAMESPACE),
  ]);

  return (
    <SubLayout
      pageTitle={t('views.statistics')}
      breadcrumbs={[[getZamdekanReportPath({ view: 'groups' }), t('title')]]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring" monitoringView="statistics">
          <Heading3>{t('views.statistics')}</Heading3>
          <ZamdekanDepartmentSelect departments={summary.departments} departmentId={departmentId} />
          <ZamdekanDepartmentStatisticsTable key={departmentId} statistics={items} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
