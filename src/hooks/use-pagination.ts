import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useMemo } from 'react';

export const usePagination = <T>(pageSize: number, items: T[]) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get('page') || '1');

  const prevItemsLengthRef = useRef<number>(items.length);

  useEffect(() => {
    if (prevItemsLengthRef.current !== items.length) {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      router.replace(`?${params.toString()}`);
      prevItemsLengthRef.current = items.length;
    }
  }, [items.length, router, searchParams]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [items, page, pageSize]);

  return { paginatedItems, page };
};
