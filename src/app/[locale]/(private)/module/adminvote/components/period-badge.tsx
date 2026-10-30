'use client';

import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { VoteAdminTerm } from '@/types/models/vote/administration';

interface Props {
  period: Pick<VoteAdminTerm, 'startsOn' | 'endsOn'>;
}

export const PeriodBadge = ({ period }: Props) => {
  const t = useTranslations('private.adminvote.periods.table');
  const today = dayjs().startOf('day');
  const upcoming = today.isBefore(dayjs(period.startsOn), 'day');
  const ended = today.isAfter(dayjs(period.endsOn), 'day');

  return (
    <Badge
      variant={upcoming ? 'blue' : 'success'}
      className={
        upcoming
          ? 'border border-other-blue bg-other-blue/10 text-other-blue'
          : 'border border-status-success-300 bg-status-success-100 text-status-success-300'
      }
    >
      {t(upcoming ? 'upcoming' : ended ? 'ended' : 'active')}
    </Badge>
  );
};
