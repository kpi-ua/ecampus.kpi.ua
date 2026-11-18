import { getTranslations } from 'next-intl/server';

import { getDeputyDeanGroups } from '@/actions/deputy-dean.actions';
import { DeputyDeanGroupsTable } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-groups-table';
import { DeputyDeanTabs } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-tabs';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3 } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'private.deputy-dean';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.groups') };
}

export default async function DeputyDeanPage() {
  const [items, t] = await Promise.all([getDeputyDeanGroups(), getTranslations(INTL_NAMESPACE)]);

  return (
    <SubLayout pageTitle={t('views.groups')}>
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <DeputyDeanTabs section="groups">
          <Heading3>{t('views.groups')}</Heading3>
          <DeputyDeanGroupsTable groups={items} />
        </DeputyDeanTabs>
      </div>
    </SubLayout>
  );
}
