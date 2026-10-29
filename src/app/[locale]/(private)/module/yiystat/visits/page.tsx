import { getTranslations } from 'next-intl/server';

import { getVisitStatistics } from '@/actions/statistics.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Paragraph } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

import { StatisticsTabs } from '../components/statistics-tabs';
import { VisitPeriods } from '../components/visit-periods';
import { VisitsTable } from '../components/visits-table';
import { WeeklySummary } from '../components/weekly-summary';
import { VISIT_PERIODS } from '../constants';

const INTL_NAMESPACE = 'private.yiystat';

interface Props extends LocaleProps {
  searchParams: Promise<{ days?: string | string[] }>;
}

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function VisitsPage({ searchParams }: Props) {
  const t = await getTranslations(INTL_NAMESPACE);
  const { days: requestedDays } = await searchParams;
  const days = VISIT_PERIODS.find((period) => String(period) === requestedDays) ?? 7;
  const data = await getVisitStatistics(days);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 flex min-w-0 flex-col gap-6">
        <StatisticsTabs active="visits" />
        <Heading2>{t('visits.title')}</Heading2>
        <Paragraph className="my-0 text-sm text-neutral-600">{t('visits.description')}</Paragraph>
        <VisitPeriods days={days} />
        <VisitsTable items={data.items} />
        {data.weeklySummary && <WeeklySummary totals={data.weeklySummary} />}
      </div>
    </SubLayout>
  );
}
