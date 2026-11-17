'use client';
import { useTranslations } from 'next-intl';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlanLoad, PlanWorkplace, PlanYear } from '@/types/models/plans';

import { ResponsibilitiesTab } from './responsibilities-tab';
import { WorkloadsTab } from './workloads-tab';

interface Props {
  currentYear: PlanYear;
  workplaces: PlanWorkplace[];
  initialLoads: PlanLoad[];
}
export const PlansView = (props: Props) => {
  const t = useTranslations('private.plans');
  return (
    <Tabs defaultValue="loads" className="flex min-w-0 flex-col gap-6">
      <TabsList size="small" className="self-start">
        <TabsTrigger value="loads">{t('workloads')}</TabsTrigger>
        <TabsTrigger value="responsibilities">{t('responsibility')}</TabsTrigger>
      </TabsList>
      <TabsContent value="loads" className="mt-0">
        <WorkloadsTab {...props} />
      </TabsContent>
      <TabsContent value="responsibilities" className="mt-0">
        <ResponsibilitiesTab yearId={props.currentYear.id} />
      </TabsContent>
    </Tabs>
  );
};
