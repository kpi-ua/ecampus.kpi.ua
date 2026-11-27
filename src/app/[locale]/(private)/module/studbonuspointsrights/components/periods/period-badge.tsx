'use client';

import { useTranslations } from 'next-intl';

import { Badge, BadgeProps } from '@/components/ui/badge';
import { SbpPeriodPhase } from '@/types/models/sbp-periods';

const VARIANTS: Record<SbpPeriodPhase, BadgeProps['variant']> = {
  Planned: 'blue',
  Submission: 'success',
  SubmissionAndReview: 'success',
  Review: 'yellow',
  Appeal: 'purple',
  Leftover: 'red',
  Archive: 'neutral',
};

export const PeriodBadge = ({ phase }: { phase: SbpPeriodPhase }) => {
  const t = useTranslations('private.studbonuspointsrights.periods.phases');

  return (
    <Badge variant={VARIANTS[phase]} className="whitespace-nowrap">
      {t(phase)}
    </Badge>
  );
};
