import { getTranslations } from 'next-intl/server';

import { getZamdekanStudentResults } from '@/actions/zamdekan.actions';
import { ZamdekanResultsTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-results-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';

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
  const [items, t] = await Promise.all([
    getZamdekanStudentResults(studentId, groupId),
    getTranslations(INTL_NAMESPACE),
  ]);

  return (
    <SubLayout pageTitle={t('views.results')} breadcrumbs={[[getZamdekanReportPath({ view: 'groups' }), t('title')]]}>
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="groups">
          <Heading3>{t('views.results')}</Heading3>
          <ZamdekanResultsTable key={studentId} results={items} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
