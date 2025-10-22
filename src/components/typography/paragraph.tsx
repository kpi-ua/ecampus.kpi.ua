import { cn } from '@/lib/utils';
import React from 'react';

export const Paragraph = ({ className, ref, ...props }: React.ComponentProps<'p'>) => {
  return <p className={cn('leading-lg my-4 text-lg', className)} ref={ref} {...props} />;
};

Paragraph.displayName = 'Paragraph';
