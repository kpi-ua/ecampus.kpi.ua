import { getLocale, getTranslations } from 'next-intl/server';
import { createLoader, parseAsStringLiteral, type SearchParams } from 'nuqs/server';

import { getDnvrStudentCounts } from '@/actions/dnvr-reporting.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Paragraph } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { redirect } from '@/i18n/routing';

import { DnvrNavigation } from './components/dnvr-navigation';
import { StudentCountsTable } from './components/student-counts-table';
import { attestationPeriods, attestationReports, getAttestationPath } from './routes';

const loadView = createLoader({
  period: parseAsStringLiteral(attestationPeriods),
  report: parseAsStringLiteral(attestationReports),
});

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { report, ...query } = await searchParams;
  const selection = loadView({ period: query.period, report });
  if (selection.period || (selection.report && query.period !== 'all')) {
    return redirect({
      href: { pathname: getAttestationPath(selection.report), query: { ...query, period: selection.period ?? '1' } },
      locale: await getLocale(),
    });
  }

  const [modules, t, rows] = await Promise.all([
    getTranslations('global.modules'),
    getTranslations('private.dnvr-reporting'),
    getDnvrStudentCounts({}),
  ]);

  return (
    <SubLayout pageTitle={modules('hignyak')}>
      <Card className="col-span-full flex min-w-0 flex-col gap-4 p-4 sm:p-6">
        <DnvrNavigation activeTab="student-counts" />
        <Heading2>{t('studentCounts')}</Heading2>
        <Paragraph className="my-0 text-muted-foreground">{t('fullTimeStudents')}</Paragraph>
        <StudentCountsTable rows={rows} report={null} detail={false} />
      </Card>
    </SubLayout>
  );
}
