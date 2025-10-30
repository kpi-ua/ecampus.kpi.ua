import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Heading4 } from '@/components/typography';
import { Broadcast } from './broadcast/broadcast';
import { getAllGroups, getFacultyOptions } from '@/actions/msg.acitons';
import { Individual } from './broadcast/individual';
import { getTranslations } from 'next-intl/server';

export default async function Compose() {
  const t = await getTranslations('private.msg.compose');
  const groupOptions = await getAllGroups();
  const facultyOptions = await getFacultyOptions();

  return (
    <div className="w-full">
      <Heading4 className="mb-6">{t('title')}</Heading4>

      <Tabs defaultValue="individual" className="mb-6 w-full">
        <TabsList>
          <TabsTrigger value="individual">{t('individual')}</TabsTrigger>
          <TabsTrigger value="broadcast">{t('broadcast')}</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-6 space-y-6">
          <Individual facultyOptions={facultyOptions} />
        </TabsContent>

        <TabsContent value="broadcast" className="mt-6">
          <Broadcast groupOptions={groupOptions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
