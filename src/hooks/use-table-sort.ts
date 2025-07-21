'use client';

import { useState } from 'react';

type SortDirection = 'asc' | 'desc';
type SortState = { header: string; direction: SortDirection } | null;

export function useTableSort(
  data: Record<string, unknown>[],
  getSortValue?: (row: Record<string, unknown>, header: string) => unknown,
) {
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
        const aVal = getSortValue ? getSortValue(a, sort.header) : a[sort.header];
        const bVal = getSortValue ? getSortValue(b, sort.header) : b[sort.header];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sort.direction === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      })
    : data;

  function getSortDirection(header: string): SortDirection | null {
    if (!sort || sort.header !== header) return null;
    return sort.direction;
  }

  return { handleHeaderClick, sortedRows, getSortDirection };
}
