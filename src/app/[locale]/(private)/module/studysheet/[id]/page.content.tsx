'use client';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Heading1 } from '@/components/typography/headers';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Card } from '@/components/ui/card';
import { TableSheets } from '@/app/[locale]/(private)/module/studysheet/[id]/components/TableSheets';
import { CreditModule } from '@/types/models/current-control/credit-module';
import React from 'react';
import { SHEET_TRANSLATION_KEYS } from '@/app/[locale]/(private)/module/studysheet/[id]/constants';
import { InternalMaterialsTable } from '@/app/[locale]/(private)/module/studysheet/[id]/components/InternalMaterialsTable';
import { EventPlanTable } from '@/app/[locale]/(private)/module/studysheet/[id]/components/EventPlanTable';
import { ExternalMaterialsTable } from '@/app/[locale]/(private)/module/studysheet/[id]/components/ExternalMaterialsTable';
import { JournalTable } from '@/app/[locale]/(private)/module/studysheet/[id]/components/JournalTable';

const INTL_NAMESPACE = 'private.study-sheet';
interface Props {
  creditModule: CreditModule;
}

export function ModuleInfoPage({ creditModule }: Props) {
  const t = useTranslations(INTL_NAMESPACE);
  const tTable = useTranslations(`${INTL_NAMESPACE}.table`);
  const tSheet = useTranslations(`${INTL_NAMESPACE}.sheet`);

  const searchParams = useSearchParams();

  const selectedSheet = searchParams.get('sheet') || SHEET_TRANSLATION_KEYS.JOURNAL;

  const studyPeriod = `${creditModule.studyYear}(${creditModule.semester} ${t('semester.title')})`;

  const totalScore = creditModule.journal.reduce((acc, entry) => {
    const score = typeof entry.score === 'number' ? entry.score : 0;
    return acc + score;
  }, 0);

  return (
    <SubLayout pageTitle={t('module-info')} breadcrumbs={[['/module/studysheet', t('title')]]}>
      <div className="col-span-8">
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
            {creditModule?.lecturers?.map((item, i) => (
              <span key={i} className="font-semibold text-basic-black">
                {item.fullName}
              </span>
            ))}
            <span className="text-neutral-500">{t('lecturers')}</span>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <TableSheets sheetList={Object.values(SHEET_TRANSLATION_KEYS)} t={tSheet} />
          <Card className="rounded-b-6 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
            {selectedSheet === SHEET_TRANSLATION_KEYS.JOURNAL && (
              <JournalTable journal={creditModule.journal} totalScore={totalScore} tTable={tTable} t={t} />
            )}

            {selectedSheet === SHEET_TRANSLATION_KEYS.EVENT_PLAN && (
              <EventPlanTable eventsPlan={creditModule.eventsPlan} t={tTable} />
            )}

            {selectedSheet === SHEET_TRANSLATION_KEYS.EXTERNAL_MATERIALS && (
              <ExternalMaterialsTable externalMaterials={creditModule.externalMaterials} t={tTable} />
            )}

            {selectedSheet === SHEET_TRANSLATION_KEYS.INTERNAL_MATERIALS && (
              <InternalMaterialsTable internalMaterials={creditModule.internalMaterials} t={tTable} />
            )}
          </Card>
        </div>
      </div>
    </SubLayout>
  );
}
