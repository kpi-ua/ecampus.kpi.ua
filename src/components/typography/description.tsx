import { cn } from '@/lib/utils';
import React from 'react';

export interface DescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const Description = React.forwardRef<HTMLParagraphElement, DescriptionProps>(({ className, ...props }, ref) => {
  return <p className={cn('py-4 text-neutral-600', className)} ref={ref} {...props} />;
});

Description.displayName = 'Description';
