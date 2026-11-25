import { getTranslations } from 'next-intl/server';
import { createLoader, parseAsInteger, type SearchParams } from 'nuqs/server';

import { getDnvrStudentCounts } from '@/actions/dnvr-reporting.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2 } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { type DnvrAttestationReport } from '@/types/models/dnvr-reporting';

import { type AttestationPeriod, attestationReports, getAttestationPath } from '../routes';
import { AttestationPeriodFilter } from './attestation-period-filter';
import { DnvrNavigation } from './dnvr-navigation';
import { DnvrTabs } from './dnvr-tabs';
import { StudentCountsTable } from './student-counts-table';
const loadSearchParams = createLoader({
  facultyId: parseAsInteger,
  educationLevelId: parseAsInteger,
  course: parseAsInteger,
});

export async function AttestationView({
  period,
  report,
  searchParams,
}: {
  period: AttestationPeriod | null;
  report?: DnvrAttestationReport;
  searchParams: SearchParams;
}) {
  const { facultyId, educationLevelId, course } = loadSearchParams(searchParams);
  const detail = Boolean(facultyId && educationLevelId && course);
  const [modules, t, rows] = await Promise.all([
    getTranslations('global.modules'),
    getTranslations('private.dnvr-reporting'),
    period
      ? getDnvrStudentCounts({
          period: Number(period),
          report: report ?? undefined,
          facultyId: detail ? (facultyId ?? undefined) : undefined,
          educationLevelId: detail ? (educationLevelId ?? undefined) : undefined,
          course: detail ? (course ?? undefined) : undefined,
        })
      : [],
  ]);

  return (
    <SubLayout pageTitle={modules('hignyak')}>
      <Card className="col-span-full flex min-w-0 flex-col gap-4 p-4 sm:p-6">
        <DnvrNavigation activeTab="attestation" />
        <Heading2>{t(report ?? (period ? 'participation' : 'attestationReports'))}</Heading2>
        <AttestationPeriodFilter period={period} report={report} />
        {period && (
          <DnvrTabs
            activeTab={report ?? ''}
            tabs={attestationReports.map((value) => ({
              value,
              label: t(value),
              href: { pathname: getAttestationPath(value), query: { period } },
            }))}
          />
        )}
        {period && <StudentCountsTable rows={rows} report={report ?? null} period={period} detail={detail} />}
      </Card>
    </SubLayout>
  );
}
