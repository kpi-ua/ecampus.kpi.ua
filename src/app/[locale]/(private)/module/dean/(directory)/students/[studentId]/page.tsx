import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getDeanStudent } from '@/actions/dean.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2 } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type LocaleProps } from '@/types/locale-props';

import { StudentAttestationTable } from './components/student-attestation-table';
import { StudentMonitoringTable } from './components/student-monitoring-table';
import { StudentSessionTable } from './components/student-session-table';
import { StudentSurveyTable } from './components/student-survey-table';

const INTL_NAMESPACE = 'private.dean';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return {
    title: t('studentRecord'),
  };
}

interface Props {
  params: Promise<{ studentId: string }>;
}

export default async function DeanStudentPage({ params }: Props) {
  const { studentId } = await params;
  const id = Number(studentId);

  const student = await getDeanStudent(id);

  if (!student) {
    notFound();
  }
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout
      pageTitle={student.fullName}
      breadcrumbs={[
        ['/module/dean', t('title')],
        ['/module/dean/students', t('students')],
      ]}
    >
      <Card className="col-span-full min-w-0 p-6">
        <Heading2 className="mb-4 text-xl leading-7 lg:text-xl lg:leading-7">{student.fullName}</Heading2>
        <Tabs key={id} defaultValue="surveys" activationMode="manual">
          <div className="overflow-x-auto">
            <TabsList className="bg-white" size="small" aria-label={t('studentRecord')}>
              <TabsTrigger value="surveys">{t('surveys')}</TabsTrigger>
              <TabsTrigger value="attestations">{t('attestations')}</TabsTrigger>
              <TabsTrigger value="monitoring">{t('monitoring')}</TabsTrigger>
              <TabsTrigger value="session">{t('session')}</TabsTrigger>
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
            <Suspense fallback={<Skeleton className="h-8 w-full" />}>
              <StudentSessionTable studentId={id} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </Card>
    </SubLayout>
  );
}
