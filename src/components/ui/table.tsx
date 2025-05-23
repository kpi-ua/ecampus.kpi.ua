import * as React from 'react';

import { cn } from '@/lib/utils';

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
  <tfoot ref={ref} className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
);
TableFooter.displayName = 'TableFooter';

const TableRow = ({ className, ref, ...props }: React.ComponentProps<'tr'>) => (
  <tr
    ref={ref}
    className={cn(
      'border-b bg-white transition-colors hover:bg-[#F8F8FF] active:bg-[#F5FBFF] data-[state=selected]:bg-muted',
      className,
    )}
    {...props}
  />
);
TableRow.displayName = 'TableRow';

const TableHead = ({ className, ref, ...props }: React.ComponentProps<'th'>) => (
  <th
    ref={ref}
    className={cn(
      'h-12 bg-[#E1E1EC] px-4 text-left align-middle text-sm font-semibold uppercase text-[#40414D] [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
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
  <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
);
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
