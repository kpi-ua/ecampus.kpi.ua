'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

import { STATISTICS_PATH, VISIT_PERIODS } from '../constants';

interface Props {
  days: number;
}

export const VisitPeriods = ({ days }: Props) => {
  const t = useTranslations('private.yiystat.visits');

  return (
    <nav className="flex flex-wrap gap-2">
      {VISIT_PERIODS.map((period) => (
        <Button asChild key={period} size="small" variant={period === days ? 'primary' : 'secondary'}>
          <Link href={`${STATISTICS_PATH}/visits?days=${period}`} aria-current={period === days ? 'page' : undefined}>
            {t('period', { days: period })}
          </Link>
        </Button>
      ))}
    </nav>
  );
};
