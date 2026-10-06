import { getTranslations } from 'next-intl/server';

import { getZamdekanGroups } from '@/actions/zamdekan.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { ZamdekanGroupSelect } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-group-select';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { Heading2, Heading3, Paragraph } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'private.zamdekan';
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('sections.agreements') };
}

export default async function AgreementsPage() {
  const [groups, t] = await Promise.all([getZamdekanGroups(), getTranslations(INTL_NAMESPACE)]);

  return (
    <SubLayout
      pageTitle={t('sections.agreements')}
      breadcrumbs={[[getZamdekanReportPath({ view: 'groups' }), t('title')]]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="agreements">
          <Heading3>{t('views.agreements')}</Heading3>
          <ZamdekanGroupSelect groups={groups} />
          <Paragraph className="text-muted-foreground text-sm">
            {groups.length ? t('select-group-hint') : t('empty')}
          </Paragraph>
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
