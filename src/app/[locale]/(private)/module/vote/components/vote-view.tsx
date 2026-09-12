'use client';

import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { VoteData, VoteState } from '@/types/models/vote';

import { ActiveVote } from './active-vote';
import { VoteResultsTable } from './vote-results-table';

interface Props {
  voteData: VoteData;
}

export const VoteView = ({ voteData }: Props) => {
  const t = useTranslations('private.vote');

  if (voteData.state === VoteState.ResultsPublished) {
    return <VoteResultsTable voteData={voteData} />;
  }

  if (voteData.state !== VoteState.Active) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm">
        <Paragraph className="m-0 text-base font-semibold text-neutral-900">
          {t(`state.${voteData.state}.title`)}
        </Paragraph>
        <Paragraph className="leading-sm m-0 text-sm text-neutral-600">
          {t(`state.${voteData.state}.description`)}
        </Paragraph>
      </div>
    );
  }

  if (voteData.lecturers.length === 0 || voteData.criteria.length === 0) {
    return <Paragraph className="text-muted-foreground m-0 py-12 text-center text-sm">{t('empty')}</Paragraph>;
  }

  return <ActiveVote initialVoteData={voteData} />;
};
