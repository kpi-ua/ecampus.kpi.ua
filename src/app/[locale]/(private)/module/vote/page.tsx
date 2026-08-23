import { getTranslations } from 'next-intl/server';

import { getVoteData } from '@/actions/vote.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Paragraph } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

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
        <Heading2>{t('title')}</Heading2>
        <Paragraph className="leading-sm mt-3 mb-7 max-w-4xl text-sm font-normal text-neutral-700">
          {t('subtitle')}
        </Paragraph>
        <VoteView voteData={voteData} />
      </div>
    </SubLayout>
  );
}
