import { getTranslations } from 'next-intl/server';

import { getDeputyDeanSheetMarks } from '@/actions/deputy-dean.actions';
import { DeputyDeanTableCard } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-table-card';
import { DeputyDeanTabs } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-tabs';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { groupSheetMarks } from '@/app/[locale]/(private)/module/deputy-dean/utils/group-sheet-marks';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3, Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { formatDate } from '@/lib/utils';
const INTL_NAMESPACE = 'private.deputy-dean';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{
    locale: string;
    departmentId: string;
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
  const groupId = Number(route.groupId);
  const disciplineId = Number(route.disciplineId);
  const monitoringId = Number(route.monitoringId);
  const t = await getTranslations(INTL_NAMESPACE);
  const items = await getDeputyDeanSheetMarks(monitoringId);
  const { students, assessments } = groupSheetMarks(items);
  return (
    <SubLayout
      pageTitle={t('views.sheet')}
      breadcrumbs={[
        [getDeputyDeanReportPath({ view: DeputyDeanView.Groups }), t('title')],
        [
          getDeputyDeanReportPath({ view: DeputyDeanView.Sheets, departmentId, groupId, disciplineId }),
          t('views.sheets'),
        ],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <DeputyDeanTabs section="monitoring">
          <Heading3>{t('views.sheet')}</Heading3>
          <Show when={students.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
            <DeputyDeanTableCard>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('columns.student')}</TableHead>
                    {assessments.map((assessment) => (
                      <TableHead key={assessment.key}>
                        <Show when={!!assessment.date}>{assessment.date && formatDate(assessment.date)}</Show>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell>{student.student}</TableCell>
                      {assessments.map((assessment) => (
                        <TableCell key={assessment.key}>{student.marks[assessment.key] ?? ''}</TableCell>
                      ))}
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
