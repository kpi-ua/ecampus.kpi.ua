import { getTranslations } from 'next-intl/server';

import { getZamdekanOutwardTeachingStatistics } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanOutwardTeachingTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-outward-teaching-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { Heading2, Heading3 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

const INTL_NAMESPACE = 'private.zamdekan';
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: string; cathedraId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.statistics-other') };
}

export default async function CathedraStatisticsPage({ params }: Props) {
  const { cathedraId: cathedraIdParam } = await params;
  const cathedraId = parseReportId(cathedraIdParam);
  const [items, t] = await Promise.all([
    getZamdekanOutwardTeachingStatistics(cathedraId),
    getTranslations(INTL_NAMESPACE),
  ]);

  return (
    <SubLayout
      pageTitle={t('views.statistics-other')}
      breadcrumbs={[
        [getZamdekanReportPath({ view: 'groups' }), t('title')],
        [getZamdekanReportPath({ view: 'statistics-other' }), t('views.statistics-other')],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring" monitoringView="statistics-other">
          <Heading3>{t('views.statistics-other')}</Heading3>
          <Button asChild variant="secondary" size="small">
            <Link href={getZamdekanReportPath({ view: 'statistics-other' })}>{t('back')}</Link>
          </Button>
          <ZamdekanOutwardTeachingTable key={cathedraId} statistics={items} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
