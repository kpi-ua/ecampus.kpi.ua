'use client';

import { useTranslations } from 'next-intl';

import { Heading3, Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { Show } from '@/components/utils/show';
import { VoteCriterion, VoteLecturer } from '@/types/models/vote';

import { CriterionRating } from './criterion-rating';

interface Props {
  criteria: VoteCriterion[];
  lecturer: VoteLecturer | null;
  scores: Record<number, number>;
  isComplete: boolean;
  isSubmitting: boolean;
  onScoreChange: (criterionId: number, mark: number) => void;
  onSubmit: () => void;
}

export const VoteForm = ({ criteria, lecturer, scores, isComplete, isSubmitting, onScoreChange, onSubmit }: Props) => {
  const t = useTranslations('private.vote');

  return (
    <section className="flex w-full flex-col gap-6 rounded-3xl bg-white p-6 shadow-[0_8px_12px_rgba(158,182,201,0.25)] sm:p-9 lg:w-[784px] lg:max-w-none lg:shrink-0">
      <Show
        when={!!lecturer}
        fallback={
          <div className="flex flex-col gap-2 py-12 text-center">
            <Paragraph className="m-0 text-base font-semibold text-neutral-900">{t('allCompleted.title')}</Paragraph>
            <Paragraph className="leading-sm m-0 text-sm text-neutral-600">{t('allCompleted.description')}</Paragraph>
          </div>
        }
      >
        <div className="flex items-center gap-3">
          <ProfilePicture size="lg" src={lecturer?.photo ?? ''} />
          <div className="flex flex-col gap-1">
            <Heading3 className="leading-lg lg:leading-lg text-xl text-neutral-900 lg:text-xl">
              {lecturer?.fullName}
            </Heading3>
            <Paragraph className="leading-sm m-0 text-sm text-neutral-500">{t('rateLecturer')}</Paragraph>
          </div>
        </div>

        <div className="flex flex-col gap-4.5">
          {criteria.map((criterion) => (
            <CriterionRating
              key={criterion.id}
              criterion={criterion}
              score={scores[criterion.id]}
              disabled={isSubmitting}
              onScoreChange={onScoreChange}
            />
          ))}
        </div>

        <Button className="w-[168px]" size="big" disabled={!isComplete} loading={isSubmitting} onClick={onSubmit}>
          {t('save')}
        </Button>
      </Show>
    </section>
  );
};
