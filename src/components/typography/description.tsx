import { cn } from '@/lib/utils';
import React from 'react';

export const Description = ({ className, ref, ...props }: React.ComponentProps<'p'>) => {
  return <p className={cn('pt-4 pb-8 text-neutral-600', className)} ref={ref} {...props} />;
};

Description.displayName = 'Description';
