'use client';

import { useEffect, useMemo } from 'react';

import { getK7FormRequests } from '@/actions/k7-form.actions';
import { K7_REPORT_REQUEST_STATUS, K7ReportRequest, K7ReportRequestFilter } from '@/types/models/k7-form';

const REFRESH_INTERVAL_MS = 5_000;
const ACTIVE_STATUSES = new Set<K7ReportRequest['status']>([
  K7_REPORT_REQUEST_STATUS.Pending,
  K7_REPORT_REQUEST_STATUS.InProgress,
  K7_REPORT_REQUEST_STATUS.DataReady,
]);

interface Props {
  reports: K7ReportRequest[];
  includeAdministered: boolean;
  filter?: K7ReportRequestFilter;
  onReportsChange: (reports: K7ReportRequest[]) => void;
}

/** Polls only the request list used by the currently selected tab. */
export const K7RequestsRefresh = ({ reports, includeAdministered, filter, onReportsChange }: Props) => {
  const statuses = useMemo(
    () => Object.fromEntries(reports.map((report) => [report.k7ReportRequestId, report.status])),
    [reports],
  );
  const active = reports.some((report) => ACTIVE_STATUSES.has(report.status));

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    const checkForUpdates = async () => {
      if (document.hidden) return;

      try {
        const currentReports = await getK7FormRequests({ all: includeAdministered, ...filter });
        if (cancelled) return;

        const currentStatuses = Object.fromEntries(
          currentReports.map((report) => [report.k7ReportRequestId, report.status]),
        );
        const changed =
          Object.keys(currentStatuses).length !== Object.keys(statuses).length ||
          Object.entries(currentStatuses).some(([requestId, status]) => statuses[requestId] !== status);

        if (changed) onReportsChange(currentReports);
      } catch {
        // A transient polling failure is retried on the next tick.
      }
    };

    const intervalId = window.setInterval(checkForUpdates, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [active, filter, includeAdministered, onReportsChange, statuses]);

  return null;
};
