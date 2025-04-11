'use client';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
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
import { getTotalScore } from '@/app/[locale]/(private)/module/studysheet/[id]/utils';
import { INTL_NAMESPACE } from '@/app/[locale]/(private)/module/studysheet/constants';
import { ModuleHeader } from '@/app/[locale]/(private)/module/studysheet/[id]/components/ModuleHeader';

interface Props {
  creditModule: CreditModule;
}

export function ModuleInfoPage({ creditModule }: Props) {
  const t = useTranslations(INTL_NAMESPACE);
  const tTable = useTranslations(`${INTL_NAMESPACE}.table`);
  const tSheet = useTranslations(`${INTL_NAMESPACE}.sheet`);

  const searchParams = useSearchParams();
  const querySemester = searchParams.get('semester');
  const queryYear = searchParams.get('studyYear');

  const selectedSheet = searchParams.get('sheet') || SHEET_TRANSLATION_KEYS.JOURNAL;

  const studyPeriod = `${creditModule.studyYear}(${creditModule.semester} ${t('semester.title')})`;

  const totalScore = getTotalScore(creditModule.journal);

  const hasParams = !!querySemester && !!queryYear;
  const breadcrumbsRootPath = hasParams
    ? `/module/studysheet?semester=${querySemester}&studyYear=${queryYear}`
    : '/module/studysheet';

  return (
    <SubLayout pageTitle={t('module-info')} breadcrumbs={[[breadcrumbsRootPath, t('title')]]}>
      <div className="col-span-8">
        <ModuleHeader creditModule={creditModule} studyPeriod={studyPeriod} t={t} />
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
