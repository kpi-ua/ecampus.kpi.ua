import { getTranslations } from 'next-intl/server';

import { getLecturerVoteResults } from '@/actions/vote-lecturer.actions';
import { CriteriaDescription } from '@/app/[locale]/(private)/module/vote/components/criteria-description';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocaleProps } from '@/types/locale-props';

import { LecturerResults } from './components/lecturer-results';

const INTL_NAMESPACE = 'private.votelecturer';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return { title: t('title') };
}

export default async function VoteLecturerPage() {
  const results = await getLecturerVoteResults();
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 w-full min-w-0 px-2 sm:px-4 md:px-0">
        <Tabs defaultValue="results">
          <TabsList size="small" className="mb-7">
            <TabsTrigger value="results">{t('tabs.results')}</TabsTrigger>
            <TabsTrigger value="criteria">{t('tabs.criteria')}</TabsTrigger>
          </TabsList>
          <TabsContent value="results" forceMount className="mt-0 data-[state=inactive]:hidden">
            <LecturerResults results={results} />
          </TabsContent>
          <TabsContent value="criteria" className="mt-0">
            <CriteriaDescription />
          </TabsContent>
        </Tabs>
      </div>
    </SubLayout>
  );
}
