'use client';

import { useEffect } from 'react';

import { useRouter } from '@/i18n/routing';

const REFRESH_INTERVAL_MS = 5_000;

interface Props {
  active: boolean;
}

/**
 * Re-fetches the page data while some report request is still being processed, so the grid
 * shows status changes without a manual reload. Renders nothing.
 */
export const K7RequestsRefresh = ({ active }: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;

    const intervalId = window.setInterval(() => {
      // A background tab keeps its stale grid; refreshing it would only load the server.
      if (!document.hidden) {
        router.refresh();
      }
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [active, router]);

  return null;
};
