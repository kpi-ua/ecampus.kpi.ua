import * as React from 'react';

import { cn } from '@/lib/utils';
import { SortIcon } from '@/components/ui/sort-icon';

type SortDirection = 'asc' | 'desc' | null;
type SortHandlers = Record<
  string,
  {
    onClick: () => void;
    dir: SortDirection;
  }
>;

interface TableHeadProps extends React.ComponentProps<'th'> {
  sortHandlers?: SortHandlers;
  sortHeader?: string;
  children: React.ReactNode;
}

const Table = ({ className, ref, ...props }: React.ComponentProps<'table'>) => (
  <div className="relative w-full overflow-auto rounded-[12px]">
    <table ref={ref} className={cn('w-full caption-bottom overflow-hidden text-sm', className)} {...props} />
  </div>
);
Table.displayName = 'Table';

const TableHeader = ({ className, ref, ...props }: React.ComponentProps<'thead'>) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
);
TableHeader.displayName = 'TableHeader';

const TableBody = ({ className, ref, ...props }: React.ComponentProps<'tbody'>) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
);
TableBody.displayName = 'TableBody';

const TableFooter = ({ className, ref, ...props }: React.ComponentProps<'tfoot'>) => (
  <tfoot ref={ref} className={cn('bg-muted/50 border-t font-medium last:[&>tr]:border-b-0', className)} {...props} />
);
TableFooter.displayName = 'TableFooter';

const TableRow = ({ className, ref, ...props }: React.ComponentProps<'tr'>) => (
  <tr
    ref={ref}
    className={cn(
      'data-[state=selected]:bg-muted border-b bg-white transition-colors hover:bg-[#F8F8FF] active:bg-[#F5FBFF]',
      className,
    )}
    {...props}
  />
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortHandlers, sortHeader, children, ...props }, ref) => {
    const isSortable = sortHandlers && sortHeader && sortHandlers[sortHeader];
    return (
      <th
        ref={ref}
        className={cn(
          'h-12 bg-neutral-200 px-4 text-left align-middle text-sm font-semibold text-[#40414D] uppercase [&:has([role=checkbox])]:pr-0',
          className,
          isSortable && 'cursor-pointer',
        )}
        onClick={isSortable ? sortHandlers![sortHeader!].onClick : undefined}
        {...props}
      >
        <span className="flex items-center gap-3">
          {children}
          {isSortable && <SortIcon dir={sortHandlers![sortHeader!].dir} />}
        </span>
      </th>
    );
  },
);
TableHead.displayName = 'TableHead';

const TableCell = ({ className, ref, ...props }: React.ComponentProps<'td'>) => (
  <td
    ref={ref}
    className={cn('px-[16px] py-[19px] align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
);
TableCell.displayName = 'TableCell';

const TableCaption = ({ className, ref, ...props }: React.ComponentProps<'caption'>) => (
  <caption ref={ref} className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
);
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
