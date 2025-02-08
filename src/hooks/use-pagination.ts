import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'radash';
import React from 'react';

export const usePagination = <T>(pageSize: number, items: T[]) => {
  const searchParams = useSearchParams();

  const router = useRouter();

  let page = parseInt(searchParams.get('page') || '1');

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = items.slice(start, end);

  const handleInputChange = debounce({ delay: 200 }, (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (newSearch) {
      params.set('search', newSearch);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.replace(`?${params.toString()}`);
  });

  return { paginatedItems, page, handleInputChange };
};
