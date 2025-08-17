'use client';

import { useState } from 'react';

type SortDirection = 'asc' | 'desc' | null;
type SortState<K extends string> = { header: K; direction: SortDirection } | null;

export function useTableSort<T, K extends keyof T & string = keyof T & string>(
  data: T[],
  getSortValue?: (row: T, header: K) => unknown,
  sortableHeaders?: K[],
) {
  const [sort, setSort] = useState<SortState<K>>(null);

  function handleHeaderClick(header: K) {
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

  function getSortDirection(header: K): SortDirection {
    if (!sort || sort.header !== header) return null;
    return sort.direction;
  }

  const sortHandlers = (sortableHeaders ?? []).reduce(
    (acc, header) => {
      acc[header] = {
        onClick: () => handleHeaderClick(header),
        dir: getSortDirection(header),
      };
      return acc;
    },
    {} as Record<string, { onClick: () => void; dir: SortDirection }>,
  );

  return { handleHeaderClick, sortedRows, getSortDirection, sortHandlers };
}
