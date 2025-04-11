'use client';
import React from 'react';
import { Heading1 } from '@/components/typography/headers';
import { CreditModule } from '@/types/models/current-control/credit-module';
import { useTranslations } from 'next-intl';

interface ModuleHeaderProps {
  creditModule: CreditModule;
  studyPeriod: string;
  t: ReturnType<typeof useTranslations>;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({ creditModule, studyPeriod, t }) => {
  return (
    <>
      <Heading1>{t('title')}</Heading1>
      <div className="mt-3 flex flex-col gap-5 md:flex-row md:gap-10">
        <div className="flex flex-col-reverse text-left md:flex-col md:text-center">
          <span className="font-semibold text-basic-black">{studyPeriod}</span>
          <span className="text-neutral-500">{t('study-year')}</span>
        </div>
        <div className="flex flex-col-reverse text-left md:flex-col md:text-center">
          <span className="max-w-[600px] break-words font-semibold text-basic-black">{creditModule.name}</span>
          <span className="text-neutral-500">{t('credit-module')}</span>
        </div>
        <div className="flex flex-col-reverse text-left md:flex-col md:text-center">
          {creditModule?.lecturers?.map((lecturer: any, index: number) => (
            <span key={index} className="font-semibold text-basic-black">
              {lecturer.fullName}
            </span>
          ))}
          <span className="text-neutral-500">{t('lecturers')}</span>
        </div>
      </div>
    </>
  );
};
