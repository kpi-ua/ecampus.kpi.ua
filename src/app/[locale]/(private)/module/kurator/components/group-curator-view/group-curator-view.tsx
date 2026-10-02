'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Heading2 } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabSheetTrigger, TabsTrigger } from '@/components/ui/tabs';

import { CuratorFilters, CuratorGroup } from '../../types';
import { AttestationTab } from './attestation-tab';
import { GroupSummary } from './group-summary';
import { OverviewTab } from './overview-tab';
import { SurveyTab } from './survey-tab';

interface Props {
  groups: CuratorGroup[];
  filters: CuratorFilters;
}

export const GroupCuratorView = ({ groups, filters }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator');
  const [groupId, setGroupId] = useState(groups[0]?.groupId.toString() ?? '');
  const selectedGroup = groups.find((group) => group.groupId.toString() === groupId);

  if (!selectedGroup) {
    return <Card className="bg-white p-10 text-center text-sm text-neutral-500">{t('empty-groups')}</Card>;
  }

  const defaultYearId = selectedGroup.yearId || filters.years[0]?.id;

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
            <TabSheetTrigger value="attestation">{t('sections.attestation')}</TabSheetTrigger>
            <TabSheetTrigger value="survey">{t('sections.survey')}</TabSheetTrigger>
          </TabsList>

          <Card className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab key={selectedGroup.groupId} group={selectedGroup} />
            </TabsContent>
            <TabsContent value="attestation" className="mt-0">
              {defaultYearId && (
                <AttestationTab
                  key={selectedGroup.groupId}
                  groupId={selectedGroup.groupId}
                  groupName={selectedGroup.name}
                  filters={filters}
                  defaultYearId={defaultYearId}
                />
              )}
            </TabsContent>
            <TabsContent value="survey" className="mt-0">
              <SurveyTab key={selectedGroup.groupId} groupId={selectedGroup.groupId} groupName={selectedGroup.name} />
            </TabsContent>
          </Card>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
};
