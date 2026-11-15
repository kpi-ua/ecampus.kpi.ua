'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { createSerializer, parseAsInteger, useQueryStates } from 'nuqs';
import { type ComponentProps } from 'react';

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

type NavigateHandler = NonNullable<ComponentProps<typeof PaginationLink>['onNavigate']>;

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
  const serialize = createSerializer(paginationParsers, { urlKeys });

  const totalPageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const visibleRange = isMobile ? 3 : 5;
  const pages = createPagesRange({ currentPage: page, pagesCount: totalPageCount, visibleRange });

  const buildLink = (newPage: number) => serialize(`${pathname}?${searchParams.toString()}`, { page: newPage });

  const navToPageSize = (newPageSize: number) => {
    void setPagination({ page: null, pageSize: newPageSize });
  };

  const handlePageNavigate = (newPage: number): NavigateHandler => {
    return (event) => {
      event.preventDefault();
      void setPagination({ page: newPage });
    };
  };

  const handleNextNavigate: NavigateHandler = (event) => {
    event.preventDefault();
    if (page < totalPageCount) {
      void setPagination({ page: page + 1 });
    }
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
                <PaginationLink href={buildLink(p)} isActive={page === p} onNavigate={handlePageNavigate(p)}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              href={buildLink(Math.min(page + 1, totalPageCount))}
              onNavigate={handleNextNavigate}
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
