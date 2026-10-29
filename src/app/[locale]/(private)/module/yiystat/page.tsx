import { getTranslations } from 'next-intl/server';

import { getSurveyParticipation } from '@/actions/statistics.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2 } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

import { StatisticsTabs } from './components/statistics-tabs';
import { SurveyParticipationTable } from './components/survey-participation-table';

const INTL_NAMESPACE = 'private.yiystat';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function StatisticsPage() {
  const t = await getTranslations(INTL_NAMESPACE);
  const surveys = await getSurveyParticipation();

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 flex min-w-0 flex-col gap-6">
        <StatisticsTabs active="surveys" />
        <Heading2>{t('surveys.title')}</Heading2>
        <SurveyParticipationTable items={surveys} />
      </div>
    </SubLayout>
  );
}
