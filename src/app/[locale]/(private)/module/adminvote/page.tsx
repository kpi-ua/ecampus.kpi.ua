import { getTranslations } from 'next-intl/server';

import { getVoteCriteriaAdministration, getVoteStudyYears } from '@/actions/vote-administration.actions';
import { CriteriaManagement } from '@/app/[locale]/(private)/module/adminvote/components/criteria-management';
import { PeriodsManagement } from '@/app/[locale]/(private)/module/adminvote/components/periods-management';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'private.adminvote';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('module-title') };
}

export default async function AdminVotePage() {
  const t = await getTranslations(INTL_NAMESPACE);

  const [data, studyYears] = await Promise.all([getVoteCriteriaAdministration(), getVoteStudyYears()]);

  return (
    <SubLayout pageTitle={t('module-title')}>
      <div className="col-span-12 flex min-w-0 flex-col gap-6">
        <Tabs defaultValue="periods" className="flex min-w-0 flex-col gap-6">
          <TabsList size="small" className="self-start">
            <TabsTrigger value="periods">{t('tabs.periods')}</TabsTrigger>
            <TabsTrigger value="criteria">{t('tabs.criteria')}</TabsTrigger>
          </TabsList>
          <TabsContent value="periods" className="mt-0">
            <PeriodsManagement data={data} studyYears={studyYears} />
          </TabsContent>
          <TabsContent value="criteria" className="mt-0">
            <CriteriaManagement data={data} />
          </TabsContent>
        </Tabs>
      </div>
    </SubLayout>
  );
}
