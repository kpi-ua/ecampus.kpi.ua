import { getTranslations } from 'next-intl/server';

import { getZamdekanAgreements, getZamdekanGroups } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanGroupSelect } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-group-select';
import { ZamdekanAgreementsTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-agreements-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { Heading2, Heading3 } from '@/components/typography';

const INTL_NAMESPACE = 'private.zamdekan';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: string; groupId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.agreements') };
}

export default async function GroupAgreementsPage({ params }: Props) {
  const { groupId: groupIdParam } = await params;
  const groupId = parseReportId(groupIdParam);
  const [items, groups, t] = await Promise.all([
    getZamdekanAgreements(groupId),
    getZamdekanGroups(),
    getTranslations(INTL_NAMESPACE),
  ]);

  return (
    <SubLayout
      pageTitle={t('views.agreements')}
      breadcrumbs={[[getZamdekanReportPath({ view: 'groups' }), t('title')]]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="agreements">
          <Heading3>{t('views.agreements')}</Heading3>
          <ZamdekanGroupSelect groups={groups} groupId={groupId} />
          <ZamdekanAgreementsTable key={groupId} agreements={items} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
