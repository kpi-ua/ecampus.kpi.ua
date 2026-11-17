import { getTranslations } from 'next-intl/server';

import { getZamdekanSheets } from '@/actions/zamdekan.actions';
import { ZamdekanEmployeeSheetsTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-employee-sheets-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';
const INTL_NAMESPACE = 'private.zamdekan';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ locale: string; departmentId: string; employeeId: string; groupId: string; disciplineId: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('navigation.lecturerSheets') };
}
export default async function MonitoringPage({ params }: Props) {
  const route = await params;
  const departmentId = parseReportId(route.departmentId);
  const employeeId = parseReportId(route.employeeId);
  const groupId = parseReportId(route.groupId);
  const disciplineId = parseReportId(route.disciplineId);
  const t = await getTranslations(INTL_NAMESPACE);
  const items = await getZamdekanSheets(groupId, disciplineId);
  return (
    <SubLayout
      pageTitle={t('navigation.lecturerSheets')}
      breadcrumbs={[
        [getZamdekanReportPath({ view: 'groups' }), t('title')],
        [getZamdekanReportPath({ view: 'employee-load', departmentId, employeeId }), t('views.employee-load')],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring">
          <Heading3>{t('navigation.lecturerSheets')}</Heading3>
          <ZamdekanEmployeeSheetsTable sheets={items} departmentId={departmentId} employeeId={employeeId} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
