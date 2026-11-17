import { getTranslations } from 'next-intl/server';

import { getZamdekanSheetMarks } from '@/actions/zamdekan.actions';
import { ZamdekanTableCard } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-table-card';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { ZamdekanView } from '@/app/[locale]/(private)/module/zamdekan/constants';
import { groupSheetMarks } from '@/app/[locale]/(private)/module/zamdekan/utils/group-sheet-marks';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3, Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { formatDate } from '@/lib/utils';
const INTL_NAMESPACE = 'private.zamdekan';
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
  const departmentId = parseReportId(route.departmentId);
  const groupId = parseReportId(route.groupId);
  const disciplineId = parseReportId(route.disciplineId);
  const monitoringId = parseReportId(route.monitoringId);
  const t = await getTranslations(INTL_NAMESPACE);
  const items = await getZamdekanSheetMarks(monitoringId);
  const { students, assessments } = groupSheetMarks(items);
  return (
    <SubLayout
      pageTitle={t('views.sheet')}
      breadcrumbs={[
        [getZamdekanReportPath({ view: ZamdekanView.Groups }), t('title')],
        [getZamdekanReportPath({ view: ZamdekanView.Sheets, departmentId, groupId, disciplineId }), t('views.sheets')],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring">
          <Heading3>{t('views.sheet')}</Heading3>
          <Show when={students.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
            <ZamdekanTableCard>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>{t('columns.student')}</TableHead>
                    {assessments.map((assessment) => (
                      <TableHead key={assessment.key}>
                        <Show when={!!assessment.date}>{assessment.date && formatDate(assessment.date)}</Show>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student.studentId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.student}</TableCell>
                      {assessments.map((assessment) => (
                        <TableCell key={assessment.key}>{student.marks[assessment.key] ?? ''}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ZamdekanTableCard>
          </Show>
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
