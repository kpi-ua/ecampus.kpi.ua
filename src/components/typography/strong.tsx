import { cn } from '@/lib/utils';
import React from 'react';

export interface StrongProps extends React.HTMLAttributes<HTMLElement> {}

export const Strong = React.forwardRef<HTMLElement, StrongProps>(({ className, ...props }, ref) => {
  return <strong className={cn('font-bold', className)} ref={ref} {...props} />;
});

Strong.displayName = 'Strong';
