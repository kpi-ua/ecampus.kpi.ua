import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { StudyGroupsTable } from './study-groups-table';
import { CuratorGroup } from '../types';
import { getTranslations } from 'next-intl/server';

interface Props {
  teachingGroups: CuratorGroup[];
}

export const LecturerCuratorView = async ({ teachingGroups }: Props) => {
  const t = await getTranslations('private.curator.lecturer');

  return (
    <Tabs defaultValue="study-groups">
      <TabsList className="mb-6 bg-white" size="small">
        <TabsTrigger value="study-groups">{t('tabs.study-groups')}</TabsTrigger>
      </TabsList>

      <TabsContent value="study-groups" className="mt-0">
        <StudyGroupsTable groups={teachingGroups} />
      </TabsContent>
    </Tabs>
  );
};
