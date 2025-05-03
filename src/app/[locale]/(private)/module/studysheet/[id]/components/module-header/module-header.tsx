'use client';

import React from 'react';
import { Heading1 } from '@/components/typography/headers';
import { CreditModule } from '@/types/models/current-control/credit-module';
import { useTranslations } from 'next-intl';
import { InfoItem } from './components/info-item';
import { Separator } from '@/components/ui/separator';

interface Props {
  creditModule: CreditModule;
  studyPeriod: string;
}

export function ModuleHeader({ creditModule, studyPeriod }: Props) {
  const t = useTranslations('private.study-sheet');

  return (
    <>
      <Heading1>{t('title')}</Heading1>
      <div className="mt-3 flex flex-col gap-5 md:flex-row">
        <InfoItem label={t('study-year')} value={studyPeriod} />
        <Separator orientation="vertical" className="hidden h-[38px] bg-neutral-divider md:block" />
        <InfoItem
          label={t('credit-module')}
          value={<span className="max-w-[600px] break-words">{creditModule.name}</span>}
        />
        <Separator orientation="vertical" className="hidden h-[38px] bg-neutral-divider md:block" />
        <InfoItem
          label={t('lecturers')}
          value={creditModule.lecturers?.map((lecturer) => lecturer.fullName).join(', ')}
        />
      </div>
    </>
  );
}
