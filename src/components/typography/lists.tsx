import { cn } from '@/lib/utils';
import React from 'react';

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {}

export const UList = React.forwardRef<HTMLUListElement, ListProps>(({ className, ...props }, ref) => {
  return <ul className={cn('ml-6 list-outside list-disc', className)} ref={ref} {...props} />;
});

UList.displayName = 'UlList';
