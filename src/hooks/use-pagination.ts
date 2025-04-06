import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const usePagination = <T>(pageSize: number, items: T[]) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get('page') || '1');

  const prevItemsRef = useRef<T[]>(items);

  useEffect(() => {
    if (prevItemsRef.current !== items) {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      router.replace(`?${params.toString()}`);
      prevItemsRef.current = items;
    }
  }, [items, router, searchParams]);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = items.slice(start, end);

  return { paginatedItems, page };
};
