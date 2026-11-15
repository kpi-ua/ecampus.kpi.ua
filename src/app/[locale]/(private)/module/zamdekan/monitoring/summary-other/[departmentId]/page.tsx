import { getTranslations } from 'next-intl/server';

import { getZamdekanDepartmentSummary } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanDepartmentSelect } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-department-select';
import { ZamdekanSummaryTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-summary-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
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
  return { title: t('views.summary-other') };
}

export default async function OtherDepartmentSummaryPage({ params }: Props) {
  const { departmentId: departmentIdParam } = await params;
  const departmentId = parseReportId(departmentIdParam);
  const [report, departments, t] = await Promise.all([
    getZamdekanDepartmentSummary(departmentId),
    getZamdekanDepartmentSummary(),
    getTranslations(INTL_NAMESPACE),
  ]);

  return (
    <SubLayout
      pageTitle={t('views.summary-other')}
      breadcrumbs={[[getZamdekanReportPath({ view: 'groups' }), t('title')]]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring" monitoringView="summary-other">
          <Heading3>{t('views.summary-other')}</Heading3>
          <ZamdekanDepartmentSelect
            departments={departments.departments}
            departmentId={departmentId}
            view="summary-other"
          />
          <ZamdekanSummaryTable key={departmentId} summary={report} outwardOnly departmentId={departmentId} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
