import { cn } from '@/lib/utils';
import React from 'react';

export const Paragraph = ({ className, ref, ...props }: React.ComponentProps<'p'>) => {
  return <p className={cn('my-4 text-lg leading-lg', className)} ref={ref} {...props} />;
};

Paragraph.displayName = 'Paragraph';
