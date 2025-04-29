import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { MoreHorizontal } from 'lucide-react';
import { CaretRightLight } from '@/app/images';

import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

const Breadcrumb = ({
  ref,
  ...props
}: React.ComponentProps<'nav'> & {
  separator?: React.ReactNode;
}) => <nav ref={ref} aria-label="breadcrumb" {...props} />;
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = ({ className, ref, ...props }: React.ComponentProps<'ol'>) => (
  <ol
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
      className,
    )}
    {...props}
  />
);
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = ({ className, ref, ...props }: React.ComponentProps<'li'>) => (
  <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = ({
  asChild,
  className,
  ref,
  ...props
}: React.ComponentProps<typeof Link> & {
  asChild?: boolean;
}) => {
  const Comp = asChild ? Slot : Link;

  return (
    <Comp ref={ref} className={cn('text-neutral-600 transition-colors hover:text-foreground', className)} {...props} />
  );
};
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = ({ className, ref, ...props }: React.ComponentProps<'span'>) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('font-semibold text-neutral-900', className)}
    {...props}
  />
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => (
  <li role="presentation" aria-hidden="true" className={cn('[&>svg]:h-[16px] [&>svg]:w-[16px]', className)} {...props}>
    {children ?? <CaretRightLight />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
