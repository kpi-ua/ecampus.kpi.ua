import { getTranslations } from 'next-intl/server';

import { getZamdekanGroups } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanGroupsTable } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-groups-table';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { Heading2, Heading3 } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'private.zamdekan';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.groups') };
}

export default async function ZamdekanPage() {
  const [items, t] = await Promise.all([getZamdekanGroups(), getTranslations(INTL_NAMESPACE)]);

  return (
    <SubLayout pageTitle={t('views.groups')}>
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="groups">
          <Heading3>{t('views.groups')}</Heading3>
          <ZamdekanGroupsTable groups={items} />
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
