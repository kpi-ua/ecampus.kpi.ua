import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { GroupCuratorView } from './group-curator-view/group-curator-view';
import { StudyGroupsTable } from './study-groups-table';
import { CuratorGroup } from '../types';
import { getTranslations } from 'next-intl/server';

interface Props {
  teachingGroups: CuratorGroup[];
  groups: CuratorGroup[];
}

export const LecturerCuratorView = async ({ teachingGroups, groups }: Props) => {
  const t = await getTranslations('private.curator.lecturer');

  return (
    <Tabs defaultValue="study-groups">
      <TabsList className="mb-6 bg-white" size="small">
        <TabsTrigger value="study-groups">{t('tabs.study-groups')}</TabsTrigger>
        <TabsTrigger value="group-curator">{t('tabs.group-curator')}</TabsTrigger>
      </TabsList>

      <TabsContent value="study-groups" className="mt-0">
        <StudyGroupsTable groups={teachingGroups} />
      </TabsContent>
      <TabsContent value="group-curator" className="mt-0">
        <GroupCuratorView groups={groups} />
      </TabsContent>
    </Tabs>
  );
};
