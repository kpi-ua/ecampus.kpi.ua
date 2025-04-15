'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { ModuleHeader } from '@/app/[locale]/(private)/module/studysheet/[id]/components/module-header';
import { TableSheets } from '@/app/[locale]/(private)/module/studysheet/[id]/components/table-sheets';
import { JournalTable } from '@/app/[locale]/(private)/module/studysheet/[id]/components/journal-table';
import { EventPlanTable } from '@/app/[locale]/(private)/module/studysheet/[id]/components/event-plan-table';
import { ExternalMaterialsTable } from '@/app/[locale]/(private)/module/studysheet/[id]/components/external-materials-table';
import { InternalMaterialsTable } from '@/app/[locale]/(private)/module/studysheet/[id]/components/internal-materials-table';
import { Card } from '@/components/ui/card';
import { SHEET_TRANSLATION_KEYS } from '@/app/[locale]/(private)/module/studysheet/[id]/constants';
import { getTotalScore } from '@/app/[locale]/(private)/module/studysheet/[id]/utils';
import { getMonitoringById } from '@/actions/monitoring.actions';
import { CreditModule } from '@/types/models/current-control/credit-module';
import { INTL_NAMESPACE } from '@/app/[locale]/(private)/module/studysheet/constants';
import SpinnerGap from '@/app/images/icons/SpinnerGap.svg';

export default function InfoPageClient() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations(INTL_NAMESPACE);
  const tTable = useTranslations(`${INTL_NAMESPACE}.table`);
  const tSheet = useTranslations(`${INTL_NAMESPACE}.sheet`);

  const [creditModule, setCreditModule] = useState<CreditModule>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMonitoringById(id as string);
        setCreditModule(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <SpinnerGap />
      </div>
    );
  }

  if (!creditModule) {
    return null;
  }

  const studyPeriod = `${creditModule.studyYear} (${creditModule.semester} ${t('semester.title')})`;
  const totalScore = getTotalScore(creditModule.journal);
  const selectedSheet = searchParams.get('sheet') || SHEET_TRANSLATION_KEYS.JOURNAL;

  return (
    <div>
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
  );
}
