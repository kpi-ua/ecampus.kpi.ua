import { getTranslations } from 'next-intl/server';

import { AttestationReport } from '@/app/[locale]/(private)/module/attestationresults/types';
import { getAttestationReportTables } from '@/app/[locale]/(private)/module/attestationresults/utils/report-tables';
import { ATTESTATION_RESULT } from '@/app/[locale]/(private)/module/curatorlecturer/constants';
import { campusFetch } from '@/lib/client';
import { createCsvResponse } from '@/lib/csv-response';
import { formatDate } from '@/lib/utils';

export async function GET(request: Request) {
  const query = loadAttestationReportSearchParams(new URL(request.url).searchParams);
  const response = await campusFetch<AttestationReport>(
    serializeAttestationReportSearchParams('/attestation-results/report', query),
  );
  if (!response.ok) {
    return new Response(null, { status: response.status });
  }
  const report = await response.json();
  const t = await getTranslations('private.attestation-reports');
  const labels: Record<string, string> = {
    [ATTESTATION_RESULT.Attested]: t('result.a'),
    [ATTESTATION_RESULT.NotAttested]: t('result.na'),
    [ATTESTATION_RESULT.NotStudying]: t('result.nv'),
    [ATTESTATION_RESULT.Missing]: t('result.ov'),
  };
  const rows = getAttestationReportTables(report).flatMap(({ group, students, columns, cells }) => [
    [group.name, t('course'), group.course],
    [t('student'), t('group'), t('course'), ...columns.map((column) => `${column.lecturer}\n${column.discipline}`)],
    ...students.map((student) => [
      student.fullName,
      group.name,
      group.course,
      ...columns.map((column) => {
        const result = cells.get(`${student.studentId}-${column.disciplineId}-${column.employeeId}`);
        return result ? (labels[result] ?? result) : t('missing');
      }),
    ]),
    [],
  ]);
  return createCsvResponse(
    rows,
    `attestation-results-${query.yearId}-${query.semester}-${query.attestationId}-${formatDate(new Date())}.csv`,
  );
}
import {
  loadAttestationReportSearchParams,
  serializeAttestationReportSearchParams,
} from '@/app/[locale]/(private)/module/attestationresults/search-params';
