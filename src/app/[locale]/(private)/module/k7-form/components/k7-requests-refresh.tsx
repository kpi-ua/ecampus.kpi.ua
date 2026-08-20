'use client';

import { useEffect } from 'react';

import { getK7FormRequests } from '@/actions/k7-form.actions';
import { useRouter } from '@/i18n/routing';
import { K7ReportRequestStatus } from '@/types/models/k7-form';

const REFRESH_INTERVAL_MS = 5_000;

interface Props {
  active: boolean;
  /** Snapshot of the rendered grid, keyed by request id. */
  statuses: Record<string, K7ReportRequestStatus>;
  includeDepartment: boolean;
}

/**
 * Watches the report requests while some of them are still being processed, so the grid shows
 * status changes without a manual reload. Only the request lists are polled; the full page render
 * (with its per-lecturer profile fan-out) is re-run just when a status actually changed.
 * Renders nothing.
 */
export const K7RequestsRefresh = ({ active, statuses, includeDepartment }: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    const checkForUpdates = async () => {
      // A background tab keeps its stale grid; refreshing it would only load the server.
      if (document.hidden) return;

      try {
        const lists = await Promise.all([
          getK7FormRequests({}),
          ...(includeDepartment ? [getK7FormRequests({ all: true })] : []),
        ]);

        if (cancelled) return;

        // A department head's own reports appear in both lists, so compare deduplicated maps.
        const current = Object.fromEntries(lists.flat().map((report) => [report.k7ReportRequestId, report.status]));
        const changed =
          Object.keys(current).length !== Object.keys(statuses).length ||
          Object.entries(current).some(([requestId, status]) => statuses[requestId] !== status);

        if (changed) {
          router.refresh();
        }
      } catch {
        // A transient polling failure is not worth a toast; the next tick retries.
      }
    };

    const intervalId = window.setInterval(checkForUpdates, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [active, includeDepartment, router, statuses]);

  return null;
};
