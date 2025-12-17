'use client';

import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getMonitoringById } from '@/actions/monitoring.actions';
import {
  EventPlanTable,
  ExternalMaterialsTable,
  InternalMaterialsTable,
  JournalTable,
  ModuleHeader,
} from '@/app/[locale]/(private)/module/studysheet/[id]/components';
import { SheetTranslationKeys } from '@/app/[locale]/(private)/module/studysheet/[id]/constants';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { LoadingScreen } from '@/components/loading-screen';
import { Card } from '@/components/ui/card';
import { Tabs, TabSheetTrigger, TabsList } from '@/components/ui/tabs';
import { CreditModule } from '@/types/models/current-control/credit-module';

export default function InfoPageClient() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations('private.study-sheet');
  const tTab = useTranslations(`private.study-sheet.tab`);
  const [selectedSheet, setSelectedSheet] = useState(SheetTranslationKeys.Journal);

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
    return <LoadingScreen />;
  }

  if (!creditModule) {
    return null;
  }

  const studyPeriod = `${creditModule.studyYear} (${creditModule.semester} ${t('semester.title')})`;
  const hasParams = !!querySemester && !!queryYear;
  const breadcrumbsRootPath = hasParams
    ? `/module/studysheet?semester=${querySemester}&studyYear=${queryYear}`
    : '/module/studysheet';

  const sheetList = Object.values(SheetTranslationKeys);

  return (
    <SubLayout pageTitle={t('module-info')} breadcrumbs={[[breadcrumbsRootPath, t('title')]]}>
      <div className="col-span-7">
        <ModuleHeader creditModule={creditModule} studyPeriod={studyPeriod} />
        <div className="mt-8 flex flex-col">
          <Tabs value={selectedSheet} onValueChange={(value) => setSelectedSheet(value as SheetTranslationKeys)}>
            <TabsList className="rounded-none border-0 bg-transparent p-0">
              {sheetList.map((item) => (
                <TabSheetTrigger key={item} value={item}>
                  {tTab(item)}
                </TabSheetTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Card className="rounded-b-6 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
            {selectedSheet === SheetTranslationKeys.Journal && <JournalTable journal={creditModule.journal} />}
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
