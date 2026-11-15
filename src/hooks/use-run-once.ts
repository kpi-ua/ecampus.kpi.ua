'use client';

import { useEffect, useRef } from 'react';

/** Runs a one-off effect once per mount. Not for effects that need cleanup. */
export const useRunOnce = (callback: () => void) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }

    hasRun.current = true;
    callback();
  }, [callback]);
};
