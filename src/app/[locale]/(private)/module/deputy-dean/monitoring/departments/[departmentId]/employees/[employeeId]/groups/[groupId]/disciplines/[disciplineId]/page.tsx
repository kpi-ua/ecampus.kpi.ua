import { getTranslations } from 'next-intl/server';

import { getDeputyDeanSheets } from '@/actions/deputy-dean.actions';
import { DeputyDeanEmployeeSheetsTable } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-employee-sheets-table';
import { DeputyDeanTabs } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-tabs';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { parseReportId } from '@/app/[locale]/(private)/module/deputy-dean/utils/parse-report-id';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';
const INTL_NAMESPACE = 'private.deputy-dean';
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
  const items = await getDeputyDeanSheets(groupId, disciplineId);
  return (
    <SubLayout
      pageTitle={t('navigation.lecturerSheets')}
      breadcrumbs={[
        [getDeputyDeanReportPath({ view: DeputyDeanView.Groups }), t('title')],
        [
          getDeputyDeanReportPath({ view: DeputyDeanView.EmployeeLoad, departmentId, employeeId }),
          t('views.employee-load'),
        ],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <DeputyDeanTabs section="monitoring">
          <Heading3>{t('navigation.lecturerSheets')}</Heading3>
          <DeputyDeanEmployeeSheetsTable sheets={items} departmentId={departmentId} employeeId={employeeId} />
        </DeputyDeanTabs>
      </div>
    </SubLayout>
  );
}
