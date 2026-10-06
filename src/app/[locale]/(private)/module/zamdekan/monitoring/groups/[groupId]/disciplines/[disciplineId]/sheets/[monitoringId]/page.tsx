import { getTranslations } from 'next-intl/server';

import { getZamdekanSheetMarks } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanGroupSheetMarksTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-group-sheet-marks-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { Heading2, Heading3 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

const INTL_NAMESPACE = 'private.zamdekan';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: string; groupId: string; disciplineId: string; monitoringId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.sheet') };
}

export default async function GroupSheetPage({ params }: Props) {
  const { groupId: groupIdParam, disciplineId: disciplineIdParam, monitoringId: monitoringIdParam } = await params;
  const groupId = parseReportId(groupIdParam);
  const disciplineId = parseReportId(disciplineIdParam);
  const monitoringId = parseReportId(monitoringIdParam);
  const [items, t] = await Promise.all([getZamdekanSheetMarks(monitoringId), getTranslations(INTL_NAMESPACE)]);

  return (
    <SubLayout
      pageTitle={t('views.sheet')}
      breadcrumbs={[
        [getZamdekanReportPath({ view: 'groups' }), t('title')],
        [getZamdekanReportPath({ view: 'monitoring-groups' }), t('views.monitoring-groups')],
        [getZamdekanReportPath({ view: 'group-load', groupId }), t('views.group-load')],
        [getZamdekanReportPath({ view: 'sheets', groupId, disciplineId }), t('views.sheets')],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring" monitoringView="monitoring-groups">
          <Heading3>{t('views.sheet')}</Heading3>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="small">
              <Link href={getZamdekanReportPath({ view: 'sheets', groupId, disciplineId })}>{t('back')}</Link>
            </Button>
          </div>
          <ZamdekanGroupSheetMarksTable key={monitoringId} marks={items} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
