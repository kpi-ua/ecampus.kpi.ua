import { getTranslations } from 'next-intl/server';

import { getZamdekanReport } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanReportTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-report-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { ZamdekanQuery } from '@/app/[locale]/(private)/module/zamdekan/types';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { Heading2, Heading3 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

const INTL_NAMESPACE = 'private.zamdekan';

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
  const query: ZamdekanQuery = { view: 'results', groupId, studentId };
  const [report, t] = await Promise.all([getZamdekanReport(query), getTranslations(INTL_NAMESPACE)]);

  return (
    <SubLayout
      pageTitle={t('views.results')}
      breadcrumbs={[
        [getZamdekanReportPath({ view: 'groups' }), t('title')],
        [getZamdekanReportPath({ view: 'agreements', groupId }), t('views.agreements')],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="groups">
          <Heading3>{t('views.results')}</Heading3>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="small">
              <Link href={getZamdekanReportPath({ view: 'agreements', groupId })}>{t('back')}</Link>
            </Button>
          </div>
          <ZamdekanReportTable key={getZamdekanReportPath(query)} report={report} query={query} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
