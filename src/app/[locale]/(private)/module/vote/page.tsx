import { getTranslations } from 'next-intl/server';

import { getVoteData } from '@/actions/vote.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Paragraph } from '@/components/typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocaleProps } from '@/types/locale-props';

import { CriteriaDescription } from './components/criteria-description';
import { VoteView } from './components/vote-view';

const INTL_NAMESPACE = 'private.vote';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function VotePage() {
  const voteData = await getVoteData();
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 w-full px-2 sm:px-4 md:px-0">
        <Tabs defaultValue="survey">
          <TabsList
            className="mb-7 h-auto min-h-11 max-w-full flex-wrap gap-0.75 border-neutral-300 bg-white"
            aria-label={t('tabs.navigation')}
          >
            <TabsTrigger value="survey" className="h-9">
              {t('tabs.survey')}
            </TabsTrigger>
            <TabsTrigger value="criteria" className="h-9">
              {t('tabs.criteria')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="survey" forceMount className="mt-0 data-[state=inactive]:hidden">
            <Heading2>{t('title')}</Heading2>
            <Paragraph className="mt-3 mb-7 max-w-4xl text-sm leading-sm font-normal text-neutral-700">
              {t('subtitle')}
            </Paragraph>
            <VoteView voteData={voteData} />
          </TabsContent>
          <TabsContent value="criteria" className="mt-0">
            <CriteriaDescription />
          </TabsContent>
        </Tabs>
      </div>
    </SubLayout>
  );
}
