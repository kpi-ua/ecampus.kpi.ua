'use client';

import { useTranslations } from 'next-intl';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AttestationReportView } from '../constants';
import {
  AttestationReportGroup,
  AttestationReportOptions,
  AttestationReportQuery,
  AttestationReportStudent,
} from '../types';
import { ReportCoursesTable } from './report-courses-table';
import { ReportDepartmentTable } from './report-department-table';
import { ReportFilters } from './report-filters';
import { ReportGroupsTable } from './report-groups-table';
import { ReportStudentsTable } from './report-students-table';

interface Props {
  options: AttestationReportOptions;
  query: AttestationReportQuery;
  groups: AttestationReportGroup[];
  students: AttestationReportStudent[];
}

export const ReportDirectory = ({ options, query, groups, students }: Props) => {
  const t = useTranslations('private.attestation-reports');
  return (
    <Tabs defaultValue={AttestationReportView.Groups}>
      <div className="overflow-x-auto">
        <TabsList className="bg-white" size="small" aria-label={t('title')}>
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
  );
};
