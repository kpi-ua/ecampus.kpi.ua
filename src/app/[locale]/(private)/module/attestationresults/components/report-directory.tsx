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
import { ReportDirectoryTable } from './report-directory-table';
import { ReportFilters } from './report-filters';

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
      {Object.values(AttestationReportView).map((view) => (
        <TabsContent key={view} value={view}>
          <ReportDirectoryTable groups={groups} students={students} view={view} query={query} />
        </TabsContent>
      ))}
    </Tabs>
  );
};
