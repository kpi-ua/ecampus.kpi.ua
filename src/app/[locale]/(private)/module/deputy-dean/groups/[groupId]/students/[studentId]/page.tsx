import { getTranslations } from 'next-intl/server';
import { type SearchParams } from 'nuqs/server';

import { getDeputyDeanStudentResults } from '@/actions/deputy-dean.actions';
import { DeputyDeanTabs } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-tabs';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { loadStudentResultsSearchParams } from '@/app/[locale]/(private)/module/deputy-dean/student-results-search-params';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/common';

import { DeputyDeanResultsTable } from './components/deputy-dean-results-table';

const INTL_NAMESPACE = 'private.deputy-dean';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: string; groupId: string; studentId: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.results') };
}

export default async function StudentResultsPage({ params, searchParams }: Props) {
  const query = await loadStudentResultsSearchParams(searchParams);
  const { groupId: groupIdParam, studentId: studentIdParam } = await params;
  const groupId = Number(groupIdParam);
  const studentId = Number(studentIdParam);
  const [results, t] = await Promise.all([
    getDeputyDeanStudentResults({
      studentId,
      groupId,
      page: query.page,
      pageSize: PAGE_SIZE_DEFAULT,
      sort: query.sort,
      descending: query.direction === 'desc',
    }),
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
          <DeputyDeanResultsTable results={results.items} />
          {results.totalCount > results.pageSize && (
            <PaginationWithLinks page={query.page} pageSize={results.pageSize} totalCount={results.totalCount} />
          )}
        </DeputyDeanTabs>
      </div>
    </SubLayout>
  );
}
