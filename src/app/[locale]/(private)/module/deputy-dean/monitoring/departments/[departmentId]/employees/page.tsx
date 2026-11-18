import { getTranslations } from 'next-intl/server';

import { getDeputyDeanEmployees } from '@/actions/deputy-dean.actions';
import { DeputyDeanEmployeesTable } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-employees-table';
import { DeputyDeanTabs } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-tabs';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { parseReportId } from '@/app/[locale]/(private)/module/deputy-dean/utils/parse-report-id';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';
const INTL_NAMESPACE = 'private.deputy-dean';
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
  const items = await getDeputyDeanEmployees(departmentId);
  return (
    <SubLayout
      pageTitle={t('navigation.lecturers')}
      breadcrumbs={[[getDeputyDeanReportPath({ view: DeputyDeanView.Groups }), t('title')]]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <DeputyDeanTabs section="monitoring">
          <Heading3>{t('navigation.lecturers')}</Heading3>
          <DeputyDeanEmployeesTable employees={items} departmentId={departmentId} />
        </DeputyDeanTabs>
      </div>
    </SubLayout>
  );
}
