'use client';

import { CircleHelp } from 'lucide-react';

import { Paragraph } from '@/components/typography';
import { cn } from '@/lib/utils';
import { VoteCriterion } from '@/types/models/vote';

interface Props {
  criterion: VoteCriterion;
  score: number | undefined;
  disabled: boolean;
  onScoreChange: (criterionId: number, mark: number) => void;
}

const MARKS = [1, 2, 3, 4, 5] as const;

export const CriterionRating = ({ criterion, score, disabled, onScoreChange }: Props) => (
  <fieldset disabled={disabled} className="grid gap-2 sm:grid-cols-[252px_1fr] sm:items-center sm:gap-4">
    <legend className="sr-only">{criterion.name}</legend>
    <div className="flex gap-2" role="radiogroup">
      {MARKS.map((mark) => (
        <button
          key={mark}
          type="button"
          role="radio"
          onClick={() => onScoreChange(criterion.id, mark)}
          className={cn(
            'size-11 rounded-md border text-sm font-medium transition-colors',
            'hover:border-basic-blue hover:text-basic-blue border-neutral-300 bg-white text-neutral-800',
            mark <= (score ?? 0) && 'border-basic-blue bg-brand-00 text-basic-blue hover:text-basic-blue',
          )}
        >
          {mark}
        </button>
      ))}
    </div>
    <Paragraph className="leading-sm m-0 text-sm font-medium text-neutral-800">
      {criterion.name}
      <CircleHelp className="ml-1.5 inline-block size-3.5 align-middle text-neutral-400" aria-hidden="true" />
    </Paragraph>
  </fieldset>
);
