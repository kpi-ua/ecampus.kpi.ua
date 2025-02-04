import { useSearchParams } from 'next/navigation';

export const usePaginationParams = (pageSize: number) => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return { start, end, page };
};
