'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RatingData } from '@/types/models/rating';
import { WorkplaceCard } from './workplace-card';

interface RatingViewProps {
  ratingData: RatingData;
}

export function RatingView({ ratingData }: RatingViewProps) {
  const t = useTranslations('private.rating');

  const availableYears = useMemo(() => {
    return Object.keys(ratingData.years)
      .filter((year) => ratingData.years[year].length > 0)
      .sort((a, b) => parseInt(a) - parseInt(b));
  }, [ratingData.years]);

  const [selectedYear, setSelectedYear] = useState<string>(availableYears[availableYears.length - 1] || '');

  const workplaces = selectedYear ? ratingData.years[selectedYear] : [];

  if (availableYears.length === 0) {
    return (
      <div className="rounded-lg bg-neutral-100 p-8 text-center">
        <p className="text-neutral-600">{t('noData')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={selectedYear} onValueChange={setSelectedYear}>
        <TabsList className="flex-wrap">
          {availableYears.map((year) => (
            <TabsTrigger key={year} value={year}>
              {year}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-6">
        {workplaces.map((workplace) => (
          <WorkplaceCard key={workplace.workPlace.id} workplace={workplace} />
        ))}
      </div>
    </div>
  );
}
