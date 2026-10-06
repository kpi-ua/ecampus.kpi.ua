import { getTranslations } from 'next-intl/server';

import { getZamdekanEmployeeActivity } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanEmployeeActivityTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-employee-activity-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { Heading2, Heading3 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

const INTL_NAMESPACE = 'private.zamdekan';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: string; employeeId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.activity') };
}

export default async function EmployeeActivityPage({ params }: Props) {
  const { employeeId: employeeIdParam } = await params;
  const employeeId = parseReportId(employeeIdParam);
  const [items, t] = await Promise.all([getZamdekanEmployeeActivity(employeeId), getTranslations(INTL_NAMESPACE)]);

  return (
    <SubLayout
      pageTitle={t('views.activity')}
      breadcrumbs={[
        [getZamdekanReportPath({ view: 'groups' }), t('title')],
        [getZamdekanReportPath({ view: 'employees' }), t('views.employees')],
        [getZamdekanReportPath({ view: 'employee-load', employeeId }), t('views.employee-load')],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring" monitoringView="employees">
          <Heading3>{t('views.activity')}</Heading3>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="small">
              <Link href={getZamdekanReportPath({ view: 'employee-load', employeeId })}>{t('back')}</Link>
            </Button>
          </div>
          <ZamdekanEmployeeActivityTable key={employeeId} activities={items} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
