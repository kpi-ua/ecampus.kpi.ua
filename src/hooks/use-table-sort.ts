'use client';

import { useState } from 'react';

type SortDirection = 'asc' | 'desc';
type SortState = { header: string; direction: SortDirection } | null;

export function useTableSort<T extends Record<string, any>>(data: T[], getSortValue?: (row: T, header: string) => any) {
  const [sort, setSort] = useState<SortState>(null);

  function handleHeaderClick(header: string) {
    if (!sort || sort.header !== header) {
      setSort({ header, direction: 'desc' });
    } else if (sort.direction === 'desc') {
      setSort({ header, direction: 'asc' });
    } else {
      setSort(null);
    }
  }

  const sortedRows = sort
    ? [...data].sort((a, b) => {
        let aVal = getSortValue ? getSortValue(a, sort.header) : a[sort.header];
        let bVal = getSortValue ? getSortValue(b, sort.header) : b[sort.header];
        if (aVal === bVal) return 0;
        if (sort.direction === 'asc') return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      })
    : data;

  function getSortDirection(header: string): SortDirection | null {
    if (!sort || sort.header !== header) return null;
    return sort.direction;
  }

  return { sort, handleHeaderClick, sortedRows, getSortDirection };
}
