import { getTranslations } from 'next-intl/server';

import { getDeputyDeanSheetMarks } from '@/actions/deputy-dean.actions';
import { DeputyDeanEmployeeSheetMarksTable } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-employee-sheet-marks-table';
import { DeputyDeanTabs } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-tabs';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';
const INTL_NAMESPACE = 'private.deputy-dean';
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
  const departmentId = Number(route.departmentId);
  const employeeId = Number(route.employeeId);
  const groupId = Number(route.groupId);
  const disciplineId = Number(route.disciplineId);
  const monitoringId = Number(route.monitoringId);
  const t = await getTranslations(INTL_NAMESPACE);
  const items = await getDeputyDeanSheetMarks(monitoringId);
  return (
    <SubLayout
      pageTitle={t('views.sheet')}
      breadcrumbs={[
        [getDeputyDeanReportPath({ view: DeputyDeanView.Groups }), t('title')],
        [
          getDeputyDeanReportPath({ view: DeputyDeanView.Sheets, departmentId, groupId, disciplineId, employeeId }),
          t('views.sheets'),
        ],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <DeputyDeanTabs section="monitoring">
          <Heading3>{t('views.sheet')}</Heading3>
          <DeputyDeanEmployeeSheetMarksTable marks={items} />
        </DeputyDeanTabs>
      </div>
    </SubLayout>
  );
}
