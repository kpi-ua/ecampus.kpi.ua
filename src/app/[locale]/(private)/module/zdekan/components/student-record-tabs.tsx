'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getDeanOfficeSessionResults, type getDeanOfficeStudent } from '@/actions/dean-office.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { StudentAttestationTable } from './student-attestation-table';
import { StudentMonitoringTable } from './student-monitoring-table';
import { StudentSessionTable } from './student-session-table';
import { StudentSurveyTable } from './student-survey-table';

const views = ['surveys', 'attestations', 'monitoring', 'session'] as const;
type Student = NonNullable<Awaited<ReturnType<typeof getDeanOfficeStudent>>>;

export function StudentRecordTabs({ studentId, student }: { studentId: number; student: Student }) {
  const t = useTranslations('private.dean-office');
  const [active, setActive] = useState('surveys');
  const session = useQuery({
    queryKey: ['dean-office', 'student-session', studentId],
    queryFn: () => getDeanOfficeSessionResults(studentId),
    enabled: active === 'session',
  });

  return (
    <Tabs value={active} activationMode="manual" onValueChange={setActive}>
      <div className="overflow-x-auto">
        <TabsList className="bg-white" size="small" aria-label={t('studentRecord')}>
          {views.map((view) => (
            <TabsTrigger key={view} value={view}>
              {t(view)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="surveys">
        <StudentSurveyTable surveys={student.surveys} />
      </TabsContent>
      <TabsContent value="attestations">
        <StudentAttestationTable attestations={student.attestations} />
      </TabsContent>
      <TabsContent value="monitoring">
        <StudentMonitoringTable monitoring={student.monitoring} />
      </TabsContent>
      <TabsContent value="session">
        <StudentSessionTable results={session.data ?? []} isPending={session.isPending} isError={session.isError} />
      </TabsContent>
    </Tabs>
  );
}
