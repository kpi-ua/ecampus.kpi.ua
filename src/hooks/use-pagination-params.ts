import { useRouter, useSearchParams } from 'next/navigation';

export const usePaginationParams = <T>(pageSize: number, items: T[]) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  let page = parseInt(searchParams.get('page') || '1');

  if (page > 1 && items.length <= pageSize) {
    page = 1;
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    router.replace(`?${params.toString()}`);
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const paginatedItems = items.slice(start, end);

  return { paginatedItems, page };
};
