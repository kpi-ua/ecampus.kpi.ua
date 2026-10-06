import { getTranslations } from 'next-intl/server';

import { getZamdekanGroupDisciplines } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanGroupDisciplinesTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-group-disciplines-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { Heading2, Heading3 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

const INTL_NAMESPACE = 'private.zamdekan';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: string; groupId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.group-load') };
}

export default async function GroupMonitoringPage({ params }: Props) {
  const { groupId: groupIdParam } = await params;
  const groupId = parseReportId(groupIdParam);
  const [items, t] = await Promise.all([getZamdekanGroupDisciplines(groupId), getTranslations(INTL_NAMESPACE)]);

  return (
    <SubLayout
      pageTitle={t('views.group-load')}
      breadcrumbs={[
        [getZamdekanReportPath({ view: 'groups' }), t('title')],
        [getZamdekanReportPath({ view: 'monitoring-groups' }), t('views.monitoring-groups')],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring" monitoringView="monitoring-groups">
          <Heading3>{t('views.group-load')}</Heading3>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="small">
              <Link href={getZamdekanReportPath({ view: 'monitoring-groups' })}>{t('back')}</Link>
            </Button>
          </div>
          <ZamdekanGroupDisciplinesTable key={groupId} disciplines={items} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
