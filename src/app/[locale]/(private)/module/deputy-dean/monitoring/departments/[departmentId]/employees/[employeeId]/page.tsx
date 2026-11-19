import { getTranslations } from 'next-intl/server';

import { getDeputyDeanEmployeeDisciplines, getDeputyDeanEmployeeActivity } from '@/actions/deputy-dean.actions';
import { DeputyDeanTabs } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-tabs';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';

import { DeputyDeanEmployeeActivityTable } from './components/deputy-dean-employee-activity-table';
import { DeputyDeanEmployeeDisciplinesTable } from './components/deputy-dean-employee-disciplines-table';
const INTL_NAMESPACE = 'private.deputy-dean';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ locale: string; departmentId: string; employeeId: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.employee-load') };
}
export default async function MonitoringPage({ params }: Props) {
  const route = await params;
  const departmentId = Number(route.departmentId);
  const employeeId = Number(route.employeeId);
  const t = await getTranslations(INTL_NAMESPACE);
  const [items, activity] = await Promise.all([
    getDeputyDeanEmployeeDisciplines(employeeId),
    getDeputyDeanEmployeeActivity(employeeId),
  ]);
  return (
    <SubLayout
      pageTitle={t('views.employee-load')}
      breadcrumbs={[
        [getDeputyDeanReportPath({ view: DeputyDeanView.Groups }), t('title')],
        [
          getDeputyDeanReportPath({ view: DeputyDeanView.DepartmentEmployees, departmentId }),
          t('navigation.lecturers'),
        ],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <DeputyDeanTabs section="monitoring">
          <Heading3>{t('views.employee-load')}</Heading3>
          <DeputyDeanEmployeeDisciplinesTable disciplines={items} departmentId={departmentId} />
          <hr />
          <Heading3>{t('views.activity')}</Heading3>
          <DeputyDeanEmployeeActivityTable activity={activity} />
        </DeputyDeanTabs>
      </div>
    </SubLayout>
  );
}
