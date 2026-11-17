import { getTranslations } from 'next-intl/server';

import { getZamdekanDepartmentSummary } from '@/actions/zamdekan.actions';
import { ZamdekanTableCard } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-table-card';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { ZamdekanView } from '@/app/[locale]/(private)/module/zamdekan/constants';
import { ZamdekanCourseIndicators, ZamdekanDepartmentSummary } from '@/app/[locale]/(private)/module/zamdekan/types';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3, Heading4, Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
const INTL_NAMESPACE = 'private.zamdekan';
export const dynamic = 'force-dynamic';

const metrics = ['groupCount', 'moduleCount', 'sheetCount', 'filledSheetCount'] as const;
const courses = [
  { educationLevel: 'bachelor', count: 4 },
  { educationLevel: 'master', count: 2 },
  { educationLevel: 'phd', count: 2 },
] as const;

interface Props {
  params: Promise<{ locale: string; departmentId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.summary') };
}

export default async function MonitoringPage({ params }: Props) {
  const route = await params;
  const departmentId = parseReportId(route.departmentId);
  const t = await getTranslations(INTL_NAMESPACE);
  const report = await getZamdekanDepartmentSummary(departmentId);
  const departments = report.departments.filter((department) => department.departmentId === departmentId);

  const renderIndicators = (
    indicators: ZamdekanCourseIndicators[],
    title: string,
    department: ZamdekanDepartmentSummary['departments'][number],
  ) => (
    <div className="space-y-4">
      <Heading4>{title}</Heading4>
      <ZamdekanTableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2}>{t('columns.faculty')}</TableHead>
              <TableHead rowSpan={2}>{t('columns.department')}</TableHead>
              <TableHead rowSpan={2}>{t('summary.indicator')}</TableHead>
              {courses.map((level) => (
                <TableHead key={level.educationLevel} colSpan={level.count}>
                  {t(`summary.${level.educationLevel}`)}
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              {courses.flatMap((level) =>
                Array.from({ length: level.count }, (_, index) => (
                  <TableHead key={`${level.educationLevel}-${index}`}>{index + 1}</TableHead>
                )),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric}>
                <TableCell>{department.faculty}</TableCell>
                <TableCell>{department.department}</TableCell>
                <TableCell>{t(`summary.${metric}`)}</TableCell>
                {courses.flatMap((level) =>
                  Array.from({ length: level.count }, (_, index) => (
                    <TableCell key={`${level.educationLevel}-${index}`} className="text-start tabular-nums">
                      {indicators.find(
                        (item) => item.educationLevel === level.educationLevel && item.course === index + 1,
                      )?.[metric] ?? 0}
                    </TableCell>
                  )),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ZamdekanTableCard>
    </div>
  );

  return (
    <SubLayout
      pageTitle={t('views.summary')}
      breadcrumbs={[[getZamdekanReportPath({ view: ZamdekanView.Groups }), t('title')]]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring">
          <Heading3>{t('views.summary')}</Heading3>
          <Show
            when={departments.length > 0}
            fallback={<Paragraph className="py-12 text-center text-sm text-muted-foreground">{t('empty')}</Paragraph>}
          >
            <div className="space-y-10">
              {departments.map((department) => (
                <section key={department.departmentId} className="space-y-8">
                  <Heading3>
                    {department.faculty} — {department.department}
                  </Heading3>
                  {renderIndicators(department.curriculum, t('summary.curriculum'), department)}
                  {renderIndicators(department.outwardTeaching, t('summary.outwardTeaching'), department)}
                </section>
              ))}
            </div>
          </Show>
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
