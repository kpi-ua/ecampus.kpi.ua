'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { parseAsInteger, useQueryStates } from 'nuqs';
import queryString from 'query-string';

import { useIsMobile } from '@/hooks/use-mobile';
import { createPagesRange } from '@/lib/pagination.utils';
import { cn } from '@/lib/utils';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from './pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

const paginationParsers = {
  page: parseAsInteger,
  pageSize: parseAsInteger,
};

export interface PaginationWithLinksProps {
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string;
    pageSizeOptions: number[];
  };
  totalCount: number;
  pageSize: number;
  page: number;
  pageSearchParam?: string;
}

export function PaginationWithLinks({
  pageSizeSelectOptions,
  pageSize,
  totalCount,
  page = 1,
  pageSearchParam,
}: PaginationWithLinksProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const urlKeys = {
    page: pageSearchParam || 'page',
    pageSize: pageSizeSelectOptions?.pageSizeSearchParam || 'pageSize',
  };
  const [, setPagination] = useQueryStates(paginationParsers, {
    urlKeys,
    history: 'push',
    shallow: false,
    scroll: true,
  });
  const query = queryString.parse(searchParams.toString());

  const totalPageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const visibleRange = isMobile ? 3 : 5;
  const pages = createPagesRange({ currentPage: page, pagesCount: totalPageCount, visibleRange });

  const buildLink = (newPage: number) =>
    queryString.stringifyUrl({ url: pathname, query: { ...query, [urlKeys.page]: newPage } });

  const navToPageSize = (newPageSize: number) => {
    void setPagination({ page: null, pageSize: newPageSize });
  };

  return (
    <div className="flex w-full flex-col items-center gap-3 md:flex-row">
      {pageSizeSelectOptions && (
        <div className="flex flex-1 flex-col gap-4">
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
      <Pagination className={cn({ 'md:justify-end': pageSizeSelectOptions })}>
        <PaginationContent className="max-sm:gap-0">
          {pages.map((p, index) =>
            typeof p !== 'number' ? (
              <PaginationItem key={p + index}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink href={buildLink(p)} isActive={page === p}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              href={buildLink(Math.min(page + 1, totalPageCount))}
              aria-disabled={page >= totalPageCount}
              tabIndex={page >= totalPageCount ? -1 : undefined}
              className={`text-lg font-semibold text-neutral-900 ${
                page >= totalPageCount ? 'pointer-events-none opacity-50' : undefined
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function SelectRowsPerPage({
  options,
  setPageSize,
  pageSize,
}: {
  options: number[];
  setPageSize: (newSize: number) => void;
  pageSize: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm whitespace-nowrap">Rows per page</span>
      <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Select page size">{String(pageSize)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
