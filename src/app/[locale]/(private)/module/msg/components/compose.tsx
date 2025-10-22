import React, { Suspense } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Heading4 } from '@/components/typography';
import { Broadcast } from './broadcast/broadcast';
import { getAllGroups } from '@/actions/msg.acitons';

export interface Subdivision {
  id: number;
  name: string;
}

export default async function Compose() {
  const groupOptions = await getAllGroups();

  return (
    <div className="w-full">
      <Heading4 className="mb-6">Нове повідомлення</Heading4>

      <Tabs defaultValue="individual" className="mb-6 w-full">
        <TabsList>
          <TabsTrigger value="individual">Індивідуальне</TabsTrigger>
          <TabsTrigger value="broadcast">Масове</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-6 space-y-6">
          {/* <Individual facultyOptions={facultyOptions} /> */}
        </TabsContent>

        <TabsContent value="broadcast" className="mt-6">
          <Suspense fallback={<div>Loading...</div>}>
            <Broadcast groupOptions={groupOptions} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
