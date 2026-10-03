'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Heading2 } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabSheetTrigger, TabsTrigger } from '@/components/ui/tabs';

import { CuratorGroup } from '../../types';
import { GroupSummary } from './group-summary';
import { OverviewTab } from './overview-tab';

interface Props {
  groups: CuratorGroup[];
}

export const GroupCuratorView = ({ groups }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator');
  const [groupId, setGroupId] = useState(groups[0]?.groupId.toString() ?? '');
  const selectedGroup = groups.find((group) => group.groupId.toString() === groupId);

  if (!selectedGroup) {
    return <Card className="bg-white p-10 text-center text-sm text-neutral-500">{t('empty-groups')}</Card>;
  }

  return (
    <Tabs value={groupId} onValueChange={setGroupId} className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-4">
        <Heading2 className="mb-0">{t('title')}</Heading2>
        <TabsList size="small" className="max-w-full overflow-x-auto bg-white">
          {groups.map((group) => (
            <TabsTrigger key={group.groupId} value={group.groupId.toString()}>
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value={groupId} className="mt-0 flex flex-col gap-8">
        <GroupSummary group={selectedGroup} />

        <Tabs defaultValue="overview">
          <TabsList className="h-auto justify-start rounded-none border-0 bg-transparent p-0" size="small">
            <TabSheetTrigger value="overview">{t('sections.overview')}</TabSheetTrigger>
          </TabsList>

          <Card className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab key={selectedGroup.groupId} group={selectedGroup} />
            </TabsContent>
          </Card>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
};
