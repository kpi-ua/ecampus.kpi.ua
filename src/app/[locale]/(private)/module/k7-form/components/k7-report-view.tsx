'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getK7FormRequests } from '@/actions/k7-form.actions';
import { SpinnerGap } from '@/app/images';
import { Card } from '@/components/ui/card';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import {
  K7FormFilters,
  K7FormLecturerProfileOption,
  K7ReportRequest,
  K7ReportRequestFilter,
} from '@/types/models/k7-form';

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

const getUniversityRequestFilter = (selection: K7UniversityFilterSelection): K7ReportRequestFilter | undefined => {
  const { year, departmentId, targetAccountId, employeeId, position } = selection;
  if (!year || !departmentId || !targetAccountId || !employeeId || !position) return undefined;

  return { year, departmentId, targetAccountId, employeeId, position };
};

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
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const { errorToast } = useServerErrorToast();
  const errorToastRef = useRef(errorToast);
  const reportRequestId = useRef(0);

  useEffect(() => {
    errorToastRef.current = errorToast;
  }, [errorToast]);

  useEffect(() => setReports(initialReports), [initialReports]);

  const universityRequestFilter = useMemo(() => getUniversityRequestFilter(universitySelection), [universitySelection]);

  const handleUniversityFilterChange = useCallback((selection: K7UniversityFilterSelection) => {
    const requestId = ++reportRequestId.current;
    const filter = getUniversityRequestFilter(selection);

    setUniversitySelection(selection);
    setReports([]);
    setIsLoadingReports(filter !== undefined);
    if (!filter) return;

    const fetchReports = async () => {
      try {
        const selectedReports = await getK7FormRequests({ all: true, ...filter });
        if (requestId === reportRequestId.current) setReports(selectedReports);
      } catch {
        if (requestId === reportRequestId.current) errorToastRef.current();
      } finally {
        if (requestId === reportRequestId.current) setIsLoadingReports(false);
      }
    };

    void fetchReports();
  }, []);

  const visibleReports = useMemo(() => {
    if (activeView === K7_DASHBOARD_VIEW.Department) {
      const departmentIds = new Set(departmentProfiles.map(({ departmentId }) => departmentId));
      return reports.filter(({ departmentId }) => departmentIds.has(departmentId));
    }

    if (activeView === K7_DASHBOARD_VIEW.Personal) {
      return reports;
    }

    const { year, departmentId, targetAccountId, employeeId, position } = universitySelection;

    if (!year || !departmentId || !targetAccountId || !employeeId || !position) {
      return [];
    }

    return reports.filter(
      (report) =>
        report.year === year &&
        report.departmentId === departmentId &&
        report.targetUserAccountId === targetAccountId &&
        report.employeeId === employeeId &&
        report.position === position,
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
      <K7RequestsRefresh
        reports={reports}
        includeAdministered={all}
        filter={activeView === K7_DASHBOARD_VIEW.University ? universityRequestFilter : undefined}
        onReportsChange={setReports}
      />

      <Card className="border-neutral-divider min-w-0 overflow-hidden rounded-lg border bg-white shadow-none">
        <K7DashboardNavigation
          activeView={activeView}
          hasDepartmentProfiles={hasDepartmentProfiles}
          hasUniversityCathedras={filters.cathedras.length > 0}
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
              faculties={filters.faculties}
              cathedras={filters.cathedras}
              onFilterChange={handleUniversityFilterChange}
            />
          )}
        </div>
      </Card>

      <div className="mt-3">
        {isLoadingReports ? (
          <div
            className="border-neutral-divider flex min-h-32 items-center justify-center rounded-lg border bg-white"
            aria-busy="true"
          >
            <SpinnerGap className="text-basic-blue" />
          </div>
        ) : (
          <K7ReportsTable reports={visibleReports} departmentNames={departmentNames} all={all} />
        )}
      </div>
    </>
  );
};
