import { getTranslations } from 'next-intl/server';

import { getDeputyDeanDepartments } from '@/actions/deputy-dean.actions';
import { DeputyDeanTableCard } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-table-card';
import { DeputyDeanTabs } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-tabs';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3, Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { Link } from '@/i18n/routing';

const INTL_NAMESPACE = 'private.deputy-dean';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ locale: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('navigation.departments') };
}
export default async function MonitoringPage() {
  const t = await getTranslations(INTL_NAMESPACE);
  const departments = await getDeputyDeanDepartments();
  return (
    <SubLayout
      pageTitle={t('navigation.departments')}
      breadcrumbs={[[getDeputyDeanReportPath({ view: DeputyDeanView.Groups }), t('title')]]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <DeputyDeanTabs section="monitoring">
          <nav aria-label={t('sections.monitoring')} className="flex flex-wrap gap-4">
            <Link className="underline" href={getDeputyDeanReportPath({ view: DeputyDeanView.Employees })}>
              {t('views.employees')}
            </Link>
            <Link className="underline" href={getDeputyDeanReportPath({ view: DeputyDeanView.Summary })}>
              {t('views.summary')}
            </Link>
          </nav>
          <Heading3>{t('navigation.departments')}</Heading3>
          <Show when={departments.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
            <DeputyDeanTableCard>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('columns.facultyShort')}</TableHead>
                    <TableHead>{t('navigation.departmentGroups')}</TableHead>
                    <TableHead>{t('navigation.curriculumStatistics')}</TableHead>
                    <TableHead>{t('navigation.outwardStatistics')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>{department.faculty}</TableCell>
                      <TableCell>
                        <Link
                          className="underline"
                          href={getDeputyDeanReportPath({
                            view: DeputyDeanView.DepartmentGroups,
                            departmentId: department.id,
                          })}
                        >
                          {department.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          className="underline"
                          href={getDeputyDeanReportPath({ view: DeputyDeanView.Statistics, departmentId: department.id })}
                        >
                          {t('navigation.open')}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          className="underline"
                          href={getDeputyDeanReportPath({
                            view: DeputyDeanView.OutwardStatistics,
                            departmentId: department.id,
                          })}
                        >
                          {t('navigation.open')}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DeputyDeanTableCard>
          </Show>
        </DeputyDeanTabs>
      </div>
    </SubLayout>
  );
}
