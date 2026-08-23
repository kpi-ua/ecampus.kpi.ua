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
    <section className="w-full rounded-xl border border-neutral-200 bg-white p-5 shadow-sm lg:max-w-2xl">
      <Show
        when={!!lecturer}
        fallback={
          <div className="py-12 text-center">
            <p className="font-semibold text-neutral-900">{t('allCompleted.title')}</p>
            <p className="mt-2 text-sm text-neutral-600">{t('allCompleted.description')}</p>
          </div>
        }
      >
        <div className="mb-5 flex items-center gap-3">
          <ProfilePicture size="base" src="" />
          <div>
            <h3 className="text-base font-semibold text-neutral-900">{lecturer?.fullName}</h3>
            <p className="mt-1 text-sm text-neutral-500">{t('rateLecturer')}</p>
          </div>
        </div>

        <div className="space-y-4">
          {criteria.map((criterion) => (
            <fieldset key={criterion.id} className="grid gap-2 sm:grid-cols-[176px_1fr] sm:items-center">
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
                      'size-8 rounded-md border text-sm font-medium transition-colors',
                      'hover:border-basic-blue hover:text-basic-blue border-neutral-300 bg-white text-neutral-800',
                      scores[criterion.id] === mark && 'border-basic-blue bg-basic-blue text-white hover:text-white',
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

        <Button className="mt-5 min-w-28" size="small" disabled={!isComplete} loading={isSubmitting} onClick={onSubmit}>
          {t('save')}
        </Button>
      </Show>
    </section>
  );
};
