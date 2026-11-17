import { getTranslations } from 'next-intl/server';
import qs from 'query-string';

import { getAttestationReport, getAttestationReportOptions } from '@/actions/attestation-results.actions';
import { ReportExportButton } from '@/app/[locale]/(private)/module/attestationresults/components/report-export-button';
import {
  ATTESTATION_RESULTS_PATH,
  AttestationReportView,
} from '@/app/[locale]/(private)/module/attestationresults/constants';
import { getAttestationReportQuery } from '@/app/[locale]/(private)/module/attestationresults/utils/report-query';
import { getAttestationReportTables } from '@/app/[locale]/(private)/module/attestationresults/utils/report-tables';
import { ATTESTATION_RESULT } from '@/app/[locale]/(private)/module/curatorlecturer/constants';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3, Paragraph } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';

const INTL_NAMESPACE = 'private.attestation-reports';
interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
export const generateMetadata = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
};

export default async function AttestationReportPage({ searchParams }: Props) {
  const t = await getTranslations(INTL_NAMESPACE);
  const options = await getAttestationReportOptions();
  const query = getAttestationReportQuery(await searchParams, options);
  const report = await getAttestationReport(query);
  const tables = getAttestationReportTables(report);
  const labels: Record<string, string> = {
    [ATTESTATION_RESULT.Attested]: t('result.a'),
    [ATTESTATION_RESULT.NotAttested]: t('result.na'),
    [ATTESTATION_RESULT.NotStudying]: t('result.nv'),
    [ATTESTATION_RESULT.Missing]: t('result.ov'),
  };
  return (
    <SubLayout
      pageTitle={t('title')}
      breadcrumbs={[
        [
          qs.stringifyUrl({
            url: `${ATTESTATION_RESULTS_PATH}/reports/${AttestationReportView.Groups}`,
            query: { ...query, groupId: undefined, course: undefined, studentId: undefined },
          }),
          t('title'),
        ],
      ]}
    >
      <Card className="col-span-full flex min-w-0 flex-col gap-6 p-6">
        <Heading2>{t('title')}</Heading2>
        <Paragraph>
          {options.years.find((year) => year.id === query.yearId)?.name} —{' '}
          {t(query.semester === 1 ? 'first-semester' : 'second-semester')} —{' '}
          {options.attestations.find((item) => item.id === query.attestationId)?.name}
        </Paragraph>
        <ReportExportButton query={query} />
        <Show when={tables.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
          {tables.map(({ group, students, columns, cells }) => (
            <section key={group.id} className="space-y-4">
              <Heading3>
                {group.name} — {t('course')} {group.course}
              </Heading3>
              <Show when={students.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('student')}</TableHead>
                      <TableHead>{t('group')}</TableHead>
                      <TableHead>{t('course')}</TableHead>
                      {columns.map((column) => (
                        <TableHead key={`${column.disciplineId}-${column.employeeId}`}>
                          {column.lecturer}
                          <br />
                          {column.discipline}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.studentId}>
                        <TableCell>{student.fullName}</TableCell>
                        <TableCell>{group.name}</TableCell>
                        <TableCell>{group.course}</TableCell>
                        {columns.map((column) => {
                          const result = cells.get(`${student.studentId}-${column.disciplineId}-${column.employeeId}`);
                          return (
                            <TableCell key={`${column.disciplineId}-${column.employeeId}`}>
                              {result ? (labels[result] ?? result) : t('missing')}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Show>
            </section>
          ))}
        </Show>
      </Card>
    </SubLayout>
  );
}
