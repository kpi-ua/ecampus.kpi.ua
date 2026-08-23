'use client';

import { useTranslations } from 'next-intl';

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
      <div className="rounded-xl border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-base font-semibold text-neutral-900">{t(`state.${voteData.state}.title`)}</p>
        <p className="mt-2 text-sm text-neutral-600">{t(`state.${voteData.state}.description`)}</p>
      </div>
    );
  }

  if (voteData.lecturers.length === 0 || voteData.criteria.length === 0) {
    return <p className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</p>;
  }

  return <ActiveVote initialVoteData={voteData} />;
};
