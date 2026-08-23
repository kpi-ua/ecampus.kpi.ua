'use client';

import { CircleHelp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { Show } from '@/components/utils/show';
import { cn } from '@/lib/utils';
import { VoteCriterion, VoteLecturer } from '@/types/models/vote';

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
    <section className="w-full gap-6 flex flex-col rounded-3xl bg-white p-6 shadow-[0_8px_12px_rgba(158,182,201,0.25)] sm:p-9 lg:w-[784px] lg:max-w-none lg:shrink-0">
      <Show
        when={!!lecturer}
        fallback={
          <div className="py-12 text-center">
            <p className="font-semibold text-neutral-900">{t('allCompleted.title')}</p>
            <p className="mt-2 text-sm text-neutral-600">{t('allCompleted.description')}</p>
          </div>
        }
      >
        <div className="flex items-center gap-3">
          <ProfilePicture size="lg" src={lecturer?.photo ?? ''} />
          <div>
            <h3 className="text-base font-semibold text-neutral-900">{lecturer?.fullName}</h3>
            <p className="mt-1 text-sm text-neutral-500">{t('rateLecturer')}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 space-y-4">
          {criteria.map((criterion) => (
            <fieldset key={criterion.id} className="grid gap-2 sm:grid-cols-[252px_1fr] sm:items-center sm:gap-4">
              <legend className="sr-only">{criterion.name}</legend>
              <div className="flex gap-2" role="radiogroup" aria-label={criterion.name}>
                {[1, 2, 3, 4, 5].map((mark) => (
                  <button
                    key={mark}
                    type="button"
                    role="radio"
                    aria-checked={scores[criterion.id] === mark}
                    onClick={() => onScoreChange(criterion.id, mark)}
                    className={cn(
                      'size-11 rounded-[8px] border text-sm font-medium transition-colors',
                      'hover:border-basic-blue hover:text-basic-blue border-neutral-300 bg-white text-neutral-800',
                      mark <= (scores[criterion.id] ?? 0) &&
                        'border-basic-blue bg-brand-00 text-basic-blue hover:text-basic-blue',
                    )}
                  >
                    {mark}
                  </button>
                ))}
              </div>
              <p className="flex items-center gap-1.5 text-sm text-neutral-800">
                {criterion.name}
                <CircleHelp className="size-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
              </p>
            </fieldset>
          ))}
        </div>

        <Button className="w-[168px]" size="big" disabled={!isComplete} loading={isSubmitting} onClick={onSubmit}>
          {t('save')}
        </Button>
      </Show>
    </section>
  );
};
