import { getTranslations } from 'next-intl/server';

import { getZamdekanEmployeeDisciplines, getZamdekanEmployeeActivity } from '@/actions/zamdekan.actions';
import { ZamdekanEmployeeActivityTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-employee-activity-table';
import { ZamdekanEmployeeDisciplinesTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-employee-disciplines-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';
const INTL_NAMESPACE = 'private.zamdekan';
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
  const departmentId = parseReportId(route.departmentId);
  const employeeId = parseReportId(route.employeeId);
  const t = await getTranslations(INTL_NAMESPACE);
  const [items, activity] = await Promise.all([
    getZamdekanEmployeeDisciplines(employeeId),
    getZamdekanEmployeeActivity(employeeId),
  ]);
  return (
    <SubLayout
      pageTitle={t('views.employee-load')}
      breadcrumbs={[
        [getZamdekanReportPath({ view: 'groups' }), t('title')],
        [getZamdekanReportPath({ view: 'department-employees', departmentId }), t('navigation.lecturers')],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring" monitoringView="employees">
          <Heading3>{t('views.employee-load')}</Heading3>
          <ZamdekanEmployeeDisciplinesTable disciplines={items} departmentId={departmentId} />
          <hr />
          <Heading3>{t('views.activity')}</Heading3>
          <ZamdekanEmployeeActivityTable activity={activity} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
