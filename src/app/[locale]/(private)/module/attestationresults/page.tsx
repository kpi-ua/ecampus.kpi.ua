import { getTranslations } from 'next-intl/server';

import {
  getAttestationReportGroups,
  getAttestationReportOptions,
  getAttestationReportStudents,
} from '@/actions/attestation-results.actions';
import { ReportCoursesTable } from '@/app/[locale]/(private)/module/attestationresults/components/report-courses-table';
import { ReportDepartmentTable } from '@/app/[locale]/(private)/module/attestationresults/components/report-department-table';
import { ReportFilters } from '@/app/[locale]/(private)/module/attestationresults/components/report-filters';
import { ReportGroupsTable } from '@/app/[locale]/(private)/module/attestationresults/components/report-groups-table';
import { ReportStudentsTable } from '@/app/[locale]/(private)/module/attestationresults/components/report-students-table';
import { AttestationReportView } from '@/app/[locale]/(private)/module/attestationresults/constants';
import { getAttestationReportQuery } from '@/app/[locale]/(private)/module/attestationresults/utils/report-query';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'private.attestation-results';

interface Props extends LocaleProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function AttestationResultsPage({ searchParams }: Props) {
  const t = await getTranslations('private.attestation-reports');
  const options = await getAttestationReportOptions();
  const query = getAttestationReportQuery(await searchParams, options);
  const [groups, students] = await Promise.all([
    getAttestationReportGroups(query),
    getAttestationReportStudents(query),
  ]);
  return (
    <Card className="col-span-full flex min-w-0 flex-col gap-6 p-6">
      <Tabs defaultValue={AttestationReportView.Groups}>
        <div className="overflow-x-auto">
          <TabsList className="bg-white" size="small">
            {Object.values(AttestationReportView).map((view) => (
              <TabsTrigger key={view} value={view}>
                {t(`views.${view}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="my-6">
          <ReportFilters options={options} query={query} />
        </div>
        <TabsContent value={AttestationReportView.Groups}>
          <ReportGroupsTable groups={groups} query={query} />
        </TabsContent>
        <TabsContent value={AttestationReportView.Courses}>
          <ReportCoursesTable groups={groups} query={query} />
        </TabsContent>
        <TabsContent value={AttestationReportView.Department}>
          <ReportDepartmentTable groups={groups} query={query} />
        </TabsContent>
        <TabsContent value={AttestationReportView.Students}>
          <ReportStudentsTable groups={groups} students={students} query={query} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
