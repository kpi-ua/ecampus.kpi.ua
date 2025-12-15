'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Heading5 } from '@/components/typography';
import { MapPin } from 'lucide-react';
import { WorkPlaceRating } from '@/types/models/rating';
import { EntriesTable } from './entries-table';
import { formatNumber } from '@/lib/utils';

interface WorkplaceCardProps {
  workplace: WorkPlaceRating;
}

export function WorkplaceCard({ workplace }: WorkplaceCardProps) {
  const t = useTranslations('private.rating');

  return (
    <Card className="overflow-hidden bg-white">
      <div className="p-6">
        <div className="mb-4 flex items-start gap-2">
          <MapPin className="text-basic-blue mt-1 h-5 w-5 shrink-0" />
          <Heading5>{workplace.workPlace.name}</Heading5>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold text-neutral-700">{t('summary.title')}:</p>
          <div className="space-y-1">
            {workplace.summary.map((item) => (
              <div key={item.workKindId} className="text-sm">
                <span className="font-semibold text-neutral-700">{item.workKindName}:</span>{' '}
                <span className="text-neutral-600">
                  {formatNumber(item.sumResult)} {t('points')} ({item.entryCount})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-4">
          <span className="font-semibold text-neutral-900">{t('total')}:</span>{' '}
          <span className="text-basic-blue text-lg font-bold">
            {formatNumber(workplace.totalResult)} {t('points')} ({t('entries', { count: workplace.totalEntryCount })})
          </span>
        </div>
      </div>

      <div className="border-t border-neutral-200 px-6 pb-6 pt-6">
        <EntriesTable entries={workplace.entries} />
      </div>
    </Card>
  );
}
