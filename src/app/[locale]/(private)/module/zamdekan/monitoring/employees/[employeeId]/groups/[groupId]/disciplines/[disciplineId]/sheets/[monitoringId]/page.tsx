import { getTranslations } from 'next-intl/server';

import { getZamdekanReport } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanReportTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-report-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { ZamdekanQuery } from '@/app/[locale]/(private)/module/zamdekan/types';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { Heading2, Heading3 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

const INTL_NAMESPACE = 'private.zamdekan';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: string; employeeId: string; groupId: string; disciplineId: string; monitoringId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.sheet') };
}

export default async function EmployeeSheetPage({ params }: Props) {
  const {
    employeeId: employeeIdParam,
    groupId: groupIdParam,
    disciplineId: disciplineIdParam,
    monitoringId: monitoringIdParam,
  } = await params;
  const employeeId = parseReportId(employeeIdParam);
  const groupId = parseReportId(groupIdParam);
  const disciplineId = parseReportId(disciplineIdParam);
  const monitoringId = parseReportId(monitoringIdParam);
  const query: ZamdekanQuery = { view: 'sheet', employeeId, groupId, disciplineId, monitoringId };
  const [report, t] = await Promise.all([getZamdekanReport(query), getTranslations(INTL_NAMESPACE)]);

  return (
    <SubLayout
      pageTitle={t('views.sheet')}
      breadcrumbs={[
        [getZamdekanReportPath({ view: 'groups' }), t('title')],
        [getZamdekanReportPath({ view: 'employees' }), t('views.employees')],
        [getZamdekanReportPath({ view: 'employee-load', employeeId }), t('views.employee-load')],
        [getZamdekanReportPath({ view: 'sheets', employeeId, groupId, disciplineId }), t('views.sheets')],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring" monitoringView="employees">
          <Heading3>{t('views.sheet')}</Heading3>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="small">
              <Link href={getZamdekanReportPath({ view: 'sheets', employeeId, groupId, disciplineId })}>
                {t('back')}
              </Link>
            </Button>
          </div>
          <ZamdekanReportTable key={getZamdekanReportPath(query)} report={report} query={query} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
