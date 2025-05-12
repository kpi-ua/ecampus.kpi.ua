import { cn } from '@/lib/utils';
import React from 'react';

export const Description = ({ className, ref, ...props }: React.ComponentProps<'p'>) => {
  return <p className={cn('py-4 text-neutral-600', className)} ref={ref} {...props} />;
};

Description.displayName = 'Description';
