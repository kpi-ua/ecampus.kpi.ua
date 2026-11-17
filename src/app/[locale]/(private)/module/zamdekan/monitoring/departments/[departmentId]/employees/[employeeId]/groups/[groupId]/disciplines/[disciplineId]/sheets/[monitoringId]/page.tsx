import { getTranslations } from 'next-intl/server';

import { getZamdekanSheetMarks } from '@/actions/zamdekan.actions';
import { ZamdekanEmployeeSheetMarksTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-employee-sheet-marks-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';
const INTL_NAMESPACE = 'private.zamdekan';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{
    locale: string;
    departmentId: string;
    employeeId: string;
    groupId: string;
    disciplineId: string;
    monitoringId: string;
  }>;
}
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.sheet') };
}
export default async function MonitoringPage({ params }: Props) {
  const route = await params;
  const departmentId = parseReportId(route.departmentId);
  const employeeId = parseReportId(route.employeeId);
  const groupId = parseReportId(route.groupId);
  const disciplineId = parseReportId(route.disciplineId);
  const monitoringId = parseReportId(route.monitoringId);
  const t = await getTranslations(INTL_NAMESPACE);
  const items = await getZamdekanSheetMarks(monitoringId);
  return (
    <SubLayout
      pageTitle={t('views.sheet')}
      breadcrumbs={[
        [getZamdekanReportPath({ view: 'groups' }), t('title')],
        [getZamdekanReportPath({ view: 'sheets', departmentId, groupId, disciplineId, employeeId }), t('views.sheets')],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring" monitoringView="employees">
          <Heading3>{t('views.sheet')}</Heading3>
          <ZamdekanEmployeeSheetMarksTable marks={items} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
