'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';
import { SheetTranslationKeys } from '@/app/[locale]/(private)/module/studysheet/[id]/constants';
import { getTotalScore } from '@/app/[locale]/(private)/module/studysheet/[id]/utils';
import { getMonitoringById } from '@/actions/monitoring.actions';
import { CreditModule } from '@/types/models/current-control/credit-module';
import SpinnerGap from '@/app/images/icons/SpinnerGap.svg';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import {
  EventPlanTable,
  ExternalMaterialsTable,
  InternalMaterialsTable,
  JournalTable,
  ModuleHeader,
  TableSheets,
} from '@/app/[locale]/(private)/module/studysheet/[id]/components';

export default function InfoPageClient() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations('private.study-sheet');

  const querySemester = searchParams.get('semester');
  const queryYear = searchParams.get('studyYear');

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
  }, []);

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
  const selectedSheet = searchParams.get('sheet') || SheetTranslationKeys.Journal;
  const hasParams = !!querySemester && !!queryYear;
  const breadcrumbsRootPath = hasParams
    ? `/module/studysheet?semester=${querySemester}&studyYear=${queryYear}`
    : '/module/studysheet';

  return (
    <SubLayout pageTitle={t('module-info')} breadcrumbs={[[breadcrumbsRootPath, t('title')]]}>
      <div className="col-span-7">
        <ModuleHeader creditModule={creditModule} studyPeriod={studyPeriod} />
        <div className="mt-8 flex flex-col">
          <TableSheets sheetList={Object.values(SheetTranslationKeys)} />
          <Card className="rounded-b-6 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
            {selectedSheet === SheetTranslationKeys.Journal && (
              <JournalTable journal={creditModule.journal} totalScore={totalScore} />
            )}
            {selectedSheet === SheetTranslationKeys.EventPlan && (
              <EventPlanTable eventsPlan={creditModule.eventsPlan} />
            )}
            {selectedSheet === SheetTranslationKeys.ExternalMaterials && (
              <ExternalMaterialsTable externalMaterials={creditModule.externalMaterials} />
            )}
            {selectedSheet === SheetTranslationKeys.InternalMaterials && (
              <InternalMaterialsTable internalMaterials={creditModule.internalMaterials} />
            )}
          </Card>
        </div>
      </div>
    </SubLayout>
  );
}
