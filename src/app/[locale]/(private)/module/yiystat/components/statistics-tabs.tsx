'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

import { STATISTICS_PATH } from '../constants';

interface Props {
  active: 'surveys' | 'visits';
}

export const StatisticsTabs = ({ active }: Props) => {
  const t = useTranslations('private.yiystat.tabs');

  return (
    <nav className="flex flex-wrap gap-2">
      <Button asChild size="small" variant={active === 'surveys' ? 'primary' : 'secondary'}>
        <Link href={STATISTICS_PATH} aria-current={active === 'surveys' ? 'page' : undefined}>
          {t('surveys')}
        </Link>
      </Button>
      <Button asChild size="small" variant={active === 'visits' ? 'primary' : 'secondary'}>
        <Link href={`${STATISTICS_PATH}/visits`} aria-current={active === 'visits' ? 'page' : undefined}>
          {t('visits')}
        </Link>
      </Button>
    </nav>
  );
};
