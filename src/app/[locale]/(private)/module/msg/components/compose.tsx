import React, { Suspense } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Heading4 } from '@/components/typography';
import { Broadcast } from './broadcast/broadcast';
import { getAllGroups, getFacultyOptions } from '@/actions/msg.acitons';
import { Individual } from './broadcast/individual';
import { Skeleton } from '@/components/ui/skeleton';

export interface Subdivision {
  id: number;
  name: string;
}

export default async function Compose() {
  const groupOptions = await getAllGroups();
  const facultyOptions = await getFacultyOptions();

  return (
    <div className="w-full">
      <Heading4 className="mb-6">Нове повідомлення</Heading4>

      <Tabs defaultValue="individual" className="mb-6 w-full">
        <TabsList>
          <TabsTrigger value="individual">Індивідуальне</TabsTrigger>
          <TabsTrigger value="broadcast">Масове</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-6 space-y-6">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <Individual facultyOptions={facultyOptions} />
          </Suspense>
        </TabsContent>

        <TabsContent value="broadcast" className="mt-6">
          <Broadcast groupOptions={groupOptions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
