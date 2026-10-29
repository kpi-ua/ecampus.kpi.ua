import { getTranslations } from 'next-intl/server';

import { getSurveyParticipation } from '@/actions/statistics.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2 } from '@/components/typography';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/common';
import { LocaleProps } from '@/types/locale-props';

import { SurveyParticipationTable } from './components/survey-participation-table';

const INTL_NAMESPACE = 'private.yiystat';

interface Props extends LocaleProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function StatisticsPage({ searchParams }: Props) {
  const t = await getTranslations(INTL_NAMESPACE);
  const [surveys, { page: requestedPage }] = await Promise.all([getSurveyParticipation(), searchParams]);
  const pageNumber = typeof requestedPage === 'string' ? Number(requestedPage) : 1;
  const pageCount = Math.max(1, Math.ceil(surveys.length / PAGE_SIZE_DEFAULT));
  const page = Number.isSafeInteger(pageNumber) && pageNumber > 0 ? Math.min(pageNumber, pageCount) : 1;
  const items = surveys.slice((page - 1) * PAGE_SIZE_DEFAULT, page * PAGE_SIZE_DEFAULT);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 flex min-w-0 flex-col gap-6">
        <Heading2>{t('surveys.title')}</Heading2>
        <SurveyParticipationTable items={items} page={page} totalCount={surveys.length} />
      </div>
    </SubLayout>
  );
}
