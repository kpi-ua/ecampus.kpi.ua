import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Show } from '@/components/utils/show';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = ({ className, ref, ...props }: React.ComponentProps<'ul'>) => (
  <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = ({ className, ref, ...props }: React.ComponentProps<'li'>) => (
  <li ref={ref} className={cn('', className)} {...props} />
);
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

const PaginationLink = ({ className = 'size-[32px]', isActive, size = 'small', ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      `${buttonVariants({
        variant: isActive ? 'primary' : 'tertiary',
        size,
      })}`,
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" size="small" className={cn('gap-1 pl-2.5', className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  const isMobile = useIsMobile();

  return (
    <PaginationLink
      aria-label="Go to next page"
      size="small"
      className={cn('gap-[4px] pr-2.5 hover:text-basic-blue', className)}
      {...props}
    >
      <Show when={!isMobile}>
        <span>Далі</span>
      </Show>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
};
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span
      aria-hidden
      className={cn(`flex size-[32px] items-end justify-center text-neutral-600`, className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
};
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
