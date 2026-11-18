import { getTranslations } from 'next-intl/server';

import { getDeputyDeanStudentResults } from '@/actions/deputy-dean.actions';
import { DeputyDeanResultsTable } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-results-table';
import { DeputyDeanTabs } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-tabs';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { parseReportId } from '@/app/[locale]/(private)/module/deputy-dean/utils/parse-report-id';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';

const INTL_NAMESPACE = 'private.deputy-dean';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: string; groupId: string; studentId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.results') };
}

export default async function StudentResultsPage({ params }: Props) {
  const { groupId: groupIdParam, studentId: studentIdParam } = await params;
  const groupId = parseReportId(groupIdParam);
  const studentId = parseReportId(studentIdParam);
  const [items, t] = await Promise.all([
    getDeputyDeanStudentResults(studentId, groupId),
    getTranslations(INTL_NAMESPACE),
  ]);

  return (
    <SubLayout
      pageTitle={t('views.results')}
      breadcrumbs={[[getDeputyDeanReportPath({ view: DeputyDeanView.Groups }), t('title')]]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <DeputyDeanTabs section="groups">
          <Heading3>{t('views.results')}</Heading3>
          <DeputyDeanResultsTable key={studentId} results={items} />
        </DeputyDeanTabs>
      </div>
    </SubLayout>
  );
}
