'use client';

import { useSearchParams } from 'next/navigation';

export const useK7FilterParams = () => {
  const searchParams = useSearchParams();

  const updateFilters = (values: Record<string, string | undefined>) => {
    const url = new URL(window.location.href);
    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    });
    // Keep the current history entry so browser Back returns directly from the preview.
    window.history.replaceState(null, '', url);
  };

  return { searchParams, updateFilters };
};
