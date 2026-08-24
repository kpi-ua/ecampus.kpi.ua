'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Card } from '@/components/ui/card';
import { K7FormFilters, K7FormLecturerProfileOption, K7ReportRequest } from '@/types/models/k7-form';

import { K7_DASHBOARD_VIEW, K7DashboardView } from '../constants';
import { K7DepartmentReportFilters } from './k7-department-report-filters';
import { K7DashboardNavigation } from './k7-dashboard-navigation';
import { K7PersonalReportFilters } from './k7-personal-report-filters';
import { K7ReportsTable } from './k7-reports-table';
import { K7RequestsRefresh } from './k7-requests-refresh';
import { K7UniversityFilterSelection, K7UniversityReportFilters } from './k7-university-report-filters';

interface Props {
  activeView: K7DashboardView;
  filters: K7FormFilters;
  initialReports: K7ReportRequest[];
  departmentProfiles: K7FormLecturerProfileOption[];
  departmentNames: Record<number, string>;
  hasDepartmentProfiles: boolean;
  all: boolean;
}

export const K7ReportView = ({
  activeView,
  filters,
  initialReports,
  departmentProfiles,
  departmentNames,
  hasDepartmentProfiles,
  all,
}: Props) => {
  const [reports, setReports] = useState(initialReports);
  const [universitySelection, setUniversitySelection] = useState<K7UniversityFilterSelection>({});

  useEffect(() => setReports(initialReports), [initialReports]);

  const visibleReports = useMemo(() => {
    if (activeView === K7_DASHBOARD_VIEW.Department) {
      const departmentIds = new Set(departmentProfiles.map(({ departmentId }) => departmentId));
      return reports.filter(({ departmentId }) => departmentIds.has(departmentId));
    }

    if (activeView === K7_DASHBOARD_VIEW.Personal) return reports;

    const { year, departmentId, lecturerUserAccountId } = universitySelection;

    if (!year || !departmentId || !lecturerUserAccountId) return [];

    return reports.filter(
      (report) =>
        report.year === year &&
        report.departmentId === departmentId &&
        report.targetUserAccountId === lecturerUserAccountId,
    );
  }, [activeView, departmentProfiles, reports, universitySelection]);

  const handleRequestCreated = useCallback((request: K7ReportRequest) => {
    setReports((currentReports) => [
      request,
      ...currentReports.filter((item) => item.k7ReportRequestId !== request.k7ReportRequestId),
    ]);
  }, []);

  return (
    <>
      <K7RequestsRefresh reports={reports} includeAdministered={all} onReportsChange={setReports} />

      <Card className="border-neutral-divider min-w-0 overflow-hidden rounded-lg border bg-white shadow-none">
        <K7DashboardNavigation
          activeView={activeView}
          hasDepartmentProfiles={hasDepartmentProfiles}
          hasUniversityDepartments={filters.departments.length > 0}
        />
        <div className="p-5">
          {activeView === K7_DASHBOARD_VIEW.Personal && (
            <K7PersonalReportFilters
              filters={filters}
              reports={visibleReports}
              onRequestCreated={handleRequestCreated}
            />
          )}
          {activeView === K7_DASHBOARD_VIEW.Department && (
            <K7DepartmentReportFilters
              years={filters.years}
              profiles={departmentProfiles}
              reports={visibleReports}
              onRequestCreated={handleRequestCreated}
            />
          )}
          {activeView === K7_DASHBOARD_VIEW.University && (
            <K7UniversityReportFilters
              years={filters.years}
              departments={filters.departments}
              onFilterChange={setUniversitySelection}
            />
          )}
        </div>
      </Card>

      <div className="mt-3">
        <K7ReportsTable reports={visibleReports} departmentNames={departmentNames} all={all} />
      </div>
    </>
  );
};
