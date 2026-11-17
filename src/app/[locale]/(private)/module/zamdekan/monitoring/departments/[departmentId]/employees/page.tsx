import { getTranslations } from 'next-intl/server';

import { getZamdekanEmployees } from '@/actions/zamdekan.actions';
import { ZamdekanEmployeesTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-employees-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';
const INTL_NAMESPACE = 'private.zamdekan';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ locale: string; departmentId: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('navigation.lecturers') };
}
export default async function MonitoringPage({ params }: Props) {
  const route = await params;
  const departmentId = parseReportId(route.departmentId);
  const t = await getTranslations(INTL_NAMESPACE);
  const items = await getZamdekanEmployees(departmentId);
  return (
    <SubLayout
      pageTitle={t('navigation.lecturers')}
      breadcrumbs={[[getZamdekanReportPath({ view: 'groups' }), t('title')]]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring" monitoringView="employees">
          <Heading3>{t('navigation.lecturers')}</Heading3>
          <ZamdekanEmployeesTable employees={items} departmentId={departmentId} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
