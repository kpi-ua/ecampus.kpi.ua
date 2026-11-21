import { getTranslations } from 'next-intl/server';
import { createLoader, parseAsInteger, parseAsStringLiteral, type SearchParams } from 'nuqs/server';

import { getDnvrStudentCounts } from '@/actions/dnvr-reporting.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Paragraph } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { DnvrAttestationReport } from '@/types/models/dnvr-reporting';

import { StudentCountsTable } from './components/student-counts-table';

const periods = ['1', '2', '3'] as const;
const reports = Object.values(DnvrAttestationReport);
const loadSearchParams = createLoader({
  period: parseAsStringLiteral(periods),
  report: parseAsStringLiteral(reports),
  facultyId: parseAsInteger,
  educationLevelId: parseAsInteger,
  course: parseAsInteger,
});

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { period, report, facultyId, educationLevelId, course } = await loadSearchParams(searchParams);
  const detail = Boolean(facultyId && educationLevelId && course);
  const selectedPeriod = period ?? '1';
  const [modules, t, rows] = await Promise.all([
    getTranslations('global.modules'),
    getTranslations('private.dnvr-reporting'),
    getDnvrStudentCounts({
      period: period || report ? Number(selectedPeriod) : undefined,
      report: report ?? undefined,
      facultyId: detail ? (facultyId ?? undefined) : undefined,
      educationLevelId: detail ? (educationLevelId ?? undefined) : undefined,
      course: detail ? (course ?? undefined) : undefined,
    }),
  ]);

  return (
    <SubLayout pageTitle={modules('hignyak')}>
      <Card className="col-span-full flex min-w-0 flex-col gap-4 p-4 sm:p-6">
        <Heading2>{t(report ?? (period ? 'participation' : 'studentCounts'))}</Heading2>
        <Link className="underline" href="/module/hignyak/current-control">
          {t('currentControl')}
        </Link>
        <nav className="flex flex-wrap gap-4">
          <Link
            href="/module/hignyak"
            className="aria-[current=page]:underline"
            aria-current={period || report ? undefined : 'page'}
          >
            {t('studentCounts')}
          </Link>
          {periods.map((value) => (
            <Link
              key={value}
              href={{ pathname: '/module/hignyak', query: { period: value, ...(report ? { report } : {}) } }}
              className="aria-[current=page]:underline"
              aria-current={selectedPeriod === value && (period || report) ? 'page' : undefined}
            >
              {value === '3' ? t('combined') : t('period', { number: value })}
            </Link>
          ))}
        </nav>
        <nav className="flex flex-wrap gap-4">
          {reports.map((value) => (
            <Link
              key={value}
              href={{ pathname: '/module/hignyak', query: { report: value, period: selectedPeriod } }}
              className="aria-[current=page]:underline"
              aria-current={report === value ? 'page' : undefined}
            >
              {t(value)}
            </Link>
          ))}
        </nav>
        {!period && !report && <Paragraph className="my-0 text-muted-foreground">{t('fullTimeStudents')}</Paragraph>}
        <StudentCountsTable rows={rows} report={report} period={selectedPeriod} detail={detail} />
      </Card>
    </SubLayout>
  );
}
