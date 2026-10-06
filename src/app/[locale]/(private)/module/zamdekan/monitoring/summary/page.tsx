import { getTranslations } from 'next-intl/server';

import { getZamdekanDepartmentSummary } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanSummaryTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-summary-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';

import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { Heading2, Heading3 } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'private.zamdekan';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.summary') };
}

export default async function SummaryPage() {
  const [report, t] = await Promise.all([getZamdekanDepartmentSummary(), getTranslations(INTL_NAMESPACE)]);

  return (
    <SubLayout pageTitle={t('views.summary')} breadcrumbs={[[getZamdekanReportPath({ view: 'groups' }), t('title')]]}>
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring" monitoringView="summary">
          <Heading3>{t('views.summary')}</Heading3>
          <ZamdekanSummaryTable summary={report} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
