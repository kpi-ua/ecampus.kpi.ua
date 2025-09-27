'use client';

import React from 'react';
import { Heading2 } from '@/components/typography/headers';
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
      <Heading2>{t('title')}</Heading2>
      <div className="my-8 flex flex-col gap-6 md:flex-row">
        <InfoItem label={t('study-year')} value={studyPeriod} />
        <Separator orientation="vertical" className="bg-neutral-divider hidden h-[38px] md:block" />
        <InfoItem
          label={t('credit-module')}
          value={<span className="max-w-[600px] break-words">{creditModule.name}</span>}
        />
        <Separator orientation="vertical" className="bg-neutral-divider hidden h-[38px] md:block" />
        <InfoItem
          label={t('lecturers')}
          value={creditModule.lecturers?.map((lecturer) => lecturer.fullName).join(', ')}
        />
      </div>
    </>
  );
}
